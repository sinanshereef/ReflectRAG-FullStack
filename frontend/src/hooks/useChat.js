// useChat.js — the assistant's brain.
// =============================================================
// Wraps the REAL /api/ask NDJSON stream. Every message stores the raw
// pipeline events so the UI can show honest progress ("retrieving...",
// "grading documents...") instead of a fake typing animation.

import { useCallback, useEffect, useRef, useState } from "react";
import { askGreenCare, pingHealth, splitAnswerSources } from "../api.js";
import { GREETING } from "../data/hospital.js";

let uid = 1;
const nextId = () => `m${uid++}`;

function greetingMessage() {
  return { id: nextId(), role: "assistant", text: GREETING, ts: new Date(), status: "done" };
}

function makeUser(text) {
  return { id: nextId(), role: "user", text, ts: new Date(), status: "done" };
}

function makePendingAssistant() {
  return {
    id: nextId(),
    role: "assistant",
    text: "",
    ts: new Date(),
    status: "pending", // pending -> done | error
    pipeline: [],
    sources: [],
    meta: null,
    answerError: null,
    retryText: null, // remembered so Retry can resend the exact question
  };
}

export function useChat() {
  const [messages, setMessages] = useState(() => [greetingMessage()]);
  const [busy, setBusy] = useState(false);
  const [backendOk, setBackendOk] = useState(null); // null = not checked yet
  const [open, setOpen] = useState(false);
  const [sink, setSink] = useState("drawer"); // "drawer" | "dock"
  const streamRef = useRef(null); // AbortController of the in-flight request

  // Check the bridge on mount so the header dot tells the truth.
  useEffect(() => {
    let alive = true;
    pingHealth().then((ok) => alive && setBackendOk(ok));
    return () => {
      alive = false;
    };
  }, []);

  // Abort an in-flight stream if the app unmounts mid-request.
  useEffect(() => () => streamRef.current?.abort(), []);

  // Patch the single pending assistant bubble; accepts object or updater.
  const patchPending = useCallback((patch) => {
    setMessages((prev) => {
      const idx = prev.findIndex((m) => m.status === "pending");
      if (idx === -1) return prev;
      const next = [...prev];
      const base = next[idx];
      next[idx] = typeof patch === "function" ? patch(base) : { ...base, ...patch };
      return next;
    });
  }, []);

  const send = useCallback(
    async (rawText) => {
      const text = String(rawText ?? "").trim();
      if (!text || busy) return;

      streamRef.current?.abort();
      const controller = new AbortController();
      streamRef.current = controller;

      setBusy(true);
      setMessages((prev) => [...prev, makeUser(text), makePendingAssistant()]);

      const handleEvent = (ev) => {
        if (ev.type === "start") return;

        if (ev.type === "step") {
          patchPending((m) => {
            const pipeline = m.pipeline.filter(
              (p) => !(p.node === ev.node && p.pass === ev.pass)
            );
            pipeline.push({
              node: ev.node,
              pass: ev.pass,
              seconds: ev.seconds,
              kept: ev.kept,
              newQuestion: ev.new_question,
              retriesUsed: ev.retries_used,
              retriesMax: ev.retries_max,
            });
            return { ...m, pipeline };
          });
          return;
        }

        if (ev.type === "done") {
          const { mainText, sources } = splitAnswerSources(ev.answer, ev.sources);
          patchPending((m) => ({
            ...m,
            status: "done",
            text: mainText,
            sources,
            meta: {
              chunksKept: ev.chunks_kept,
              retriesUsed: ev.retries_used,
              totalSeconds: ev.total_seconds,
            },
          }));
          setBusy(false);
          return;
        }

        if (ev.type === "error") {
          patchPending((m) => ({
            ...m,
            status: "error",
            answerError: ev.message,
            retryText: m.retryText ?? text,
          }));
          setBusy(false);
        }
      };

      try {
        await askGreenCare(text, handleEvent, { signal: controller.signal });
        // If the stream ended without done/error, resolve pending honestly.
        setMessages((prev) =>
          prev.map((m) => {
            if (m.status !== "pending") return m;
            return m.pipeline.length
              ? { ...m, status: "done", text: m.text || "(no answer was returned)", meta: { totalSeconds: null } }
              : { ...m, status: "error", answerError: "The response ended unexpectedly. Please retry.", retryText: m.retryText ?? text };
          })
        );
      } catch (err) {
        if (err?.name === "AbortError") {
          // A newer attempt replaced this one; the new send manages its own state.
          setMessages((prev) => prev.filter((m) => m.status !== "pending"));
          return;
        }
        setMessages((prev) =>
          prev.map((m) =>
            m.status === "pending"
              ? {
                  ...m,
                  status: "error",
                  answerError: err?.message?.includes("Failed to fetch")
                    ? "I can't reach the hospital records service right now. Please make sure the backend bridge is running on port 8000, then retry."
                    : m.answerError || err?.message || "Something went wrong. Please retry.",
                  retryText: m.retryText ?? text,
                }
              : m
          )
        );
        setBusy(false);
        pingHealth().then(setBackendOk);
      }
    },
    [busy, patchPending]
  );

  // Retry removes the failed answer and re-asks the exact same question.
  const retry = useCallback(
    (msgId) => {
      const target = messages.find((m) => m.id === msgId);
      const q = target?.retryText;
      if (!q || busy) return;
      setMessages((prev) => prev.filter((m) => m.id !== msgId));
      send(q);
    },
    [messages, busy, send]
  );

  const clear = useCallback(() => {
    streamRef.current?.abort();
    setBusy(false);
    setMessages(() => [greetingMessage()]);
  }, []);

  return {
    messages,
    busy,
    open,
    setOpen,
    sink,
    setSink,
    backendOk,
    send,
    retry,
    clear,
  };
}

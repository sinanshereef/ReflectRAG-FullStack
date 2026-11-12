// ChatDock.jsx — the full GreenCare AI conversation interface, used both
// inside the floating drawer and in the dedicated on-page section.
// Sends every question to the REAL /api/ask endpoint; shows honest live
// pipeline status, real source chips, retry, copy and clear.

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertTriangle,
  ArrowUp,
  Eraser,
  ShieldCheck,
  Sparkles,
  X,
} from "lucide-react";
import ChatMessage from "./ChatMessage.jsx";
import { HOSPITAL, SUGGESTED_QUESTIONS } from "../data/hospital.js";
import { useAssistant } from "../context/AssistantContext.jsx";
import { AssistantMark } from "../components/Logo.jsx";

function ReadyDot({ ok }) {
  return (
    <span
      className={`gcai__conn ${ok === false ? "is-down" : ""}`}
      title={ok ? "Hospital records service online" : "Records service unreachable"}
      aria-hidden="true"
    />
  );
}

export default function ChatDock({ docked = false, onClose = null }) {
  const { messages, busy, backendOk, send, retry, clear } = useAssistant();
  const [draft, setDraft] = useState("");
  const scrollRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll: follow live updates and keep the answer in view when the
  // user is already near the bottom (never fight an intentional scroll-up).
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const nearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 160;
    if (nearBottom || busy) {
      el.scrollTop = el.scrollHeight;
    }
  }, [messages, busy]);

  const autoFocus = () => inputRef.current?.focus();
  useEffect(() => {
    if (!docked) autoFocus();
  }, [docked]);

  const submit = (e) => {
    e.preventDefault();
    const text = draft.trim();
    if (!text || busy) return;
    setDraft("");
    send(text);
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submit(e);
    }
  };

  const showSuggestions = messages.filter((m) => m.role === "user").length === 0;

  return (
    <div className={`gcai ${docked ? "" : "gcai--drawer"}`} aria-label="GreenCare AI assistant">
      {/* Header */}
      <div className="gcai__head">
        <span className="gcai__avatar"><AssistantMark size={26} /></span>
        <div className="gcai__id">
          <div className="gcai__name">
            GreenCare AI
            <Sparkles size={13} aria-hidden="true" />
          </div>
          <div className="gcai__sub">
            <ReadyDot ok={backendOk} />
            {backendOk === false
              ? "Records service offline"
              : backendOk === true
                ? "Hospital records · connected"
                : "Connecting to hospital records…"}
          </div>
        </div>
        <div className="gcai__tools">
          <button
            className="gcai__tool"
            onClick={clear}
            disabled={busy}
            aria-label="Clear conversation"
            title="Clear conversation"
          >
            <Eraser size={16} />
          </button>
          {onClose && (
            <button
              className="gcai__tool"
              onClick={onClose}
              aria-label="Close assistant"
              title="Close"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Emergency strip */}
      <div className="gcai__em" role="note">
        <AlertTriangle size={15} aria-hidden="true" />
        <span>
          Medical emergency? Call <strong>{HOSPITAL.emergencyNumber}</strong> or reach
          the Emergency &amp; Trauma department immediately — an AI chat is never a
          substitute for urgent care.
        </span>
      </div>

      {/* Conversation */}
      <div className="gcai__scroll" ref={scrollRef} aria-live="polite">
        {messages.map((m) => (
          <ChatMessage key={m.id} msg={m} onRetry={retry} />
        ))}

        <AnimatePresence>
          {busy && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{ height: 6 }}
            />
          )}
        </AnimatePresence>
      </div>

      {/* Suggested questions */}
      {showSuggestions && !busy && (
        <div className="suggests">
          <span className="suggests__label">Suggested questions</span>
          {SUGGESTED_QUESTIONS.map((q, i) => (
            <button
              key={q}
              className="suggests__chip"
              style={{ animationDelay: `${i * 45}ms` }}
              onClick={() => send(q)}
            >
              <Sparkles size={12} aria-hidden="true" />
              {q}
            </button>
          ))}
        </div>
      )}

      {/* Composer */}
      <form className="composer" onSubmit={submit}>
        <div className="composer__row">
          <textarea
            ref={inputRef}
            className="composer__input"
            rows={1}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder={
              busy
                ? "GreenCare AI is looking up hospital records…"
                : "Ask about departments, fees, visiting hours…"
            }
            aria-label="Ask GreenCare AI"
            disabled={false}
          />
          <button
            type="submit"
            className="composer__send"
            disabled={busy || !draft.trim()}
            aria-label="Send question"
          >
            <ArrowUp size={19} />
          </button>
        </div>
        <div className="composer__foot">
          <span>
            Answers come from <strong>{HOSPITAL.name}</strong>'s own indexed documents via
            RAG — nothing is invented.
          </span>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 5, flex: "none" }}>
            <ShieldCheck size={12} aria-hidden="true" />
            Enter to send
          </span>
        </div>
      </form>
    </div>
  );
}

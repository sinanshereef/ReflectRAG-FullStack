// ChatMessage.jsx — one message in the conversation.
// Raw pipeline events from /api/ask are rendered as an honest progress
// list ("retrieving → grading → composing"), sources are expandable
// (and never invented — they only appear if the backend sent them).

import { useState } from "react";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import {
  AlertTriangle,
  BadgeCheck,
  Bot,
  Check,
  ChevronDown,
  Copy,
  FileSearch,
  Gavel,
  Lightbulb,
  PenLine,
  RefreshCw,
  Search,
  Sparkles,
  Workflow,
} from "lucide-react";
import { NODE_LABELS } from "../api.js";
import { HOSPITAL } from "../data/hospital.js";

const NODE_ICONS = {
  retrieve: Search,
  grade_documents: Gavel,
  transform_query: PenLine,
  generate: Sparkles,
};

function timeStr(date) {
  return new Date(date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function PipelineList({ steps }) {
  if (!steps?.length) return null;
  return (
    <div className="pipe" aria-label="Live pipeline status">
      {steps.map((s) => {
        const Icon = NODE_ICONS[s.node] ?? Workflow;
        return (
          <div className="pipe__row is-active" key={`${s.node}-${s.pass}`}>
            <Icon size={13} aria-hidden="true" />
            <span>
              {NODE_LABELS[s.node] ?? s.node}
              {s.node === "transform_query" && s.newQuestion && (
                <em style={{ opacity: 0.85 }}> → “{s.newQuestion}”</em>
              )}
            </span>
            {typeof s.seconds === "number" && <small>{s.seconds}s</small>}
          </div>
        );
      })}
    </div>
  );
}

function Sources({ sources }) {
  const [open, setOpen] = useState(false);
  if (!sources?.length) return null;
  return (
    <div className="sources">
      <button
        className="sources__head"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
      >
        <FileSearch size={14} aria-hidden="true" />
        Retrieved from {sources.length} source document{sources.length > 1 ? "s" : ""}
        <ChevronDown size={14} aria-hidden="true" />
      </button>
      {open && (
        <div className="sources__list">
          {sources.map((s, i) => (
            <span key={i}>
              <BadgeCheck size={13} aria-hidden="true" />
              <span style={{ fontWeight: 650 }}>{s.split("/").pop() || s}</span>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

export default function ChatMessage({ msg, onRetry }) {
  const [copied, setCopied] = useState(false);
  const isUser = msg.role === "user";

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(msg.text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      // clipboard unavailable — ignore silently
    }
  };

  return (
    <motion.div
      className={`msg ${isUser ? "msg--user" : "msg--ai"}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="msg__avatar" aria-hidden="true">
        {isUser ? HOSPITAL.shortName : <Bot size={19} />}
      </div>

      <div className="msg__col" style={{ minWidth: isUser ? undefined : "0" }}>
        {msg.status === "pending" ? (
          <div className="msg__bubble">
            <PipelineList steps={msg.pipeline} />
            <div className="typing" aria-live="polite" aria-label="Assistant is working">
              <i /><i /><i />
            </div>
          </div>
        ) : msg.status === "error" ? (
          <div className="msg__bubble">
            <div style={{ display: "flex", gap: 8, alignItems: "flex-start", color: "var(--danger)" }}>
              <AlertTriangle size={16} style={{ flex: "none", marginTop: 2 }} aria-hidden="true" />
              <span style={{ lineHeight: 1.55 }}>{msg.answerError}</span>
            </div>
            <div className="msg__tools">
              <button className="msg__tool msg__tool--danger" onClick={() => onRetry?.(msg.id)}>
                <RefreshCw size={12} aria-hidden="true" /> Retry
              </button>
            </div>
            <div className="msg__time">{timeStr(msg.ts)}</div>
          </div>
        ) : (
          <div className="msg__bubble">
            {!isUser && <PipelineList steps={msg.pipeline} />}
            <div className="markdown">
              <ReactMarkdown>{msg.text}</ReactMarkdown>
            </div>
            {!isUser && <Sources sources={msg.sources} />}
            {!isUser && msg.meta && (
              <div style={{ marginTop: 8, fontSize: "0.7rem", color: "var(--ink-2)", fontWeight: 700 }}>
                {msg.meta.totalSeconds != null && <>Answered in {msg.meta.totalSeconds}s</>}
                {msg.meta.chunksKept != null && <> · {msg.meta.chunksKept} doc chunk{msg.meta.chunksKept === 1 ? "" : "s"} kept</>}
              </div>
            )}
          </div>
        )}

        {msg.status === "done" && msg.text && (
          <div className="msg__tools" aria-hidden={copied}>
            <button className="msg__tool" onClick={copy} aria-label="Copy response">
              {copied ? <Check size={12} /> : <Copy size={12} />}
              {copied ? "Copied" : "Copy"}
            </button>
            {isUser && (
              <button
                className="msg__tool"
                onClick={() => onRetry?.(msg.id)}
                aria-label="Ask this again"
              >
                <Lightbulb size={12} /> Ask again
              </button>
            )}
          </div>
        )}

        {msg.status === "done" && <div className="msg__time">{timeStr(msg.ts)}</div>}
      </div>
    </motion.div>
  );
}

// AssistantContext.jsx — shared state so the navbar button, hero CTA,
// floating launcher and the docked section panel all drive the same
// assistant. The sink ("drawer" | "dock") decides WHERE the chat renders;
// exactly one sink is active at a time.

import { createContext, useCallback, useContext, useEffect, useMemo } from "react";
import { useChat } from "../hooks/useChat.js";

const AssistantContext = createContext(null);

export function AssistantProvider({ children }) {
  const chat = useChat();

  const openIn = useCallback(
    (sink) => {
      chat.setSink(sink);
      chat.setOpen(true);
    },
    [chat]
  );

  const close = useCallback(() => chat.setOpen(false), [chat]);

  // Lock page scroll while the drawer owns the screen.
  useEffect(() => {
    if (chat.open && chat.sink === "drawer") {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [chat.open, chat.sink]);

  // Esc closes the drawer.
  useEffect(() => {
    if (!chat.open || chat.sink !== "drawer") return;
    const onKey = (e) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [chat.open, chat.sink, close]);

  const value = useMemo(
    () => ({ ...chat, openIn, close }),
    [chat, openIn, close]
  );

  return (
    <AssistantContext.Provider value={value}>
      {children}
    </AssistantContext.Provider>
  );
}

export function useAssistant() {
  const ctx = useContext(AssistantContext);
  if (!ctx) throw new Error("useAssistant must be used inside <AssistantProvider>");
  return ctx;
}

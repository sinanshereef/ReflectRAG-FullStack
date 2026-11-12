// FloatingAssistant.jsx — the elegant launcher present on every page
// section, plus the full-height mobile/desktop drawer that hosts ChatDock.

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useAssistant } from "../context/AssistantContext.jsx";
import { AssistantMark } from "../components/Logo.jsx";
import ChatDock from "../assistant/ChatDock.jsx";

export default function FloatingAssistant() {
  const { open, sink, setOpen, backendOk } = useAssistant();

  // The greeting bubble is a top-of-page nudge — once the visitor scrolls into
  // the content it would only cover whatever sits at the bottom-right corner,
  // so it dismisses itself (the launcher button remains).
  const [nearTop, setNearTop] = useState(true);
  useEffect(() => {
    const onScroll = () => setNearTop(window.scrollY < 560);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const showBubble = nearTop && backendOk !== null && !open;

  return (
    <>
      {/* Floating launcher — hidden while the drawer is open */}
      <div className="launch" style={open && sink === "drawer" ? { display: "none" } : undefined}>
        <AnimatePresence>
          {showBubble && (
            <motion.button
              className="launch__bubble"
              onClick={() => setOpen(true)}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0, transition: { delay: 1.6, duration: 0.5 } }}
              exit={{ opacity: 0, y: 10 }}
              aria-label="Open GreenCare AI assistant"
            >
              Questions about departments, fees or visiting hours? Ask GreenCare
              AI — instant answers.
            </motion.button>
          )}
        </AnimatePresence>

        <motion.button
          className="launch__btn"
          onClick={() => setOpen(true)}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 20, delay: 1 }}
          whileHover={{ y: -3 }}
          whileTap={{ scale: 0.96 }}
          aria-label="Open GreenCare AI assistant"
          aria-haspopup="dialog"
        >
          <AssistantMark size={30} className="launch__glyph" />
          <span className={`launch__status ${backendOk === false ? "is-down" : ""}`} aria-hidden="true" />
        </motion.button>
      </div>

      {/* Drawer hosting the assistant */}
      <AnimatePresence>
        {open && sink === "drawer" && (
          <div className="drawer is-open" role="dialog" aria-modal="true" aria-label="GreenCare AI assistant">
            <motion.div
              className="drawer__scrim"
              onClick={() => setOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
            <motion.div
              className="drawer__panel drawer__panel--chat"
              initial={{ x: "102%" }}
              animate={{ x: 0 }}
              exit={{ x: "102%" }}
              transition={{ type: "tween", duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="chat-drawer-stage">
                <ChatDock onClose={() => setOpen(false)} />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

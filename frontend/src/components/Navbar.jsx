// Navbar.jsx — sticky, transparent over the hero, solid after scrolling.
// Includes the AI Assistant button (opens GreenCare AI drawer) and the
// appointment CTA, plus an animated mobile drawer.

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Bot, CalendarCheck, ChevronRight, X, Menu, ArrowRight } from "lucide-react";
import { NAV_LINKS } from "../data/hospital.js";
import { useAssistant } from "../context/AssistantContext.jsx";
import { AssistantMark, LogoMark } from "./Logo.jsx";

export default function Navbar() {
  const [solid, setSolid] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const assistant = useAssistant();

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const openDrawer = () => setDrawerOpen(true);

  return (
    <>
      <header className={`nav ${solid ? "is-solid" : ""}`}>
        <div className="container--wide nav__inner">
          <a href="#home" className="logo" aria-label="Green Field Hospital — home">
            <LogoMark size={44} className="logo__mark" />
            <span className="logo__text">
              <span className="logo__name">GREEN FIELD</span>
              <span className="logo__sub">HOSPITAL</span>
            </span>
          </a>

          <nav className="nav__links" aria-label="Primary">
            {NAV_LINKS.map((l) => (
              <a key={l.href} href={l.href} className="nav__link">
                {l.label}
              </a>
            ))}
          </nav>

          <div className="nav__actions">
            <button
              className="nav__ai"
              onClick={() => assistant.openIn("drawer")}
              aria-haspopup="dialog"
            >
              <Bot size={18} aria-hidden="true" />
              <span>AI Assistant</span>
            </button>
            <a href="#appointment" className="btn btn--primary btn--sm nav__book">
              <CalendarCheck size={16} aria-hidden="true" />
              <span>Appointment</span>
            </a>
            <button
              className="nav__burger"
              onClick={openDrawer}
              aria-label="Open menu"
              aria-expanded={drawerOpen}
            >
              <Menu size={21} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {drawerOpen && (
          <div className={`drawer ${drawerOpen ? "is-open" : ""}`} role="dialog" aria-modal="true" aria-label="Menu">
            <div className="drawer__scrim" onClick={() => setDrawerOpen(false)} />
            <motion.div
              className="drawer__panel"
              initial={{ x: "102%" }}
              animate={{ x: 0 }}
              exit={{ x: "102%" }}
              transition={{ type: "tween", duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="drawer__head">
                <svg width="40" height="40" viewBox="0 0 64 64" aria-hidden="true">
                  <rect width="64" height="64" rx="14" fill="#145C45" />
                  <rect x="28" y="13" width="9" height="38" rx="3.5" fill="#FFFFFF" />
                  <rect x="13.5" y="27.5" width="38" height="9" rx="3.5" fill="#FFFFFF" />
                  <path d="M45.5 10.5c7.2 0 11.6 4.4 11.6 10.4 0 6.9-6.4 11.3-13.5 10.9-.6-7 1-15.5 1.9-21.3z" fill="#B9E8D5" />
                  <path d="M46.5 12.5c4.4 1.1 7.6 4.4 7.6 8.3 0 3.6-2.4 6.5-5.9 7.9" fill="none" stroke="#16866A" strokeWidth="1.6" strokeLinecap="round" />
                </svg>
                <button className="drawer__close" onClick={() => setDrawerOpen(false)} aria-label="Close menu">
                  <X size={19} />
                </button>
              </div>

              <nav className="drawer__links" aria-label="Mobile">
                {NAV_LINKS.map((l) => (
                  <a key={l.href} href={l.href} onClick={() => setDrawerOpen(false)}>
                    {l.label}
                    <ChevronRight size={16} />
                  </a>
                ))}
              </nav>

              <div className="drawer__foot">
                <button
                  className="btn btn--outline"
                  style={{ width: "100%", justifyContent: "flex-start" }}
                  onClick={() => {
                    setDrawerOpen(false);
                    assistant.openIn("drawer");
                  }}
                >
                  <AssistantMark size={26} />
                  AI Assistant
                  <ArrowRight size={16} style={{ marginLeft: "auto" }} />
                </button>
                <a
                  href="#appointment"
                  className="btn btn--primary"
                  style={{ width: "100%" }}
                  onClick={() => setDrawerOpen(false)}
                >
                  <CalendarCheck size={17} />
                  Request an Appointment
                </a>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

// Footer.jsx — complete site footer: brand, quick nav, departments,
// patient resources, contact, and the mandatory sample-data disclaimer.
// Privacy / Terms open as short modal cards (sample text — honest).

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Clock, Info, Mail, MapPin, Phone, ShieldAlert, X } from "lucide-react";
import { LogoMark } from "./Logo.jsx";
import { NAV_LINKS, DEPARTMENTS, HOSPITAL } from "../data/hospital.js";

const LEGAL = {
  privacy: {
    title: "Privacy Policy (sample)",
    body: [
      ["What this demo does", "This website is a demonstration build for Green Field Hospital (a fictional hospital used for RAG research). Asking questions to GreenCare AI sends your typed text to this project's local backend; nothing is stored on any server, and no external analytics run on this page."],
      ["Contact forms", "The appointment and contact forms validate your input in the browser only. They are not transmitted anywhere and no copy is kept."],
      ["AI assistant", "GreenCare AI runs a retrieval pipeline over the project's indexed documents. Your questions are not logged after the visit ends."],
      ["Note", "For a production deployment, this policy would describe the actual data flows, retention periods and lawful basis — written by the hospital's compliance team."],
    ],
  },
  terms: {
    title: "Terms of Use (sample)",
    body: [
      ["Demonstration purpose", "All hospital information shown here is synthetic sample data built for testing a self-correcting RAG pipeline. Names, numbers, addresses, doctors and fees are placeholders."],
      ["No medical service", "Nothing on this site is medical advice, diagnosis or treatment. In a real emergency, contact your local emergency services immediately."],
      ["AI assistant limits", "GreenCare AI answers only from its indexed sample documents, can be wrong, and must never delay professional medical assessment."],
      ["Attribution", "Photographs are licensed stock images from Unsplash. The hospital brand and logo are original designs created for this project."],
    ],
  },
};

export default function Footer() {
  const [modal, setModal] = useState(null); // "privacy" | "terms" | null

  return (
    <footer className="footer" aria-label="Site footer">
      <div className="container--wide footer__main">
        <div className="footer__brand">
          <a href="#home" className="logo" aria-label="Green Field Hospital — back to top">
            <LogoMark size={46} className="logo__mark" />
            <span className="logo__text">
              <span className="logo__name">GREEN FIELD</span>
              <span className="logo__sub">HOSPITAL</span>
            </span>
          </a>
          <p>
            {HOSPITAL.positioning} — a demonstration hospital website built around
            a real retrieval-augmented AI assistant, GreenCare AI.
          </p>
        </div>

        <div>
          <h4>Explore</h4>
          <ul className="footer__list">
            {NAV_LINKS.slice(1, 6).map((l) => (
              <li key={l.href}><a href={l.href}>{l.label}</a></li>
            ))}
            <li><a href="#assistant">GreenCare AI</a></li>
          </ul>
        </div>

        <div>
          <h4>Departments</h4>
          <ul className="footer__list">
            {DEPARTMENTS.slice(0, 5).map((d) => (
              <li key={d.id}>
                <a href="#departments">{d.name}</a>
              </li>
            ))}
            <li><a href="#departments">View all departments</a></li>
          </ul>
        </div>

        <div>
          <h4>Patient resources</h4>
          <ul className="footer__list">
            <li><a href="#patient-info">Fees &amp; room rates</a></li>
            <li><a href="#patient-info">Visiting hours</a></li>
            <li><a href="#patient-info">What to bring</a></li>
            <li><a href="#experiences">Patient experience</a></li>
            <li><a href="#appointment">Appointment enquiry</a></li>
          </ul>
        </div>
      </div>

      {/* Contact strip */}
      <div className="container--wide" style={{ paddingBottom: "clamp(1.5rem, 3vw, 2.5rem)" }}>
        <ul className="footer__contact">
          <li style={{ flexWrap: "wrap", gap: "12px 28px" }}>
            <span style={{ display: "inline-flex", gap: 9 }}>
              <Phone size={15} aria-hidden="true" />
              {HOSPITAL.phone}
              <small style={{ opacity: 0.6 }}>(sample number · 24 hours)</small>
            </span>
            <span style={{ display: "inline-flex", gap: 9 }}>
              <Mail size={15} aria-hidden="true" />
              {HOSPITAL.email}
            </span>
            <span style={{ display: "inline-flex", gap: 9 }}>
              <MapPin size={15} aria-hidden="true" />
              {HOSPITAL.address}
            </span>
            <span style={{ display: "inline-flex", gap: 9 }}>
              <Clock size={15} aria-hidden="true" />
              Emergency &amp; reception: 24 × 7
            </span>
          </li>
        </ul>
      </div>

      <div className="container--wide footer__notice">
        <div className="footer__disclaimer">
          <ShieldAlert size={17} aria-hidden="true" />
          <span>
            <strong style={{ color: "#fff" }}>Demonstration notice:</strong> Green Field
            Hospital is the fictional subject of this RAG engineering build. All
            contact details, doctors, fees and policies are clearly-marked sample
            data and must not be used for real medical or emergency decisions.
          </span>
        </div>

        <div className="footer__legal">
          <span>© {new Date().getFullYear()} Green Field Hospital — ReflectRAG project demo. All rights reserved (sample).</span>
          <nav aria-label="Legal">
            <button onClick={() => setModal("privacy")}>Privacy Policy</button>
            <button onClick={() => setModal("terms")}>Terms of Use</button>
          </nav>
        </div>
      </div>

      {/* Legal modal */}
      <AnimatePresence>
        {modal && (
          <div className="modal" role="dialog" aria-modal="true" aria-label={LEGAL[modal].title}>
            <div className="modal__scrim" onClick={() => setModal(null)} />
            <motion.div
              className="modal__card"
              initial={{ opacity: 0, y: 14, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.98 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              <button className="modal__close" onClick={() => setModal(null)} aria-label="Close dialog">
                <X size={17} />
              </button>
              <h3>{LEGAL[modal].title}</h3>
              {LEGAL[modal].body.map(([head, text]) => (
                <p key={head}>
                  <strong>{head}. </strong>
                  {text}
                </p>
              ))}
              <p style={{ display: "flex", gap: 8, alignItems: "center", color: "var(--forest)" }}>
                <Info size={14} aria-hidden="true" />
                Sample legal text provided for completeness of the demo.
              </p>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </footer>
  );
}

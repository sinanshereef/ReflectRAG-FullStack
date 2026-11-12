// Contact.jsx — contact information exactly as published in the knowledge
// base (sample placeholders), with an enquiry form. The address is
// fictional, so there is NO live map embed — the honesty rules.

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  CheckCircle2,
  Clock,
  Info,
  Mail,
  MapPin,
  Phone,
  Send,
  Siren,
} from "lucide-react";
import Reveal from "../components/Reveal.jsx";
import { HOSPITAL } from "../data/hospital.js";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);
  const [errs, setErrs] = useState({});

  const valid = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Please share your name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) e.email = "A valid email is required.";
    if (!form.message.trim()) e.message = "Tell us how we can help.";
    return e;
  };

  const submit = (ev) => {
    ev.preventDefault();
    const e = valid();
    setErrs(e);
    if (Object.keys(e).length) return;
    setSent(true);
  };

  return (
    <section className="section contact" id="contact" aria-label="Contact">
      <div className="container contact__grid">
        <div>
          <Reveal className="sec-head">
            <span className="eyebrow">Contact Us</span>
            <h2>We're here whenever you need us</h2>
            <p>
              Reach reception any time — or ask GreenCare AI first, many questions
              (hours, fees, departments) are answered instantly.
            </p>
          </Reveal>

          <Reveal className="c-card c-card--alert">
            <span className="c-card__icon"><Siren size={21} aria-hidden="true" /></span>
            <div>
              <div className="c-card__label">Medical emergency</div>
              <div className="c-card__value">Call {HOSPITAL.emergencyNumber} immediately</div>
              <div className="c-card__sub">
                India's universal emergency number — do not wait for a callback.
                Then come directly to the Emergency &amp; Trauma entrance.
              </div>
            </div>
          </Reveal>

          <Reveal delay={70} className="c-card">
            <span className="c-card__icon"><Phone size={21} aria-hidden="true" /></span>
            <div>
              <div className="c-card__label">Reception</div>
              <div className="c-card__value">{HOSPITAL.phone}</div>
              <div className="c-card__sub">Open 24 hours, every day (sample contact number)</div>
            </div>
          </Reveal>

          <Reveal delay={110} className="c-card">
            <span className="c-card__icon"><Mail size={21} aria-hidden="true" /></span>
            <div>
              <div className="c-card__label">Email</div>
              <div className="c-card__value">{HOSPITAL.email}</div>
              <div className="c-card__sub">For non-urgent questions (sample placeholder address)</div>
            </div>
          </Reveal>

          <Reveal delay={150} className="c-card">
            <span className="c-card__icon"><MapPin size={21} aria-hidden="true" /></span>
            <div>
              <div className="c-card__label">Address</div>
              <div className="c-card__value">{HOSPITAL.address}</div>
              <div className="c-card__sub">Greenfield Junction (fictional sample address)</div>
              <span className="c-card__place">
                <Info size={12} aria-hidden="true" /> No live map shown — address is a demonstration placeholder
              </span>
            </div>
          </Reveal>

          <Reveal delay={190} className="c-card">
            <span className="c-card__icon"><Clock size={21} aria-hidden="true" /></span>
            <div>
              <div className="c-card__label">Emergency &amp; reception hours</div>
              <div className="c-card__value">24 hours, 7 days a week</div>
              <div className="c-card__sub">Pharmacy 7 AM – 11 PM · Lab collection 7 AM – 7 PM · General visiting 4–6 PM</div>
            </div>
          </Reveal>
        </div>

        <Reveal delay={120} className="contact-form-card">
          <h3 style={{ fontFamily: "var(--font-body)", fontWeight: 800, fontSize: "1.15rem" }}>
            Send us a message
          </h3>
          <p style={{ fontSize: "0.85rem", color: "var(--ink-2)", marginTop: 6 }}>
            Non-urgent enquiries only. For urgent clinical concerns, call reception
            or the emergency number above.
          </p>

          <form onSubmit={submit} noValidate className="form-grid">
            <div className={`field ${errs.name ? "has-error" : ""}`}>
              <label htmlFor="ct-name">Your name <span aria-hidden="true">*</span></label>
              <input
                id="ct-name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                aria-invalid={Boolean(errs.name)}
              />
              {errs.name && <span className="field__error" role="alert">{errs.name}</span>}
            </div>
            <div className={`field ${errs.email ? "has-error" : ""}`}>
              <label htmlFor="ct-email">Email <span aria-hidden="true">*</span></label>
              <input
                id="ct-email"
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                aria-invalid={Boolean(errs.email)}
              />
              {errs.email && <span className="field__error" role="alert">{errs.email}</span>}
            </div>
            <div className={`field field--full ${errs.message ? "has-error" : ""}`}>
              <label htmlFor="ct-msg">Message <span aria-hidden="true">*</span></label>
              <textarea
                id="ct-msg"
                placeholder="How can we help you?"
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                aria-invalid={Boolean(errs.message)}
              />
              {errs.message && <span className="field__error" role="alert">{errs.message}</span>}
            </div>

            <div className="field field--full">
              <button type="submit" className="btn btn--primary" style={{ width: "100%" }}>
                <Send size={17} aria-hidden="true" />
                Send message
              </button>
            </div>
          </form>

          <AnimatePresence>
            {sent && (
              <motion.div
                className="form-success"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                role="status"
              >
                <div className="form-success__head">
                  <CheckCircle2 size={18} aria-hidden="true" />
                  Message drafted
                </div>
                <p>
                  Contact forms in this demo are not transmitted. For a guaranteed
                  response, call reception at <code>{HOSPITAL.phone}</code> — it's
                  staffed 24 hours.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </Reveal>
      </div>
    </section>
  );
}

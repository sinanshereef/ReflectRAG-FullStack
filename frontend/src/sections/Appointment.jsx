// Appointment.jsx — appointment ENQUIRY form with real client-side
// validation. This build has no booking backend: the form is clearly
// labelled as an enquiry, and success states are honest (demo notice).
// Right column: patient information from the knowledge base.

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  BadgeCheck,
  BedDouble,
  CalendarCheck,
  CheckCircle2,
  CreditCard,
  IdCard,
  Info,
  Wallet,
} from "lucide-react";
import Reveal from "../components/Reveal.jsx";
import { HOSPITAL, PATIENT_INFO } from "../data/hospital.js";

const DEPT_OPTIONS = [
  "General Medicine",
  "Cardiology",
  "Paediatrics",
  "Obstetrics & Gynaecology",
  "Orthopaedics",
  "Dermatology",
  "ENT",
  "Ophthalmology",
  "Dentistry",
  "Emergency & Trauma",
  "Radiology & Imaging",
  "Laboratory Services",
];

const initial = { name: "", email: "", phone: "", department: "", date: "", message: "" };

function validate(values) {
  const errors = {};
  if (!values.name.trim()) errors.name = "Please enter the patient's name.";
  else if (values.name.trim().length < 3) errors.name = "Name looks too short.";

  if (!values.email.trim()) errors.email = "Email is required for confirmation.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim()))
    errors.email = "That email address doesn't look valid.";

  if (!values.phone.trim()) errors.phone = "Phone number is required.";
  else if (!/^[+\d][\d\s-]{6,15}$/.test(values.phone.trim()))
    errors.phone = "Use digits, optionally starting with + for country code.";

  if (!values.department) errors.department = "Choose a department so we route your enquiry.";

  if (values.date) {
    const d = new Date(values.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (Number.isNaN(d.getTime())) errors.date = "Enter a valid date.";
    else if (d < today) errors.date = "Preferred date cannot be in the past.";
  }
  return errors;
}

export default function Appointment() {
  const [values, setValues] = useState(initial);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [sentAt, setSentAt] = useState(null);

  const set = (key) => (e) => {
    setValues((v) => ({ ...v, [key]: e.target.value }));
    setErrors((er) => ({ ...er, [key]: undefined }));
    setSubmitted(false);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    const errs = validate(values);
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    // No booking API exists in this project — treat explicitly as an enquiry.
    setSubmitted(true);
    setSentAt(new Date().toLocaleTimeString());
  };

  return (
    <section className="section" id="appointment" aria-label="Appointment and patient information">
      <div className="container--wide">
        <Reveal className="sec-head">
          <span className="eyebrow">Appointments &amp; Patient Info</span>
          <h2>Plan your visit in two minutes</h2>
          <p>
            Send us your details and ideal timing — and check the essentials
            (fees, visiting hours, what to bring) before you arrive.
          </p>
        </Reveal>

        <div className="appoint__grid" id="patient-info">
          {/* ---------- Enquiry form ---------- */}
          <Reveal className="form-card">
            <form onSubmit={onSubmit} noValidate>
              <h3 style={{ fontFamily: "var(--font-body)", fontWeight: 800, fontSize: "1.15rem", display: "flex", alignItems: "center", gap: 10 }}>
                <CalendarCheck size={20} color="var(--emerald)" aria-hidden="true" />
                Appointment enquiry
              </h3>

              <div className="form-grid">
                <div className={`field ${errors.name ? "has-error" : ""}`}>
                  <label htmlFor="ap-name">Patient name <span aria-hidden="true">*</span></label>
                  <input
                    id="ap-name"
                    type="text"
                    placeholder="e.g. Anjali Sharma"
                    value={values.name}
                    onChange={set("name")}
                    aria-invalid={Boolean(errors.name)}
                    aria-describedby={errors.name ? "ap-name-err" : undefined}
                  />
                  {errors.name && (
                    <span id="ap-name-err" className="field__error" role="alert">{errors.name}</span>
                  )}
                </div>

                <div className={`field ${errors.email ? "has-error" : ""}`}>
                  <label htmlFor="ap-email">Email <span aria-hidden="true">*</span></label>
                  <input
                    id="ap-email"
                    type="email"
                    placeholder="you@example.com"
                    value={values.email}
                    onChange={set("email")}
                    aria-invalid={Boolean(errors.email)}
                    aria-describedby={errors.email ? "ap-email-err" : undefined}
                  />
                  {errors.email && (
                    <span id="ap-email-err" className="field__error" role="alert">{errors.email}</span>
                  )}
                </div>

                <div className={`field ${errors.phone ? "has-error" : ""}`}>
                  <label htmlFor="ap-phone">Phone <span aria-hidden="true">*</span></label>
                  <input
                    id="ap-phone"
                    type="tel"
                    placeholder="+91 00000 10001"
                    value={values.phone}
                    onChange={set("phone")}
                    aria-invalid={Boolean(errors.phone)}
                    aria-describedby={errors.phone ? "ap-phone-err" : undefined}
                  />
                  {errors.phone && (
                    <span id="ap-phone-err" className="field__error" role="alert">{errors.phone}</span>
                  )}
                </div>

                <div className={`field ${errors.department ? "has-error" : ""}`}>
                  <label htmlFor="ap-dept">Department <span aria-hidden="true">*</span></label>
                  <select
                    id="ap-dept"
                    value={values.department}
                    onChange={set("department")}
                    aria-invalid={Boolean(errors.department)}
                    aria-describedby={errors.department ? "ap-dept-err" : undefined}
                  >
                    <option value="">Select a department…</option>
                    {DEPT_OPTIONS.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                  {errors.department && (
                    <span id="ap-dept-err" className="field__error" role="alert">{errors.department}</span>
                  )}
                </div>

                <div className={`field field--full ${errors.date ? "has-error" : ""}`}>
                  <label htmlFor="ap-date">Preferred date</label>
                  <input
                    id="ap-date"
                    type="date"
                    value={values.date}
                    onChange={set("date")}
                    aria-invalid={Boolean(errors.date)}
                    aria-describedby={errors.date ? "ap-date-err" : undefined}
                  />
                  {errors.date && (
                    <span id="ap-date-err" className="field__error" role="alert">{errors.date}</span>
                  )}
                </div>

                <div className="field field--full">
                  <label htmlFor="ap-msg">Anything we should know?</label>
                  <textarea
                    id="ap-msg"
                    placeholder="Symptoms, previous reports, insurance details…"
                    value={values.message}
                    onChange={set("message")}
                  />
                </div>
              </div>

              <div className="form-card__actions">
                <button type="submit" className="btn btn--primary btn--lg">
                  <CalendarCheck size={18} aria-hidden="true" />
                  Send enquiry
                </button>
                <p className="form-card__hint">
                  This is an <strong>enquiry form</strong> (this build has no booking
                  system). It does not transmit data or confirm appointments —
                  reception confirms final slots at <nobr>{HOSPITAL.phone}</nobr>.
                </p>
              </div>

              <AnimatePresence>
                {submitted && (
                  <motion.div
                    className="form-success"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    role="status"
                  >
                    <div className="form-success__head">
                      <CheckCircle2 size={18} aria-hidden="true" />
                      Enquiry prepared {sentAt && <span style={{ fontWeight: 600 }}>· {sentAt}</span>}
                    </div>
                    <p>
                      Your details have been validated successfully. Because this demo
                      has no live booking system, please finalise by calling reception
                      at <code>{HOSPITAL.phone}</code> (24 hours) or by asking GreenCare
                      AI about department timings before you arrive.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </form>
          </Reveal>

          {/* ---------- Patient information ---------- */}
          <div className="pi-col">
            <Reveal className="pi-card">
              <div className="pi-card__head">
                <Wallet size={19} aria-hidden="true" />
                <h3>Registration &amp; consultation fees</h3>
              </div>
              <dl className="pi-table">
                {PATIENT_INFO.registration.map((row) => (
                  <div className="pi-row" key={row.k}>
                    <dt>{row.k}</dt>
                    <dd>{row.v}</dd>
                  </div>
                ))}
              </dl>
              <p className="pi-note">
                <Info size={12} style={{ verticalAlign: "-2px", marginRight: 4 }} aria-hidden="true" />
                Sample fees from the knowledge base. Tests, medicines and procedures
                may add to the total — the billing desk confirms before treatment.
              </p>
            </Reveal>

            <Reveal delay={90} className="pi-card">
              <div className="pi-card__head">
                <BedDouble size={19} aria-hidden="true" />
                <h3>Room rates</h3>
              </div>
              <dl className="pi-table">
                {PATIENT_INFO.rooms.map((row) => (
                  <div className="pi-row" key={row.k}>
                    <dt>{row.k}</dt>
                    <dd>{row.v}</dd>
                  </div>
                ))}
              </dl>
            </Reveal>

            <Reveal delay={140} className="pi-card">
              <div className="pi-card__head">
                <CreditCard size={19} aria-hidden="true" />
                <h3>Payments &amp; insurance</h3>
              </div>
              <p style={{ fontSize: "0.88rem", color: "var(--ink-2)", lineHeight: 1.6 }}>
                {PATIENT_INFO.payments}
              </p>
              <div style={{ marginTop: 14 }}>
                <div className="pi-card__head" style={{ marginBottom: 10 }}>
                  <IdCard size={19} aria-hidden="true" />
                  <h3>What to bring</h3>
                </div>
                <ul className="pi-check">
                  {PATIENT_INFO.bring.map((b) => (
                    <li key={b}>
                      <BadgeCheck size={16} aria-hidden="true" />
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

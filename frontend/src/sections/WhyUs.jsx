// WhyUs.jsx — the "why choose us" section on a deep forest backdrop.
// Themes only: no invented statistics, counts or awards.

import { Sparkles } from "lucide-react";
import Reveal from "../components/Reveal.jsx";
import { icon } from "../components/icons.js";
import { WHY_US } from "../data/hospital.js";
import { useAssistant } from "../context/AssistantContext.jsx";

export default function WhyUs() {
  const assistant = useAssistant();
  return (
    <section className="section why" id="why-us" aria-label="Why choose Green Field Hospital">
      <div className="container--wide">
        <Reveal className="sec-head sec-head--center">
          <span className="eyebrow" style={{ color: "var(--mint)" }}>Why Green Field Hospital</span>
          <h2 style={{ color: "#fff" }}>The difference is how you're treated</h2>
          <p>
            Not a bigger promise — a better experience, built on six everyday habits.
          </p>
        </Reveal>

        <div className="why__grid">
          {WHY_US.map((why, i) => {
            const Icon = icon(why.icon);
            return (
              <Reveal key={why.title} delay={(i % 3) * 80} className="why-card" as="article">
                <span className="why-card__icon"><Icon size={23} aria-hidden="true" /></span>
                <h3>{why.title}</h3>
                <p>{why.text}</p>
              </Reveal>
            );
          })}
        </div>

        <Reveal delay={120} className="why__cta">
          <button className="btn btn--light" onClick={() => assistant.openIn("drawer")}>
            <Sparkles size={17} aria-hidden="true" />
            See how GreenCare AI can help you
          </button>
          <p>Instant answers about departments, hours, fees &amp; preparation — before you arrive.</p>
        </Reveal>
      </div>
    </section>
  );
}

// Departments.jsx — the specialty grid. Descriptions are deliberately
// general and responsible; the knowledge base is the source of the
// department list, clinics and timings.

import { ArrowRight, Info } from "lucide-react";
import Reveal from "../components/Reveal.jsx";
import { icon } from "../components/icons.js";
import { DEPARTMENTS } from "../data/hospital.js";
import { useAssistant } from "../context/AssistantContext.jsx";

export default function Departments() {
  const assistant = useAssistant();

  const askAboutDepartment = (name) => {
    const q = `Tell me about the ${name} department and its timings`;
    assistant.openIn("drawer");
    // Ask right after the drawer opens so the first paint is instant.
    requestAnimationFrame(() => assistant.send(q));
  };

  return (
    <section className="section departments" id="departments" aria-label="Departments">
      <div className="container--wide">
        <Reveal className="sec-head sec-head--center">
          <span className="eyebrow">Departments &amp; Specialties</span>
          <h2>Expert care for every part of you</h2>
          <p>
            Medical departments working as one team — with clinic timings
            published for every specialty, and GreenCare AI ready to answer
            follow-up questions any time.
          </p>
        </Reveal>

        <div className="dep__grid">
          {DEPARTMENTS.map((dep, i) => {
            const Icon = icon(dep.icon);
            return (
              <Reveal key={dep.id} delay={(i % 4) * 70} className="dep-card" as="article">
                <div className="dep-card__icon"><Icon size={25} aria-hidden="true" /></div>
                <div className="dep-card__name">{dep.name}</div>
                <p className="dep-card__blurb">{dep.blurb}</p>
                <div className="dep-card__foot">
                  <span className="dep-card__kw">{dep.kw}</span>
                  <button
                    className="dep-card__more"
                    onClick={() => askAboutDepartment(dep.name)}
                    aria-label={`Ask GreenCare AI about ${dep.name}`}
                  >
                    Explore More
                    <ArrowRight size={15} aria-hidden="true" />
                  </button>
                </div>
              </Reveal>
            );
          })}
        </div>

        <Reveal delay={120} style={{ display: "flex", justifyContent: "center", marginTop: 26 }}>
          <span className="sample-note">
            <Info size={15} aria-hidden="true" />
            Department list, clinic hours and availability come from this project's
            knowledge base — always reconfirm specific timings with reception.
          </span>
        </Reveal>
      </div>
    </section>
  );
}

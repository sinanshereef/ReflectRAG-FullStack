// Experiences.jsx — patient-experience highlights. NO fabricated real
// patient reviews: cards are visibly labelled as illustrative sample
// content describing how hospital information *can* work for you.

import { Info, Quote } from "lucide-react";
import Reveal from "../components/Reveal.jsx";
import { SAMPLE_EXPERIENCES } from "../data/hospital.js";

export default function Experiences() {
  return (
    <section className="section section--tight" id="experiences" aria-label="Patient experience (sample)">
      <div className="container--wide">
        <Reveal className="sec-head sec-head--center">
          <span className="eyebrow">Patient Experience</span>
          <h2>What good information feels like</h2>
          <p>
            Illustrative scenarios — clearly labelled sample content, not real
            patient reviews — showing how published details help families plan
            care with confidence.
          </p>
        </Reveal>

        <div className="tex__grid">
          {SAMPLE_EXPERIENCES.map((t, i) => (
            <Reveal key={t.id} delay={i * 90} className="tex-card" as="article">
              <Quote className="tex-card__quote" size={34} aria-hidden="true" />
              <div className="tex-card__title">{t.title}</div>
              <p className="tex-card__text">{t.text}</p>
              <div className="tex-card__foot">
                <span className="tex-card__avatar" aria-hidden="true">{t.initials}</span>
                <div>
                  <div className="tex-card__who">Illustrative scenario</div>
                  <div className="tex-card__tag">{t.tag} · sample content</div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={140} style={{ display: "flex", justifyContent: "center", marginTop: 22 }}>
          <span className="sample-note">
            <Info size={15} aria-hidden="true" />
            These are fictional, clearly-labelled scenarios for demonstration — not
            attributed to any real patient.
          </span>
        </Reveal>
      </div>
    </section>
  );
}

// Doctors.jsx — demonstration directory using the sample doctor names from
// the indexed knowledge base. Photos are stock portraits; every card is
// clearly labelled as a demonstration profile (no real identities claimed).

import { Award, CalendarClock, MessageCircleQuestion } from "lucide-react";
import Reveal from "../components/Reveal.jsx";
import SmartImage from "../components/SmartImage.jsx";
import { DOCTORS } from "../data/hospital.js";
import { useAssistant } from "../context/AssistantContext.jsx";

export default function Doctors() {
  const assistant = useAssistant();

  const ask = (name, speciality) => {
    assistant.openIn("drawer");
    requestAnimationFrame(() =>
      assistant.send(`When is ${speciality} doctor ${name} available and what are the consultation charges?`)
    );
  };

  return (
    <section className="section doctors" id="doctors" aria-label="Our doctors">
      <div className="container--wide">
        <Reveal className="sec-head">
          <span className="eyebrow">Our Doctors</span>
          <h2>Meet the people behind your care</h2>
          <p>
            A demonstration directory built from the knowledge base's sample
            doctor profiles — names, clinics and timings as published in the
            hospital's indexed documents.
          </p>
        </Reveal>

        <div className="doc__grid">
          {DOCTORS.map((doc, i) => (
            <Reveal key={doc.name} delay={(i % 3) * 80} className="doc-card" as="article">
              <div className="doc-card__photo">
                <SmartImage
                  src={doc.photo}
                  alt={`Portrait — ${doc.name}, ${doc.speciality} (demonstration profile)`}
                />
                <span className="doc-card__tag">Demo profile</span>
              </div>
              <div className="doc-card__body">
                <div className="doc-card__name">{doc.name}</div>
                <div className="doc-card__spec">
                  <Award size={15} aria-hidden="true" />
                  {doc.speciality}
                </div>
                <div className="doc-card__meta">
                  <span>
                    <CalendarClock size={15} aria-hidden="true" />
                    {doc.hours}
                  </span>
                  <span>
                    <MessageCircleQuestion size={15} aria-hidden="true" />
                    {doc.quals}
                  </span>
                </div>
                <div className="doc-card__foot">
                  <a href="#appointment" className="btn btn--outline btn--sm">
                    Request consult
                  </a>
                  <button className="doc-card__ask" onClick={() => ask(doc.name, doc.speciality)}>
                    Ask GreenCare AI
                  </button>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

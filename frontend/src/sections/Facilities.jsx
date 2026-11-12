// Facilities.jsx — image-first editorial grid. Every claim is limited to
// what the knowledge base documents; room rates and hours live in the
// Patient Information section.

import Reveal from "../components/Reveal.jsx";
import SmartImage from "../components/SmartImage.jsx";
import { icon } from "../components/icons.js";
import { FACILITIES } from "../data/hospital.js";

export default function Facilities() {
  return (
    <section className="section facilities" id="facilities" aria-label="Facilities">
      <div className="container--wide">
        <Reveal className="sec-head">
          <span className="eyebrow">Facilities &amp; Infrastructure</span>
          <h2>Everything your care may need, under one roof</h2>
          <p>
            From 24-hour emergency response to in-house diagnostics, pharmacy and
            surgical suites — designed so your treatment never waits on logistics.
          </p>
        </Reveal>

        <div className="fac__grid">
          {FACILITIES.map((fac, i) => {
            const Icon = icon(fac.icon);
            const wide = i === 0 || i === 3;
            return (
              <Reveal
                key={fac.name}
                delay={(i % 3) * 70}
                className={`fac-card ${wide ? "fac-card--wide" : ""}`}
                as="article"
              >
                <SmartImage src={fac.photo} alt={fac.name} fallbackIcon={Icon} />
                <div className="fac-card__scrim" />
                <div className="fac-card__body">
                  <div className="fac-card__row">
                    <span className="fac-card__icon"><Icon size={19} aria-hidden="true" /></span>
                    <div className="fac-card__name">{fac.name}</div>
                  </div>
                  <p className="fac-card__text">{fac.text}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

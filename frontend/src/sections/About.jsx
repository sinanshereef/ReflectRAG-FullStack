// About.jsx — who we are: philosophy, mission, vision. Everything stated
// here is either generic (philosophy) or comes from the indexed documents;
// no invented accreditations, awards or statistics.

import { Eye, Leaf, ShieldCheck, Target } from "lucide-react";
import Reveal from "../components/Reveal.jsx";
import SmartImage from "../components/SmartImage.jsx";
import { HOSPITAL } from "../data/hospital.js";

export default function About() {
  return (
    <section className="section" id="about" aria-label="About us">
      <div className="container about__grid">
        <div className="about__media">
          <Reveal className="about__img">
            <SmartImage
              src="/images/about.jpg"
              alt="A doctor discussing a care plan with a smiling patient"
            />
          </Reveal>
          <Reveal delay={140} className="about__stat">
            <span className="about__stat-icon"><Leaf size={20} aria-hidden="true" /></span>
            <div>
              <div className="about__stat-title">Care, the way it should feel</div>
              <div className="about__stat-sub">Unhurried · Clear · Human</div>
            </div>
          </Reveal>
        </div>

        <div>
          <Reveal className="sec-head">
            <span className="eyebrow">About Us</span>
            <h2>Modern medicine, delivered with everyday warmth.</h2>
            <p>
              Green Field Hospital brings the disciplines of a modern hospital —
              clear processes, digitised information, multidisciplinary teams — to
              neighbourhood healthcare that still feels personal.
            </p>
          </Reveal>

          <Reveal delay={90}>
            <div className="about__pillars">
              <div className="pillar">
                <h3><Target size={19} aria-hidden="true" /> Our mission</h3>
                <p>
                  Make trustworthy healthcare simple to reach and easy to understand
                  for every patient and family who walks through our doors.
                </p>
              </div>
              <div className="pillar">
                <h3><Eye size={19} aria-hidden="true" /> Our vision</h3>
                <p>
                  A hospital where the right information meets the right people —
                  so every visit feels informed, calm and cared for.
                </p>
              </div>
              <div className="pillar">
                <h3><Leaf size={19} aria-hidden="true" /> Our philosophy</h3>
                <p>
                  Natural calm, honest guidance and modern medicine presented in
                  plain language — never confusing, never rushed.
                </p>
              </div>
              <div className="pillar">
                <h3><ShieldCheck size={19} aria-hidden="true" /> Our commitment</h3>
                <p>
                  Your questions come first. From reception to discharge, our teams
                  work so that you always know what happens next.
                </p>
              </div>
            </div>
          </Reveal>

          <Reveal delay={160}>
            <p style={{ marginTop: 22, display: "inline-block" }} className="sample-note">
              <ShieldCheck size={15} aria-hidden="true" />
              Sample-content build — {HOSPITAL.name} data comes from this project's own
              published quiz set.
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

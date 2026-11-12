// Hero.jsx — the signature first impression: cinematic hospital exterior,
// deep-forest scrim, animated headline, and honest floating info cards.

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import {
  ArrowRight,
  CalendarCheck,
  ChevronDown,
  Clock,
  Leaf,
  MapPin,
  Siren,
  Sparkles,
} from "lucide-react";
import { HOSPITAL } from "../data/hospital.js";
import { useAssistant } from "../context/AssistantContext.jsx";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.15 } },
};

const item = {
  hidden: { opacity: 0, y: 26 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
};

const floatCard = {
  hidden: { opacity: 0, y: 24, scale: 0.95 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] } },
};

export default function Hero() {
  const assistant = useAssistant();
  const reduced = useReducedMotion();
  const { scrollY } = useScroll();
  const bgY = useTransform(scrollY, [0, 600], [0, reduced ? 0 : 90]);
  const bgScale = useTransform(scrollY, [0, 600], [1.06, 1]);

  return (
    <section className="hero" id="home" aria-label="Welcome to Green Field Hospital">
      <motion.div
        className="hero__bg"
        style={{
          "--hero-img": `url('/images/hero.jpg')`,
          y: bgY,
          scale: bgScale,
        }}
        aria-hidden="true"
      />
      <div className="hero__scrim" aria-hidden="true" />
      <div className="hero__orb hero__orb--mint" aria-hidden="true" />
      <div className="hero__orb hero__orb--gold" aria-hidden="true" />

      <div className="container--wide hero__inner">
        <motion.div className="hero__copy" variants={container} initial="hidden" animate="show">
          <motion.div className="hero__badges" variants={item}>
            <span className="chip">
              <Siren size={13} aria-hidden="true" /> 24/7 Emergency &amp; Trauma
            </span>
            <span className="chip">
              <Leaf size={13} aria-hidden="true" /> Multispeciality care
            </span>
            <span className="chip">
              <Sparkles size={13} aria-hidden="true" /> GreenCare AI inside
            </span>
          </motion.div>

          <motion.h1 className="hero__title" variants={item}>
            Your Health. Our Commitment. <em>Every Day.</em>
          </motion.h1>

          <motion.p className="hero__lead" variants={item}>
            Experience compassionate healthcare, advanced medical facilities, and
            dedicated professionals committed to your wellbeing — with instant,
            accurate answers to your questions, right on this page.
          </motion.p>

          <motion.div className="hero__ctas" variants={item}>
            <a href="#departments" className="btn btn--light btn--lg">
              Explore Our Services
              <ArrowRight size={18} aria-hidden="true" />
            </a>
            <button onClick={() => assistant.openIn("drawer")} className="btn btn--ghost btn--lg">
              <Sparkles size={18} aria-hidden="true" />
              Talk to Our AI Assistant
            </button>
          </motion.div>

          <motion.div className="hero__meta" variants={item}>
            <span>
              <MapPin size={15} aria-hidden="true" /> {HOSPITAL.address}
            </span>
            <span>
              <Clock size={15} aria-hidden="true" /> Reception open 24 hours
            </span>
          </motion.div>
        </motion.div>

        <motion.div
          className="hero__side"
          variants={container}
          initial="hidden"
          animate="show"
          aria-label="Hospital highlights"
        >
          <motion.div className="float-cards">
            <motion.button
              className="fcard fcard--ai"
              variants={floatCard}
              whileHover={reduced ? undefined : { y: -6 }}
              onClick={() => assistant.openIn("drawer")}
              style={{ textAlign: "left", cursor: "pointer" }}
            >
              <div className="fcard__row">
                <span className="fcard__icon fcard__icon--mint">
                  <Sparkles size={20} aria-hidden="true" />
                </span>
                <div>
                  <div className="fcard__label">GreenCare AI</div>
                  <div className="fcard__title">Your intelligent hospital assistant</div>
                </div>
              </div>
              <p className="fcard__sub">
                Ask about departments, fees, visiting hours — answered from our own
                published information.
                <span style={{ color: "var(--emerald)", fontWeight: 800, marginLeft: 4 }}>
                  Ask now →
                </span>
              </p>
            </motion.button>

            <motion.div className="fcard fcard--hours" variants={floatCard}>
              <div className="fcard__row">
                <span className="fcard__icon fcard__icon--gold">
                  <CalendarCheck size={19} aria-hidden="true" />
                </span>
                <div>
                  <div className="fcard__label">Appointments</div>
                  <div className="fcard__title">Mon–Sat clinics</div>
                </div>
              </div>
              <p className="fcard__sub">
                Register at reception; enquiry desk guides slot availability.
              </p>
            </motion.div>

            <motion.div className="fcard fcard--amb" variants={floatCard}>
              <div className="fcard__row">
                <span className="fcard__icon fcard__icon--red">
                  <Siren size={19} aria-hidden="true" />
                  <span className="fcard__pulse" aria-hidden="true" />
                </span>
                <div>
                  <div className="fcard__label">Emergency</div>
                  <div className="fcard__title">Round-the-clock response</div>
                </div>
              </div>
              <p className="fcard__sub">
                Emergencies: call <strong>{HOSPITAL.emergencyNumber}</strong> first —
                then come straight to the Emergency &amp; Trauma entrance.
              </p>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      <a className="hero__scroll" href="#about" aria-label="Scroll to explore">
        Explore
        <ChevronDown size={16} aria-hidden="true" />
      </a>
    </section>
  );
}

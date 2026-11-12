// AssistantDock.jsx — the dedicated GreenCare AI section embedded in the
// page: an intro/feature column next to the full ChatDock panel.
// The SAME conversation state is shared with the floating launcher, so
// users can switch between the two and never lose their thread.

import { GanttChartSquare, MessagesSquare, Quote, ShieldCheck } from "lucide-react";
import Reveal from "../components/Reveal.jsx";
import ChatDock from "../assistant/ChatDock.jsx";
import { useAssistant } from "../context/AssistantContext.jsx";

const FEATURES = [
  {
    icon: GanttChartSquare,
    title: "A real RAG pipeline, live",
    text: "Watch each step as it runs — retrieving hospital records, grading relevance, rewriting when needed, then answering.",
  },
  {
    icon: MessagesSquare,
    title: "Built on our own documents",
    text: "Only indexed Green Field Hospital information is used. If something isn't documented, the assistant says so plainly.",
  },
  {
    icon: Quote,
    title: "Sources, never surprises",
    text: "Every answer lists the exact published document it was retrieved from. No invented citations, ever.",
  },
];

export default function AssistantDock() {
  const assistant = useAssistant();

  return (
    <section className="section" id="assistant" aria-label="GreenCare AI assistant">
      <div className="container--wide aidock">
        <div className="aidock__grid">
          <Reveal className="aidock__info">
            <span className="eyebrow">GreenCare AI</span>
            <h2>Your intelligent hospital assistant</h2>
            <p>
              Instant, accurate answers about departments, fees, visiting hours
              and appointments — powered by this project's own
              retrieval-augmented pipeline, right from the website.
            </p>

            <div className="aidock__feats">
              {FEATURES.map((f, i) => (
                <Reveal key={f.title} delay={i * 80} className="aidock__feat" as="div">
                  <f.icon size={20} aria-hidden="true" />
                  <div>
                    <strong>{f.title}</strong>
                    <span>{f.text}</span>
                  </div>
                </Reveal>
              ))}
            </div>

            <Reveal delay={220} style={{ marginTop: 24 }}>
              <span className="sample-note">
                <ShieldCheck size={15} aria-hidden="true" />
                Conversations are shared with the floating launcher — start here,
                continue anywhere on the page.
              </span>
            </Reveal>
          </Reveal>

          <Reveal delay={140} className="aidock__panel">
            <div className="aidock__glow" aria-hidden="true" />
            <div className="aidock__dock">
              <ChatDock docked onClose={() => assistant.openIn("drawer")} />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

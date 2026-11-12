// App.jsx — Green Field Hospital: the complete single-page site with the
// GreenCare AI assistant (real RAG backend) woven through it.
//
// Layout order:
//   Navbar → Hero → InfoStrip → About → Departments → Doctors →
//   Facilities → WhyUs → GreenCare AI (dedicated section) → Experiences →
//   Appointment + Patient Info → Contact → Footer (+ floating assistant)

import { AssistantProvider } from "./context/AssistantContext.jsx";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import FloatingAssistant from "./components/FloatingAssistant.jsx";

import Hero from "./sections/Hero.jsx";
import InfoStrip from "./sections/InfoStrip.jsx";
import About from "./sections/About.jsx";
import Departments from "./sections/Departments.jsx";
import Doctors from "./sections/Doctors.jsx";
import Facilities from "./sections/Facilities.jsx";
import WhyUs from "./sections/WhyUs.jsx";
import AssistantDock from "./sections/AssistantDock.jsx";
import Experiences from "./sections/Experiences.jsx";
import Appointment from "./sections/Appointment.jsx";
import Contact from "./sections/Contact.jsx";

export default function App() {
  return (
    <AssistantProvider>
      <a href="#about" className="skip-link">
        Skip to main content
      </a>

      <Navbar />

      <main id="main">
        <Hero />
        <InfoStrip />
        <About />
        <Departments />
        <Doctors />
        <Facilities />
        <WhyUs />
        <AssistantDock />
        <Experiences />
        <Appointment />
        <Contact />
      </main>

      <Footer />
      <FloatingAssistant />
    </AssistantProvider>
  );
}

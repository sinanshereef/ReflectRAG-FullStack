// main.jsx — entry point. Self-hosted variable fonts (no external font
// requests), then every style sheet in dependency order.

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";

// Fonts: Manrope (body) + Fraunces (display), both variable, woff2 local.
import "@fontsource-variable/manrope";
import "@fontsource-variable/fraunces";

import "./styles/tokens.css";
import "./styles/base.css";
import "./styles/sections.css";
import "./styles/assistant.css";
import "./styles/footer.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

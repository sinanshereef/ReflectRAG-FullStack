import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Vite dev server config.
// The "/api" proxy is the only backend-specific line here:
// while you develop on http://localhost:5173, every request to /api/*
// is forwarded to the FastAPI bridge running on port 8000 by default.
// This avoids CORS problems and keeps the frontend code clean.
// Override the backend port without editing code:
//   VITE_API_PROXY=http://localhost:8100 npm run dev
const API_TARGET = process.env.VITE_API_PROXY ?? "http://localhost:8000";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": API_TARGET,
    },
  },
});

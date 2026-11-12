# Green Field Hospital — frontend v2

Premium single-page hospital website for **Green Field Hospital**, with the
**GreenCare AI** assistant wired to the original ReflectRAG backend.

> The previous ReflectRAG demo UI is archived in `_legacy_v1/` — nothing was
> deleted, only redesigned.

---

## Run it

### 1. Backend (ReflectRAG bridge — unchanged)

From the **C_RAG root** (so the relative Chroma paths resolve):

```bash
# default, documented port (used by this project's own venv)
./venv/bin/python -m uvicorn api_server.main:app --port 8000

# this machine currently has another process on :8000, so the demo below
# used the tested ai-engineer venv on :8100 instead:
/home/sinanshareef/projects/test-python/.venv/bin/python -m uvicorn api_server.main:app --port 8100
```

Both interpreters are Python 3.11.18 with identical packages.

### 2. Frontend

```bash
cd frontend
npm install        # once

# if the backend runs on :8000 (default, no env needed):
npm run dev

# if the backend runs on another port (e.g. :8100):
VITE_API_PROXY=http://localhost:8100 npm run dev
```

Open http://localhost:5173

### Production build

```bash
npm run build && npm run preview
# Keep /api on the same origin, or set VITE_API_BASE for an absolute backend URL.
```

---

## What's inside

```
src/
  api.js                  # the ONLY module that talks to /api/ask (NDJSON stream)
  data/hospital.js        # all website content, sourced from the indexed KB
  context/AssistantContext.jsx  # shared chat state (drawer + dock share one thread)
  hooks/
    useChat.js            # chat engine: streaming, retry, clear, health ping
    useReveal.js          # IntersectionObserver scroll reveal
  components/             # Logo, Navbar, Footer, floating launcher, legal modals
  sections/               # Hero, InfoStrip, About, Departments, Doctors,
                          # Facilities, WhyUs, AssistantDock, Experiences,
                          # Appointment (enquiry + patient info), Contact
  assistant/ChatDock.jsx  # the conversation UI (used in drawer AND page section)
  styles/                 # tokens → base → sections → assistant → footer CSS
public/
  favicon.svg             # original cross + leaf mark
  images/                 # local Unsplash photography (compressed)
```

## Design honesty rules (kept from the master prompt)

- No invented statistics, awards, accreditations or live patient reviews.
- Doctor profiles use the KB's sample names and are labelled **Demo profile**.
- Contact details are the KB's placeholders, marked as sample data.
- Appointment/contact forms validate locally and explicitly state that no
  booking system exists in this build.
- Chat answers come ONLY from `/api/ask` (real RAG); sources render only when
  the backend actually returned them.
- Emergencies always route to real emergency services, never the chat.

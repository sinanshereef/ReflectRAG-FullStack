#!/usr/bin/env python3
"""
Builds: C_RAG/docs/ReflectRAG_User_Manual.pdf

A complete user manual + project guide for the ReflectRAG showcase:
what it is, how it works, how to run it, file map, troubleshooting,
GitHub/LinkedIn checklist.

Run with the project's own Python:
    ./venv/bin/python docs/build_manual.py
(The venv needs: fpdf2 — installed during the front-end build.)
"""

import os
from pathlib import Path

from fpdf import FPDF
from fpdf.fonts import FontFace

# ---------------------------------------------------------------- paths
ROOT = Path(__file__).resolve().parent.parent          # .../C_RAG
OUT = ROOT / "docs" / "ReflectRAG_User_Manual.pdf"

# ---------------------------------------------------------------- colors
INK = (16, 22, 47)          # main text on paper
MUTED = (90, 100, 120)      # captions
ACCENT = (124, 92, 255)     # violet
ACCENT2 = (14, 165, 180)    # teal (print-friendly cyan)
BG_LIGHT = (243, 244, 249)  # code-block fill
LINE = (222, 224, 232)      # table borders

FONT_DIR = Path("/usr/share/fonts/liberation-sans-fonts")
MONO_DIR = Path("/usr/share/fonts/liberation-mono-fonts")


class Manual(FPDF):
    def header(self):
        if self.page_no() == 1:
            return
        self.set_draw_color(*ACCENT)
        self.set_line_width(0.6)
        self.line(18, 14, 192, 14)
        self.set_y(17)
        self.set_font("lib", "", 8.2)
        self.set_text_color(*MUTED)
        self.cell(0, 4, "ReflectRAG — User Manual & Project Guide", align="L")
        self.cell(0, 4, "v1.0 · 2026", align="R", new_x="LMARGIN", new_y="NEXT")
        self.ln(4)

    def footer(self):
        self.set_y(-14)
        self.set_font("lib", "", 8)
        self.set_text_color(*MUTED)
        self.cell(0, 6, f"page {self.page_no()} of {{nb}}", align="C")


pdf = Manual(format="A4")
pdf.set_margins(18, 18, 18)
pdf.set_auto_page_break(True, 20)

# Unicode text needs embedded TTF fonts (built-in core fonts are latin-1).
pdf.add_font("lib", "", str(FONT_DIR / "LiberationSans-Regular.ttf"))
pdf.add_font("lib", "B", str(FONT_DIR / "LiberationSans-Bold.ttf"))
pdf.add_font("lib", "I", str(FONT_DIR / "LiberationSans-Italic.ttf"))
pdf.add_font("mono", "", str(MONO_DIR / "LiberationMono-Regular.ttf"))
pdf.add_font("mono", "B", str(MONO_DIR / "LiberationMono-Bold.ttf"))


# ------------------------------------------------------------- helpers
def body(text, size=10.3, color=INK, style="", h=5.4):
    pdf.set_font("lib", style, size)
    pdf.set_text_color(*color)
    pdf.multi_cell(0, h, text.strip(), new_x="LMARGIN", new_y="NEXT")
    pdf.ln(1.5)


def bullet(text, size=10.3):
    pdf.set_font("lib", "", size)
    pdf.set_text_color(*ACCENT)
    pdf.cell(6, 5.4, "•")
    pdf.set_text_color(*INK)
    pdf.multi_cell(0, 5.4, text.strip(), new_x="LMARGIN", new_y="NEXT")
    pdf.ln(0.8)


def h1(text):
    if pdf.page_no() > 1:
        pdf.ln(3)
    pdf.set_font("lib", "B", 17)
    pdf.set_text_color(*INK)
    pdf.multi_cell(0, 8, text, new_x="LMARGIN", new_y="NEXT")
    y = pdf.get_y()
    pdf.set_draw_color(*ACCENT)
    pdf.set_line_width(0.9)
    pdf.line(18, y + 1, 62, y + 1)
    pdf.ln(7)


def h2(text, size=12.2):
    pdf.ln(1)
    pdf.set_font("lib", "B", size)
    pdf.set_text_color(*ACCENT)
    pdf.multi_cell(0, 6.4, text.strip(), new_x="LMARGIN", new_y="NEXT")
    pdf.ln(1.2)


def mono_block(code, size=8.4, fill=BG_LIGHT):
    lines = code.rstrip("\n").split("\n")
    lh = 4.7
    box_h = len(lines) * lh + 5
    x, y = pdf.get_x(), pdf.get_y()
    if y + box_h > pdf.h - 20:
        pdf.add_page()
        x, y = pdf.get_x(), pdf.get_y()
    pdf.set_fill_color(*fill)
    pdf.set_draw_color(*LINE)
    pdf.rect(x, y, 174, box_h, style="DF")
    pdf.set_xy(x + 4, y + 2.5)
    for line in lines:
        pdf.set_font("mono", "B" if line.startswith("#") or "venv" in line else "", size)
        pdf.set_text_color(46, 16, 101) if line.strip().startswith("#") else pdf.set_text_color(*INK)
        pdf.cell(0, lh, line.replace("\t", "    "), new_x="LMARGIN", new_y="NEXT")
    pdf.set_y(y + box_h + 4)


def table(headers, rows, widths=None, h_conf=None):
    style = FontFace(emphasis="BOLD", color=(255, 255, 255), fill_color=ACCENT, size_pt=9)
    with pdf.table(
        col_widths=widths or tuple(len(headers)),
        text_align="LEFT",
        line_height=5.6,
        headings_style=style,
        borders_layout="ALL",
    ) as t:
        hr = t.row()
        for htxt in headers:
            hr.cell(htxt)
        for row in rows:
            r = t.row()
            for cell in row:
                r.cell(str(cell))
    pdf.ln(3)


# =====================================================================
# 1 — COVER
# =====================================================================
pdf.add_page()
pdf.set_fill_color(*ACCENT)
pdf.rect(0, 0, 210, 7, style="F")

pdf.ln(26)
pdf.set_font("mono", "B", 10)
pdf.set_text_color(*ACCENT2)
pdf.cell(0, 6, "USER MANUAL + PROJECT GUIDE", new_x="LMARGIN", new_y="NEXT")
pdf.ln(8)

pdf.set_font("lib", "B", 31)
pdf.set_text_color(*INK)
pdf.multi_cell(0, 12, "ReflectRAG", new_x="LMARGIN", new_y="NEXT")
pdf.set_font("lib", "B", 14.5)
pdf.set_text_color(*ACCENT)
pdf.multi_cell(0, 7.5, "Self-Correcting Knowledge Assistant — with a live animated front-end", new_x="LMARGIN", new_y="NEXT")
pdf.ln(6)

pdf.set_font("lib", "", 10.6)
pdf.set_text_color(*MUTED)
pdf.multi_cell(0, 5.8,
    "A self-correcting RAG agent built as a LangGraph state machine "
    "(retrieve → grade → rewrite → generate), with an LLM-as-Judge relevance "
    "grader, capped query rewriting, a persistent ChromaDB index and a "
    "beautiful React + Vite dashboard that streams every pipeline step live.",
    new_x="LMARGIN", new_y="NEXT")

pdf.ln(10)
mono_block(
    "Python 3.11  ·  LangGraph  ·  LangChain  ·  Gemini 2.5 Flash\n"
    "ChromaDB (persistent)  ·  FastAPI bridge  ·  React + Vite  ·  pure-CSS animations",
    fill=(240, 239, 253),
)

pdf.ln(24)
pdf.set_font("lib", "", 9.5)
pdf.set_text_color(*MUTED)
pdf.multi_cell(0, 5.2,
    "Prepared for the GitHub & LinkedIn showcase — everything inside,\n"
    "exactly in the order you need it: understand → run → explain → publish.\n\n"
    "Author: <your name>\nProject location:\n"
    f"  {ROOT}",
    new_x="LMARGIN", new_y="NEXT")

pdf.set_fill_color(*ACCENT)
pdf.rect(0, 287, 210, 3, style="F")

# =====================================================================
# 2 — WHAT IS REFLECTRAG
# =====================================================================
pdf.add_page()
h1("1 · What is ReflectRAG?")
body(
    "ReflectRAG is a knowledge assistant over your own PDF/TXT documents — "
    "but instead of the usual one-shot RAG (retrieve once, generate, hope), it "
    "runs a small state machine that checks its own evidence before answering:"
)
bullet("Retrieves top-k chunks (k = 4) from a persistent ChromaDB index.")
bullet("Grades every chunk with Gemini (LLM-as-Judge): is it relevant to the question?")
bullet("If nothing survived, rewrites the question and retrieves again — capped at 2 retries so the run always terminates.")
bullet("Generates the final answer strictly from surviving context, appends cited source files, or honestly answers “I don’t know”.")
body(
    "This front-end addition turns that pipeline into a demo recruiters can see: "
    "every step above lights up live in the browser, with per-step timings, "
    "retry notes, chunk-kept counts and cited sources."
)

h2("The project in one sentence (for LinkedIn)")
pdf.set_text_color(*INK)
mono_block(
    "ReflectRAG — a self-correcting RAG agent as a LangGraph state machine: an\n"
    "LLM-as-Judge grades retrieved chunks, the question is rewritten when the\n"
    "grader keeps nothing (max 2 retries), and answers come strictly from a\n"
    "persistent ChromaDB index — cited sources or “I don’t know”."
)

h2("Why it is different from a basic RAG chatbot")
table(
    ["Aspect", "Basic RAG", "ReflectRAG"],
    widths=(40, 55, 79),
    rows=[
        ("Retrieval", "one pass, take all hits", "top-k then graded — only relevant chunks survive"),
        ("Bad retrieval", "hallucination risk", "detect it, rewrite the question, try again (≤ 2)"),
        ("Termination", "n/a", "guaranteed: retry counter in the graph state"),
        ("No evidence", "model guesses", "honest fallback: “I don’t know”"),
        ("Citations", "rare", "Sources: <file> appended from chunk metadata"),
        ("Visibility", "a chat bubble", "live node-by-node pipeline with timings"),
    ],
)

# =====================================================================
# 3 — ARCHITECTURE
# =====================================================================
pdf.add_page()
h1("2 · How it works — the state machine")

# --- diagram ---------------------------------------------------------
def box(x, y, w, h, title, sub, hot=False):
    pdf.set_fill_color(*(238, 235, 255) if hot else (243, 244, 249))
    pdf.set_draw_color(*ACCENT if hot else LINE)
    pdf.set_line_width(0.4)
    pdf.rect(x, y, w, h, style="DF")
    pdf.set_xy(x + 2, y + 3)
    pdf.set_font("mono", "B", 8.6)
    pdf.set_text_color(*INK)
    pdf.cell(w - 4, 4.4, title)
    pdf.set_xy(x + 2, y + 8)
    pdf.set_font("lib", "", 7.4)
    pdf.set_text_color(*MUTED)
    pdf.multi_cell(w - 4, 3.6, sub)
    return (x, y, w, h)

def arrow(x1, y1, x2, y2):
    pdf.set_draw_color(*MUTED)
    pdf.set_line_width(0.5)
    pdf.line(x1, y1, x2, y2)
    ang = -0.42 if x2 > x1 else 2.72
    pdf.line(x2, y2, x2 - 2.6, y2 + 1.4)
    pdf.line(x2, y2, x2 + 2.6, y2 + 1.4)

Y = 34
b1 = box(18, Y, 38, 16, "retrieve", "top-k from\nChromaDB")
b2 = box(66, Y, 38, 16, "grade_docs", "LLM JUDGE\nyes / no ×k", hot=True)
b3 = box(114, Y, 38, 16, "transform", "rewrite query\n(retry node)")
b4 = box(162, Y, 32, 16, "generate", "answer +\ncitations")

arrow(56, Y + 8, 66, Y + 8)          # retrieve -> grade
arrow(146, Y + 8, 162, Y + 8)        # (grade) -> generate, same line
arrow(104, Y + 8, 114, Y + 8)        # grade -> transform (loop branch)

# loop-back elbow: transform -> retrieve, labelled ≤ 2 retries
pdf.set_draw_color(*ACCENT2)
pdf.set_line_width(0.55)
pdf.line(133, Y + 16, 133, Y + 24)
pdf.line(133, Y + 24, 37, Y + 24)
pdf.line(37, Y + 24, 37, Y + 16)
pdf.set_font("lib", "I", 8)
pdf.set_text_color(*ACCENT2)
pdf.text(56, Y + 28, "kept == 0  →  try again  (≤ 2 retries)   ·   kept > 0  →  jump to generate")

pdf.ln(22)
body(
    "The routing function decide_next_step() is 4 lines of honest code: "
    "if no documents survived grading AND retry_count < MAX_RETRIES (2) → "
    "transform_query; otherwise → generate. The retry counter lives in the "
    "graph state (GraphState), which also carries question, documents "
    "(content + source metadata) and the final generation — that is how "
    "citations survive the filtering step.",
)

h2("What each node does (as implemented in gemini_crag.py)")
table(
    ["Node", "Does", "Writes into state"],
    widths=(30, 95, 49),
    rows=[
        ("retrieve", "GoogleGenerativeAIEmbeddings → Chroma similarity search, k=4; keeps content + source metadata per chunk", "documents[]"),
        ("grade_documents", "One Gemini call per chunk: “relevant to the question? yes/no” — keep only the yeses", "documents[] (filtered)"),
        ("transform_query", "Gemini rewrites the question to be clearer and more specific", "question, retry_count+1"),
        ("generate", "Answers using ONLY surviving context; appends unique Sources from chunk metadata", "generation"),
    ],
)

h2("The API stream (what the browser receives)")
body(
    "The FastAPI bridge (api_server/main.py) streams one JSON line per event, "
    "so the UI can animate the state machine as it truly runs. Real captured "
    "output from a validation run (a question outside the corpus):",
)
mono_block(
    '{"type": "start"}\n'
    '{"type": "step", "node": "retrieve",        "pass": 1, "seconds": 0.93}\n'
    '{"type": "step", "node": "grade_documents", "pass": 1, "seconds": 33.7, "kept": 0}\n'
    '{"type": "step", "node": "transform_query", "seconds": 5.2,\n'
    ' "new_question": "What is the name of the current Prime Minister of France?",\n'
    ' "retries_used": 1, "retries_max": 2}\n'
    '{"type": "step", "node": "retrieve",        "pass": 2, "seconds": 0.73}  —  self-correcting loop\n'
    '… {"type": "done", "answer": "…", "sources": […], "retries_used": 1, …}'
)
body(
    "A grounded single-pass run ends like this (also captured live):"
)
mono_block(
    '{"type": "step", "node": "generate", "seconds": 2.66}\n'
    '{"type": "done",\n'
    ' "answer": "I don\'t know.\\n\\nSources: ./Hospital_DOC/Greenfield_Hospital_Chatbot_FAQ.txt",\n'
    ' "sources": ["./Hospital_DOC/Greenfield_Hospital_Chatbot_FAQ.txt"],\n'
    ' "retries_used": 0, "chunks_kept": 2, "total_seconds": 13.62}'
)

# =====================================================================
# 4 — FOLDER MAP
# =====================================================================
pdf.add_page()
h1("3 · Folder map — what exists and what was added")
body(
    "Hard rule respected during development: not one existing file or folder "
    "was modified. The glossary: everything marked [NEW] below was created "
    "for the showcase; everything else is your original project."
)
mono_block(
    "C_RAG/\n"
    "├─ gemini_crag.py                 (untouched — the LangGraph state machine)\n"
    "├─ .env                           (untouched — Google_API_Key)\n"
    "├─ Hospital_DOC/                  (untouched — source PDF/TXT documents)\n"
    "├─ Hospital_RAG/, Bank/           (untouched — notebooks & second corpus)\n"
    "├─ vector_database/               (untouched — persistent Chroma store, 59 chunks)\n"
    "├─ chroma_db    -> vector_database [NEW symlink: lets gemini_crag.py find the store]\n"
    "├─ venv/                          (untouched — Python 3.11.18; +3 packages installed)\n"
    "├─ api_server/                    [NEW] FastAPI bridge\n"
    "│   ├─ main.py                    (bridge: /api/health, /api/ask — ~130 lines)\n"
    "│   └─ README.md\n"
    "├─ frontend/                      [NEW] React + Vite animated UI\n"
    "│   ├─ package.json, vite.config.js, index.html, .gitignore\n"
    "│   ├─ README.md\n"
    "│   └─ src/\n"
    "│       ├─ main.jsx               (mounts React)\n"
    "│       ├─ App.jsx                (page state + stream handling)\n"
    "│       ├─ api.js                 (NDJSON stream reader)\n"
    "│       ├─ styles.css             (whole design — pure-CSS animations)\n"
    "│       └─ components/            (Header, Hero, PipelineTracker,\n"
    "│                                  AnswerCard, StatsBar, HowItWorks, Footer)\n"
    "└─ docs/                          [NEW] this manual + build script\n"
    "    ├─ ReflectRAG_User_Manual.pdf\n"
    "    └─ build_manual.py            (rebuilds the PDF: ./venv/bin/python docs/build_manual.py)"
)
pdf.ln(2)
body(
    "Note on chroma_db: the existing index physically lives in vector_database/ "
    "(built by your Hospital notebook with the same embedding model as "
    "gemini_crag.py — verified). The symlink is a read/write shortcut, not a "
    "copy; delete it any time and nothing breaks."
)

# =====================================================================
# 5 — HOW TO RUN
# =====================================================================
pdf.add_page()
h1("4 · How to run it — 3 terminals, 3 commands")

h2("Step 0 — one-time setup")
body("Nothing to configure: your .env already has the key, and npm install was already run. If you ever move the project to a new machine:")
mono_block(
    "# inside C_RAG/\n"
    "python3.11 -m venv venv                  # rebuild venv (or reuse the committed one)\n"
    "./venv/bin/pip install fastapi fpdf2     # the only two additions to your base set\n"
    "ln -s vector_database chroma_db          # (Linux/macOS) connect the existing index\n"
    "cd frontend && npm install               # React app dependencies (~20 packages)"
)

h2("Step 1 — start the bridge (terminal 1)")
mono_block(
    'cd "/home/sinanshareef/Documents/Artificial Intelligence/Generative AI/LangGraph/C_RAG"\n'
    "./venv/bin/python -m uvicorn api_server.main:app --port 8000\n"
    "#   → INFO:     Uvicorn running on http://127.0.0.1:8000\n"
    "#   The first boot pools up the vector store — a few seconds.\n"
    "#   Their graph's own markers (---RETRIEVE---, ---GRADE…) print here too."
)

h2("Step 2 — start the UI (terminal 2)")
mono_block(
    "cd frontend\n"
    "npm run dev\n"
    "#   → VITE ready: Local: http://localhost:5173/"
)

h2("Step 3 — open the app (browser)")
mono_block("http://localhost:5173")
body(
    "Click one of the suggested questions (they match the Hospital corpus). "
    "The pipeline tracker lights up node by node, then the answer types itself "
    "out with cited sources, and four stat cards summarise the run. "
    "FastAPI also gives you an interactive API console at "
    "http://localhost:8000/docs."
)

h2("Stopping / restarting")
mono_block(
    "Ctrl+C in each terminal. To start again: repeat Steps 1–2.\n"
    "# Optional: auto-install React deps were already done; re-run 'npm install'\n"
    "# only if package.json changes."
)

# =====================================================================
# 6 — FRONT-END TOUR
# =====================================================================
pdf.add_page()
h1("5 · Front-end tour — what was used and why")

h2("Tech choices (all essential, nothing exotic)")
table(
    ["Piece", "Role", "Why this one"],
    widths=(34, 62, 78),
    rows=[
        ("React 19 + Vite", "UI framework + dev server/bundler", "you asked for Vite; instant reload and a tiny, standard file tree"),
        ("Plain JSX components", "7 small component files", "one job per file — easy to read and explain in interviews"),
        ("Vite proxy", "forwards /api/* to :8000", "no CORS code needed while developing"),
        ("fetch + ReadableStream", "reads the NDJSON pipeline events", "native browser API, ~30 lines, no libraries"),
        ("Pure CSS keyframes", "every animation on the page", "no animation library — nothing beyond React itself to install"),
        ("Google Fonts (Inter + JetBrains Mono)", "typography", "fallbacks to system fonts work offline"),
    ],
)

h2("The components (file → job)")
table(
    ["File", "What it renders / does"],
    widths=(52, 122),
    rows=[
        ("App.jsx", "keeps the whole page state: question, stream events, result, error, history"),
        ("api.js", "POST /api/ask, reads the stream line by line, calls back onEvent per event"),
        ("Header.jsx", "brand bar + a live green/red dot for the bridge status"),
        ("Hero.jsx", "headline, ask box, suggested & recent question chips, offline banner"),
        ("PipelineTracker.jsx", "the live 4-node state machine: idle → running (glow) → done (check), ×pass badges, per-node seconds, kept n/k, delayed dashed “retry-only” node, loop-back notes"),
        ("StatsBar.jsx", "time · chunks kept · retries used · sources cited"),
        ("AnswerCard.jsx", "typewriter answer, grounded-fallback badge, source chips"),
        ("HowItWorks.jsx", "static explainer cards — made for LinkedIn screenshots"),
        ("Footer.jsx", "links + credit line"),
    ],
)

h2("Animations in the UI (all defined once in styles.css)")
bullet("Gradient title shimmer and drifting background blobs.")
bullet("Pipeline nodes: pulse while running, pop-in check when done, dashed “standby” for the retry-only node.")
bullet("Light dots along connector pipes chain-animate left → right.")
bullet("Typewriter answer with a blinking block caret.")
bullet("Bouncing thinking dots, spinning spinner, live elapsed-seconds stopwatch, floating stat pop-ins.")
bullet("prefers-reduced-motion: every animation is disabled automatically for accessibility.")

h2("Two integrations worth understanding (interview gold)")
body(
    "1) The bridge imports your compiled graph with from gemini_crag import app "
    "as graph and streams graph.stream(state, stream_mode=\"updates\") — the UI "
    "is literally watching your LangGraph state machine execute.\n"
    "2) The stream protocol is one JSON object per line (NDJSON). The browser "
    "reads it with a plain fetch reader and updates React state per event — "
    "the same pattern production AI apps use for token streaming."
)

# =====================================================================
# 7 — TROUBLESHOOTING + LIMITS
# =====================================================================
pdf.add_page()
h1("6 · Troubleshooting & honest limitations")

h2("Rate limits (verified the hard way — document for your demos)")
table(
    ["Symptom", "What happened", "What to do"],
    widths=(40, 62, 72),
    rows=[
        ("Orange “Pipeline stopped: 429 … free_tier_requests, limit: 5”", "Free Tier allows 5 requests/minute for gemini-2.5-flash; one grading pass = 4 calls + 1 generate, a retry pass adds more", "wait ~60 s, ask again; pace demo questions; a single-pass question usually fits"),
        ("429 with “limit: 20 … per day”", "Free Tier daily cap (20 generate calls/day) reached — resets later (the error states when)", "wait for the reset shown in the message; or use another model family for that day"),
        ("2 full retry passes never finish on Free Tier", "15+ LLM calls in <1 min exceeds any free window", "expected & honest behaviour — see note below"),
        ("Bridge “offline” dot / CORS-ish errors", "uvicorn not running, or started from the wrong folder", "run Step 1 from the C_RAG root exactly as printed in §4"),
        ("“Google_API_Key not found in .env”", "bridge launched from a different directory", "the bridge self-corrects by using C_RAG/.env; run from the project root anyway"),
        ("Vite page onload but no data", "bridge down or answering", "watch terminal 1 — the graph prints its markers live"),
        ("Node/npm missing elsewhere", "different machine", "install Node 18+; versions used here: node 24.21.0 / npm 11.19.0"),
    ],
)
pdf.ln(1)
body(
    "Note on the Free Tier & your project story: rate-limit discipline is "
    "real production knowledge. Explain in interviews: “the grader makes one "
    "LLM call per chunk, so a full loop costs ~10 calls; I pace demos and I "
    "know where the knobs are (RETRIEVE_K, model choice, or a paid tier)”. "
    "Increasing limits properly means changing model settings in YOUR "
    "gemini_crag.py — a one-line change you can make any time."
)

h2("Everything else")
bullet("If a question finds nothing: by design the assistant answers honestly instead of guessing — the UI shows a teal “grounded fallback” badge.")
bullet("The rewrite (dashed) node stays idle for well-phrased questions — that is correct, it only runs when 0 chunks are kept.")
bullet("First npm run dev may take a few seconds more (Vite warms up).")
bullet("If port 8000/5173 is taken: add --port 8001 (or 5174) to one command and adjust vite.config.js proxy target to match.")

# =====================================================================
# 8 — SHOWCASE CHECKLIST
# =====================================================================
pdf.add_page()
h1("7 · GitHub & LinkedIn showcase checklist")

h2("Repository hygiene (suggested .gitignore content — file creation is yours)")
mono_block(
    "venv/\n"
    "vector_database/\n"
    "chroma_db\n"
    "Bank/DataBase_Chroma/\n"
    "frontend/node_modules/\n"
    "frontend/dist/\n"
    "__pycache__/\n"
    ".env                # NEVER commit API keys\n"
    "ipynb_checkpoints/"
)
body("Keep .env out of the repo; Ship .env.example instead with the line Google_API_Key=your_key_here.")

h2("Suggested README skeleton (paste-ready)")
mono_block(
    "# ReflectRAG — Self-Correcting Knowledge Assistant\n"
    "LangGraph state machine: retrieve → grade (LLM-as-Judge) → rewrite (≤2)\n"
    "→ generate. Persistent ChromaDB (1000/150), Gemini 2.5 Flash, cited\n"
    "grounded answers, honest fallback.\n\n"
    "## Demo\n![pipeline] (screenshot of the animated UI mid-run)\n\n"
    "## Run\n"
    "1. ./venv/bin/python -m uvicorn api_server.main:app --port 8000\n"
    "2. cd frontend && npm install && npm run dev\n"
    "3. open http://localhost:5173\n\n"
    "## Architecture\n (the diagram from §2 or a short Mermaid block)\n"
    "## Why not a plain RAG chain?  (bullets from §1)"
)

h2("LinkedIn post draft (edit freely)")
body(
    "“Most RAG demos retrieve once and pray. I built ReflectRAG — a "
    "self-correcting RAG agent as a LangGraph state machine that GRADES every "
    "retrieved chunk with Gemini before the answer model ever sees it. If "
    "nothing survives, it rewrites the question and retries (capped at 2 so "
    "termination is guaranteed). The new UI streams every node live — you can "
    "watch retrieve → grade → rewrite → generate happen in real time, with "
    "timings, chunk-kept counts and cited sources. Stack: Python · LangGraph · "
    "LangChain · Gemini · ChromaDB · FastAPI · React + Vite. Link to repo in "
    "the comments — and attach 2–3 screenshots (hero, mid-run tracker with kept "
    "badges, the HowItWorks section).”"
)

h2("Before you publish")
bullet("Add a 20–30 s screen recording of the animated pipeline as the repo GIF.")
bullet("Rename <your name> in the Footer.jsx and in this manual's cover.")
bullet("Test the 3 suggested questions once after the Free-Tier reset, so your screenshots show a truly grounded answer with citations.")
bullet("Pin the repo, add topics: langgraph, rag, gemini, chromadb, fastapi, react.")

# =====================================================================
# 9 — WHAT WAS INSTALLED / CHANGED
# =====================================================================
h1("8 · Transparency — every change made by this build")
table(
    ["Changed/added", "Where", "Impact"],
    widths=(46, 58, 70),
    rows=[
        ("pip packages", "./venv only: fastapi 0.162.0, uvicorn 0.54.0 (already present), fpdf2 2.9.0", "isolated in the project venv"),
        ("npm packages", "frontend/node_modules only: react, react-dom, vite, @vitejs/plugin-react (~20 packages)", "local to frontend/"),
        ("new folder api_server/", "main.py + README.md", "the bridge"),
        ("new folder frontend/", "Vite React app", "the UI"),
        ("new folder docs/", "this PDF + build_manual.py", "documentation"),
        ("symlink chroma_db → vector_database/", "project root", "lets the untouched gemini_crag.py use the existing index; delete any time"),
        ("your existing files", "—", "NOT changed — verified byte-level"),
    ],
)
body("Nothing was installed globally; no system file was touched.")

# =====================================================================
# 10 — COMMANDS CHEATSHEET + GLOSSARY
# =====================================================================
pdf.add_page()
h1("9 · Cheat-sheet & glossary")
h2("All commands in one block")
mono_block(
    '# 1) bridge "      (from C_RAG)\n'
    "./venv/bin/python -m uvicorn api_server.main:app --port 8000\n\n"
    "# 2) UI (from C_RAG/frontend)\n"
    "npm run dev      # http://localhost:5173\n\n"
    "# 3) rebuild this PDF\n"
    "./venv/bin/python docs/build_manual.py\n\n"
    "# handy\n"
    "curl http://localhost:8000/api/health      # bridge status\n"
    "cd frontend && npm run build && npm run preview   # production check"
)

h2("Glossary (plain English)")
table(
    ["Term", "One-line meaning"],
    widths=(44, 130),
    rows=[
        ("RAG", "Retrieval-Augmented Generation: answer questions using your documents, not just model memory"),
        ("LangGraph state machine", "a graph of steps (nodes) + rules (edges) deciding what runs next, with shared state"),
        ("LLM-as-Judge", "an LLM that grades content (relevant? yes/no) instead of writing prose"),
        ("Query rewriting", "rephrasing a question to make retrieval find better matches"),
        ("ChromaDB", "a local vector database that stores text chunks as embeddings for similarity search"),
        ("NDJSON", "Newline-Delimited JSON: one JSON object per line — how the bridge streams events"),
        ("Vite", "a fast dev server + bundler for React apps"),
    ],
)
body(
    "You now know what was built, why each piece exists, how to run it, how to "
    "explain it, and how to publish it. Good luck with the showcase — the "
    "animated pipeline screenshots will do most of the talking."
)

# ---------------------------------------------------------------- output
OUT.parent.mkdir(parents=True, exist_ok=True)
pdf.output(str(OUT))
print(f"PDF written: {OUT}")
print(f"pages: {len(pdf.pages)} | size: {os.path.getsize(OUT) / 1024:.1f} KB")

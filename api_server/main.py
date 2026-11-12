"""
ReflectRAG API bridge
=====================

A thin FastAPI wrapper around the existing LangGraph pipeline in
``gemini_crag.py``. No original code is changed — the bridge simply imports
the already-compiled graph and streams its progress to the React frontend.

Endpoints
---------
GET  /api/health  -> {"status": "ok", ...}          quick check for the UI banner
POST /api/ask     -> NDJSON stream (see below)      one JSON line per pipeline step

Protocol of the /api/ask stream (one JSON object per line):
    {"type": "start"}
    {"type": "step", "node": "retrieve",         "pass": 1, "seconds": 0.4}
    {"type": "step", "node": "grade_documents",  "pass": 1, "seconds": 3.1, "kept": 2}
    {"type": "step", "node": "transform_query",  "seconds": 1.5,
     "new_question": "...", "retries_used": 1, "retries_max": 2}      # only on a retry
    {"type": "step", "node": "generate",         "pass": 2, "seconds": 4.0}
    {"type": "done",  "answer": "...", "sources": ["..."], "retries_used": 1,
     "chunks_kept": 2, "total_seconds": 9.0}
    ...or on any failure:
    {"type": "error", "message": "..."}

How to run (from the C_RAG root so the relative paths work exactly like
``python gemini_crag.py`` does):
    ./venv/bin/python -m uvicorn api_server.main:app --port 8000
"""

import json
import os
import sys
import time
from pathlib import Path

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from typing import Iterator

# --------------------------------------------------------------------------
# Path setup — done BEFORE importing gemini_crag so that the graph resolves
# its folders (./chroma_db, ./.env) exactly the same way it does when the
# author runs ``python gemini_crag.py`` from the C_RAG root.
# --------------------------------------------------------------------------
PROJECT_ROOT = Path(__file__).resolve().parent.parent   # .../C_RAG
sys.path.insert(0, str(PROJECT_ROOT))                   # make gemini_crag importable
os.chdir(PROJECT_ROOT)                                  # same CWD as author's runs
load_dotenv(PROJECT_ROOT / ".env")                      # load the API key the same way

# The author's .env stores the key as "Google_API_Key" (a custom name that the
# notebooks pass explicitly). The root graph instead relies on the library's
# default lookup, which only knows the standard names (GOOGLE_API_KEY /
# GEMINI_API_KEY). Alias the custom name to the standard one — in memory only,
# the .env file itself is never changed.
if os.getenv("Google_API_Key") and not os.getenv("GOOGLE_API_KEY"):
    os.environ["GOOGLE_API_KEY"] = os.environ["Google_API_Key"]

# Reuse the compiled LangGraph graph and its constants — read-only import.
from gemini_crag import MAX_RETRIES, RETRIEVE_K, LLM_MODEL, app as graph  # noqa: E402


app = FastAPI(title="ReflectRAG API", version="1.0.0")

# Small CORS allowance: makes a production build of the frontend work too
# (in normal dev mode the Vite proxy already avoids CORS entirely).
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)


class AskBody(BaseModel):
    """Request body of /api/ask — a single user question."""
    question: str


@app.get("/api/health")
def health():
    """Tiny status endpoint the frontend pings to show a 'bridge online' dot."""
    return {
        "status": "ok",
        "llm_model": LLM_MODEL,
        "retrieve_k": RETRIEVE_K,
        "max_retries": MAX_RETRIES,
    }


@app.post("/api/ask")
def ask(body: AskBody) -> StreamingResponse:
    """Stream the LangGraph pipeline as NDJSON lines (one line per event)."""
    question = body.question.strip()
    if not question:
        raise HTTPException(status_code=422, detail="Question cannot be empty")

    def generate_events() -> Iterator[str]:
        yield json.dumps({"type": "start"}) + "\n"

        state = {
            "question": question,
            "documents": [],
            "generation": "",
            "retry_count": 0,
        }
        final = dict(state)
        t_start = time.perf_counter()
        t_prev = t_start

        try:
            # stream_mode="updates" -> one chunk per executed node:
            # {"node_name": <whatever that node returned>}
            for chunk in graph.stream(state, stream_mode="updates"):
                node = next(iter(chunk), None)
                update = chunk.get(node) if node else None
                if not node or not update:
                    continue                     # skip internal/end markers
                final.update(update)

                seconds = round(time.perf_counter() - t_prev, 2)
                t_prev = time.perf_counter()

                event = {"type": "step", "node": node, "seconds": seconds}
                retries_so_far = final.get("retry_count", 0)
                if node in ("retrieve", "grade_documents"):
                    event["pass"] = retries_so_far + 1
                if node == "grade_documents":
                    event["kept"] = len(update.get("documents", []))
                if node == "transform_query":
                    event["new_question"] = update.get("question", "")
                    event["retries_used"] = retries_so_far
                    event["retries_max"] = MAX_RETRIES

                yield json.dumps(event) + "\n"

            # Collect unique sources in first-seen order (mirrors gemini_crag).
            sources, seen = [], set()
            for doc in final["documents"]:
                if doc["source"] not in seen:
                    seen.add(doc["source"])
                    sources.append(doc["source"])

            yield json.dumps(
                {
                    "type": "done",
                    "answer": final["generation"],
                    "sources": sources,
                    "retries_used": final["retry_count"],
                    "chunks_kept": len(final["documents"]),
                    "total_seconds": round(time.perf_counter() - t_start, 2),
                }
            ) + "\n"
        except Exception as exc:  # keep the UI alive and show a real error
            yield json.dumps({"type": "error", "message": str(exc)}) + "\n"

    return StreamingResponse(generate_events(), media_type="application/x-ndjson")

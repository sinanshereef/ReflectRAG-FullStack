# api_server — ReflectRAG API bridge

A thin **FastAPI** wrapper that exposes the existing LangGraph pipeline in
`../gemini_crag.py` to the React frontend. The original graph code is **not
modified** — this file only imports the compiled graph and streams its
progress to the browser.

## Run (from the C_RAG root)

```bash
./venv/bin/python -m uvicorn api_server.main:app --port 8000
```

- Interactive API docs (Swagger): http://localhost:8000/docs
- Health check: GET http://localhost:8000/api/health

## Endpoints

| Method | Path        | Body / Response |
|--------|-------------|-----------------|
| GET    | /api/health | `{status, llm_model, retrieve_k, max_retries}` |
| POST   | /api/ask    | Body `{"question": "..."}` → NDJSON stream, one JSON line per pipeline step (`start`, `step` × nodes, `done` or `error`) |

## What the bridge does (and doesn't)

- Sets the working directory to the C_RAG root, exactly like running
  `python gemini_crag.py` by hand does.
- Loads `../.env` the same way the graph does, and (in memory only) aliases
  the author's custom key name `Google_API_Key` to the standard
  `GOOGLE_API_KEY` name that `langchain-google-genai` expects.
- Reads from the same persistent ChromaDB store via the `chroma_db` symlink.
- Adds **no new graph logic**: grading, rewriting, retries and citations all
  come from the untouched `gemini_crag.py`.

## Files

- `main.py` — the whole bridge (~130 lines, heavily commented).

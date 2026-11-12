// api.js — the ONLY file that talks to the backend.
// =============================================================
// POSTs the question to /api/ask and reads the answer as a stream of
// NDJSON lines (one small JSON object per pipeline step). Each complete
// line is passed to onEvent(event), so the UI can follow the LangGraph
// pipeline live: retrieve -> grade_documents -> (transform_query) -> generate.

const API_BASE = import.meta.env.DEV ? "" : import.meta.env.VITE_API_BASE ?? "";

export async function askGreenCare(question, onEvent, { signal } = {}) {
  const res = await fetch(`${API_BASE}/api/ask`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question }),
    signal,
  });

  if (!res.ok || !res.body) {
    throw new Error(
      `API error ${res.status} — is the bridge running on :8000?`
    );
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  // Reading a stream works in chunks; a line may arrive split across two
  // chunks, so we keep the last (possibly incomplete) part in `buffer`.
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });

    const lines = buffer.split("\n");
    buffer = lines.pop(); // keep the possibly-incomplete tail
    for (const line of lines) {
      if (!line.trim()) continue;
      try {
        onEvent(JSON.parse(line));
      } catch {
        // ignore a malformed line instead of breaking the whole demo
      }
    }
  }
  if (buffer.trim()) {
    try {
      onEvent(JSON.parse(buffer));
    } catch {
      // same safety net for the final line
    }
  }
}

// Small helper used on page load / on open: is the Python bridge up?
export async function pingHealth() {
  try {
    const res = await fetch(`${API_BASE}/api/health`, {
      signal: AbortSignal.timeout(6000),
    });
    if (!res.ok) return false;
    return true;
  } catch {
    return false;
  }
}

// gemini_crag used to append "\n\nSources: ..." to the answer text.
// The bridge now sends sources separately, but we still split defensively
// so legacy formatting can never leak into the rendered answer.
export function splitAnswerSources(answerText, apiSources) {
  const [mainText, srcText] = String(answerText || "").split("\n\nSources: ");
  let sources = apiSources ?? [];
  if (srcText) sources = srcText.split(", ");
  return { mainText: mainText.trim(), sources };
}

// Human labels for pipeline node names coming from the stream.
export const NODE_LABELS = {
  retrieve: "Retrieving from hospital records",
  grade_documents: "Checking relevance of documents",
  transform_query: "Refining the question",
  generate: "Composing the answer",
};

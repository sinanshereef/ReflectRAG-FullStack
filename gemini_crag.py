import os
from typing import List, TypedDict
from dotenv import load_dotenv
from langchain_community.document_loaders import PyPDFLoader, TextLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_google_genai import ChatGoogleGenerativeAI, GoogleGenerativeAIEmbeddings
from langchain_chroma import Chroma
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langgraph.graph import StateGraph, END

load_dotenv()
if not os.getenv("Google_API_Key"):
    raise ValueError("Google_API_Key not found in .env")

# Repo-relative defaults: work for any fresh clone of the repo.
# (Locally this resolves to the same DB the ./chroma_db symlink points at.)
DOCS_DIR = os.getenv("DOCS_DIR", "./Hospital_DOC")
CHROMA_DIR = os.getenv("CHROMA_DIR", "./Hospital_RAG/vector_database")
LLM_MODEL = "models/gemini-flash-lite-latest"
EMBED_MODEL = "models/gemini-embedding-2"
RETRIEVE_K = 4
MAX_RETRIES = 2

# ---------- 1. Document loading ----------

def load_documents(folder):
    docs = []
    if not os.path.exists(folder):
        raise FileNotFoundError(f"{folder} not found")
    for file in os.listdir(folder):
        path = os.path.join(folder, file)
        try:
            if file.endswith(".pdf"):
                loader = PyPDFLoader(path)
            elif file.endswith(".txt"):
                loader = TextLoader(path, encoding="utf-8")
            else:
                continue
            docs.extend(loader.load())
        except Exception as e:
            print(f"{file} skipped: {e}")
    return docs  #here we have page content and meta data inside the docs

# ---------- 2. Vectorstore (persisted, Gemini embeddings) ----------

def get_vectorstore():
    embeddings = GoogleGenerativeAIEmbeddings(model=EMBED_MODEL)
    if os.path.exists(CHROMA_DIR):
        return Chroma(persist_directory=CHROMA_DIR, embedding_function=embeddings)
    docs = load_documents(DOCS_DIR)
    if not docs:
        raise ValueError("No documents loaded")
    splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=150)
    chunks = splitter.split_documents(docs)
    return Chroma.from_documents(chunks, embeddings, persist_directory=CHROMA_DIR)

vectorstore = get_vectorstore()
retriever = vectorstore.as_retriever(search_kwargs={"k": RETRIEVE_K})
llm = ChatGoogleGenerativeAI(model=LLM_MODEL, temperature=0, max_retries=1, timeout=60)

# ---------- 3. Shared graph state ----------
# documents carry source metadata now, not just raw text,
# so citations survive the grading/filtering step.

class GraphState(TypedDict):
    question: str
    documents: List[dict]  # {"content": str, "source": str}
    generation: str
    retry_count: int

# ---------- 4. Nodes ----------

def retrieve(state: GraphState) -> GraphState:
    print("---RETRIEVE---")
    docs = retriever.invoke(state["question"])
    documents = [
        {"content": d.page_content, "source": d.metadata.get("source", "unknown")}
        for d in docs
    ]
    return {**state, "documents": documents}

def grade_documents(state: GraphState) -> GraphState:
    print("---GRADE DOCUMENTS---")
    grade_prompt = ChatPromptTemplate.from_template(
        "Question: {question}\nDocument: {document}\n\n"
        "Does this document contain information relevant to the question? "
        "Answer only 'yes' or 'no'."
    )
    grader = grade_prompt | llm | StrOutputParser()

    relevant = []
    for doc in state["documents"]:
        result = grader.invoke({"question": state["question"], "document": doc["content"]})
        if "yes" in result.lower():
            relevant.append(doc)

    print(f"Relevant docs kept: {len(relevant)}/{len(state['documents'])}")
    return {**state, "documents": relevant}

def transform_query(state: GraphState) -> GraphState:
    print("---REWRITE QUERY---")
    rewrite_prompt = ChatPromptTemplate.from_template(
        "The original question did not retrieve good results:\n{question}\n\n"
        "Rewrite it to be clearer and more specific for document search. "
        "Return only the rewritten question."
    )
    rewriter = rewrite_prompt | llm | StrOutputParser()
    new_question = rewriter.invoke({"question": state["question"]})
    return {**state, "question": new_question.strip(), "retry_count": state["retry_count"] + 1}

def generate(state: GraphState) -> GraphState:
    print("---GENERATE---")
    context = "\n\n".join(doc["content"] for doc in state["documents"])
    gen_prompt = ChatPromptTemplate.from_template(
        "Answer the question using only the context below.\n"
        "If the answer is not in the context, say you don't know.\n"
        "Answer directly and concisely with only the needed information; "
        "do not mention the context, documents or sources.\n\n"
        "Context:\n{context}\n\nQuestion:\n{question}"
    )
    chain = gen_prompt | llm | StrOutputParser()
    answer = chain.invoke({"context": context, "question": state["question"]})

    # dedup sources, keep first-seen order
    seen = set()
    sources = []
    for doc in state["documents"]:
        if doc["source"] not in seen:
            seen.add(doc["source"])
            sources.append(doc["source"])

    return {**state, "generation": answer}

# ---------- 5. Routing logic ----------

def decide_next_step(state: GraphState) -> str:
    if len(state["documents"]) == 0 and state["retry_count"] < MAX_RETRIES:
        return "transform_query"
    return "generate"

# ---------- 6. Build the graph ----------

workflow = StateGraph(GraphState)
workflow.add_node("retrieve", retrieve)
workflow.add_node("grade_documents", grade_documents)
workflow.add_node("transform_query", transform_query)
workflow.add_node("generate", generate)

workflow.set_entry_point("retrieve")
workflow.add_edge("retrieve", "grade_documents")
workflow.add_conditional_edges(
    "grade_documents",
    decide_next_step,
    {"transform_query": "transform_query", "generate": "generate"},
)
workflow.add_edge("transform_query", "retrieve")
workflow.add_edge("generate", END)

app = workflow.compile()

# ---------- 7. Run ----------

if __name__ == "__main__":
    while True:
        question = input("\nAsk something (or 'quit'): ")
        if question.lower() == "quit":
            print("Thank you, come again")
            break
        if not question.strip():
            continue
        try:
            result = app.invoke({
                "question": question,
                "documents": [],
                "generation": "",
                "retry_count": 0,
            })
            print("\nAnswer:", result["generation"])
        except Exception as e:
            print(f"something went wrong: {e}")

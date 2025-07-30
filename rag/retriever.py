from chromadb import PersistentClient
from sentence_transformers import SentenceTransformer

# Load embedding model again
model = SentenceTransformer(
    "sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2")
client = PersistentClient(path="./chroma_store")
collection = client.get_or_create_collection("fairy_rag")


def retrieve_cultural_snippets(topic: str, culture: str, top_k=3):
    embedding = model.encode(topic).tolist()
    results = collection.query(
        query_embeddings=[embedding],
        n_results=top_k,
        where={"culture": culture}
    )
    return results["documents"][0] if results["documents"] else []

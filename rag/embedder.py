import os
from glob import glob
from chromadb import PersistentClient
from sentence_transformers import SentenceTransformer

# Load multilingual embedding model
model = SentenceTransformer(
    "sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2")


def load_texts(base_path="rag/data"):
    docs = []
    for culture_dir in os.listdir(base_path):
        culture_path = os.path.join(base_path, culture_dir)
        for file_path in glob(f"{culture_path}/*.txt"):
            with open(file_path, "r", encoding="utf-8") as f:
                text = f.read().strip()
                docs.append({
                    "text": text,
                    "culture": culture_dir,
                    "source": os.path.basename(file_path)
                })
    return docs


def embed_and_store(docs):
    client = PersistentClient(path="./chroma_store")
    collection = client.get_or_create_collection("fairy_rag")

    for i, doc in enumerate(docs):
        collection.add(
            documents=[doc["text"]],
            metadatas=[{"culture": doc["culture"], "source": doc["source"]}],
            ids=[f"doc_{i}"]
        )


if __name__ == "__main__":
    docs = load_texts()
    embed_and_store(docs)
    print("✅ Embedding complete. Vector DB created in ./chroma_store")

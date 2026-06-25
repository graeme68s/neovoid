import os
from typing import List, Dict
from sentence_transformers import SentenceTransformer
import chromadb
from chromadb.config import Settings
from pathlib import Path

# Use a small fast model that runs on CPU
MODEL_NAME = 'all-MiniLM-L6-v2'

class Embedder:
    def __init__(self, db_path: str):
        print(f"Loading embedding model {MODEL_NAME}...")
        self.model = SentenceTransformer(MODEL_NAME)

        # ChromaDB persistent storage
        self.client = chromadb.PersistentClient(
            path=db_path,
            settings=Settings(anonymized_telemetry=False)
        )
        print(f"ChromaDB ready at {db_path}")

    def _get_collection(self, workspace_path: str):
        """Get or create a collection for this workspace"""
        # Use workspace path as collection name (sanitized)
        name = workspace_path.replace('/', '_').replace('\\', '_').replace(':', '').strip('_')
        name = name[-60:] if len(name) > 60 else name  # ChromaDB has name length limit
        return self.client.get_or_create_collection(
            name=name,
            metadata={"workspace": workspace_path}
        )

    def index(self, workspace_path: str, chunks: List[Dict]) -> int:
        """Embed and store chunks for a workspace"""
        if not chunks:
            return 0

        collection = self._get_collection(workspace_path)

        # Clear existing index for this workspace
        existing = collection.count()
        if existing > 0:
            collection.delete(where={"workspace": workspace_path})

        # Embed in batches of 64
        batch_size = 64
        total = 0

        for i in range(0, len(chunks), batch_size):
            batch = chunks[i:i + batch_size]
            texts = [c['text'] for c in batch]

            embeddings = self.model.encode(texts, show_progress_bar=False).tolist()

            ids = [f"{c['file']}:{c['start_line']}" for c in batch]
            metadatas = [{
                'file': c['file'],
                'type': c['type'],
                'name': c['name'],
                'start_line': c['start_line'],
                'end_line': c['end_line'],
                'workspace': workspace_path
            } for c in batch]

            collection.add(
                embeddings=embeddings,
                documents=texts,
                metadatas=metadatas,
                ids=ids
            )
            total += len(batch)
            print(f"Indexed {total}/{len(chunks)} chunks...")

        return total

    def query(self, workspace_path: str, query_text: str, top_k: int = 5) -> List[Dict]:
        """Semantic search across the workspace index"""
        collection = self._get_collection(workspace_path)

        if collection.count() == 0:
            return []

        query_embedding = self.model.encode([query_text]).tolist()

        results = collection.query(
            query_embeddings=query_embedding,
            n_results=min(top_k, collection.count()),
            include=['documents', 'metadatas', 'distances']
        )

        chunks = []
        for i, doc in enumerate(results['documents'][0]):
            chunks.append({
                'text': doc,
                'file': results['metadatas'][0][i]['file'],
                'name': results['metadatas'][0][i]['name'],
                'start_line': results['metadatas'][0][i]['start_line'],
                'end_line': results['metadatas'][0][i]['end_line'],
                'score': 1 - results['distances'][0][i]  # convert distance to similarity
            })

        return chunks

    def status(self, workspace_path: str) -> Dict:
        """Get indexing status for a workspace"""
        collection = self._get_collection(workspace_path)
        return {
            'indexed': collection.count() > 0,
            'chunks': collection.count(),
            'workspace': workspace_path
        }

from flask import Flask, request, jsonify
from chunker import scan_workspace
from embedder import Embedder
import threading
import os

app = Flask(__name__)

# DB stored next to the executable
DB_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'neovoid_index')

embedder = Embedder(DB_PATH)

# Track indexing status
indexing_status = {}
indexing_lock = threading.Lock()

def do_index(workspace_path: str):
    """Run indexing in background thread"""
    with indexing_lock:
        indexing_status[workspace_path] = {'state': 'indexing', 'chunks': 0}

    try:
        print(f"Scanning {workspace_path}...")
        chunks = scan_workspace(workspace_path)
        print(f"Found {len(chunks)} chunks, embedding...")

        total = embedder.index(workspace_path, chunks)

        with indexing_lock:
            indexing_status[workspace_path] = {'state': 'done', 'chunks': total}
        print(f"Indexing complete: {total} chunks")

    except Exception as e:
        with indexing_lock:
            indexing_status[workspace_path] = {'state': 'error', 'error': str(e)}
        print(f"Indexing error: {e}")


@app.route('/index', methods=['POST'])
def index():
    data = request.json
    workspace_path = data.get('workspace_path')
    if not workspace_path:
        return jsonify({'error': 'workspace_path required'}), 400

    # Run indexing in background so NeoVoid doesn't block
    thread = threading.Thread(target=do_index, args=(workspace_path,))
    thread.daemon = True
    thread.start()

    return jsonify({'status': 'indexing started', 'workspace': workspace_path})


@app.route('/query', methods=['POST'])
def query():
    data = request.json
    workspace_path = data.get('workspace_path')
    query_text = data.get('text')
    top_k = data.get('top_k', 5)

    if not workspace_path or not query_text:
        return jsonify({'error': 'workspace_path and text required'}), 400

    results = embedder.query(workspace_path, query_text, top_k)
    return jsonify({'results': results})


@app.route('/status', methods=['GET'])
def status():
    workspace_path = request.args.get('workspace_path')
    if not workspace_path:
        return jsonify({'error': 'workspace_path required'}), 400

    db_status = embedder.status(workspace_path)

    with indexing_lock:
        current = indexing_status.get(workspace_path, {})

    return jsonify({**db_status, **current})


@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'ok'})


if __name__ == '__main__':
    port = int(os.environ.get('NEOVOID_INDEXER_PORT', 8765))
    print(f"NeoVoid Indexer starting on port {port}")
    app.run(host='127.0.0.1', port=port)

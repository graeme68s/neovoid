import os
import ast
from pathlib import Path
from typing import List, Dict

# File types we support
SUPPORTED_EXTENSIONS = {
    '.py', '.ts', '.tsx', '.js', '.jsx',
    '.cpp', '.c', '.h', '.hpp',
    '.rs', '.go', '.java', '.cs',
    '.md', '.json', '.yaml', '.yml'
}

# Always skip these
SKIP_DIRS = {
    'node_modules', '.git', 'dist', 'build', 'out',
    '__pycache__', '.venv', 'venv', '.next', 'coverage'
}

def should_skip(path: Path) -> bool:
    return any(part in SKIP_DIRS for part in path.parts)

def chunk_python(filepath: str, source: str) -> List[Dict]:
    """Chunk Python by function/class using AST"""
    chunks = []
    try:
        tree = ast.parse(source)
        for node in ast.walk(tree):
            if isinstance(node, (ast.FunctionDef, ast.AsyncFunctionDef, ast.ClassDef)):
                start = node.lineno - 1
                end = node.end_lineno
                chunk_text = '\n'.join(source.splitlines()[start:end])
                chunks.append({
                    'text': chunk_text,
                    'file': filepath,
                    'type': type(node).__name__,
                    'name': node.name,
                    'start_line': start + 1,
                    'end_line': end
                })
    except SyntaxError:
        # Fall back to whole file if parse fails
        chunks.append({
            'text': source,
            'file': filepath,
            'type': 'file',
            'name': Path(filepath).name,
            'start_line': 1,
            'end_line': len(source.splitlines())
        })
    return chunks

def chunk_by_lines(filepath: str, source: str, chunk_size: int = 50) -> List[Dict]:
    """Fallback chunker — splits by line count for non-Python files"""
    lines = source.splitlines()
    chunks = []
    for i in range(0, len(lines), chunk_size):
        block = lines[i:i + chunk_size]
        chunks.append({
            'text': '\n'.join(block),
            'file': filepath,
            'type': 'block',
            'name': f"{Path(filepath).name}:{i+1}",
            'start_line': i + 1,
            'end_line': min(i + chunk_size, len(lines))
        })
    return chunks

def chunk_file(filepath: str) -> List[Dict]:
    """Chunk a single file"""
    path = Path(filepath)
    ext = path.suffix.lower()

    if ext not in SUPPORTED_EXTENSIONS:
        return []

    try:
        source = path.read_text(encoding='utf-8', errors='ignore')
    except Exception:
        return []

    if not source.strip():
        return []

    if ext == '.py':
        chunks = chunk_python(filepath, source)
        if not chunks:
            chunks = chunk_by_lines(filepath, source)
    else:
        chunks = chunk_by_lines(filepath, source)

    return chunks

def scan_workspace(workspace_path: str) -> List[Dict]:
    """Scan entire workspace and return all chunks"""
    all_chunks = []
    workspace = Path(workspace_path)

    for filepath in workspace.rglob('*'):
        if not filepath.is_file():
            continue
        if should_skip(filepath.relative_to(workspace)):
            continue
        chunks = chunk_file(str(filepath))
        all_chunks.extend(chunks)

    return all_chunks

# NeoVoid Roadmap

NeoVoid is a VSCode fork with native AI integration. This document outlines the v1 and v2 feature sets.

> **Note:** The original Void editor was archived in June 2026. NeoVoid picks up where it left off.

---

## v1 Features

### 1. Token Cost Tracker
Real-time token usage and cost display in the sidebar. Shows per-session and cumulative spend across models.

### 2. Send to Chat (Context Menu)
Right-click any selected text to send it directly to the AI chat.

### 3. System Prompt Toggle / Presets
Save and switch between system prompt presets from the UI.

### 4. Update Script
Controlled update mechanism that bypasses upstream auto-updates.

### 5. Flash / Pro Auto-Router
Routes simple queries to fast/cheap model, complex reasoning to pro model. Badge indicator in status bar. Toggleable in settings.

### 6. Project Rule Files (`.neovoidrules`)
Drop a `.neovoidrules` markdown file in any project root. NeoVoid auto-ingests it as baseline AI context when that workspace opens.

---

## v2 Features

### 7. Inline Ghost Text (FIM)
Fill-In-the-Middle autocomplete streamed into the editor buffer as you type.

### 8. Context Indexing & @ Mentions
Type `@` in chat to attach files, folders, or terminal output directly into context.

### 9. Agent Mode
Describe what you want in plain English. NeoVoid plans which files to touch, makes the changes, runs the code, and fixes its own errors. Free. No subscription.

### 10. Codebase Indexing
Full repo awareness so the AI understands your entire project, not just the open file.

---

## Stability Policy

All dependencies pinned to exact versions. No auto-updates. Change version numbers manually, test, then commit.

---

## Status

| Feature | Status |
|---|---|
| Token cost tracker | ✅ Done |
| Send to chat | ✅ Done |
| Extension marketplace access | ✅ Done |
| Dependency pinning | ✅ Done |
| System prompt presets | 🔧 In Progress |
| Update script | 🔧 In Progress |
| Flash/Pro auto-router | 🔧 In Progress |
| Project rule files | 🔧 In Progress |
| Inline ghost text (FIM) | v2 |
| Context indexing & @ mentions | v2 |
| Agent mode | v2 |
| Codebase indexing | v2 |

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
Controlled update mechanism that bypasses VSCode auto-update.

### 5. Flash / Pro Auto-Router
Routes simple queries to fast/cheap model, complex reasoning to pro model. Badge indicator in status bar. Toggleable in settings.

### 6. Microsoft Marketplace Access
Modify `product.json` to allow official Microsoft Extension Marketplace access alongside Open VSX.

### 7. Project Rule Files (`.neovoidrules`)
Drop a `.neovoidrules` markdown file in any project root. NeoVoid auto-ingests it as baseline AI context when that workspace opens.

---

## v2 Features

### 8. Inline Ghost Text (FIM)
Fill-In-the-Middle autocomplete streamed into the editor buffer as you type.

### 9. Context Indexing & @ Mentions
Type `@` in chat to attach files, folders, or terminal output directly into context.

---

## Stability Policy

All dependencies pinned to exact versions. No auto-updates. Change version numbers manually, test, then commit.

---

## Status

| Feature | Status |
|---|---|
| Token cost tracker | ✅ Done |
| Send to chat | ✅ Done |
| System prompt presets | 🔧 In Progress |
| Update script | 🔧 In Progress |
| Flash/Pro auto-router | 🔧 In Progress |
| Microsoft Marketplace access | ✅ Done |
| Project rule files | 🔧 In Progress |
| Inline ghost text (FIM) | v2 |
| Context indexing & @ mentions | v2 |
| Dependency pinning | ✅ Done |

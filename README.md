# NeoVoid

> A VS Code fork that actually works. Native AI integration, full extension marketplace access, dependency-locked for stability.

---

## Why NeoVoid?

The original [Void editor](https://github.com/voideditor/void) was archived in June 2026. NeoVoid picks up where it left off — but fixes the core problems that killed it.

| Problem | Void | NeoVoid |
|---|---|---|
| VSCode/Tailwind updates breaking everything | ❌ | ✅ Fixed — all deps pinned |
| Extension marketplace locked out | ❌ | ✅ Unlocked |
| Cursor costs $20/month | 💸 | 🆓 Bring your own API key |
| Abandoned | ☠️ | 🚀 Active |

---

## Features

### ✅ Done
- **Extension marketplace access** — Install any extension without restrictions.
- **Dependency pinning** — All dependencies locked to exact versions. Upstream updates will never break your install again.
- **Token cost tracker** — Real-time spend display under every AI response. Shows input tokens, output tokens, and exact USD cost per message.
- **Send to Chat** — Highlight any code and use the inline toolbar to send it directly to AI chat. No copy-paste.

### 🔧 v1 In Progress
- **System prompt presets** — Save and switch between modes (coding, review, architecture) with one click.
- **Flash / Pro auto-router** — Simple queries go to the fast cheap model. Complex reasoning goes to Pro. Status bar badge shows which model is active. Toggleable.
- **Update script** — One command to pull, compile, and package. Updates on your terms.
- **Project rule files** — Drop a `.neovoidrules` file in any project root. NeoVoid auto-loads it as AI context when you open that workspace.

### 🗓️ v2 Planned
- **Inline ghost text (FIM)** — AI autocomplete streamed directly into the editor as you type.
- **@ mentions** — Type `@` in chat to attach files, folders, or terminal output to your context instantly.
- **Agent mode** — Describe what you want, NeoVoid figures out which files to touch and makes the changes. Free. No subscription.
- **Codebase indexing** — Full repo awareness so the AI understands your project, not just the open file.

---

## Supported Models

NeoVoid supports bring-your-own-key for:

- **Anthropic** — Claude Haiku, Sonnet, Opus
- **DeepSeek** — V4 Flash, V4 Pro
- **OpenAI** — GPT-4o, o1
- **Google** — Gemini Flash, Pro
- **Mistral**, **Groq**, **Ollama** (local models)

---

## Getting Started

### Prerequisites
- WSL2 (Linux) or Linux
- Node.js 20+
- VcXsrv or equivalent X server (Windows only)

### Build from source

```bash
git clone https://github.com/graeme68s/neovoid
cd neovoid
npm install
npm run compile
npm run gulp vscode-linux-x64
```

Build takes ~30 minutes. Output lands at `~/VSCode-linux-x64/`.

### Launch

```bash
DISPLAY=$(grep nameserver /etc/resolv.conf | awk '{print $2}'):0.0 ~/VSCode-linux-x64/void --no-sandbox
```

---

## Philosophy

> Simple. Stable. Yours.

NeoVoid is not chasing venture capital or trying to impress investors with the latest upstream versions. It is built to work reliably, stay out of your way, and let you bring your own AI stack without a monthly subscription.

Inspired by Japanese monozukuri — nothing sloppy, done properly or not at all.

---

## Status

Active development. Contributions welcome.

---

## License

MIT

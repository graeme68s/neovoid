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
| Same model for every query | 🐌 | ⚡ Model Efficiency Scaling |
| Abandoned | ☠️ | 🚀 Active |

---

## Features

### ✅ Done
- **Dependency pinning** — All dependencies locked to exact versions. Upstream updates will never break your install again.
- **Extension marketplace access** — Install any extension without restrictions.
- **Token cost tracker** — Real-time spend display under every AI response.
- **Send to Chat** — Highlight any code and send it directly to AI chat. No copy-paste.
- **Model Efficiency Scaling (MES)** — Automatically routes simple queries to a fast cheap model and complex reasoning to a pro model. Status bar badge shows which model is active in real time. Toggleable. Nobody else has this.

### 🔧 v1 In Progress
- **System prompt presets** — Save and switch between modes (coding, review, architecture) with one click.
- **Flash / Pro auto-router refinement** — Improve classification accuracy and add per-provider model pairs.
- **Update script** — One command to pull, compile, and package. Updates on your terms.
- **Project rule files** — Drop a `.neovoidrules` file in any project root. NeoVoid auto-loads it as AI context when you open that workspace.

### 🗓️ v2 Planned
- **Inline ghost text (FIM)** — AI autocomplete streamed directly into the editor as you type.
- **@ mentions** — Type `@` in chat to attach files, folders, or terminal output to your context instantly.
- **Agent mode** — Describe what you want in plain English. NeoVoid plans which files to touch, makes the changes, runs the code, and fixes its own errors. Free. No subscription.
- **Codebase indexing** — Full repo awareness via vector database. The AI understands your entire project, not just the open file.

---

## Model Efficiency Scaling

MES is a NeoVoid exclusive. No other open source editor has this.

When you send a query, NeoVoid classifies it as simple or complex and routes it to the appropriate model automatically:

| Query type | Example | Model |
|---|---|---|
| Simple | "what does this variable do" | ⚡ Flash (fast, cheap) |
| Complex | "debug why my HMM is giving UNKNOWN states" | 🧠 Pro (full reasoning) |

The status bar badge updates in real time. MES can be toggled on/off in settings.

**Supported providers:**
| Provider | Flash | Pro |
|---|---|---|
| DeepSeek | deepseek-v4-flash | deepseek-v4-pro |
| Anthropic | claude-haiku-4-5 | claude-sonnet-4-6 |
| OpenAI | gpt-4.1-nano | gpt-4.1 |
| Gemini | gemini-2.0-flash-lite | gemini-2.5-pro |
| Groq | llama-3.1-8b-instant | llama-3.3-70b-versatile |

---

## Supported Models

NeoVoid supports bring-your-own-key for:

- **Anthropic** — Claude Haiku, Sonnet, Opus
- **DeepSeek** — V4 Flash, V4 Pro
- **OpenAI** — GPT-4.1, o3, o4-mini
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

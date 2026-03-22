# NextUp — Drop in anything messy. Instantly get what matters.

> AI-powered life admin. Paste emails, meeting notes, bills, or PDFs and
> instantly receive a summary, deadlines, key entities, urgency score, next
> steps, and three reply drafts — all saved to a task dashboard.

---

## Overview

NextUp solves information overload. Students, professionals, and anyone drowning
in documents can drop in messy content and immediately see:

- **What it is** — auto-detected urgency, type, and summary
- **What's due** — deadline extraction with dates
- **Who's involved** — people, organizations, places, documents
- **What to do** — prioritised next steps and tasks with due dates
- **What to say** — three reply drafts (professional, friendly, quick ACK)

All results are saved locally and accessible from the sidebar history panel.

---

## Features

- **Zero-cost demo mode** — runs fully offline without an API key (mock AI)
- **One-click demo data** — 5 pre-loaded seed inputs to try immediately
- **PDF upload** — drag-and-drop or click to upload; text extracted automatically
- **Urgency scoring** — critical / high / medium / low with color coding
- **Task board** — check off tasks with priority and due date tracking
- **Reply drafts** — three tone variants, one-click copy to clipboard
- **History sidebar** — past items with urgency dot, type, and relative time
- **Delete items** — with confirmation guard
- **Dark-first UI** — minimal, editorial aesthetic (near-black + warm amber accent)

---

## Tech Stack

| Layer | Choice |
|-------|--------|
| Framework | Next.js 14 (App Router) + TypeScript |
| Styling | Tailwind CSS (custom design tokens) |
| Icons | Lucide React |
| Fonts | Geist Sans + Geist Mono |
| Database | better-sqlite3 (local SQLite) |
| AI | OpenAI SDK (compatible with any OpenAI-format provider) |
| PDF | pdf-parse |
| Toasts | Sonner |

**Accent color:** Warm amber `#e8a87c` — editorial warmth, strong contrast on
near-black, avoids AI-cliché blue/purple, evokes attention without aggression.

---

## Local Setup

```bash
# 1. Install dependencies
npm install

# 2. Configure environment (copy and edit)
cp .env.example .env.local

# 3. Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

**No API key required** — the app runs in mock mode automatically.

---

## .env Setup

| Variable | Required | Description |
|----------|----------|-------------|
| `OPENAI_API_KEY` | No | OpenAI (or compatible) key. Leave blank for free mock mode. |
| `OPENAI_BASE_URL` | No | API base URL. Default: `https://api.openai.com/v1` |
| `OPENAI_MODEL` | No | Model ID. Default: `gpt-4o-mini` |
| `DB_PATH` | No | SQLite file path. Default: `./nextup.db` |
| `USE_MOCK_AI` | No | Set `true` to force mock mode even with a key. |

### Compatible providers (via `OPENAI_BASE_URL`)

| Provider | Base URL | Example Model |
|----------|----------|---------------|
| OpenAI | `https://api.openai.com/v1` | `gpt-4o-mini` |
| Groq (free tier) | `https://api.groq.com/openai/v1` | `llama3-8b-8192` |
| Together AI | `https://api.together.xyz/v1` | `mistralai/Mixtral-8x7B-Instruct-v0.1` |
| Ollama (local) | `http://localhost:11434/v1` | `llama3` |

---

## AI Flow

A single LLM call per analysis returns structured JSON. The flow:

```
User input (text or PDF)
       │
       ▼
lib/parsers.ts → extract plain text
       │
       ▼
lib/prompts.ts → buildAnalysisPrompt(content, type)
       │
       ▼
lib/ai.ts → send to LLM, parse + validate JSON
       │
       ├─ mock mode: lib/mock-ai.ts (no API call, keyword-based)
       │
       ▼
app/api/analyze/route.ts → save to SQLite (items + tasks + replies)
       │
       ▼
Return full item → UI renders ResultCard
```

**JSON shape returned by LLM:**
```json
{
  "summary": "...",
  "suggestedTitle": "...",
  "urgency": "low|medium|high|critical",
  "deadlines": [{ "description": "...", "date": "YYYY-MM-DD" }],
  "entities": [{ "name": "...", "type": "person|organization|..." }],
  "nextSteps": ["..."],
  "tasks": [{ "title": "...", "dueDate": "YYYY-MM-DD", "priority": "low|medium|high" }],
  "reply": { "professional": "...", "friendly": "...", "acknowledgement": "..." }
}
```

If JSON parsing fails, the request is retried once before returning an error.

---

## Database Schema

```sql
CREATE TABLE items (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  title       TEXT    NOT NULL,
  type        TEXT    NOT NULL,   -- email|notes|meeting|assignment|bill|document|other
  raw_content TEXT    NOT NULL,
  summary     TEXT    NOT NULL,
  urgency     TEXT    NOT NULL,   -- low|medium|high|critical
  deadlines   TEXT    NOT NULL,   -- JSON array
  entities    TEXT    NOT NULL,   -- JSON array
  next_steps  TEXT    NOT NULL,   -- JSON array
  created_at  TEXT    NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE tasks (
  id        INTEGER PRIMARY KEY AUTOINCREMENT,
  item_id   INTEGER NOT NULL REFERENCES items(id) ON DELETE CASCADE,
  title     TEXT    NOT NULL,
  due_date  TEXT,
  priority  TEXT    NOT NULL DEFAULT 'medium',
  completed INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE replies (
  id              INTEGER PRIMARY KEY AUTOINCREMENT,
  item_id         INTEGER NOT NULL UNIQUE REFERENCES items(id) ON DELETE CASCADE,
  professional    TEXT    NOT NULL DEFAULT '',
  friendly        TEXT    NOT NULL DEFAULT '',
  acknowledgement TEXT    NOT NULL DEFAULT ''
);
```

---

## Seed Data

Click **"Try a demo"** in the input panel to load any of these:

| Label | Type | Key Details |
|-------|------|-------------|
| Professor Assignment Email | Email | HIST 4501 paper, 40% of grade, due Mar 28 |
| Doctor Appointment Summary | Notes | Cholesterol follow-up, 5 action items |
| Team Meeting Notes | Meeting | Q1 review, 5 action items, decisions logged |
| Travel Itinerary | Document | EWR→SFO flight + hotel confirmation |
| Utility Bill — Final Notice | Bill | $347.82 overdue, service interruption warning |

---

## Known Limitations

- **SQLite + Vercel:** `better-sqlite3` won't persist on serverless deployments (ephemeral filesystem). For production, migrate to [Turso](https://turso.tech) (libSQL, SQLite-compatible) or [PlanetScale](https://planetscale.com) (MySQL).
- **Mock AI:** Returns keyword-heuristic responses. Not as accurate as a real LLM — use it to explore the UI, not for production decisions.
- **PDF OCR:** `pdf-parse` extracts embedded text only. Scanned/image PDFs will return an error. Add Tesseract.js or a vision API for OCR support.
- **File size:** PDFs capped at 10 MB. Content truncated at 8,000 characters for LLM.
- **No auth:** Single-user, local only. All data is on your machine.
- **No real-time:** Results appear after analysis completes; no streaming.
- **No undo:** Deleting an item is permanent (with a confirmation guard).

---

## Deploy Guide

### Vercel (no persistence)
```bash
vercel --prod
# Works for demo — data resets on each deploy/restart
```

### Fly.io (with persistent volume — recommended)
```bash
fly launch
fly volumes create nextup_data --size 1
# Mount to /data, set DB_PATH=/data/nextup.db
fly deploy
```

### Self-hosted / VPS
```bash
npm run build
npm start
# Keep alive with pm2 or systemd
```

### Production DB recommendation
Replace `better-sqlite3` with **Turso** (drop-in libSQL replacement):
```bash
npm install @libsql/client
# Update lib/db.ts to use createClient({ url, authToken })
```

---

## Tomorrow's Launch Wins (5 Quick Improvements)

1. **Streaming responses** — stream the LLM output token-by-token instead of waiting for the full result. Dramatically improves perceived speed.
2. **Search / filter sidebar** — full-text search across item titles and summaries. Essential once you have >20 items.
3. **Export to Markdown / Notion** — one-click export of the structured result. High-value for professionals.
4. **Calendar sync** — push extracted deadlines to Google Calendar via OAuth. Closes the loop from "identified" to "scheduled".
5. **Drag-and-drop multi-file queue** — analyze multiple documents in a batch, with a progress queue UI.

---

## Launch Tagline

**"Drop in anything messy. Instantly get what matters and what to do next."**

### Product Hunt Description

NextUp is an AI life-admin tool that turns any messy document — emails, PDFs,
meeting notes, bills, assignments — into a clean breakdown: summary, deadlines,
key entities, urgency level, next steps, and three reply drafts, all saved to a
personal task dashboard.

No subscription required to try it. Runs locally with a built-in demo mode and
connects to any OpenAI-compatible LLM (including free Groq and local Ollama).

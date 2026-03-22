import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/db'
import { analyzeContent } from '@/lib/ai'
import { extractTextFromPdf, extractTextFromPlain } from '@/lib/parsers'
import type { ItemType } from '@/types'

const VALID_TYPES: ItemType[] = ['email', 'notes', 'meeting', 'assignment', 'bill', 'document', 'other']
const MAX_FILE_BYTES = 10 * 1024 * 1024 // 10 MB
const MAX_CONTENT_CHARS = 8000

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()

    const rawType = formData.get('type') as string | null
    const type: ItemType = VALID_TYPES.includes(rawType as ItemType)
      ? (rawType as ItemType)
      : 'other'

    // ── Extract text ─────────────────────────────────────────────────────────
    let fullText = ''
    const file = formData.get('file') as File | null

    if (file && file.size > 0) {
      if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
        return NextResponse.json(
          { error: 'Only PDF files are supported for upload.' },
          { status: 400 }
        )
      }
      if (file.size > MAX_FILE_BYTES) {
        return NextResponse.json(
          { error: 'File too large. Maximum size is 10 MB.' },
          { status: 400 }
        )
      }
      const buf = Buffer.from(await file.arrayBuffer())
      fullText = await extractTextFromPdf(buf)
    } else {
      const raw = formData.get('content') as string | null
      if (!raw?.trim()) {
        return NextResponse.json(
          { error: 'Please provide text content or upload a PDF to analyze.' },
          { status: 400 }
        )
      }
      fullText = extractTextFromPlain(raw)
    }

    if (fullText.trim().length < 20) {
      return NextResponse.json(
        { error: 'Content is too short to analyze. Please provide more detail.' },
        { status: 400 }
      )
    }

    // Truncate for LLM but persist full text
    const truncated =
      fullText.length > MAX_CONTENT_CHARS
        ? fullText.slice(0, MAX_CONTENT_CHARS) + '\n\n[Content truncated for analysis]'
        : fullText

    // ── Run AI analysis ──────────────────────────────────────────────────────
    const { result, mock } = await analyzeContent(truncated, type)

    // ── Persist to DB ────────────────────────────────────────────────────────
    const db = getDb()

    const ins = db
      .prepare(
        `INSERT INTO items (title, type, raw_content, summary, urgency, deadlines, entities, next_steps)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
      )
      .run(
        result.suggestedTitle,
        type,
        fullText.slice(0, 50_000),
        result.summary,
        result.urgency,
        JSON.stringify(result.deadlines),
        JSON.stringify(result.entities),
        JSON.stringify(result.nextSteps)
      )

    const itemId = ins.lastInsertRowid as number

    // Insert tasks
    const insTask = db.prepare(
      `INSERT INTO tasks (item_id, title, due_date, priority) VALUES (?, ?, ?, ?)`
    )
    for (const t of result.tasks) {
      insTask.run(itemId, t.title, t.dueDate, t.priority)
    }

    // Insert reply
    db.prepare(
      `INSERT INTO replies (item_id, professional, friendly, acknowledgement) VALUES (?, ?, ?, ?)`
    ).run(itemId, result.reply.professional, result.reply.friendly, result.reply.acknowledgement)

    // ── Return full item ─────────────────────────────────────────────────────
    const item = db.prepare(`SELECT * FROM items WHERE id = ?`).get(itemId) as any
    const tasks = db.prepare(`SELECT * FROM tasks WHERE item_id = ?`).all(itemId) as any[]
    const reply = db.prepare(`SELECT * FROM replies WHERE item_id = ?`).get(itemId)

    return NextResponse.json({
      ...item,
      deadlines: JSON.parse(item.deadlines),
      entities: JSON.parse(item.entities),
      next_steps: JSON.parse(item.next_steps),
      tasks: tasks.map((t) => ({ ...t, completed: Boolean(t.completed) })),
      reply: reply ?? null,
      _mock: mock, // lets the UI show a badge when in mock mode
    })
  } catch (err) {
    console.error('[analyze]', err)
    const message = err instanceof Error ? err.message : 'Analysis failed. Please try again.'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

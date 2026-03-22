import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/db'

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id, 10)
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid item ID.' }, { status: 400 })
    }

    const db = getDb()
    const item = db.prepare(`SELECT * FROM items WHERE id = ?`).get(id) as any

    if (!item) {
      return NextResponse.json({ error: 'Item not found.' }, { status: 404 })
    }

    const tasks = db.prepare(`SELECT * FROM tasks WHERE item_id = ?`).all(id) as any[]
    const reply = db.prepare(`SELECT * FROM replies WHERE item_id = ?`).get(id)

    return NextResponse.json({
      ...item,
      deadlines: JSON.parse(item.deadlines),
      entities: JSON.parse(item.entities),
      next_steps: JSON.parse(item.next_steps),
      tasks: tasks.map((t) => ({ ...t, completed: Boolean(t.completed) })),
      reply: reply ?? null,
    })
  } catch (err) {
    console.error('[items/:id GET]', err)
    return NextResponse.json({ error: 'Failed to load item.' }, { status: 500 })
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id, 10)
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid item ID.' }, { status: 400 })
    }

    const db = getDb()
    const result = db.prepare(`DELETE FROM items WHERE id = ?`).run(id)

    if (result.changes === 0) {
      return NextResponse.json({ error: 'Item not found.' }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[items/:id DELETE]', err)
    return NextResponse.json({ error: 'Failed to delete item.' }, { status: 500 })
  }
}

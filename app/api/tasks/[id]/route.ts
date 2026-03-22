import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/db'

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id, 10)
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid task ID.' }, { status: 400 })
    }

    const body = await request.json()
    const { completed } = body

    if (typeof completed !== 'boolean') {
      return NextResponse.json(
        { error: 'Field "completed" must be a boolean.' },
        { status: 400 }
      )
    }

    const db = getDb()
    const result = db
      .prepare(`UPDATE tasks SET completed = ? WHERE id = ?`)
      .run(completed ? 1 : 0, id)

    if (result.changes === 0) {
      return NextResponse.json({ error: 'Task not found.' }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[tasks/:id PATCH]', err)
    return NextResponse.json({ error: 'Failed to update task.' }, { status: 500 })
  }
}

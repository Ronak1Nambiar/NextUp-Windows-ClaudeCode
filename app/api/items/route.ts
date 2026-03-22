import { NextResponse } from 'next/server'
import { getDb } from '@/lib/db'

export async function GET() {
  try {
    const db = getDb()
    const items = db
      .prepare(
        `SELECT id, title, type, urgency, created_at
         FROM items
         ORDER BY created_at DESC
         LIMIT 100`
      )
      .all()
    return NextResponse.json(items)
  } catch (err) {
    console.error('[items GET]', err)
    return NextResponse.json({ error: 'Failed to load history.' }, { status: 500 })
  }
}

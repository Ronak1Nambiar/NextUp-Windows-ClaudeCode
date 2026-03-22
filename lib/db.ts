import Database from 'better-sqlite3'
import path from 'path'

const DB_PATH = process.env.DB_PATH || path.join(process.cwd(), 'nextup.db')

let _db: Database.Database | null = null

export function getDb(): Database.Database {
  if (!_db) {
    _db = new Database(DB_PATH)
    _db.pragma('journal_mode = WAL')
    _db.pragma('foreign_keys = ON')
    initSchema(_db)
  }
  return _db
}

function initSchema(db: Database.Database): void {
  db.exec(`
    CREATE TABLE IF NOT EXISTS items (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      title       TEXT    NOT NULL,
      type        TEXT    NOT NULL DEFAULT 'other',
      raw_content TEXT    NOT NULL DEFAULT '',
      summary     TEXT    NOT NULL DEFAULT '',
      urgency     TEXT    NOT NULL DEFAULT 'medium',
      deadlines   TEXT    NOT NULL DEFAULT '[]',
      entities    TEXT    NOT NULL DEFAULT '[]',
      next_steps  TEXT    NOT NULL DEFAULT '[]',
      created_at  TEXT    NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS tasks (
      id        INTEGER PRIMARY KEY AUTOINCREMENT,
      item_id   INTEGER NOT NULL,
      title     TEXT    NOT NULL,
      due_date  TEXT,
      priority  TEXT    NOT NULL DEFAULT 'medium',
      completed INTEGER NOT NULL DEFAULT 0,
      FOREIGN KEY (item_id) REFERENCES items(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS replies (
      id              INTEGER PRIMARY KEY AUTOINCREMENT,
      item_id         INTEGER NOT NULL UNIQUE,
      professional    TEXT    NOT NULL DEFAULT '',
      friendly        TEXT    NOT NULL DEFAULT '',
      acknowledgement TEXT    NOT NULL DEFAULT '',
      FOREIGN KEY (item_id) REFERENCES items(id) ON DELETE CASCADE
    );
  `)
}

export default getDb

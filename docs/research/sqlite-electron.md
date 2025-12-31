# SQLite + better-sqlite3 in Electron Research

## Overview

This document covers integrating SQLite with Electron using better-sqlite3 for the Eidolon desktop application's local database.

## Why better-sqlite3?

| Feature | better-sqlite3 | sql.js | sqlite3 |
|---------|---------------|--------|---------|
| Performance | Fastest | Slowest | Medium |
| Sync API | Yes | Yes | No (async only) |
| Native | Yes | No (WASM) | Yes |
| Type Support | Excellent | Good | Good |
| FTS5 Support | Yes | Limited | Yes |

**Recommendation**: better-sqlite3 for its synchronous API (simpler code in main process) and excellent performance.

## Installation & Native Module Setup

### Installation

```bash
bun add better-sqlite3
bun add -D @types/better-sqlite3 electron-rebuild
```

### Native Module Rebuilding

better-sqlite3 is a native Node module that must be rebuilt for Electron's Node version.

```json
// package.json
{
  "scripts": {
    "postinstall": "electron-rebuild",
    "rebuild": "electron-rebuild -f -w better-sqlite3"
  }
}
```

### electron-vite Configuration

```typescript
// electron.vite.config.ts
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'

export default defineConfig({
  main: {
    plugins: [
      externalizeDepsPlugin({
        // Don't bundle native modules
        exclude: ['better-sqlite3']
      })
    ]
  }
})
```

## Database Service Pattern

```typescript
// electron/services/database.ts
import Database from 'better-sqlite3'
import { app } from 'electron'
import { join } from 'path'
import { existsSync, mkdirSync } from 'fs'

class DatabaseService {
  private db: Database.Database | null = null
  private dbPath: string

  constructor() {
    const userDataPath = app.getPath('userData')
    const dbDir = join(userDataPath, 'data')

    if (!existsSync(dbDir)) {
      mkdirSync(dbDir, { recursive: true })
    }

    this.dbPath = join(dbDir, 'eidolon.db')
  }

  connect(): Database.Database {
    if (this.db) return this.db

    this.db = new Database(this.dbPath, {
      // Recommended settings
      verbose: process.env.NODE_ENV === 'development' ? console.log : undefined
    })

    // Enable WAL mode for better concurrent read performance
    this.db.pragma('journal_mode = WAL')

    // Enable foreign keys
    this.db.pragma('foreign_keys = ON')

    return this.db
  }

  close(): void {
    if (this.db) {
      this.db.close()
      this.db = null
    }
  }

  get instance(): Database.Database {
    return this.db ?? this.connect()
  }
}

export const database = new DatabaseService()
```

## Migration System

### Migration File Structure

```
electron/db/migrations/
├── 001_initial_schema.sql
├── 002_add_documents.sql
├── 003_add_fts.sql
└── ...
```

### Migration Runner

```typescript
// electron/db/migrator.ts
import Database from 'better-sqlite3'
import { readdirSync, readFileSync } from 'fs'
import { join } from 'path'

interface Migration {
  id: number
  name: string
  applied_at: string
}

export class Migrator {
  private db: Database.Database
  private migrationsPath: string

  constructor(db: Database.Database, migrationsPath: string) {
    this.db = db
    this.migrationsPath = migrationsPath
    this.ensureMigrationsTable()
  }

  private ensureMigrationsTable(): void {
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS migrations (
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL,
        applied_at TEXT DEFAULT CURRENT_TIMESTAMP
      )
    `)
  }

  getAppliedMigrations(): Migration[] {
    return this.db
      .prepare('SELECT * FROM migrations ORDER BY id')
      .all() as Migration[]
  }

  getPendingMigrations(): string[] {
    const applied = new Set(
      this.getAppliedMigrations().map((m) => m.name)
    )

    return readdirSync(this.migrationsPath)
      .filter((f) => f.endsWith('.sql'))
      .sort()
      .filter((f) => !applied.has(f))
  }

  migrate(): { applied: string[]; errors: string[] } {
    const pending = this.getPendingMigrations()
    const applied: string[] = []
    const errors: string[] = []

    for (const migration of pending) {
      try {
        const sql = readFileSync(
          join(this.migrationsPath, migration),
          'utf-8'
        )

        this.db.transaction(() => {
          this.db.exec(sql)
          this.db
            .prepare('INSERT INTO migrations (name) VALUES (?)')
            .run(migration)
        })()

        applied.push(migration)
      } catch (error) {
        errors.push(`${migration}: ${error}`)
        break // Stop on first error
      }
    }

    return { applied, errors }
  }

  rollback(steps = 1): { rolledBack: string[]; errors: string[] } {
    const migrations = this.getAppliedMigrations().reverse()
    const rolledBack: string[] = []
    const errors: string[] = []

    for (let i = 0; i < Math.min(steps, migrations.length); i++) {
      const migration = migrations[i]
      const downFile = migration.name.replace('.sql', '.down.sql')
      const downPath = join(this.migrationsPath, downFile)

      try {
        const sql = readFileSync(downPath, 'utf-8')

        this.db.transaction(() => {
          this.db.exec(sql)
          this.db
            .prepare('DELETE FROM migrations WHERE id = ?')
            .run(migration.id)
        })()

        rolledBack.push(migration.name)
      } catch (error) {
        errors.push(`${migration.name}: ${error}`)
        break
      }
    }

    return { rolledBack, errors }
  }
}
```

### Initial Schema Migration

```sql
-- electron/db/migrations/001_initial_schema.sql

-- Conversations table
CREATE TABLE conversations (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  title TEXT NOT NULL DEFAULT 'New Conversation',
  model_id TEXT,
  system_prompt TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_conversations_updated ON conversations(updated_at DESC);

-- Messages table
CREATE TABLE messages (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  conversation_id TEXT NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  model_id TEXT,
  tokens_input INTEGER,
  tokens_output INTEGER,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_messages_conversation ON messages(conversation_id, created_at);

-- Documents table
CREATE TABLE documents (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  title TEXT NOT NULL DEFAULT 'Untitled',
  current_branch_id TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- Branches table
CREATE TABLE branches (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  document_id TEXT NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
  name TEXT NOT NULL DEFAULT 'main',
  parent_branch_id TEXT REFERENCES branches(id),
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(document_id, name)
);

-- Versions table
CREATE TABLE versions (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  branch_id TEXT NOT NULL REFERENCES branches(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  message TEXT,
  word_count INTEGER,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_versions_branch ON versions(branch_id, created_at DESC);

-- Generated images table
CREATE TABLE generated_images (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  prompt TEXT NOT NULL,
  model_id TEXT NOT NULL,
  image_path TEXT NOT NULL,
  settings TEXT, -- JSON
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);
```

### FTS5 Migration

```sql
-- electron/db/migrations/002_add_fts.sql

-- Full-text search for messages
CREATE VIRTUAL TABLE messages_fts USING fts5(
  content,
  content='messages',
  content_rowid='rowid'
);

-- Triggers to keep FTS in sync
CREATE TRIGGER messages_ai AFTER INSERT ON messages BEGIN
  INSERT INTO messages_fts(rowid, content) VALUES (NEW.rowid, NEW.content);
END;

CREATE TRIGGER messages_ad AFTER DELETE ON messages BEGIN
  INSERT INTO messages_fts(messages_fts, rowid, content)
    VALUES('delete', OLD.rowid, OLD.content);
END;

CREATE TRIGGER messages_au AFTER UPDATE ON messages BEGIN
  INSERT INTO messages_fts(messages_fts, rowid, content)
    VALUES('delete', OLD.rowid, OLD.content);
  INSERT INTO messages_fts(rowid, content) VALUES (NEW.rowid, NEW.content);
END;

-- Rebuild FTS index from existing data
INSERT INTO messages_fts(rowid, content)
  SELECT rowid, content FROM messages;
```

## Repository Pattern

```typescript
// electron/db/repositories/conversations.ts
import Database from 'better-sqlite3'
import type { Conversation, Message } from '@eidolon/shared'

export class ConversationRepository {
  private db: Database.Database

  constructor(db: Database.Database) {
    this.db = db
  }

  findAll(): Conversation[] {
    return this.db
      .prepare(`
        SELECT c.*, COUNT(m.id) as message_count
        FROM conversations c
        LEFT JOIN messages m ON m.conversation_id = c.id
        GROUP BY c.id
        ORDER BY c.updated_at DESC
      `)
      .all() as Conversation[]
  }

  findById(id: string): Conversation | null {
    return this.db
      .prepare('SELECT * FROM conversations WHERE id = ?')
      .get(id) as Conversation | null
  }

  create(data: Partial<Conversation>): Conversation {
    const stmt = this.db.prepare(`
      INSERT INTO conversations (title, model_id, system_prompt)
      VALUES (@title, @modelId, @systemPrompt)
      RETURNING *
    `)

    return stmt.get({
      title: data.title ?? 'New Conversation',
      modelId: data.modelId ?? null,
      systemPrompt: data.systemPrompt ?? null
    }) as Conversation
  }

  update(id: string, data: Partial<Conversation>): Conversation {
    const fields = Object.keys(data)
      .map((k) => `${k} = @${k}`)
      .join(', ')

    const stmt = this.db.prepare(`
      UPDATE conversations
      SET ${fields}, updated_at = CURRENT_TIMESTAMP
      WHERE id = @id
      RETURNING *
    `)

    return stmt.get({ ...data, id }) as Conversation
  }

  delete(id: string): void {
    this.db.prepare('DELETE FROM conversations WHERE id = ?').run(id)
  }

  search(query: string): Conversation[] {
    return this.db
      .prepare(`
        SELECT DISTINCT c.*
        FROM conversations c
        JOIN messages m ON m.conversation_id = c.id
        JOIN messages_fts ON messages_fts.rowid = m.rowid
        WHERE messages_fts MATCH ?
        ORDER BY c.updated_at DESC
      `)
      .all(query) as Conversation[]
  }
}
```

## Backup & Restore

```typescript
// electron/services/backup.ts
import Database from 'better-sqlite3'
import { copyFileSync, existsSync } from 'fs'
import { join } from 'path'
import { app } from 'electron'

export class BackupService {
  private db: Database.Database
  private backupDir: string

  constructor(db: Database.Database) {
    this.db = db
    this.backupDir = join(app.getPath('userData'), 'backups')
  }

  async backup(): Promise<string> {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
    const backupPath = join(this.backupDir, `eidolon-${timestamp}.db`)

    // Use SQLite backup API for consistency
    await this.db.backup(backupPath)

    return backupPath
  }

  restore(backupPath: string): void {
    if (!existsSync(backupPath)) {
      throw new Error('Backup file not found')
    }

    // Close current connection
    this.db.close()

    // Copy backup over current database
    const dbPath = join(app.getPath('userData'), 'data', 'eidolon.db')
    copyFileSync(backupPath, dbPath)

    // Reconnect will happen on next access
  }

  listBackups(): string[] {
    // Implementation...
  }
}
```

## Performance Tips

1. **Use Transactions for Bulk Operations**
   ```typescript
   const insert = db.prepare('INSERT INTO messages ...')
   const insertMany = db.transaction((messages) => {
     for (const msg of messages) insert.run(msg)
   })
   insertMany(messagesArray) // Much faster than individual inserts
   ```

2. **Prepare Statements Once**
   ```typescript
   // Good - prepare once, reuse
   const stmt = db.prepare('SELECT * FROM users WHERE id = ?')
   users.map(id => stmt.get(id))

   // Bad - prepare each time
   users.map(id => db.prepare('SELECT * FROM users WHERE id = ?').get(id))
   ```

3. **Use WAL Mode**
   ```typescript
   db.pragma('journal_mode = WAL')
   ```

4. **Add Appropriate Indexes**
   - Index columns used in WHERE clauses
   - Index foreign keys
   - Use composite indexes for multi-column queries

## References

- [better-sqlite3 Documentation](https://github.com/WiseLibs/better-sqlite3)
- [SQLite FTS5 Documentation](https://www.sqlite.org/fts5.html)
- [Electron Data Persistence](https://www.electronjs.org/docs/latest/tutorial/data-storage)

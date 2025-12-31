# Database Migrations SOP

## Overview

Standard procedure for creating and running database migrations in Eidolon.

## When to Use

- Adding new tables
- Modifying existing tables
- Adding/removing columns
- Creating indexes
- Any schema change

## Prerequisites

- [ ] Understanding of current schema
- [ ] Migration plan reviewed
- [ ] Backup strategy in place

## Steps

### 1. Create Migration File

Create a new migration in `apps/desktop/electron/db/migrations/`:

```
migrations/
├── 001_initial_schema.sql
├── 002_add_conversations.sql
├── 003_add_documents.sql
└── XXX_your_migration.sql  <- New
```

Naming convention: `{number}_{description}.sql`

### 2. Write Migration

```sql
-- Migration: XXX_your_migration
-- Description: What this migration does
-- Author: Your name
-- Date: YYYY-MM-DD

-- Up migration
CREATE TABLE IF NOT EXISTS new_table (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  created_at INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_new_table_name
ON new_table(name);

-- Record migration
INSERT INTO migrations (version, name, applied_at)
VALUES (XXX, 'your_migration', strftime('%s', 'now'));
```

### 3. Write Rollback (Optional but Recommended)

Create rollback file: `XXX_your_migration_rollback.sql`

```sql
-- Rollback: XXX_your_migration

DROP TABLE IF EXISTS new_table;

DELETE FROM migrations WHERE version = XXX;
```

### 4. Test Migration

```typescript
// In development, test with fresh database
db.exec(fs.readFileSync('migrations/XXX_your_migration.sql', 'utf8'));

// Verify
const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
console.log(tables);
```

### 5. Test Rollback

```typescript
// Test rollback works
db.exec(fs.readFileSync('migrations/XXX_your_migration_rollback.sql', 'utf8'));
```

### 6. Update Types

Update TypeScript types to match new schema:

```typescript
// apps/desktop/electron/db/types.ts
interface NewTable {
  id: string;
  name: string;
  createdAt: number;
}
```

## Migration Best Practices

### DO:
- [ ] Use transactions for multi-statement migrations
- [ ] Use `IF NOT EXISTS` / `IF EXISTS` for idempotency
- [ ] Test with data (not just empty database)
- [ ] Keep migrations small and focused
- [ ] Document breaking changes

### DON'T:
- [ ] Delete columns in production without data migration
- [ ] Rename tables without aliasing
- [ ] Remove indexes without performance testing
- [ ] Modify existing migrations

## Handling Breaking Changes

For changes that require data migration:

```sql
-- 1. Create new structure
CREATE TABLE new_messages (
  id TEXT PRIMARY KEY,
  conversation_id TEXT NOT NULL,
  content TEXT NOT NULL
);

-- 2. Migrate data
INSERT INTO new_messages (id, conversation_id, content)
SELECT id, conversation_id, content FROM messages;

-- 3. Swap tables
DROP TABLE messages;
ALTER TABLE new_messages RENAME TO messages;
```

## Checklist

### Creation
- [ ] Migration file created with correct naming
- [ ] SQL is idempotent (can run multiple times)
- [ ] Rollback file created
- [ ] Types updated

### Testing
- [ ] Migration runs on fresh database
- [ ] Migration runs on existing database with data
- [ ] Rollback works correctly
- [ ] Application functions with new schema

### Deployment
- [ ] Migration included in release
- [ ] Backup procedure documented
- [ ] Rollback procedure documented

## Troubleshooting

See [Database Issues](../troubleshooting/database-issues.md)

## Related

- [Release Process](./release-process.md)

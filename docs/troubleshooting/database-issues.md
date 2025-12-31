# Database Troubleshooting

Issues related to SQLite database operations.

## Table of Contents

- [Database Not Found](#database-not-found)
- [Migration Failures](#migration-failures)
- [Query Errors](#query-errors)
- [Data Corruption](#data-corruption)
- [Performance Issues](#performance-issues)

---

## Database Not Found

### Symptom
```
Error: SQLITE_CANTOPEN: unable to open database file
```

### Cause
- Database directory doesn't exist
- Permission issues
- Path resolution error

### Solution
1. Ensure directory exists:
   ```typescript
   import { app } from 'electron';
   import fs from 'fs';
   import path from 'path';

   const dbDir = path.join(app.getPath('userData'), 'data');
   if (!fs.existsSync(dbDir)) {
     fs.mkdirSync(dbDir, { recursive: true });
   }
   ```
2. Check file permissions
3. Verify path is absolute

### Prevention
Create database directory on app startup.

---

## Migration Failures

### Symptom
```
Error: Migration failed: table already exists
```

### Cause
- Migration ran partially
- Migration version tracking corrupted

### Solution
1. Check migration status:
   ```sql
   SELECT * FROM migrations;
   ```
2. Manually fix migration state if needed
3. Consider fresh database for development

### Prevention
- Wrap migrations in transactions
- Test migrations on fresh database

---

## Query Errors

### Symptom
```
Error: SQLITE_CONSTRAINT: UNIQUE constraint failed
```

### Cause
- Duplicate primary key
- Unique constraint violation
- Foreign key violation

### Solution
1. Use INSERT OR REPLACE for upserts:
   ```sql
   INSERT OR REPLACE INTO table (id, value) VALUES (?, ?)
   ```
2. Check data before insert
3. Use proper error handling:
   ```typescript
   try {
     db.run('INSERT INTO ...');
   } catch (error) {
     if (error.code === 'SQLITE_CONSTRAINT') {
       // Handle duplicate
     }
   }
   ```

### Prevention
- Validate data before insert
- Use parameterized queries

---

## Data Corruption

### Symptom
- Unexpected query results
- Integrity check fails
- App crashes on database access

### Solution
1. Run integrity check:
   ```sql
   PRAGMA integrity_check;
   ```
2. If corrupted, restore from backup:
   ```typescript
   // Copy backup over corrupted file
   fs.copyFileSync(backupPath, dbPath);
   ```
3. As last resort, export what you can and recreate

### Prevention
- Enable WAL mode
- Implement automatic backups
- Handle app shutdown gracefully

---

## Performance Issues

### Symptom
- Slow queries
- High memory usage
- UI freezing during database operations

### Solution
1. Add indexes for frequent queries:
   ```sql
   CREATE INDEX idx_messages_conversation
   ON messages(conversation_id);
   ```
2. Use WAL mode:
   ```sql
   PRAGMA journal_mode = WAL;
   ```
3. Run queries in background:
   ```typescript
   // Run expensive queries off main thread
   ```
4. Use prepared statements:
   ```typescript
   const stmt = db.prepare('SELECT * FROM messages WHERE id = ?');
   stmt.get(id);
   ```

### Prevention
- Profile queries during development
- Add indexes early
- Test with realistic data volumes

---

## Useful PRAGMA Commands

```sql
-- Enable WAL mode (recommended)
PRAGMA journal_mode = WAL;

-- Check database integrity
PRAGMA integrity_check;

-- Get table info
PRAGMA table_info(table_name);

-- List all tables
SELECT name FROM sqlite_master WHERE type='table';

-- Optimize database
PRAGMA optimize;

-- Get database size
SELECT page_count * page_size as size FROM pragma_page_count(), pragma_page_size();
```

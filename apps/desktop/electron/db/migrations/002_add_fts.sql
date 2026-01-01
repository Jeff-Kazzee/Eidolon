-- FTS5 Full-Text Search for Messages
-- Creates virtual table and sync triggers for message content search

-- FTS5 virtual table for message search
-- Uses content= to create an external content FTS table that references messages
CREATE VIRTUAL TABLE messages_fts USING fts5(
  content,
  content='messages',
  content_rowid='rowid'
);

-- Trigger: Sync on INSERT
CREATE TRIGGER messages_fts_ai AFTER INSERT ON messages BEGIN
  INSERT INTO messages_fts(rowid, content) VALUES (NEW.rowid, NEW.content);
END;

-- Trigger: Sync on DELETE
CREATE TRIGGER messages_fts_ad AFTER DELETE ON messages BEGIN
  INSERT INTO messages_fts(messages_fts, rowid, content)
    VALUES('delete', OLD.rowid, OLD.content);
END;

-- Trigger: Sync on UPDATE (only when content actually changes)
CREATE TRIGGER messages_fts_au AFTER UPDATE ON messages
WHEN NEW.content != OLD.content BEGIN
  INSERT INTO messages_fts(messages_fts, rowid, content)
    VALUES('delete', OLD.rowid, OLD.content);
  INSERT INTO messages_fts(rowid, content) VALUES (NEW.rowid, NEW.content);
END;

-- Rebuild index only if there are existing messages
-- On fresh install this is a no-op, avoiding unnecessary work
INSERT INTO messages_fts(messages_fts)
SELECT 'rebuild'
WHERE EXISTS (SELECT 1 FROM messages LIMIT 1);

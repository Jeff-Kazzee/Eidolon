-- Eidolon Initial Schema Migration
-- Creates core tables for conversations, documents, and generated images

-- Conversations table
CREATE TABLE conversations (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  system_prompt TEXT,
  model_id TEXT,
  created_at INTEGER NOT NULL DEFAULT (unixepoch()),
  updated_at INTEGER NOT NULL DEFAULT (unixepoch())
);

CREATE INDEX idx_conversations_updated_at ON conversations(updated_at DESC);

-- Messages table
CREATE TABLE messages (
  id TEXT PRIMARY KEY,
  conversation_id TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  model_id TEXT,
  token_count INTEGER,
  created_at INTEGER NOT NULL DEFAULT (unixepoch()),
  FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE
);

CREATE INDEX idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX idx_messages_created_at ON messages(conversation_id, created_at);

-- Documents table
CREATE TABLE documents (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  current_branch_id TEXT,
  created_at INTEGER NOT NULL DEFAULT (unixepoch()),
  updated_at INTEGER NOT NULL DEFAULT (unixepoch())
);

CREATE INDEX idx_documents_updated_at ON documents(updated_at DESC);

-- Branches table
CREATE TABLE branches (
  id TEXT PRIMARY KEY,
  document_id TEXT NOT NULL,
  name TEXT NOT NULL,
  parent_branch_id TEXT,
  created_at INTEGER NOT NULL DEFAULT (unixepoch()),
  FOREIGN KEY (document_id) REFERENCES documents(id) ON DELETE CASCADE,
  FOREIGN KEY (parent_branch_id) REFERENCES branches(id) ON DELETE SET NULL,
  UNIQUE (document_id, name)
);

CREATE INDEX idx_branches_document_id ON branches(document_id);

-- Trigger: Validate documents.current_branch_id points to a branch in the same document
-- SQLite doesn't support ALTER TABLE ADD CONSTRAINT, so we use triggers to enforce this
--
-- NOTE: On INSERT, current_branch_id must be NULL because branches reference documents,
-- creating a chicken-and-egg problem. The workflow is:
-- 1. INSERT document with current_branch_id = NULL
-- 2. INSERT branch referencing the document
-- 3. UPDATE document to set current_branch_id to the new branch
CREATE TRIGGER validate_current_branch_id_insert
BEFORE INSERT ON documents
WHEN NEW.current_branch_id IS NOT NULL
BEGIN
  SELECT RAISE(ABORT, 'current_branch_id must reference a branch belonging to this document')
  WHERE NOT EXISTS (
    SELECT 1 FROM branches
    WHERE branches.id = NEW.current_branch_id
    AND branches.document_id = NEW.id
  );
END;

CREATE TRIGGER validate_current_branch_id_update
BEFORE UPDATE OF current_branch_id ON documents
WHEN NEW.current_branch_id IS NOT NULL
BEGIN
  SELECT RAISE(ABORT, 'current_branch_id must reference a branch belonging to this document')
  WHERE NOT EXISTS (
    SELECT 1 FROM branches
    WHERE branches.id = NEW.current_branch_id
    AND branches.document_id = NEW.id
  );
END;

-- Trigger: Set documents.current_branch_id to NULL when the referenced branch is deleted
CREATE TRIGGER nullify_current_branch_id_on_delete
AFTER DELETE ON branches
BEGIN
  UPDATE documents
  SET current_branch_id = NULL
  WHERE current_branch_id = OLD.id;
END;

-- Versions table
CREATE TABLE versions (
  id TEXT PRIMARY KEY,
  branch_id TEXT NOT NULL,
  content TEXT NOT NULL,
  message TEXT,
  word_count INTEGER,
  created_at INTEGER NOT NULL DEFAULT (unixepoch()),
  FOREIGN KEY (branch_id) REFERENCES branches(id) ON DELETE CASCADE
);

CREATE INDEX idx_versions_branch_id ON versions(branch_id);
CREATE INDEX idx_versions_created_at ON versions(created_at DESC);

-- Generated Images table
CREATE TABLE generated_images (
  id TEXT PRIMARY KEY,
  prompt TEXT NOT NULL,
  model_id TEXT NOT NULL,
  settings TEXT NOT NULL,
  file_path TEXT NOT NULL,
  thumbnail_path TEXT,
  favorite INTEGER NOT NULL DEFAULT 0 CHECK (favorite IN (0, 1)),
  created_at INTEGER NOT NULL DEFAULT (unixepoch())
);

CREATE INDEX idx_generated_images_created_at ON generated_images(created_at DESC);
CREATE INDEX idx_generated_images_favorite ON generated_images(favorite);

-- Settings table (key-value store)
CREATE TABLE settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at INTEGER NOT NULL DEFAULT (unixepoch())
);

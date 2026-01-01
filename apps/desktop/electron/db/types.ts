// Re-export DatabaseHealth from shared to maintain single source of truth
export type { DatabaseHealth } from '@eidolon/shared'

export interface MigrationRecord {
  id: number
  name: string
  checksum: string
  applied_at: string
}

export interface MigrationResult {
  applied: string[]
  errors: string[]
}

// Row types matching SQLite schema (snake_case)
export interface ConversationRow {
  id: string
  title: string
  system_prompt: string | null
  model_id: string | null
  created_at: number
  updated_at: number
}

export interface MessageRow {
  id: string
  conversation_id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  model_id: string | null
  token_count: number | null
  created_at: number
}

export interface DocumentRow {
  id: string
  title: string
  current_branch_id: string | null
  created_at: number
  updated_at: number
}

export interface BranchRow {
  id: string
  document_id: string
  name: string
  parent_branch_id: string | null
  created_at: number
}

export interface VersionRow {
  id: string
  branch_id: string
  content: string
  message: string | null
  word_count: number | null
  created_at: number
}

export interface GeneratedImageRow {
  id: string
  prompt: string
  model_id: string
  settings: string
  file_path: string
  thumbnail_path: string | null
  favorite: number
  created_at: number
}

export interface SettingsRow {
  key: string
  value: string
  updated_at: number
}

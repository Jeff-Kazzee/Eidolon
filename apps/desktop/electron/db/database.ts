import Database from 'better-sqlite3'
import { app } from 'electron'
import { mkdirSync, lstatSync } from 'fs'
import { join } from 'path'
import type { DatabaseHealth } from './types'

/**
 * SQLite PRAGMA configuration with rationale.
 * These settings optimize for a desktop AI chat application with:
 * - Large context windows (100k+ tokens)
 * - Image generation metadata
 * - Document versioning with potentially large content
 */
const PRAGMA_CONFIG = {
  // WAL mode: Better concurrency, allows reads during writes
  journal_mode: 'WAL',

  // Foreign keys: Enforce referential integrity
  foreign_keys: 'ON',

  // Synchronous NORMAL: Good balance of safety and speed
  // FULL would be safer but slower; acceptable for non-critical user data
  synchronous: 'NORMAL',

  // 256MB cache: Sized for AI workloads with large context windows,
  // chat histories, and document content. Negative value = KB.
  cache_size: -262144,

  // Store temp tables in memory for speed
  temp_store: 'MEMORY',

  // 5 second busy timeout: Prevents immediate failure on lock contention
  // when multiple operations access DB simultaneously
  busy_timeout: 5000,
} as const

class DatabaseService {
  private db: Database.Database | null = null
  private dbPath: string | null = null
  private initialized = false

  /**
   * Initialize the database path based on Electron's userData directory.
   * Must be called after app.whenReady().
   */
  initialize(): void {
    if (this.initialized) {
      return
    }

    const dataDir = join(app.getPath('userData'), 'data')

    // Create data directory if it doesn't exist
    // Use recursive: true to handle nested creation safely
    mkdirSync(dataDir, { recursive: true })

    // Verify dataDir is actually a directory (not a symlink to file, etc.)
    const stats = lstatSync(dataDir)
    if (!stats.isDirectory()) {
      throw new Error(`[Database] Data path is not a directory: ${dataDir}`)
    }

    this.dbPath = join(dataDir, 'eidolon.db')
    this.initialized = true
    console.log(`[Database] Path initialized: ${this.dbPath}`)
  }

  /**
   * Connect to the SQLite database and configure it for optimal performance.
   */
  connect(): void {
    if (this.db) {
      console.log('[Database] Already connected')
      return
    }

    if (!this.dbPath) {
      throw new Error('[Database] Not initialized. Call initialize() first.')
    }

    // Create database with timeout for lock contention
    this.db = new Database(this.dbPath, { timeout: PRAGMA_CONFIG.busy_timeout })

    // Apply all PRAGMAs from config
    this.db.pragma(`journal_mode = ${PRAGMA_CONFIG.journal_mode}`)
    this.db.pragma(`foreign_keys = ${PRAGMA_CONFIG.foreign_keys}`)
    this.db.pragma(`synchronous = ${PRAGMA_CONFIG.synchronous}`)
    this.db.pragma(`cache_size = ${PRAGMA_CONFIG.cache_size}`)
    this.db.pragma(`temp_store = ${PRAGMA_CONFIG.temp_store}`)
    this.db.pragma(`busy_timeout = ${PRAGMA_CONFIG.busy_timeout}`)

    console.log('[Database] Connected and configured')
  }

  /**
   * Get the raw database instance for direct queries.
   * Throws if not connected.
   */
  getDb(): Database.Database {
    if (!this.db) {
      throw new Error('[Database] Not connected. Call connect() first.')
    }
    return this.db
  }

  /**
   * Close the database connection with WAL checkpoint.
   * Idempotent - safe to call multiple times.
   */
  close(): void {
    if (!this.db) {
      console.log('[Database] Not connected, nothing to close')
      return
    }

    const dbToClose = this.db
    this.db = null // Mark as closed immediately to prevent double-close

    try {
      // PASSIVE checkpoint doesn't block, then TRUNCATE to clean up WAL file
      // If these fail, we still want to close the connection
      dbToClose.pragma('wal_checkpoint(PASSIVE)')
      dbToClose.pragma('wal_checkpoint(TRUNCATE)')
    } catch (error) {
      console.error('[Database] WAL checkpoint error (continuing with close):', error)
    } finally {
      try {
        dbToClose.close()
        console.log('[Database] Connection closed')
      } catch (closeError) {
        console.error('[Database] Error during close:', closeError)
      }
    }
  }

  /**
   * Check if the database is connected.
   */
  isConnected(): boolean {
    return this.db !== null
  }

  /**
   * Get the database path.
   */
  getPath(): string | null {
    return this.dbPath
  }

  /**
   * Get database health status.
   * Path is only included in dev mode to avoid leaking user paths in production.
   */
  healthCheck(): DatabaseHealth {
    const isDev = !!process.env['VITE_DEV_SERVER_URL']

    if (!this.db || !this.dbPath) {
      return {
        connected: false,
        path: isDev ? (this.dbPath || '') : '[redacted]',
        walMode: false,
        foreignKeys: false,
        tableCount: 0,
      }
    }

    try {
      const walMode = this.db.pragma('journal_mode', { simple: true }) as string
      const foreignKeys = this.db.pragma('foreign_keys', { simple: true }) as number

      // Count user tables (exclude sqlite_ internal, _migrations, and FTS virtual tables)
      const tableCountResult = this.db
        .prepare(
          `SELECT COUNT(*) as count FROM sqlite_master
           WHERE type = 'table'
           AND name NOT LIKE 'sqlite_%'
           AND name NOT LIKE '\\_%' ESCAPE '\\'
           AND name NOT LIKE '%\\_fts' ESCAPE '\\'
           AND name NOT LIKE '%\\_fts\\_%' ESCAPE '\\'`
        )
        .get() as { count: number }

      return {
        connected: true,
        path: isDev ? this.dbPath : '[redacted]',
        walMode: walMode === 'wal',
        foreignKeys: foreignKeys === 1,
        tableCount: tableCountResult.count,
      }
    } catch (error) {
      console.error('[Database] Health check failed:', error)
      return {
        connected: false,
        path: isDev ? this.dbPath : '[redacted]',
        walMode: false,
        foreignKeys: false,
        tableCount: 0,
      }
    }
  }
}

// Export singleton instance
export const database = new DatabaseService()

import { createHash } from 'crypto'
import type Database from 'better-sqlite3'
import { existsSync, readdirSync, readFileSync, statSync, realpathSync } from 'fs'
import { join, resolve } from 'path'
import type { MigrationRecord, MigrationResult } from './types'

/**
 * Migration filename pattern: 3+ digit prefix, underscore, descriptive name, .sql extension
 * Examples: 001_initial_schema.sql, 002_add_fts.sql, 100_add_indexes.sql
 */
const MIGRATION_PATTERN = /^(\d{3,})_.+\.sql$/

/**
 * Compute SHA-256 checksum of file content for integrity verification.
 */
function computeChecksum(content: string): string {
  return createHash('sha256').update(content, 'utf-8').digest('hex')
}

export class Migrator {
  private db: Database.Database
  private resolvedMigrationsPath: string

  constructor(db: Database.Database, migrationsPath: string) {
    this.db = db
    // Resolve to absolute path
    this.resolvedMigrationsPath = resolve(migrationsPath)
  }

  /**
   * Validate migrations directory exists and is accessible.
   * Throws if invalid - fail fast rather than silently proceeding.
   */
  private validateMigrationsPath(): void {
    if (!existsSync(this.resolvedMigrationsPath)) {
      throw new Error(
        `[Migrator] Migrations directory not found: ${this.resolvedMigrationsPath}. ` +
          'This is a fatal error - the database cannot be initialized without migrations.'
      )
    }

    const stats = statSync(this.resolvedMigrationsPath)
    if (!stats.isDirectory()) {
      throw new Error(
        `[Migrator] Migrations path is not a directory: ${this.resolvedMigrationsPath}`
      )
    }
  }

  /**
   * Validate migration filename matches expected pattern.
   */
  private validateMigrationFilename(filename: string): { valid: boolean; prefix: number } {
    const match = filename.match(MIGRATION_PATTERN)
    if (!match || !match[1]) {
      return { valid: false, prefix: -1 }
    }
    return { valid: true, prefix: parseInt(match[1], 10) }
  }

  /**
   * Validate that migration file path is within migrations directory (prevent symlink traversal).
   */
  private validateMigrationPath(filePath: string): void {
    const realPath = realpathSync(filePath)
    const realMigrationsPath = realpathSync(this.resolvedMigrationsPath)

    if (!realPath.startsWith(realMigrationsPath)) {
      throw new Error(
        `[Migrator] Migration file escapes migrations directory: ${filePath}`
      )
    }
  }

  /**
   * Ensure the migrations tracking table exists with checksum column.
   */
  ensureMigrationsTable(): void {
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS _migrations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL UNIQUE,
        checksum TEXT NOT NULL,
        applied_at TEXT NOT NULL DEFAULT (datetime('now'))
      )
    `)
  }

  /**
   * Get list of already applied migrations with their checksums.
   */
  getAppliedMigrations(): Map<string, string> {
    const rows = this.db
      .prepare('SELECT name, checksum FROM _migrations ORDER BY id ASC')
      .all() as MigrationRecord[]
    return new Map(rows.map((row) => [row.name, row.checksum]))
  }

  /**
   * Get list of pending migration files, sorted by numeric prefix.
   * Validates filename format and rejects duplicates.
   */
  getPendingMigrations(): string[] {
    this.validateMigrationsPath()

    const appliedMigrations = this.getAppliedMigrations()

    const files = readdirSync(this.resolvedMigrationsPath)
      .filter((file) => file.endsWith('.sql'))

    // Validate all filenames and extract prefixes for sorting
    const validatedFiles: Array<{ filename: string; prefix: number }> = []
    const seenPrefixes = new Set<number>()

    for (const file of files) {
      const { valid, prefix } = this.validateMigrationFilename(file)

      if (!valid) {
        throw new Error(
          `[Migrator] Invalid migration filename: ${file}. ` +
            'Expected format: NNN_description.sql (e.g., 001_initial_schema.sql)'
        )
      }

      if (seenPrefixes.has(prefix)) {
        throw new Error(
          `[Migrator] Duplicate migration prefix ${prefix} found. ` +
            'Each migration must have a unique numeric prefix.'
        )
      }
      seenPrefixes.add(prefix)

      validatedFiles.push({ filename: file, prefix })
    }

    // Sort by numeric prefix for deterministic order
    validatedFiles.sort((a, b) => a.prefix - b.prefix)

    // Return only pending migrations (not yet applied)
    return validatedFiles
      .map((f) => f.filename)
      .filter((file) => !appliedMigrations.has(file))
  }

  /**
   * Verify checksums of already-applied migrations haven't changed.
   * Detects tampering or accidental modification of migration files.
   */
  verifyAppliedChecksums(): void {
    this.validateMigrationsPath()
    const appliedMigrations = this.getAppliedMigrations()

    for (const [name, expectedChecksum] of appliedMigrations) {
      const filePath = join(this.resolvedMigrationsPath, name)

      // Migration file might have been deleted - that's OK for old migrations
      if (!existsSync(filePath)) {
        continue
      }

      this.validateMigrationPath(filePath)
      const content = readFileSync(filePath, 'utf-8')
      const actualChecksum = computeChecksum(content)

      if (actualChecksum !== expectedChecksum) {
        throw new Error(
          `[Migrator] Checksum mismatch for applied migration: ${name}. ` +
            'The migration file has been modified after it was applied. ' +
            'This could indicate tampering or accidental changes. ' +
            `Expected: ${expectedChecksum.slice(0, 16)}..., ` +
            `Got: ${actualChecksum.slice(0, 16)}...`
        )
      }
    }
  }

  /**
   * Check if there are any pending migrations.
   */
  needsMigration(): boolean {
    this.ensureMigrationsTable()
    return this.getPendingMigrations().length > 0
  }

  /**
   * Run all pending migrations in order.
   * Each migration runs in an IMMEDIATE transaction for exclusive write access.
   */
  migrate(): MigrationResult {
    this.ensureMigrationsTable()

    // Verify existing migrations haven't been tampered with
    this.verifyAppliedChecksums()

    const pending = this.getPendingMigrations()
    const result: MigrationResult = {
      applied: [],
      errors: [],
    }

    if (pending.length === 0) {
      console.log('[Migrator] No pending migrations')
      return result
    }

    console.log(`[Migrator] Found ${pending.length} pending migration(s)`)

    for (const migrationFile of pending) {
      const migrationPath = join(this.resolvedMigrationsPath, migrationFile)

      try {
        // Validate path is within migrations directory
        this.validateMigrationPath(migrationPath)

        console.log(`[Migrator] Applying: ${migrationFile}`)
        const sql = readFileSync(migrationPath, 'utf-8')
        const checksum = computeChecksum(sql)

        // Run migration in IMMEDIATE transaction for exclusive write lock
        // This prevents concurrent migration races
        this.db.exec('BEGIN IMMEDIATE')

        try {
          this.db.exec(sql)

          // Record the migration with checksum
          this.db
            .prepare('INSERT INTO _migrations (name, checksum) VALUES (?, ?)')
            .run(migrationFile, checksum)

          this.db.exec('COMMIT')
          result.applied.push(migrationFile)
          console.log(`[Migrator] Applied: ${migrationFile}`)
        } catch (execError) {
          this.db.exec('ROLLBACK')
          throw execError
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : String(error)
        console.error(`[Migrator] Failed to apply ${migrationFile}:`, errorMessage)
        result.errors.push(`${migrationFile}: ${errorMessage}`)
        // Stop on first error to maintain migration order integrity
        break
      }
    }

    console.log(
      `[Migrator] Applied ${result.applied.length} migration(s), ${result.errors.length} error(s)`
    )

    return result
  }
}

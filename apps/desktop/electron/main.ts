import { app, BrowserWindow, shell, session, dialog } from 'electron'
import { join, resolve, sep } from 'path'
import { fileURLToPath } from 'url'
import { registerIpcHandlers } from './ipc'
import { database, Migrator } from './db'

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit()
}

// Disable GPU acceleration on Linux to prevent issues
if (process.platform === 'linux') {
  app.disableHardwareAcceleration()
}

// Single instance lock: Prevent multiple instances from corrupting the database
const gotTheLock = app.requestSingleInstanceLock()
if (!gotTheLock) {
  console.log('[App] Another instance is already running. Exiting.')
  app.quit()
}

let mainWindow: BrowserWindow | null = null

const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']
const IS_DEV = !!VITE_DEV_SERVER_URL

/**
 * Get the application root directory for security validation.
 * Used by IPC handlers to validate file:// origins.
 */
export function getAppRoot(): string {
  if (IS_DEV) {
    // In dev, use the project root (parent of dist-electron)
    return resolve(__dirname, '..')
  }
  // In production, use the app path
  return app.getAppPath()
}

/**
 * Validate if a file:// URL is within the app's trusted root.
 */
export function isUrlWithinAppRoot(url: string): boolean {
  try {
    const parsed = new URL(url)
    if (parsed.protocol !== 'file:') {
      return false
    }
    const filePath = resolve(fileURLToPath(url))
    const appRoot = resolve(getAppRoot()) + sep
    return filePath.startsWith(appRoot)
  } catch {
    return false
  }
}

/**
 * Get allowed origins for IPC validation.
 * In dev: Vite dev server origin
 * In prod: Only file:// URLs within app root
 */
export function getAllowedOrigins(): string[] {
  if (IS_DEV && VITE_DEV_SERVER_URL) {
    return [new URL(VITE_DEV_SERVER_URL).origin]
  }
  return ['file://']
}

/**
 * Initialize database connection and run migrations.
 * Migration failures are fatal - the app cannot run with a partial schema.
 */
function initializeDatabase(): void {
  database.initialize()
  database.connect()

  // Resolve migrations path using app.isPackaged for reliability
  // Fallback to app.getAppPath() if resourcesPath is undefined
  const migrationsPath = app.isPackaged
    ? join(process.resourcesPath ?? app.getAppPath(), 'migrations')
    : join(__dirname, '../electron/db/migrations')

  const migrator = new Migrator(database.getDb(), migrationsPath)
  const result = migrator.migrate()

  if (result.applied.length > 0) {
    console.log(`[App] Applied ${result.applied.length} migration(s)`)
  }

  // Migration errors are FATAL - do not proceed with partial schema
  if (result.errors.length > 0) {
    const errorMessage = result.errors.join('\n')
    console.error('[App] FATAL: Migration errors:', errorMessage)

    database.close()

    // Show blocking error dialog
    dialog.showErrorBox(
      'Database Migration Failed',
      `Eidolon cannot start due to database migration errors:\n\n${errorMessage}\n\n` +
        'Please report this issue or try reinstalling the application.'
    )

    app.exit(1)
    return
  }

  const health = database.healthCheck()
  console.log('[App] Database health:', health)
}

// Configure Content Security Policy
function setupCSP(): void {
  const devCSP = [
    "default-src 'self'",
    "script-src 'self'",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob:",
    "font-src 'self' data:",
    "connect-src 'self' ws://localhost:* http://localhost:*",
    "object-src 'none'",
    "base-uri 'self'",
    "frame-ancestors 'none'",
    "form-action 'self'",
  ].join('; ')

  const prodCSP = [
    "default-src 'self'",
    "script-src 'self'",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob:",
    "font-src 'self' data:",
    "connect-src 'self'",
    "object-src 'none'",
    "base-uri 'self'",
    "frame-ancestors 'none'",
    "form-action 'self'",
  ].join('; ')

  session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        'Content-Security-Policy': [IS_DEV ? devCSP : prodCSP],
      },
    })
  })
}

function createWindow(): void {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    show: false,
    backgroundColor: '#0a0a0c',
    titleBarStyle: 'hiddenInset',
    trafficLightPosition: { x: 16, y: 16 },
    webPreferences: {
      preload: join(__dirname, 'preload.js'),
      // Security: Disable node integration in renderer
      nodeIntegration: false,
      // Security: Enable context isolation
      contextIsolation: true,
      // Security: Enable sandbox
      sandbox: true,
      // Security: Keep web security enabled
      webSecurity: true,
    },
  })

  // Show window when ready to prevent visual flash
  mainWindow.once('ready-to-show', () => {
    mainWindow?.show()
  })

  // Handle external links - open in default browser (https only)
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    // Only allow https: URLs for external links
    if (url.startsWith('https:')) {
      shell.openExternal(url).catch((err) => {
        console.error('Failed to open external URL:', err)
      })
    }
    return { action: 'deny' }
  })

  // Load the app
  if (VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(VITE_DEV_SERVER_URL)
    // Open DevTools in development
    mainWindow.webContents.openDevTools()
  } else {
    mainWindow.loadFile(join(__dirname, '../dist/index.html'))
  }

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

// Security: Limit navigation to app URLs only
// Tightened to only allow file:// URLs within app root
app.on('web-contents-created', (_, contents) => {
  contents.on('will-navigate', (event, navigationUrl) => {
    const parsedUrl = new URL(navigationUrl)

    // In dev mode, allow Vite dev server
    if (IS_DEV && VITE_DEV_SERVER_URL) {
      const devOrigin = new URL(VITE_DEV_SERVER_URL).origin
      if (parsedUrl.origin === devOrigin) {
        return // Allow
      }
    }

    // Only allow file:// URLs within app root
    if (parsedUrl.protocol === 'file:') {
      if (isUrlWithinAppRoot(navigationUrl)) {
        return // Allow
      }
    }

    // Block everything else
    console.warn('[Security] Blocked navigation to:', navigationUrl)
    event.preventDefault()
  })
})

// Handle second instance (when user tries to open another instance)
app.on('second-instance', () => {
  if (mainWindow) {
    if (mainWindow.isMinimized()) {
      mainWindow.restore()
    }
    mainWindow.focus()
  }
})

app.whenReady().then(async () => {
  setupCSP()

  try {
    await initializeDatabase()
  } catch (error) {
    console.error('[App] FATAL: Database initialization failed:', error)

    dialog.showErrorBox(
      'Database Initialization Failed',
      `Eidolon cannot start due to a database error:\n\n${error instanceof Error ? error.message : String(error)}\n\n` +
        'Please report this issue or try reinstalling the application.'
    )

    app.exit(1)
    return
  }

  registerIpcHandlers()
  createWindow()

  app.on('activate', () => {
    // On macOS re-create window when dock icon is clicked
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  // On macOS, keep app running until explicitly quit
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// Graceful shutdown: close database before quitting
app.on('before-quit', () => {
  database.close()
})

process.on('SIGINT', () => {
  database.close()
  app.exit(0)
})

process.on('SIGTERM', () => {
  database.close()
  app.exit(0)
})

import { app, BrowserWindow, shell } from 'electron'
import { join } from 'path'
import { registerIpcHandlers } from './ipc'

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit()
}

// Disable GPU acceleration on Linux to prevent issues
if (process.platform === 'linux') {
  app.disableHardwareAcceleration()
}

let mainWindow: BrowserWindow | null = null

const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']
const IS_DEV = !!VITE_DEV_SERVER_URL

// Allowed origins for IPC validation
export function getAllowedOrigins(): string[] {
  if (IS_DEV && VITE_DEV_SERVER_URL) {
    return [new URL(VITE_DEV_SERVER_URL).origin]
  }
  return ['file://']
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
      // Security: Keep web security enabled (rely on CSP instead)
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
app.on('web-contents-created', (_, contents) => {
  contents.on('will-navigate', (event, navigationUrl) => {
    const parsedUrl = new URL(navigationUrl)
    const allowedOrigins = getAllowedOrigins()

    if (!allowedOrigins.some((origin) => parsedUrl.origin === origin || parsedUrl.protocol === 'file:')) {
      event.preventDefault()
    }
  })
})

app.whenReady().then(() => {
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

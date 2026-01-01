import { ipcMain, BrowserWindow, app, IpcMainInvokeEvent } from 'electron'
import { getAllowedOrigins, isUrlWithinAppRoot } from '../main'
import { registerDatabaseHandlers } from './database'

/**
 * Validates that the IPC event sender is from an allowed origin.
 * In production, file:// URLs must be within the app bundle.
 * Returns true if valid, false otherwise.
 */
function validateSender(event: IpcMainInvokeEvent): boolean {
  const senderUrl = event.senderFrame?.url
  if (!senderUrl) {
    return false
  }

  const allowedOrigins = getAllowedOrigins()

  try {
    const parsedUrl = new URL(senderUrl)

    // Check if origin matches any allowed origin
    return allowedOrigins.some((origin) => {
      if (origin === 'file://') {
        // For file:// URLs, verify they're within the app root
        // This prevents malicious local files from calling IPC
        return parsedUrl.protocol === 'file:' && isUrlWithinAppRoot(senderUrl)
      }
      // For HTTP origins (dev server), check exact origin match
      return parsedUrl.origin === origin
    })
  } catch {
    return false
  }
}

export function registerIpcHandlers(): void {
  // App handlers
  ipcMain.handle('app:getVersion', (event) => {
    if (!validateSender(event)) {
      throw new Error('Unauthorized IPC call')
    }
    return app.getVersion()
  })

  // Window control handlers
  ipcMain.handle('window:minimize', (event) => {
    if (!validateSender(event)) {
      throw new Error('Unauthorized IPC call')
    }
    const window = BrowserWindow.fromWebContents(event.sender)
    window?.minimize()
  })

  ipcMain.handle('window:maximize', (event) => {
    if (!validateSender(event)) {
      throw new Error('Unauthorized IPC call')
    }
    const window = BrowserWindow.fromWebContents(event.sender)
    if (window?.isMaximized()) {
      window.unmaximize()
    } else {
      window?.maximize()
    }
    const isMaximized = window?.isMaximized() ?? false
    // Notify renderer of state change
    window?.webContents.send('window:maximized-change', isMaximized)
    return isMaximized
  })

  ipcMain.handle('window:close', (event) => {
    if (!validateSender(event)) {
      throw new Error('Unauthorized IPC call')
    }
    const window = BrowserWindow.fromWebContents(event.sender)
    window?.close()
  })

  ipcMain.handle('window:isMaximized', (event) => {
    if (!validateSender(event)) {
      throw new Error('Unauthorized IPC call')
    }
    const window = BrowserWindow.fromWebContents(event.sender)
    return window?.isMaximized() ?? false
  })

  // Register database handlers
  registerDatabaseHandlers(validateSender)
}

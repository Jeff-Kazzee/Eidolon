import { ipcMain, BrowserWindow, app, IpcMainInvokeEvent } from 'electron'
import { getAllowedOrigins } from '../main'

/**
 * Validates that the IPC event sender is from an allowed origin.
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
    // file:// URLs only allowed when 'file://' is explicitly in allowedOrigins
    return allowedOrigins.some((origin) => {
      if (origin === 'file://') {
        return parsedUrl.protocol === 'file:'
      }
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
}

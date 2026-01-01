import { contextBridge, ipcRenderer } from 'electron'

// Expose protected methods that allow the renderer process to use
// ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  // Platform info
  platform: process.platform,

  // App version
  getVersion: () => ipcRenderer.invoke('app:getVersion'),

  // Window controls (for custom title bar)
  minimizeWindow: () => ipcRenderer.invoke('window:minimize'),
  maximizeWindow: () => ipcRenderer.invoke('window:maximize'),
  closeWindow: () => ipcRenderer.invoke('window:close'),
  isMaximized: () => ipcRenderer.invoke('window:isMaximized'),

  // IPC communication pattern
  invoke: (channel: string, ...args: unknown[]) => {
    // Whitelist channels for security
    const validChannels = [
      'app:getVersion',
      'window:minimize',
      'window:maximize',
      'window:close',
      'window:isMaximized',
    ]
    if (validChannels.includes(channel)) {
      return ipcRenderer.invoke(channel, ...args)
    }
    throw new Error(`Invalid IPC channel: ${channel}`)
  },

  // Event subscription pattern
  on: (channel: string, callback: (...args: unknown[]) => void) => {
    const validChannels = ['window:maximized-change']
    if (validChannels.includes(channel)) {
      const subscription = (_event: Electron.IpcRendererEvent, ...args: unknown[]) =>
        callback(...args)
      ipcRenderer.on(channel, subscription)
      return () => {
        ipcRenderer.removeListener(channel, subscription)
      }
    }
    throw new Error(`Invalid IPC channel: ${channel}`)
  },
})

// Type definitions are in src/types/electron.d.ts
// to avoid duplication and ensure consistency

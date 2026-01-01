/**
 * Type definitions for the Electron API exposed via preload script.
 * These types match the API exposed in electron/preload.ts
 */

export interface ElectronAPI {
  /** Current platform (darwin, win32, linux) */
  platform: NodeJS.Platform

  /** Get the application version */
  getVersion: () => Promise<string>

  /** Minimize the current window */
  minimizeWindow: () => Promise<void>

  /** Toggle maximize/unmaximize the current window */
  maximizeWindow: () => Promise<void>

  /** Close the current window */
  closeWindow: () => Promise<void>

  /** Check if the current window is maximized */
  isMaximized: () => Promise<boolean>

  /** Generic IPC invoke for whitelisted channels */
  invoke: (channel: string, ...args: unknown[]) => Promise<unknown>

  /** Subscribe to IPC events */
  on: (channel: string, callback: (...args: unknown[]) => void) => () => void
}

declare global {
  interface Window {
    electronAPI: ElectronAPI
  }
}

export {}

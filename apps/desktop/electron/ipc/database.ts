import { ipcMain, IpcMainInvokeEvent } from 'electron'
import { database } from '../db'

export function registerDatabaseHandlers(
  validateSender: (event: IpcMainInvokeEvent) => boolean
): void {
  ipcMain.handle('db:health', (event) => {
    if (!validateSender(event)) {
      throw new Error('Unauthorized IPC call')
    }
    return database.healthCheck()
  })
}

import { app, dialog, ipcMain } from 'electron'
import { join } from 'path'

/**
 * Registers an IPC handler that shows a Save dialog defaulting to Desktop and
 * filtering for .luna files. Returns the Electron SaveDialogReturnValue.
 * Channel: 'show-save-dialog'
 */
export function registerShowSaveDialogHandler(): void {
  ipcMain.handle('show-save-dialog', async () => {
    const desktopPath = app.getPath('desktop')
    const result = await dialog.showSaveDialog({
      title: 'Save Luna File',
      defaultPath: join(desktopPath, 'untitled.luna'),
      filters: [{ name: 'Luna Files', extensions: ['luna'] }],
      properties: ['createDirectory']
    })
    return result
  })
}

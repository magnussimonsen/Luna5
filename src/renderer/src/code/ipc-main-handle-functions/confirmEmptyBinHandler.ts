import { BrowserWindow, dialog, ipcMain } from 'electron'

export function registerConfirmEmptyBinHandler(): void {
  ipcMain.handle('confirm-empty-bin', async () => {
    const win = BrowserWindow.getFocusedWindow() || BrowserWindow.getAllWindows()[0]
    const result = await dialog.showMessageBox(win!, {
      type: 'warning',
      buttons: ['Empty Bin', 'Cancel'],
      defaultId: 1, // default to Cancel
      cancelId: 1,
      noLink: true,
      title: 'Empty Bin',
      message: 'Permanently delete all items in the Bin?',
      detail: 'This action cannot be undone.'
    })
    return result.response === 0
  })
}

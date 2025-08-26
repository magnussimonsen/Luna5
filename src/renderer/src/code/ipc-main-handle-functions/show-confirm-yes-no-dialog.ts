import { BrowserWindow, dialog, ipcMain } from 'electron'

/**
 * Registers a generic IPC handler for Yes/No confirmation dialogs.
 * Channel: 'confirm-yes-no'
 * Input: message string (or object with title+message as a future-proof option)
 * Output: boolean (true if Yes, false if No)
 */
export function registerConfirmYesNoHandler(): void {
  ipcMain.handle('confirm-yes-no', async (_event, message: string) => {
    const win = BrowserWindow.getFocusedWindow() || BrowserWindow.getAllWindows()[0]
    const result = await dialog.showMessageBox(win!, {
      type: 'question',
      buttons: ['Yes', 'No'],
      defaultId: 1, // default to No
      cancelId: 1,
      noLink: true,
      title: 'Confirm',
      message
    })
    return result.response === 0
  })
}

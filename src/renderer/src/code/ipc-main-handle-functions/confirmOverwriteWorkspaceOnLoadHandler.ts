import { BrowserWindow, dialog, ipcMain } from 'electron'

/**
 * Registers an IPC handler that shows a Yes/No dialog asking the user to confirm
 * overwriting the current workspace when loading a file. Returns true if the user
 * selects Yes, otherwise false.
 */
export function registerConfirmOverwriteWorkspaceOnLoadHandler(): void {
  ipcMain.handle('confirm-overwrite-workspace-on-load', async () => {
    const win = BrowserWindow.getFocusedWindow() || BrowserWindow.getAllWindows()[0]
    const result = await dialog.showMessageBox(win!, {
      type: 'warning',
      buttons: ['Yes', 'No'],
      defaultId: 1, // default to No for safety
      cancelId: 1,
      noLink: true,
      title: 'Load Workspace',
      message: 'A workspace is already open.',
      detail: 'Loading this file will overwrite the current workspace. Do you want to continue?'
    })
    return result.response === 0
  })
}

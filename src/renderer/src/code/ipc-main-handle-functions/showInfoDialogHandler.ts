/* Filepath: src/renderer/src/code/ipc-main-handle-functions/showInfoDialogHandler.ts */
import { BrowserWindow, dialog, ipcMain } from 'electron'

/**
 * Registers an IPC handler for information dialogs with a single OK button.
 * Used for non-blocking notifications and confirmations that don't require user choice.
 *
 * Channel: 'show-info-dialog'
 * Input: message string
 * Output: void (displays dialog and waits for user to click OK)
 */
export function registerShowInfoDialogHandler(): void {
  ipcMain.handle('show-info-dialog', async (_event, message: string) => {
    const focusedWindow = BrowserWindow.getFocusedWindow()
    const allWindows = BrowserWindow.getAllWindows()
    const targetWindow = focusedWindow || allWindows[0]

    await dialog.showMessageBox(targetWindow!, {
      type: 'info',
      buttons: ['OK'],
      defaultId: 0,
      noLink: true,
      title: 'Information',
      message
    })
  })
}

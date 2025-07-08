import { ipcMain, dialog, app } from 'electron'

export function registerQuitAppHandler(): void {
  ipcMain.handle('quit-app', async () => {
    const result = await dialog.showMessageBox({
      type: 'question',
      buttons: ['Yes', 'No'],
      defaultId: 1,
      title: 'Quit Luna',
      message: 'Are you sure you want to quit Luna?'
    })
    if (result.response === 0) {
      app.quit()
      return true
    }
    return false
  })
}

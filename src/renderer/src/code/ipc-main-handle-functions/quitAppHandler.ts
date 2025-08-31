import { ipcMain, dialog, app } from 'electron'

type QuitOptions = {
  isSaved?: boolean
  isEffectivelyEmpty?: boolean
}

export function registerQuitAppHandler(): void {
  ipcMain.handle('quit-app', async (_event, opts?: QuitOptions) => {
    const isSaved = !!opts?.isSaved
    const isEmpty = !!opts?.isEffectivelyEmpty

    // Only warn if there are unsaved changes AND workspace is not effectively empty
    if (!isSaved && !isEmpty) {
      const result = await dialog.showMessageBox({
        type: 'warning',
        buttons: ['Quit', 'Cancel'],
        defaultId: 1,
        cancelId: 1,
        title: 'Unsaved Changes',
        message: 'Your work is not saved. Quit anyway?'
      })
      if (result.response !== 0) {
        return false
      }
    }

    app.quit()
    return true
  })
}

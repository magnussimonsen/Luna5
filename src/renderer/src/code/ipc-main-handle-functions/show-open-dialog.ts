// This handler will show the open dialog and return the selected file path

/* For reference: The following is code from the last version of Luna
ipcMain.handle('show-open-dialog', async () => {
    const desktopPath = app.getPath('desktop')
    const result = await dialog.showOpenDialog({
      title: 'Open Luna File',
      defaultPath: desktopPath, // Default to desktop
      filters: [{ name: 'Luna Files', extensions: ['luna'] }],
      properties: ['openFile']
    })
    return result
  })
*/
// New handler for Yes/No/Cancel confirmation dialog

/* For reference: The following is code from the last version of Luna
  ipcMain.handle('show-confirm-cancel-dialog', async (event, opts) => {
    const result = await dialog.showMessageBox({
      type: 'question',
      buttons: ['Yes', 'No', 'Cancel'],
      title: opts.title || 'Confirm',
      message: opts.message || 'Are you sure?',
      cancelId: 2 // Index of the Cancel button
    })

    // Return a string representing the button clicked
    // This is more explicit than numbers or booleans
    if (result.response === 0) return 'yes'
    if (result.response === 1) return 'no'
    return 'cancel' // response === 2 or dialog was closed
  })
    */

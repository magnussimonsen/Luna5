// PDF Export handler - simplified approach

/* For reference: Code from the last version of Luna
//ipcMain.handle('export-to-pdf', async (event, { filePath, header, footer }) => {
  ipcMain.handle('export-to-pdf', async (event, { filePath }) => {
    try {
      console.log('Starting PDF export to:', filePath)
      // Get the webContents of the CURRENT window
      const webContents = event.sender
      // Wait for any pending renders to complete
      await new Promise((resolve) => setTimeout(resolve, 1000))
      webContents.setZoomFactor(1)
      const pdfData = await webContents.printToPDF({
        pageSize: 'A4',
        printBackground: true, // Include background colors and images
        landscape: false,
        marginsType: 0, // 0 for default margin, 1 for no margin, 2 for minimum margin
        preferCSSPageSize: true
      })

      // Write to file
      await fs.promises.writeFile(filePath, pdfData)
      console.log('PDF file written successfully')

      return { success: true, filePath: filePath }
    } catch (error) {
      console.error('PDF generation error:', error)
      return { success: false, error: error.message }
    }
  })
*/
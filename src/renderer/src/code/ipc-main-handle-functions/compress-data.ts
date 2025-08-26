/* For reference: Code from the last version of Luna
// Register IPC handlers for compression/decompression
function registerCompressionHandlers() {
  // Handler for compression
  ipcMain.handle('compress-data', async (event, { data }) => {
    return new Promise((resolve, reject) => {
      zlib.gzip(data, (err, result) => {
        if (err) {
          return reject(err)
        }
        // Convert compressed binary data to base64 for safe IPC transport
        resolve(result.toString('base64'))
      })
    })
  })

  */

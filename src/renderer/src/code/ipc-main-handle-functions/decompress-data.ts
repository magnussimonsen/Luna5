/* For reference: Code from the last version of Luna
// Handler for decompression
  ipcMain.handle('decompress-data', async (event, { data }) => {
    return new Promise((resolve, reject) => {
      // If data is base64 encoded (from file read), convert to buffer first
      let buffer
      if (typeof data === 'string') {
        try {
          // Try to decode base64
          buffer = Buffer.from(data, 'base64')
        } catch (err) {
          // If not base64, use as plain string
          buffer = Buffer.from(data)
        }
      } else {
        // If already a buffer-like object, use as is
        buffer = Buffer.from(data)
      }

      zlib.gunzip(buffer, (err, result) => {
        if (err) {
          return reject(err)
        }
        // Return decompressed data as UTF-8 string
        resolve(result.toString('utf8'))
      })
    })
  })
}
*/

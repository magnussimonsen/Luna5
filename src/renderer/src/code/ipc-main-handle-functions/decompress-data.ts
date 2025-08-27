import { ipcMain } from 'electron'
import zlib from 'node:zlib'

/**
 * Registers an IPC handler for decompressing data using zlib gunzip.
 *
 * This allows the renderer process to decompress data by sending it to the main process.
 * It accepts base64-encoded compressed data from file reads or other sources
 * and returns the decompressed data as a UTF-8 string.
 */
export function registerDecompressDataHandler(): void {
  ipcMain.handle('decompress-data', async (_event, { data }: { data: string | Buffer }) => {
    return new Promise<string>((resolve, reject) => {
      // If data is base64 encoded (from file read), convert to buffer first
      let buffer: Buffer
      if (typeof data === 'string') {
        try {
          // Try to decode base64
          buffer = Buffer.from(data, 'base64')
        } catch (err) {
          // Log the error but continue with fallback
          console.warn('Failed to decode as base64, using as plain string:', err)
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

import { ipcMain } from 'electron'
import zlib from 'node:zlib'

/**
 * Registers an IPC handler for compressing data using zlib gzip.
 *
 * This allows the renderer process to compress data by sending it to the main process,
 * which compresses it and returns the result as a base64-encoded string.
 */
export function registerCompressDataHandler(): void {
  ipcMain.handle('compress-data', async (_event, { data }: { data: string }) => {
    return new Promise<string>((resolve, reject) => {
      zlib.gzip(data, (err, result) => {
        if (err) {
          return reject(err)
        }
        // Convert compressed binary data to base64 for safe IPC transport
        resolve(result.toString('base64'))
      })
    })
  })
}

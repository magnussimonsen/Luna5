import { ipcMain, dialog } from 'electron'
import fs from 'fs'

/**
 * Registers the 'pick-image-file' IPC handler.
 * First iteration: returns a Data URI (base64) of the selected image.
 * Future improvement: copy image into a workspace assets folder and return relative path.
 */
export function registerPickImageFileHandler(): void {
  ipcMain.handle('pick-image-file', async () => {
    try {
      const result = await dialog.showOpenDialog({
        title: 'Select an image',
        properties: ['openFile'],
        filters: [{ name: 'Images', extensions: ['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg'] }]
      })
      if (result.canceled || !result.filePaths?.length) {
        return { canceled: true }
      }
      const filePath = result.filePaths[0]
      const stat = await fs.promises.stat(filePath)
      const maxBytes = 5 * 1024 * 1024 // 5MB soft cap
      if (stat.size > maxBytes) {
        return { canceled: true, error: 'Image too large (>5MB)' }
      }
      const buf = await fs.promises.readFile(filePath)
      const ext = (filePath.split('.').pop() || '').toLowerCase()
      const mimeMap: Record<string, string> = {
        png: 'image/png',
        jpg: 'image/jpeg',
        jpeg: 'image/jpeg',
        gif: 'image/gif',
        webp: 'image/webp',
        svg: 'image/svg+xml'
      }
      const mime = mimeMap[ext] || 'application/octet-stream'
      const base64 = buf.toString('base64')
      const dataUri = `data:${mime};base64,${base64}`
      const fileName = filePath.split(/[/\\]/).pop() || 'image'
      return { canceled: false, dataUri, size: stat.size, mime, alt: fileName }
    } catch (e: unknown) {
      return { canceled: true, error: e instanceof Error ? e.message : String(e) }
    }
  })
}

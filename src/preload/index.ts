import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Bridge: Renderer-facing API (safe subset of ipcRenderer exposed to window.api)
const rendererApi = {
  // File saving and loading handlers
  showSaveDialog: () => ipcRenderer.invoke('show-save-dialog'),
  showOpenDialog: (options?: { properties: string[] }) =>
    ipcRenderer.invoke('show-open-dialog', options),
  readFile: (opts: { filePath: string }) => ipcRenderer.invoke('read-file', opts),
  saveToExistingFile: (opts: { filePath: string; content: string | Buffer }) =>
    ipcRenderer.invoke('save-to-existing-file', opts),
  saveFile: (opts: { filePath: string; content: string | Buffer }) =>
    ipcRenderer.invoke('save-file', opts),
  fileExists: (opts: { filePath: string }) => ipcRenderer.invoke('file-exists', opts),
  confirmUnsavedBeforeOpen: () => ipcRenderer.invoke('confirm-unsaved-before-open'),

  // PDF export
  savePDF: (opts: { fileName?: string }) => ipcRenderer.invoke('save-pdf', opts),

  // Paths
  getDesktopPath: () => ipcRenderer.invoke('get-desktop-path'),

  // Compression and decompression handlers
  compressData: (opts: { data: string }) => ipcRenderer.invoke('compress-data', opts),
  decompressData: (opts: { data: string }) => ipcRenderer.invoke('decompress-data', opts),
  pickImageFile: () => ipcRenderer.invoke('pick-image-file')
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
// If context isolation is ON, we must use contextBridge to expose APIs.
// Otherwise, we attach them directly to the window object (dev-only scenarios).
if (process.contextIsolated) {
  try {
    console.log('Preload: exposing APIs via contextBridge')
    contextBridge.exposeInMainWorld('electron', {
      ...electronAPI,
      quitApp: (opts?: { isSaved?: boolean; isEffectivelyEmpty?: boolean }) =>
        ipcRenderer.invoke('quit-app', opts),
      confirmEmptyBin: (): Promise<boolean> => ipcRenderer.invoke('confirm-empty-bin'),
      confirmYesNo: (message: string): Promise<boolean> =>
        ipcRenderer.invoke('confirm-yes-no', message),
      showInfo: (message: string): Promise<void> => ipcRenderer.invoke('show-info-dialog', message)
    })
    contextBridge.exposeInMainWorld('api', rendererApi)
  } catch (error) {
    console.error('Error exposing APIs in contextBridge:', error)
  }
} else {
  console.log('Preload: exposing APIs directly on window (no contextIsolation)')
  // @ts-ignore (define in dts)
  window.electron = {
    ...electronAPI,
    quitApp: (opts?: { isSaved?: boolean; isEffectivelyEmpty?: boolean }) =>
      ipcRenderer.invoke('quit-app', opts),
    confirmEmptyBin: (): Promise<boolean> => ipcRenderer.invoke('confirm-empty-bin'),
    confirmYesNo: (message: string): Promise<boolean> =>
      ipcRenderer.invoke('confirm-yes-no', message)
  }
  // @ts-ignore (define in dts)
  window.api = rendererApi
}

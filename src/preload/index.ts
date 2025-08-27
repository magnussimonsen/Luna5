import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Custom APIs for renderer
const api = {
  // File saving and loading handlers
  showSaveDialog: () => ipcRenderer.invoke('show-save-dialog'),
  showOpenDialog: () => ipcRenderer.invoke('show-open-dialog'),
  readFile: (opts: { filePath: string }) => ipcRenderer.invoke('read-file', opts),
  saveToExistingFile: (opts: { filePath: string; content: string | Buffer }) =>
    ipcRenderer.invoke('save-to-existing-file', opts),
  saveFile: (opts: { filePath: string; content: string | Buffer }) =>
    ipcRenderer.invoke('save-file', opts),

  // Compression and decompression handlers
  compressData: (opts: { data: string }) => ipcRenderer.invoke('compress-data', opts),
  decompressData: (opts: { data: string }) => ipcRenderer.invoke('decompress-data', opts)
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    console.log('Exposing quitApp in contextBridge')
    contextBridge.exposeInMainWorld('electron', {
      ...electronAPI,
      quitApp: () => ipcRenderer.invoke('quit-app'),
      confirmEmptyBin: (): Promise<boolean> => ipcRenderer.invoke('confirm-empty-bin'),
      confirmYesNo: (message: string): Promise<boolean> =>
        ipcRenderer.invoke('confirm-yes-no', message)
    })
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error('Error exposing APIs in contextBridge:', error)
  }
} else {
  console.log('Exposing quitApp directly on window object')
  // @ts-ignore (define in dts)
  window.electron = {
    ...electronAPI,
    quitApp: () => ipcRenderer.invoke('quit-app'),
    confirmEmptyBin: (): Promise<boolean> => ipcRenderer.invoke('confirm-empty-bin'),
    confirmYesNo: (message: string): Promise<boolean> =>
      ipcRenderer.invoke('confirm-yes-no', message)
  }
  // @ts-ignore (define in dts)
  window.api = api
}

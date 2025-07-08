import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Custom APIs for renderer
const api = {}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    console.log('Exposing quitApp in contextBridge')
    contextBridge.exposeInMainWorld('electron', {
      ...electronAPI,
      quitApp: () => ipcRenderer.invoke('quit-app')
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
    quitApp: () => ipcRenderer.invoke('quit-app')
  }
  // @ts-ignore (define in dts)
  window.api = api
}

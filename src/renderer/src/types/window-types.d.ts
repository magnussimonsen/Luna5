// This file adds custom types to the global Window interface
interface ElectronAPI {
  process: {
    versions: {
      electron: string
      chrome: string
      node: string
      [key: string]: string
    }
  }
  ipcRenderer: {
    send: (channel: string, ...args: unknown[]) => void
    // Add other ipcRenderer methods as needed
  }
  confirmYesNo?: (message: string) => Promise<boolean>
  quitApp?: (opts?: { isSaved?: boolean; isEffectivelyEmpty?: boolean }) => Promise<void>
}

interface AppAPI {
  // File saving and loading
  showSaveDialog: () => Promise<Electron.SaveDialogReturnValue>
  showOpenDialog: (options?: {
    properties: ('openFile' | 'openDirectory' | 'multiSelections')[]
  }) => Promise<Electron.OpenDialogReturnValue>
  readFile: (opts: { filePath: string }) => Promise<{
    success: boolean
    filePath?: string
    content?: string
    error?: string
    encoding?: string
  }>
  saveToExistingFile: (opts: {
    filePath: string
    content: string | Buffer
  }) => Promise<{ success: boolean; filePath?: string; error?: string }>
  saveFile: (opts: {
    filePath: string
    content: string | Buffer
  }) => Promise<{ success: boolean; filePath?: string; error?: string }>
  fileExists: (opts: { filePath: string }) => Promise<{ exists: boolean }>
  confirmUnsavedBeforeOpen: () => Promise<'save' | 'dont-save' | 'cancel'>

  // PDF export
  savePDF: (opts: { fileName?: string }) => Promise<{
    success: boolean
    filePath?: string
    error?: string
    canceled?: boolean
  }>

  // Compression and decompression
  compressData: (opts: { data: string }) => Promise<string>
  decompressData: (opts: { data: string }) => Promise<string>
}

declare global {
  interface Window {
    electron: ElectronAPI
    api: AppAPI
  }
}

export {}

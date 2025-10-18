import { ElectronAPI } from '@electron-toolkit/preload'

// Global declarations for the API objects exposed by the preload script.
declare global {
  interface Window {
    electron: ElectronAPI & {
      confirmEmptyBin: () => Promise<boolean>
      confirmYesNo: (message: string) => Promise<boolean>
      quitApp: (opts?: { isSaved?: boolean; isEffectivelyEmpty?: boolean }) => Promise<void>
    }
    api: {
      // File saving and loading
      showSaveDialog: () => Promise<Electron.SaveDialogReturnValue>
      showOpenDialog: (options?: {
        properties: string[]
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
      // Image picking
      pickImageFile: () => Promise<{
        canceled: boolean
        dataUri?: string
        size?: number
        mime?: string
        alt?: string
        error?: string
      }>
    }
  }
}

export {}

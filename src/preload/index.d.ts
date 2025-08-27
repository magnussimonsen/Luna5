import { ElectronAPI } from '@electron-toolkit/preload'

declare global {
  interface Window {
    electron: ElectronAPI & {
      confirmEmptyBin: () => Promise<boolean>
      confirmYesNo: (message: string) => Promise<boolean>
      quitApp: () => Promise<void>
    }
    api: {
      // File saving and loading
      showSaveDialog: () => Promise<Electron.SaveDialogReturnValue>
      showOpenDialog: () => Promise<Electron.OpenDialogReturnValue>
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

      // Compression and decompression
      compressData: (opts: { data: string }) => Promise<string>
      decompressData: (opts: { data: string }) => Promise<string>
    }
  }
}

export {}

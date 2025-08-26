import { ElectronAPI } from '@electron-toolkit/preload'

declare global {
  interface Window {
    electron: ElectronAPI & {
      confirmEmptyBin: () => Promise<boolean>
      confirmYesNo: (message: string) => Promise<boolean>
      quitApp: () => Promise<void>
    }
    api: unknown
  }
}

export {}

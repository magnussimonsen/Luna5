import { ElectronAPI } from '@electron-toolkit/preload'

declare global {
  interface Window {
    electron: ElectronAPI & {
      confirmEmptyBin: () => Promise<boolean>
      quitApp: () => Promise<void>
    }
    api: unknown
  }
}

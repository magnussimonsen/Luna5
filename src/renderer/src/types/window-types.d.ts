// filepath: C:\Users\magnus.simonsen\luna\luna\src\renderer\src\assets\types\window.d.ts
declare global {
  interface Window {
    electron: {
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
      quitApp?: () => Promise<void>
    }
  }
}
export {}

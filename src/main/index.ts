import { app, shell, BrowserWindow, ipcMain, dialog } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import { registerQuitAppHandler } from '../renderer/src/code/ipc-main-handle-functions/quitAppHandler'
import { registerConfirmEmptyBinHandler } from '../renderer/src/code/ipc-main-handle-functions/confirmEmptyBinHandler'
import { registerConfirmYesNoHandler } from '../renderer/src/code/ipc-main-handle-functions/show-confirm-yes-no-dialog'
import fs from 'fs'

function createWindow(): void {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // IPC test
  ipcMain.on('ping', () => console.log('pong'))

  // Register IPC handlers
  registerQuitAppHandler()
  registerConfirmEmptyBinHandler()
  registerConfirmYesNoHandler()

  // Show Save dialog (default: Desktop, .luna)
  ipcMain.handle('show-save-dialog', async () => {
    const desktopPath = app.getPath('desktop')
    const result = await dialog.showSaveDialog({
      title: 'Save Luna File',
      defaultPath: join(desktopPath, 'untitled.luna'),
      filters: [{ name: 'Luna Files', extensions: ['luna'] }],
      properties: ['createDirectory']
    })
    return result
  })

  // Save to an explicit file path
  ipcMain.handle(
    'save-to-existing-file',
    async (_event, opts: { filePath: string; content: string | Buffer }) => {
      try {
        let dataToWrite: string | Buffer
        if (typeof opts.content === 'string' && opts.content.match(/^[A-Za-z0-9+/=]+$/)) {
          // Try base64 decode first
          try {
            dataToWrite = Buffer.from(opts.content, 'base64')
          } catch {
            dataToWrite = opts.content
          }
        } else {
          dataToWrite = opts.content
        }

        await fs.promises.writeFile(opts.filePath, dataToWrite)
        return { success: true, filePath: opts.filePath }
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : String(error)
        return { success: false, error: message }
      }
    }
  )

  // Save using a chosen path
  ipcMain.handle(
    'save-file',
    async (_event, { filePath, content }: { filePath: string; content: string | Buffer }) => {
      try {
        let dataToWrite: string | Buffer
        if (typeof content === 'string' && content.match(/^[A-Za-z0-9+/=]+$/)) {
          try {
            dataToWrite = Buffer.from(content, 'base64')
          } catch {
            dataToWrite = content
          }
        } else {
          dataToWrite = content
        }

        await fs.promises.writeFile(filePath, dataToWrite)
        return { success: true, filePath }
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : String(error)
        return { success: false, error: message }
      }
    }
  )

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

// Electron "main" entry point. Runs in the main process (Node/Electron context).
// Responsibilities:
// - Create the BrowserWindow and load the renderer
// - Register IPC handlers used by the renderer (dialogs, file I/O, etc.)
// - Keep security-sensitive work (filesystem, dialogs) in main; expose via preload
import { app, shell, BrowserWindow, ipcMain, dialog, protocol } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import { registerQuitAppHandler } from '../renderer/src/code/ipc-main-handle-functions/quitAppHandler'
import { registerConfirmEmptyBinHandler } from '../renderer/src/code/ipc-main-handle-functions/confirmEmptyBinHandler'
import { registerConfirmYesNoHandler } from '../renderer/src/code/ipc-main-handle-functions/show-confirm-yes-no-dialog'
import { registerCompressDataHandler } from '../renderer/src/code/ipc-main-handle-functions/compress-data'
import { registerDecompressDataHandler } from '../renderer/src/code/ipc-main-handle-functions/decompress-data'
import fs from 'fs'

// Enable a custom protocol so the renderer and workers can fetch static assets in packaged builds.
// This avoids file:// fetch issues (fetch doesn't support file URLs) by serving from luna://
protocol.registerSchemesAsPrivileged([
  {
    scheme: 'luna',
    privileges: { standard: true, secure: true, supportFetchAPI: true, corsEnabled: true }
  }
])

function createWindow(): void {
  // Create the browser window (the UI lives in the renderer process).
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    title: 'Luna STEM Notebook',
    // Use our app icon on Linux and Windows (in dev, Windows may still show the EXE icon in taskbar)
    ...(process.platform === 'linux' || process.platform === 'win32' ? { icon } : {}),
    webPreferences: {
      // Preload runs in an isolated context; it exposes safe APIs on window.api/window.electron
      preload: join(__dirname, '../preload/index.js'),
      // Sandbox false here because we rely on preload and Node APIs in this template.
      // If you enable sandbox, ensure your preload does not depend on Node integration.
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

  // Dev vs. Prod loading:
  // - In dev, electron-vite starts a Vite server; we load its URL for HMR.
  // - In prod, load the built index.html bundled with the app.
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
  // Set the app name for desktop environments and menus
  try {
    app.setName('Luna')
  } catch {
    // ignore platforms where setName isn't applicable
  }

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // IPC test (example): renderer can send 'ping' and we log 'pong'.
  ipcMain.on('ping', () => console.log('pong'))

  // Register IPC handlers
  // These functions are imported from the renderer repo folder but execute here in main
  // so they can use Electron's main-process-only APIs (dialogs, fs, etc.).
  // Preload (src/preload/index.ts) exposes window.api.* methods that invoke these handlers.
  registerQuitAppHandler()
  registerConfirmEmptyBinHandler()
  registerConfirmYesNoHandler()
  registerCompressDataHandler()
  registerDecompressDataHandler()

  // Show Save dialog (default: Desktop, .luna)
  // Used by renderer via window.api.showSaveDialog().
  // defaultPath is set to the user's Desktop and filename 'untitled.luna'.
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

  // Show Open dialog (default: Desktop, .luna)
  // Renderer calls window.api.showOpenDialog(options?) to select a file (or directory with properties override).
  ipcMain.handle('show-open-dialog', async (_event, options) => {
    const desktopPath = app.getPath('desktop')

    // Default options
    const dialogOptions: Electron.OpenDialogOptions = {
      title: 'Open Luna File',
      defaultPath: desktopPath,
      // Only allow .luna files
      filters: [{ name: 'Luna Files', extensions: ['luna'] }],
      properties: ['openFile']
    }

    // Add user options if provided
    if (options && Array.isArray(options.properties)) {
      // TypeScript's type system ensures properties contains valid values at runtime
      dialogOptions.properties = options.properties
    }

    const result = await dialog.showOpenDialog(dialogOptions)
    return result
  })

  // Read file contents
  // Returns base64 string so we can safely move binary data across IPC to the renderer.
  ipcMain.handle('read-file', async (_event, { filePath }: { filePath: string }) => {
    try {
      const data = await fs.promises.readFile(filePath)
      // Convert binary data to base64 string for safe transport over IPC
      const base64Data = data.toString('base64')
      return {
        success: true,
        filePath,
        content: base64Data,
        encoding: 'base64' // Add encoding info so we know how to handle it
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error)
      return { success: false, error: message }
    }
  })

  // Save to an explicit file path
  // When the renderer already knows the target path and wants to overwrite it.
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
  // Typically used after a Save As dialog; writes new content to the provided path.
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

  // Check if a file path exists (used by Save to current file without prompting)
  ipcMain.handle('file-exists', async (_event, { filePath }: { filePath: string }) => {
    try {
      await fs.promises.access(filePath, fs.constants.F_OK)
      return { exists: true }
    } catch {
      return { exists: false }
    }
  })

  // Confirm before opening a new file when there are unsaved changes
  ipcMain.handle('confirm-unsaved-before-open', async () => {
    const result = await dialog.showMessageBox({
      type: 'warning',
      buttons: ['Save', "Don't Save", 'Cancel'],
      defaultId: 0,
      cancelId: 2,
      title: 'Unsaved changes',
      message: 'You have unsaved changes.',
      detail: 'Opening a different file will discard those changes. What would you like to do?'
    })
    if (result.response === 0) return 'save'
    if (result.response === 1) return 'dont-save'
    return 'cancel'
  })

  // Map luna:// URLs to files inside the packaged app (out/renderer/...)
  // Example: luna://pyodide/pyodide.js -> <app>/resources/app.asar/out/renderer/pyodide/pyodide.js
  protocol.registerFileProtocol('luna', (request, callback) => {
    try {
      const url = new URL(request.url)
      const decodedPath = decodeURIComponent(url.pathname).replace(/^\//, '') // drop leading '/'
      const rendererRoot = join(__dirname, '../renderer')
      // Include host as first path segment (e.g., luna://pyodide/pyodide.js -> <root>/pyodide/pyodide.js)
      const filePath = join(rendererRoot, url.host, decodedPath)
      callback({ path: filePath })
    } catch {
      // Fallback: fail gracefully
      callback({ error: -6 /* net::ERR_FILE_NOT_FOUND */ })
    }
  })

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

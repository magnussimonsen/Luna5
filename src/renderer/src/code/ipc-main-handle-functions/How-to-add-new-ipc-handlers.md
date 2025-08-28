# Adding New IPC Handlers

To add a new IPC handler, follow these steps:

## Step 1: Register the IPC Handler in `src/main/index.ts`
Add the function call to register your handler in the main process. For example:

```typescript
// Register IPC handlers
registerQuitAppHandler()
```

## Step 2: Expose the IPC Handler in `src/preload/index.ts`
Ensure the handler is exposed to the renderer process using `contextBridge`. For example:

```typescript
if (process.contextIsolated) {
  try {
    console.log('Exposing quitApp in contextBridge')
    contextBridge.exposeInMainWorld('electron', {
      ...electronAPI,
      quitApp: () => ipcRenderer.invoke('quit-app')
    })
  } catch (error) {
    console.error('Error exposing APIs in contextBridge:', error)
  }
}
```

## Step 3: Add Type Definitions in `src/renderer/src/types/window-types.d.ts`
Update the `Window` interface to include the new IPC handler. For example:

```typescript
declare global {
  interface Window {
    electron: {
      quitApp?: () => Promise<void>
      // Add other IPC handlers as needed
    }
  }
}
export {}
```

## Notes:
- Ensure the handler is properly registered in the main process before exposing it in the preload script.
- Use TypeScript for type safety and consistency.
- Follow the existing folder structure for modularity.
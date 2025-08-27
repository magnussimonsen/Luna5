# IPC Architecture in Luna5

This directory contains handlers for Inter-Process Communication (IPC) between the Electron main process and renderer process.

## Overview

In Electron applications, there are two types of processes:

1. **Main Process**: Has full Node.js capabilities, including file system access, OS-level operations, etc.
2. **Renderer Process**: Runs the UI and has limited access to Node.js APIs for security reasons

IPC allows these processes to communicate safely, enabling the renderer process to request operations that require main process privileges.

## How IPC Works in Luna5

### 1. Main Process Handlers (This Directory)

Files in this directory define IPC handlers that:
- Register listeners using `ipcMain.handle('channel-name', handler)`
- Implement functionality using Node.js APIs not available to the renderer
- Return results back to the renderer process

Example: `compress-data.ts` uses Node.js zlib (not available in renderer) to compress data.

### 2. Preload Script (`src/preload/index.ts`)

The preload script:
- Exposes a secure API to the renderer via `contextBridge.exposeInMainWorld()`
- Creates wrapper functions that invoke IPC channels
- Provides type definitions for these APIs

Example: `window.api.compressData()` is exposed to the renderer.

### 3. Renderer Utilities (`src/renderer/src/code/notebook-core/utils/`)

Utility files like `compression-utils.ts`:
- Provide clean abstractions over the raw IPC calls
- Handle errors and provide type safety
- Offer higher-level functions combining multiple operations

## Adding New IPC Handlers

To add a new IPC handler:

1. Create a new file in this directory following the naming pattern `feature-name.ts`
2. Implement and export a registration function like `registerFeatureNameHandler()`
3. Register your handler in `src/main/index.ts`
4. Expose the API in `src/preload/index.ts`
5. Add type definitions in `src/preload/index.d.ts`
6. (Optional) Create utility functions in `notebook-core/utils/`

## Security Considerations

- Never expose full Node.js capabilities to the renderer
- Validate all inputs from the renderer process
- Be careful with file paths and user input
- Use IPC channels with specific purposes rather than generic "run anything" channels

## Example Flow: Compression

1. Renderer calls: `compressionUtils.compressData(myString)`
2. This calls: `window.api.compressData({data: myString})`
3. Preload forwards to: `ipcRenderer.invoke('compress-data', {data: myString})`
4. Main process handler in `compress-data.ts` receives the request
5. Handler compresses data using Node.js zlib and returns base64 string
6. Result is passed back through the chain to the original caller

## Directory Contents

- `compress-data.ts`: Compression using zlib
- `decompress-data.ts`: Decompression using zlib
- `quitAppHandler.ts`: Application quit confirmation
- `confirmEmptyBinHandler.ts`: Confirmation dialog for emptying bin
- `show-confirm-yes-no-dialog.ts`: Generic yes/no confirmation dialog
- (Add other handlers as they're implemented)

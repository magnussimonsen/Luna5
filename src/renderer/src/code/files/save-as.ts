/**
 * Save As helper for the current workspace.
 *
 * This module provides a single function that:
 * 1) Reads the current workspace from the store
 * 2) Serializes and compresses it (keeps renderer pure — no fs access here)
 * 3) Opens the native Save dialog (via window.api from preload)
 * 4) Ensures a .luna extension
 * 5) Writes to disk through an IPC call handled in the main process
 * 6) Marks the workspace as saved with its file path
 *
 * Notes for developers:
 * - Use showSaveDialog (not showOpenDialog) for Save As, so users can type a new filename.
 * - File I/O happens in main; preload exposes window.api methods to the renderer.
 * - The compression utility encapsulates the chosen format/encoding for the payload.
 */
import { serializeAndCompress } from '@renderer/utils/core/compression-utils'
import { useWorkspaceStore } from '@renderer/stores/workspaces/workspaceStore'

/**
 * Result union for the Save As operation.
 * - success:true includes the final filePath written to disk
 * - success:false may carry an error message (canceled, validation, or write failure)
 */
export type SaveAsResult = { success: true; filePath: string } | { success: false; error?: string }

/**
 * Opens the native Save dialog, appends .luna if missing, saves compressed workspace, and marks as saved.
 * Behavior
 * - Uses preload's window.api to call into main for dialogs and filesystem access
 * - Always ensures the .luna extension for consistency
 * - On success, updates the store so subsequent Save writes without prompting
 */
export async function saveAsCurrentWorkspace(): Promise<SaveAsResult> {
  try {
    // 1) Gather data from the workspace store
    const workspaceStore = useWorkspaceStore()
    const workspaceData = workspaceStore.getWorkspace()

    // 2) Serialize and compress to minimize payload size and keep a consistent format
    const compressedData = await serializeAndCompress(workspaceData)

    // 3) Ask the user where to save via the native Save dialog (preload -> main IPC)
    const saveDialogResult = await window.api.showSaveDialog()
    if (saveDialogResult.canceled || !saveDialogResult.filePath) {
      // User canceled the dialog — not an error, just a no-op
      return { success: false }
    }

    // 4) Ensure we end with the expected .luna extension
    let selectedFilePath = saveDialogResult.filePath
    if (!selectedFilePath.toLowerCase().endsWith('.luna')) {
      selectedFilePath = `${selectedFilePath}.luna`
    }

    // 5) Write the compressed content to disk through IPC handled in main
    const saveResult = await window.api.saveFile({
      filePath: selectedFilePath,
      content: compressedData
    })
    if (saveResult.success && saveResult.filePath) {
      // 6) Update app state with the saved location for future Save (no prompt)
      workspaceStore.markAsSaved(saveResult.filePath)
      return { success: true, filePath: saveResult.filePath }
    }
    return { success: false, error: saveResult.error || 'Failed to save file' }
  } catch (err) {
    // Normalize error to a message string for the UI/logs
    const message = err instanceof Error ? err.message : String(err)
    return { success: false, error: message }
  }
}

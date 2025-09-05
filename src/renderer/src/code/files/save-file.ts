import { serializeAndCompress } from '@renderer/utils/core/compression-utils'
import { useWorkspaceStore } from '@renderer/stores/workspaces/workspaceStore'

/**
 * Result union for saving the current workspace.
 * - success:true returns the filePath written to
 * - success:false may include an error code/message
 */
export type SaveResult = { success: true; filePath: string } | { success: false; error?: string }

/**
 * Save (no prompt) to the current file path, if it exists.
 * Behavior
 * - If there's no current path or the file is missing, returns success:false (caller may fall back to Save As)
 * - On success, overwrites the file and updates store state to saved
 */
export async function trySaveToCurrentFile(): Promise<SaveResult> {
  const workspaceStore = useWorkspaceStore()
  const filePath = workspaceStore.currentFilePath
  if (!filePath) return { success: false, error: 'NO_PATH' }

  // Ensure the path currently exists; if not, caller should fall back to Save As
  const fileExistsResult = await window.api.fileExists({ filePath })
  if (!fileExistsResult?.exists) return { success: false, error: 'MISSING_PATH' }

  const workspaceData = workspaceStore.workspace
  const compressedData = await serializeAndCompress(workspaceData)
  const saveResult = await window.api.saveToExistingFile({
    filePath,
    content: compressedData
  })
  if (saveResult.success && saveResult.filePath) {
    workspaceStore.markAsSaved(saveResult.filePath)
    return { success: true, filePath: saveResult.filePath }
  }
  return { success: false, error: saveResult.error || 'Failed to save' }
}

/**
 * Save or Save As orchestration used by menu and (future) autosave.
 * - First tries a direct save to the current file path
 * - Falls back to Save As when there is no path or the file is missing
 */
export async function saveOrSaveAs(): Promise<SaveResult> {
  const directSaveResult = await trySaveToCurrentFile()
  if (directSaveResult.success) return directSaveResult
  // Import lazily to avoid cycles; Save As shows dialog and updates filePath
  const { saveAsCurrentWorkspace } = await import('./save-as')
  return saveAsCurrentWorkspace()
}

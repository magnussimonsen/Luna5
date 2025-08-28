import { serializeAndCompress } from '@renderer/code/notebook-core/utils/compression-utils'
import { useWorkspaceStore } from '@renderer/stores/workspaces/workspaceStore'

export type SaveResult = { success: true; filePath: string } | { success: false; error?: string }

/**
 * Try to save the workspace to the currentFilePath without prompting.
 * - Returns success:false when there is no currentFilePath or the file does not exist.
 * - On success, overwrites the existing file and updates saved state.
 */
export async function trySaveToCurrentFile(): Promise<SaveResult> {
  const workspaceStore = useWorkspaceStore()
  const filePath = workspaceStore.currentFilePath
  if (!filePath) return { success: false, error: 'NO_PATH' }

  // Ensure the path currently exists; if not, caller should fall back to Save As
  const exists = await window.api.fileExists({ filePath })
  if (!exists?.exists) return { success: false, error: 'MISSING_PATH' }

  const data = workspaceStore.workspace
  const compressed = await serializeAndCompress(data)
  const res = await window.api.saveToExistingFile({ filePath, content: compressed })
  if (res.success && res.filePath) {
    workspaceStore.markAsSaved(res.filePath)
    return { success: true, filePath: res.filePath }
  }
  return { success: false, error: res.error || 'Failed to save' }
}

/**
 * Save or Save As orchestration used by menu and future autosave.
 * - Attempts to save to current file path when available and existing.
 * - Falls back to Save As flow when no valid current path exists.
 */
export async function saveOrSaveAs(): Promise<SaveResult> {
  const direct = await trySaveToCurrentFile()
  if (direct.success) return direct
  // Import lazily to avoid cycles; Save As shows dialog and updates filePath
  const { saveAsCurrentWorkspace } = await import('./save-as')
  return saveAsCurrentWorkspace()
}

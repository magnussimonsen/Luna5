import { decompressAndDeserialize } from '@renderer/utils/core/compression-utils'
import type { Workspace } from '@renderer/code/notebook-core/model/schema'
import { useWorkspaceStore } from '@renderer/stores/workspaces/workspaceStore'
import { saveOrSaveAs, trySaveToCurrentFile } from './save-file'

export type OpenFileResult =
  | { success: true; filePath: string }
  | { success: false; error?: string }

/**
 * Open a .luna file using the native Open dialog, then read, decompress, and load the workspace.
 * Behavior
 * - Prompts to save when there are unsaved changes and the current workspace is not effectively empty
 * - Uses preload window.api to perform native dialogs and file I/O via the main process
 * - Replaces the entire workspace in the store and selects the first notebook
 */
export async function openWorkspaceFromDisk(): Promise<OpenFileResult> {
  try {
    // Helper: consider the workspace effectively empty if it has exactly one notebook,
    // no active (non-deleted) cells, and an empty recycle bin (no cells, no notebooks).
    const isEffectivelyEmpty = (maybeWorkspace: Workspace | null | undefined): boolean => {
      if (!maybeWorkspace) return true
      const notebookIds = Object.keys(maybeWorkspace.notebooks || {})
      if (notebookIds.length !== 1) return false
      const notebook = maybeWorkspace.notebooks[notebookIds[0]]
      if (!notebook) return false
      const hasActiveCells = (notebook.cellOrder || []).some((cellId) => {
        const cell = maybeWorkspace.cells?.[cellId]
        return cell && !cell.softDeleted && !cell.hardDeleted
      })
      if (hasActiveCells) return false
      const recycleBinHasCells = Object.keys(maybeWorkspace.recycleBin?.cells || {}).length > 0
      const recycleBinHasNotebooks =
        Object.keys(maybeWorkspace.recycleBin?.notebooks || {}).length > 0
      if (recycleBinHasCells || recycleBinHasNotebooks) return false
      return true
    }

    // 0) If there are unsaved changes and workspace is not effectively empty, ask the user what to do
    const workspaceStoreCheck = useWorkspaceStore()
    if (!workspaceStoreCheck.isSaved && !isEffectivelyEmpty(workspaceStoreCheck.workspace)) {
      const choice = await window.api.confirmUnsavedBeforeOpen()
      if (choice === 'cancel') return { success: false }
      if (choice === 'save') {
        const saveResult = await trySaveToCurrentFile()
        if (!saveResult.success) {
          // Fall back to Save As if no path yet
          const fallbackSaveResult = await saveOrSaveAs()
          if (!fallbackSaveResult.success)
            return { success: false, error: fallbackSaveResult.error || 'Save canceled' }
        }
      }
      // 'dont-save' continues
    }
    // 1) Ask for a .luna file
    const openDialogResult = await window.api.showOpenDialog({ properties: ['openFile'] })
    if (openDialogResult.canceled || !openDialogResult.filePaths?.length) {
      return { success: false }
    }
    const filePath = openDialogResult.filePaths[0]

    // 2) Read file content (base64 string)
    const readResult = await window.api.readFile({ filePath })
    if (!readResult.success || !readResult.content) {
      return { success: false, error: readResult.error || 'Failed to read file' }
    }

    // 3) Decompress and deserialize to Workspace
    const workspace = await decompressAndDeserialize<Workspace>(readResult.content)

    // 4) Replace current workspace in the store and mark as saved with the file path
    const workspaceStore = useWorkspaceStore()
    // Replace the entire workspace and mark as initialized/saved
    workspaceStore.workspace = workspace
    workspaceStore.initialized = true
    workspaceStore.markAsSaved(filePath)

    // 5) Auto-select the first notebook if available
    const notebookOrder = workspace.notebookOrder || Object.keys(workspace.notebooks || {})
    const firstNotebookId = notebookOrder[0]
    if (firstNotebookId && workspace.notebooks[firstNotebookId]) {
      workspaceStore.selectNotebook(firstNotebookId)
    }

    return { success: true, filePath }
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    return { success: false, error: message }
  }
}

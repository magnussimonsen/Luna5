import { decompressAndDeserialize } from '@renderer/utils/core/compression-utils'
import type { Workspace } from '@renderer/code/notebook-core/model/schema'
import { useWorkspaceStore } from '@renderer/stores/workspaces/workspaceStore'
import { saveOrSaveAs, trySaveToCurrentFile } from './save-file'

export type OpenFileResult =
  | { success: true; filePath: string }
  | { success: false; error?: string }

/**
 * Open a .luna file using the native Open dialog, then read, decompress, and load the workspace.
 */
export async function openWorkspaceFromDisk(): Promise<OpenFileResult> {
  try {
    // Helper: consider the workspace effectively empty if it has exactly one notebook,
    // no active (non-deleted) cells, and an empty recycle bin (no cells, no notebooks).
    const isEffectivelyEmpty = (ws: Workspace | null | undefined): boolean => {
      if (!ws) return true
      const notebookIds = Object.keys(ws.notebooks || {})
      if (notebookIds.length !== 1) return false
      const nb = ws.notebooks[notebookIds[0]]
      if (!nb) return false
      const hasActiveCells = (nb.cellOrder || []).some((cid) => {
        const c = ws.cells?.[cid]
        return c && !c.softDeleted && !c.hardDeleted
      })
      if (hasActiveCells) return false
      const binHasCells = Object.keys(ws.recycleBin?.cells || {}).length > 0
      const binHasNotebooks = Object.keys(ws.recycleBin?.notebooks || {}).length > 0
      if (binHasCells || binHasNotebooks) return false
      return true
    }

    // 0) If there are unsaved changes and workspace is not effectively empty, ask the user what to do
    const storeCheck = useWorkspaceStore()
    if (!storeCheck.isSaved && !isEffectivelyEmpty(storeCheck.workspace)) {
      const choice = await window.api.confirmUnsavedBeforeOpen()
      if (choice === 'cancel') return { success: false }
      if (choice === 'save') {
        const res = await trySaveToCurrentFile()
        if (!res.success) {
          // Fall back to Save As if no path yet
          const alt = await saveOrSaveAs()
          if (!alt.success) return { success: false, error: alt.error || 'Save canceled' }
        }
      }
      // 'dont-save' continues
    }
    // 1) Ask for a .luna file
    const dlg = await window.api.showOpenDialog({ properties: ['openFile'] })
    if (dlg.canceled || !dlg.filePaths?.length) {
      return { success: false }
    }
    const filePath = dlg.filePaths[0]

    // 2) Read file content (base64 string)
    const read = await window.api.readFile({ filePath })
    if (!read.success || !read.content) {
      return { success: false, error: read.error || 'Failed to read file' }
    }

    // 3) Decompress and deserialize to Workspace
    const workspace = await decompressAndDeserialize<Workspace>(read.content)

    // 4) Replace current workspace in the store and mark as saved with the file path
    const store = useWorkspaceStore()
    // Replace the entire workspace and mark as initialized/saved
    store.workspace = workspace
    store.initialized = true
    store.markAsSaved(filePath)

    // 5) Auto-select the first notebook if available
    const order = workspace.notebookOrder || Object.keys(workspace.notebooks || {})
    const firstId = order[0]
    if (firstId && workspace.notebooks[firstId]) {
      store.selectNotebook(firstId)
    }

    return { success: true, filePath }
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    return { success: false, error: message }
  }
}

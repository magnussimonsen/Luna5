import type { Workspace } from '@renderer/code/notebook-core/model/schema'
import { useWorkspaceStore } from '@renderer/stores/workspaces/workspaceStore'
import { saveOrSaveAs, trySaveToCurrentFile } from './save-file'
import { saveAsCurrentWorkspace } from './save-as'

export type NewFileResult =
  | { success: true }
  | { success: false; error?: string; canceled?: boolean }

// Determine if the current workspace is effectively empty (skip warning in this case)
function isEffectivelyEmpty(ws: Workspace | null | undefined): boolean {
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

/**
 * Create a fresh workspace.
 * Workflow:
 * - If there are unsaved changes and the current workspace is not effectively empty, ask user: Save / Don't Save / Cancel
 *   - Save: try save current file, if missing path then Save As
 *   - Don't Save: continue
 *   - Cancel: abort
 * - Initialize a fresh workspace, ensure a default notebook exists
 * - Prompt Save As immediately so the new workspace gets a path (user may cancel)
 */
export async function createNewWorkspaceWithPrompt(): Promise<NewFileResult> {
  const store = useWorkspaceStore()

  try {
    if (!store.isSaved && !isEffectivelyEmpty(store.workspace)) {
      const choice = await window.api.confirmUnsavedBeforeOpen()
      if (choice === 'cancel') return { success: false, canceled: true }
      if (choice === 'save') {
        const res = await trySaveToCurrentFile()
        if (!res.success) {
          const alt = await saveOrSaveAs()
          if (!alt.success)
            return { success: false, error: alt.error || 'Save canceled', canceled: true }
        }
      }
      // 'dont-save' continues
    }

    // Initialize a new empty workspace and ensure one default notebook exists
    store.initEmpty(true)
    store.ensureDefaultNotebook()

    // Immediately prompt to Save As for the new workspace (optional; user may cancel)
    await saveAsCurrentWorkspace()
    return { success: true }
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    return { success: false, error: message }
  }
}

import type { Workspace } from '@renderer/code/notebook-core/model/schema'
import { useWorkspaceStore } from '@renderer/stores/workspaces/workspaceStore'
import { saveOrSaveAs, trySaveToCurrentFile } from './save-file'
import { saveAsCurrentWorkspace } from './save-as'

/**
 * Result union for creating a new workspace.
 * - success:true: new workspace initialized (user may or may not have saved it yet)
 * - success:false: includes optional error message and canceled flag when user aborts
 */
export type NewFileResult =
  | { success: true }
  | { success: false; error?: string; canceled?: boolean }

// Determine if the current workspace is effectively empty (skip unsaved warning in this case).
function isEffectivelyEmpty(currentWorkspace: Workspace | null | undefined): boolean {
  if (!currentWorkspace) return true
  const notebookIds = Object.keys(currentWorkspace.notebooks || {})
  if (notebookIds.length !== 1) return false
  const onlyNotebook = currentWorkspace.notebooks[notebookIds[0]]
  if (!onlyNotebook) return false
  const hasActiveCells = (onlyNotebook.cellOrder || []).some((cellId) => {
    const cell = currentWorkspace.cells?.[cellId]
    return cell && !cell.softDeleted && !cell.hardDeleted
  })
  if (hasActiveCells) return false
  const recycleBinHasCells = Object.keys(currentWorkspace.recycleBin?.cells || {}).length > 0
  const recycleBinHasNotebooks =
    Object.keys(currentWorkspace.recycleBin?.notebooks || {}).length > 0
  if (recycleBinHasCells || recycleBinHasNotebooks) return false
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
  const workspaceStore = useWorkspaceStore()

  try {
    if (!workspaceStore.isSaved && !isEffectivelyEmpty(workspaceStore.workspace)) {
      const choice = await window.api.confirmUnsavedBeforeOpen()
      if (choice === 'cancel') return { success: false, canceled: true }
      if (choice === 'save') {
        const saveResult = await trySaveToCurrentFile()
        if (!saveResult.success) {
          const fallbackSaveResult = await saveOrSaveAs()
          if (!fallbackSaveResult.success)
            return {
              success: false,
              error: fallbackSaveResult.error || 'Save canceled',
              canceled: true
            }
        }
      }
      // 'dont-save' continues
    }

    // Initialize a new empty workspace and ensure one default notebook exists
    workspaceStore.initEmpty(true)
    workspaceStore.ensureDefaultNotebook()

    // Immediately prompt to Save As for the new workspace (optional; user may cancel)
    await saveAsCurrentWorkspace()
    return { success: true }
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    return { success: false, error: message }
  }
}

import type { Workspace, Notebook } from '../../model/schema'
import { recalculateNotebookCellIndexes } from './add-cell-to-notebook'

/**
 * Restore a soft-deleted notebook from the recycle bin.
 * Restores notebook with the same id and title, and re-attaches its cells.
 * Cells are appended in the order of their original indices.
 * Returns the restored notebook id, or null if not found.
 */
export function restoreNotebookFromBin(workspace: Workspace, notebookId: string): string | null {
  const nbMeta = workspace.recycleBin.notebooks[notebookId]
  if (!nbMeta) return null

  // Recreate notebook with same id and title
  const notebook: Notebook = { id: notebookId, title: nbMeta.title, cellOrder: [] }
  workspace.notebooks[notebookId] = notebook
  if (!Array.isArray(workspace.notebookOrder)) workspace.notebookOrder = []
  // Append to the end per restore semantics
  workspace.notebookOrder.push(notebookId)

  // Collect and attach cells for this notebook, ordered by original index
  const entries = Object.values(workspace.recycleBin.cells)
    .filter((e) => e.notebookId === notebookId)
    .sort((a, b) => a.originalIndex - b.originalIndex)

  for (const e of entries) {
    if (workspace.cells[e.id]) {
      notebook.cellOrder.push(e.id)
    }
    // Remove cell from recycle bin
    delete workspace.recycleBin.cells[e.id]
    const cIdx = workspace.recycleBin.cellOrder.indexOf(e.id)
    if (cIdx !== -1) workspace.recycleBin.cellOrder.splice(cIdx, 1)
  }

  // Remove notebook entry from recycle bin
  delete workspace.recycleBin.notebooks[notebookId]
  const nIdx = workspace.recycleBin.notebookOrder.indexOf(notebookId)
  if (nIdx !== -1) workspace.recycleBin.notebookOrder.splice(nIdx, 1)

  recalculateNotebookCellIndexes(workspace, notebookId)
  return notebookId
}

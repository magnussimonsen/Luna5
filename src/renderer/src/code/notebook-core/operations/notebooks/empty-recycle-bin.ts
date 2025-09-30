import type { Workspace } from '../../model/schema'
import { recalculateNotebookCellIndexes } from './add-cell-to-notebook'

/**
 * Permanently clears the recycle bin by hard-deleting:
 * - Notebooks currently in the bin (and their cells)
 * - Cells soft-deleted from active notebooks
 * After this, no soft-deleted cells remain and all recycle bin metadata is cleared.
 */
export function emptyRecycleBin(workspace: Workspace): void {
  const rb = workspace.recycleBin
  const affectedNotebookIds = new Set<string>()

  // 1) Hard delete notebooks that are in the recycle bin
  for (const nbId of [...rb.notebookOrder]) {
    // Delete cells that belong to this notebook (from workspace.cells)
    const cellEntries = Object.values(rb.cells).filter((c) => c.notebookId === nbId)
    for (const entry of cellEntries) {
      // Remove actual cell object
      delete workspace.cells[entry.id]
      // Remove cell entry from recycle bin maps/orders
      delete rb.cells[entry.id]
      const cIdx = rb.cellOrder.indexOf(entry.id)
      if (cIdx !== -1) rb.cellOrder.splice(cIdx, 1)
    }
    // Finally remove the notebook (if still present for safety)
    delete workspace.notebooks[nbId]
    const nIdxActive = workspace.notebookOrder.indexOf(nbId)
    if (nIdxActive !== -1) workspace.notebookOrder.splice(nIdxActive, 1)
    // Remove from recycle bin notebooks
    delete rb.notebooks[nbId]
    const nIdx = rb.notebookOrder.indexOf(nbId)
    if (nIdx !== -1) rb.notebookOrder.splice(nIdx, 1)
  }

  // 2) Hard delete soft-deleted cells from active notebooks
  for (const cellId of [...rb.cellOrder]) {
    const meta = rb.cells[cellId]
    if (!meta) continue
    const notebook = workspace.notebooks[meta.notebookId]
    if (notebook) {
      // Remove from notebook order if present
      const idx = notebook.cellOrder.indexOf(cellId)
      if (idx !== -1) notebook.cellOrder.splice(idx, 1)
      affectedNotebookIds.add(meta.notebookId)
    }
    // Remove the actual cell
    delete workspace.cells[cellId]
    // Remove recycle bin metadata
    delete rb.cells[cellId]
    const cIdx = rb.cellOrder.indexOf(cellId)
    if (cIdx !== -1) rb.cellOrder.splice(cIdx, 1)
  }

  // Ensure structures are empty
  rb.cells = {}
  rb.notebooks = {}
  rb.cellOrder = []
  rb.notebookOrder = []

  for (const notebookId of affectedNotebookIds) {
    recalculateNotebookCellIndexes(workspace, notebookId)
  }
}

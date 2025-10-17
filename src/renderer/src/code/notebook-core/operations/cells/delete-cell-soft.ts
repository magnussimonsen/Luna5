import type { Workspace } from '../../model/schema'

/**
 * Soft-delete a cell: mark it as softDeleted and record its original index and deletion time
 * in the workspace.recycleBin.cells map for the given notebook.
 */
export function deleteCellSoft(workspace: Workspace, notebookId: string, cellId: string): boolean {
  const notebook = workspace.notebooks[notebookId]
  const cell = workspace.cells[cellId]
  if (!notebook || !cell) return false
  // Do not allow soft-delete when locked or hidden
  if (cell.softLocked || cell.hardLocked || cell.hidden) return false

  const idx = notebook.cellOrder.indexOf(cellId)
  if (idx === -1) return false

  const deletedAt = new Date().toISOString()

  // Flag the cell
  cell.softDeleted = true

  // Store original index once and record timestamp in recycle bin
  const already = workspace.recycleBin.cells[cellId]
  if (!already) {
    workspace.recycleBin.cells[cellId] = {
      id: cellId,
      notebookId,
      originalIndex: idx,
      deletedAt
    }
    // Most recent first
    workspace.recycleBin.cellOrder.unshift(cellId)
  } else {
    workspace.recycleBin.cells[cellId].deletedAt = deletedAt
  }

  return true
}

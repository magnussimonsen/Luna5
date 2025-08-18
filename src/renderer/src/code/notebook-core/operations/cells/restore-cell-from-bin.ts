/* eslint-disable prettier/prettier */
import type { Workspace } from '../../model/schema'

/**
 * Restore a soft-deleted cell for an active notebook.
 * - Unsets cell.softDeleted
 * - Removes recycleBin metadata and order entry
 * Returns true on success.
 */
export function restoreCellFromBin(
  workspace: Workspace,
  notebookId: string,
  cellId: string
): boolean {
  const cell = workspace.cells[cellId]
  const notebook = workspace.notebooks[notebookId]
  if (!cell || !notebook) return false
  const meta = workspace.recycleBin.cells[cellId]
  if (!meta || meta.notebookId !== notebookId) return false

  // Unset soft-deleted flag
  if (cell.softDeleted) cell.softDeleted = false

  // Remove from recycle bin maps
  delete workspace.recycleBin.cells[cellId]
  const idx = workspace.recycleBin.cellOrder.indexOf(cellId)
  if (idx !== -1) workspace.recycleBin.cellOrder.splice(idx, 1)

  // Note: notebook.cellOrder retains the id; we filtered it out while soft-deleted.
  return true
}

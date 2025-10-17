/* eslint-disable prettier/prettier */
import type { Workspace } from '../../model/schema'

/**
 * Hard-delete a cell: permanently remove it from the workspace and notebook.
 * The cell is completely removed and never goes to the recycle bin.
 * This is typically used for special cell types like page breaks.
 */
export function deleteCellHard(workspace: Workspace, notebookId: string, cellId: string): boolean {
  const notebook = workspace.notebooks[notebookId]
  const cell = workspace.cells[cellId]
  if (!notebook || !cell) return false

  const idx = notebook.cellOrder.indexOf(cellId)
  if (idx === -1) return false

  // Remove from notebook order
  notebook.cellOrder.splice(idx, 1)
  
  // Permanently delete from workspace
  delete workspace.cells[cellId]

  return true
}

/* eslint-disable prettier/prettier */
import type { Workspace } from '../../model/schema'
import { recalculateNotebookCellIndexes } from '../notebooks/add-cell-to-notebook'

/**
 * Move a cell ID one position up within the specified notebook's cellOrder.
 * - No-op if the notebook or cell is missing, or if the cell is already first.
 * - Returns true if a move occurred, false otherwise.
 */
export function moveCellIdUp(
  workspace: Workspace,
  notebookId: string,
  cellId: string
): boolean {
  console.log('[moveCellIdUp] called', { notebookId, cellId })
  const notebook = workspace.notebooks[notebookId]
  if (!notebook) return false
  const order = notebook.cellOrder
  if (!order || order.length < 2) return false
  const idx = order.indexOf(cellId)
  if (idx <= 0) return false
  // swap with previous
  ;[order[idx - 1], order[idx]] = [order[idx], order[idx - 1]]
  console.log('[moveCellIdUp] moved', { notebookId, cellId, newOrder: order.slice() })
  recalculateNotebookCellIndexes(workspace, notebookId)
  return true
}


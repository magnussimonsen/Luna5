/* eslint-disable prettier/prettier */
import type { Workspace } from '../../model/schema'

/**
 * Move a cell ID one position down within the specified notebook's cellOrder.
 * - No-op if the notebook or cell is missing, or if the cell is already last.
 * - Returns true if a move occurred, false otherwise.
 */
export function moveCellIdDown(
	workspace: Workspace,
	notebookId: string,
	cellId: string
): boolean {
    console.log('[moveCellIdDown] called', { notebookId, cellId })
	const notebook = workspace.notebooks[notebookId]
	if (!notebook) return false
	const order = notebook.cellOrder
	if (!order || order.length < 2) return false
	const idx = order.indexOf(cellId)
	if (idx === -1 || idx >= order.length - 1) return false
	// swap with next
	;[order[idx], order[idx + 1]] = [order[idx + 1], order[idx]]

	console.log('[moveCellIdDown] moved', { notebookId, cellId, newOrder: order.slice() })
	return true
}


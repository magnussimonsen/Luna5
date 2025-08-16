/* eslint-disable prettier/prettier */
import type { Workspace } from '../../model/schema'

/** Move a notebook one position up in workspace.notebookOrder. */
export function moveNotebookIdUp(workspace: Workspace, notebookId: string): boolean {
	const order = workspace.notebookOrder
	if (!order || order.length < 2) return false
	const idx = order.indexOf(notebookId)
	if (idx <= 0) return false
	;[order[idx - 1], order[idx]] = [order[idx], order[idx - 1]]
	return true
}

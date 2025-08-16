/* eslint-disable prettier/prettier */
import type { Workspace } from '../../model/schema'

/** Move a notebook one position down in workspace.notebookOrder. */
export function moveNotebookIdDown(workspace: Workspace, notebookId: string): boolean {
	const order = workspace.notebookOrder
	if (!order || order.length < 2) return false
	const idx = order.indexOf(notebookId)
	if (idx === -1 || idx >= order.length - 1) return false
	;[order[idx], order[idx + 1]] = [order[idx + 1], order[idx]]
	return true
}

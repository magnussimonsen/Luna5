/* eslint-disable prettier/prettier */
import type { Workspace } from '../../model/schema'

/** Rename an existing notebook. Returns true on success. */
export function renameNotebook(workspace: Workspace, notebookId: string, newTitle: string): boolean {
	const nb = workspace.notebooks[notebookId]
	if (!nb) return false
	const title = String(newTitle ?? '').trim()
	if (!title || title === nb.title) return false
	nb.title = title
	return true
}

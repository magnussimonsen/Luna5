/* eslint-disable prettier/prettier */
import type { Workspace } from '../../model/schema'

/** Rename an existing notebook. Returns true on success. */
export function renameNotebook(workspace: Workspace, notebookId: string, newTitle: string): boolean {
	const notebook = workspace.notebooks[notebookId]
	if (!notebook) return false
	const title = String(newTitle ?? '').trim()
	if (!title || title === notebook.title) return false
	notebook.title = title
	return true
}

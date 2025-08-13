import { defineStore } from 'pinia'
import { createEmptyWorkspace } from '@renderer/code/notebook-core/model/workspace-initial'
import type { Workspace } from '@renderer/code/notebook-core/model/schema'
import type { TextCell } from '@renderer/types/notebook-cell-types'
import { useCellSelectionStore } from '@renderer/stores/toolbar_cell_communication/cellSelectionStore'
import { uuid } from '@renderer/code/notebook-core/utils/id-utils'
import {
  createNotebook as operationsCreateNotebook,
  createTextCell as operationsCreateTextCell,
  addCellToNotebook as operationsAddCellToNotebook,
  deleteNotebookSoft as operationsDeleteNotebookSoft
} from '@renderer/code/notebook-core/operations'
import { setCellContent as operationsSetCellBaseInputContent } from '@renderer/code/notebook-core/operations/cells/set-cell-content'

interface WorkspaceState {
  workspace: Workspace | null
  initialized: boolean
  currentNotebookId: string | null
}

/** EXPLANATION
 * The workspace interface is defined in the schema.ts
   export interface Workspace {
   version: 1 (not used)
   notebooks: Record<string notebook ID, Notebook> (Notebook is a Record with array of cell-Ids in the notebook + other metadata)
   cells: Record<string, Cell> (Cell is a Record<cell Id, Cell-object with cell content + metadata>)
   recycleBin: RecycleBin
 }
 */

export const useWorkspaceStore = defineStore('workspace', {
  state: (): WorkspaceState => ({
    // In a pinia store the states are reactive and can be accessed
    // in components via the getter methods
    workspace: null,
    initialized: false,
    currentNotebookId: null
  }),
  getters: {
    currentNotebook: (s): import('@renderer/code/notebook-core/model/schema').Notebook | null => {
      if (!s.currentNotebookId || !s.workspace) return null
      return s.workspace.notebooks[s.currentNotebookId] || null
    },
    notebookList: (s): import('@renderer/code/notebook-core/model/schema').Notebook[] => {
      return s.workspace ? Object.values(s.workspace.notebooks) : []
    }
  },
  actions: {
    initEmpty(force = false): Workspace {
      if (!this.initialized || force) {
        this.workspace = createEmptyWorkspace()
        this.initialized = true
      }
      return this.workspace!
    },
    reset(): Workspace {
      this.workspace = createEmptyWorkspace()
      this.initialized = false
      return this.workspace
    },
    getWorkspace(): Workspace {
      if (!this.initialized || !this.workspace) {
        return this.initEmpty()
      }
      return this.workspace
    },
    ensureDefaultNotebook(): string {
      const workspace = this.getWorkspace()
      const existing = Object.keys(workspace.notebooks)
      if (existing.length) {
        if (!this.currentNotebookId || !workspace.notebooks[this.currentNotebookId]) {
          this.currentNotebookId = existing[0]
        }
        return this.currentNotebookId
      }
      const nbId = uuid()
      workspace.notebooks[nbId] = { id: nbId, title: 'Notebook 1', cellOrder: [] }
      this.currentNotebookId = nbId
      return nbId
    },
    createNotebook(title = 'New Notebook'): string {
      const workspace = this.getWorkspace()
      const nb = operationsCreateNotebook(workspace, title)
      this.currentNotebookId = nb.id
      return nb.id
    },
    deleteNotebook(id: string): void {
      const workspace = this.getWorkspace()
      const { nextNotebookId } = operationsDeleteNotebookSoft(workspace, id)
      if (this.currentNotebookId === id) {
        this.currentNotebookId = nextNotebookId
        try {
          const sel = useCellSelectionStore()
          sel.clearSelection()
        } catch {
          /* ignore */
        }
      }
    },
    selectNotebook(id: string): void {
      const workspace = this.getWorkspace()
      if (workspace.notebooks[id]) {
        this.currentNotebookId = id
        try {
          const sel = useCellSelectionStore()
          sel.clearSelection()
        } catch {
          /* ignore */
        }
      }
    },
    addTextCell(content = 'function: addTextCell in workspaceStore.ts'): TextCell {
      const workspace = this.getWorkspace()
      const notebookId = this.ensureDefaultNotebook()
      const newCell = operationsCreateTextCell(content)
      operationsSetCellBaseInputContent(newCell, 'Cell ID (dev mode): ' + newCell.id)
      operationsAddCellToNotebook(workspace, notebookId, newCell)
      try {
        // Set the selected cell to newCell
        const selectedCellStore = useCellSelectionStore()
        selectedCellStore.selectCell(newCell.id, 'text-cell')
      } catch {
        /* ignore */
      }
      return newCell
    }
  }
})

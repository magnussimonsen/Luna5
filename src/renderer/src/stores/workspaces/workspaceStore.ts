import { defineStore } from 'pinia'
import { createEmptyWorkspace } from '@renderer/code/notebook-core/model/workspace-initial'
import type { Workspace } from '@renderer/code/notebook-core/model/schema'
import type { TextCell } from '@renderer/types/notebook-cell-types'
import { useCellSelectionStore } from '@renderer/stores/toolbar_cell_communication/cellSelectionStore'
import { uuid } from '@renderer/code/notebook-core/utils/id-utils'

interface State {
  workspace: Workspace | null
  initialized: boolean
  currentNotebookId: string | null
}

export const useWorkspaceStore = defineStore('workspace', {
  state: (): State => ({
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
      const ws = this.getWorkspace()
      const existing = Object.keys(ws.notebooks)
      if (existing.length) {
        if (!this.currentNotebookId || !ws.notebooks[this.currentNotebookId]) {
          this.currentNotebookId = existing[0]
        }
        return this.currentNotebookId
      }
      const nbId = uuid()
      ws.notebooks[nbId] = { id: nbId, title: 'Notebook 1', cellOrder: [] }
      this.currentNotebookId = nbId
      return nbId
    },
    createNotebook(title = 'New Notebook'): string {
      const ws = this.getWorkspace()
      const id = uuid()
      ws.notebooks[id] = { id, title, cellOrder: [] }
      this.currentNotebookId = id
      return id
    },
    deleteNotebook(id: string): void {
      const ws = this.getWorkspace()
      const nb = ws.notebooks[id]
      if (!nb) return
      const deletedAt = new Date().toISOString()
      // Move notebook meta into recycle bin
      ws.recycleBin.notebooks[id] = { id, title: nb.title, deletedAt }
      ws.recycleBin.notebookOrder.unshift(id)
      // Record each cell position for potential future restore (cells kept in ws.cells for now)
      nb.cellOrder.forEach((cellId, index) => {
        if (!ws.recycleBin.cells[cellId]) {
          ws.recycleBin.cells[cellId] = {
            id: cellId,
            notebookId: id,
            originalIndex: index,
            deletedAt
          }
          ws.recycleBin.cellOrder.unshift(cellId)
        }
      })
      // Remove notebook from active list
      delete ws.notebooks[id]
      // Adjust current selection if needed
      if (this.currentNotebookId === id) {
        const remaining = Object.keys(ws.notebooks)
        this.currentNotebookId = remaining.length ? remaining[0] : null
        if (!this.currentNotebookId && remaining.length === 0) {
          // Optionally auto-create a fresh notebook later via ensureDefaultNotebook when needed
        }
        try {
          const sel = useCellSelectionStore()
          sel.clearSelection()
        } catch {
          /* ignore */
        }
      }
    },
    selectNotebook(id: string): void {
      const ws = this.getWorkspace()
      if (ws.notebooks[id]) {
        this.currentNotebookId = id
        try {
          const sel = useCellSelectionStore()
          sel.clearSelection()
        } catch {
          /* ignore */
        }
      }
    },
    addTextCell(content = 'This is a test text cell'): TextCell {
      const ws = this.getWorkspace()
      const notebookId = this.ensureDefaultNotebook()
      const notebook = ws.notebooks[notebookId]
      const id = uuid()
      const now = new Date().toISOString()
      const cell: TextCell = {
        id,
        kind: 'text',
        source: content,
        createdAt: now,
        updatedAt: now
      }
      ws.cells[id] = cell
      notebook.cellOrder.push(id)
      // Auto-select the new cell for immediate user feedback
      try {
        const sel = useCellSelectionStore()
        sel.selectCell(id, 'text')
      } catch {
        // store might not be ready in some edge bootstrap cases; ignore
      }
      return cell
    }
  }
})

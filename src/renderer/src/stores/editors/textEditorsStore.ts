import { defineStore } from 'pinia'
import type { Editor } from '@tiptap/vue-3'

/**
 * Central registry of active Tiptap editor instances keyed by their cell id.
 * The toolbar (which is mounted outside the cell component tree) queries this
 * store to get the currently selected cell's editor. This avoids brittle
 * provide/inject chains and keeps a single source of truth.
 */
interface TextEditorsState {
  /** Map of cellId -> Tiptap Editor instance */
  editors: Record<string, Editor>
}

export const useTextEditorsStore = defineStore('textEditors', {
  state: (): TextEditorsState => ({
    editors: {}
  }),
  actions: {
    /**
     * Register an editor so that external UI (toolbars) can access it.
     */
    registerEditorForCell(cellId: string, tiptapEditor: Editor): void {
      this.editors[cellId] = tiptapEditor
    },
    /**
     * Remove the editor reference when a cell is unmounted/destroyed.
     */
    unregisterEditorForCell(cellId: string): void {
      if (this.editors[cellId]) delete this.editors[cellId]
    },
    /**
     * Fetch an editor by cell id. Returns null if not present or id missing.
     */
    getEditorByCellId(cellId: string | null | undefined): Editor | null {
      if (!cellId) return null
      return this.editors[cellId] || null
    }
  }
})

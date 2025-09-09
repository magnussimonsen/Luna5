import { defineStore } from 'pinia'
import type { Editor } from '@tiptap/vue-3'

interface TextEditorsState {
  editors: Record<string, Editor>
}

export const useTextEditorsStore = defineStore('textEditors', {
  state: (): TextEditorsState => ({
    editors: {}
  }),
  actions: {
    register(cellId: string, editor: Editor) {
      this.editors[cellId] = editor
    },
    unregister(cellId: string) {
      if (this.editors[cellId]) delete this.editors[cellId]
    },
    getEditor(cellId: string | null | undefined): Editor | null {
      if (!cellId) return null
      return this.editors[cellId] || null
    }
  }
})

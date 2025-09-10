import { Editor } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import type { Transaction } from 'prosemirror-state'

/**
 * Creates a configured TipTap editor instance for a text cell.
 * @param {Object} options - Editor options
 * @param {boolean} options.editable - Whether the editor is editable
 * @param {string} options.content - Initial HTML content
 * @param {Function} options.onUpdate - Callback for editor updates
 * @returns {Editor} TipTap editor instance
 */
export function createTiptapEditor(options: {
  editable: boolean
  content: string
  onUpdate: (props: { editor: unknown; transaction: Transaction }) => void
}): Editor {
  const { editable, content, onUpdate } = options
  return new Editor({
    editable,
    content,
    extensions: [
      StarterKit.configure({}),
      Placeholder.configure({ placeholder: 'Rich text (Markdown-like) — start typing…' })
    ],
    onUpdate
  })
}

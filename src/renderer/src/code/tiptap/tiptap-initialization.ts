// src\renderer\src\types\tiptap-types.d.ts
import { Editor } from '@tiptap/vue-3'
import type { Editor as CoreEditor } from '@tiptap/core'
import StarterKit from '@tiptap/starter-kit'
import type { TiptapDocumentConfig } from '@renderer/types/tiptap-types'
import type { Extension } from '@tiptap/core'
import Placeholder from '@tiptap/extension-placeholder'
import { Table } from '@tiptap/extension-table'
import TableRow from '@tiptap/extension-table-row'
import TableHeader from '@tiptap/extension-table-header'
import TableCell from '@tiptap/extension-table-cell'
import Subscript from '@tiptap/extension-subscript'
import Superscript from '@tiptap/extension-superscript'
import Highlight from '@tiptap/extension-highlight'
import Link from '@tiptap/extension-link'
// Subscript/superscript are optional
// Math (custom) - dynamically imported or added when dependency installed
import type { Transaction } from 'prosemirror-state'

// Precise Editor type coming from the Vue wrapper. Use InstanceType to
// capture the actual runtime instance type exported by @tiptap/vue-3.
export type VueTiptapEditor = InstanceType<typeof import('@tiptap/vue-3').Editor>

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
  onUpdate?: (props: {
    editor: VueTiptapEditor
    transaction: Transaction
    appendedTransactions?: Transaction[]
  }) => void
}): VueTiptapEditor {
  const { editable, content, onUpdate } = options
  return new Editor({
    editable,
    content,
    extensions: [
      StarterKit.configure({
        // @ts-expect-error TipTap types do not allow document config, but it works at runtime
        document: { content: 'block*' } as TiptapDocumentConfig,
        trailingNode: {
          node: 'paragraph',
          notAfter: ['heading']
        }
      }) as unknown as Extension,
      Placeholder.configure({ placeholder: 'Rich text (Markdown-like) — start typing…' }),
      // Enable the built-in highlight extension with multicolor support
      Highlight.configure({ multicolor: true }),
      // Link support (added for toolbar Insert Link button). We disable openOnClick so
      // users can keep typing without the system browser opening accidentally.
      Link.configure({
        openOnClick: false,
        autolink: true,
        linkOnPaste: true,
        HTMLAttributes: { rel: 'noopener noreferrer', target: '_blank' }
      }),
      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell,
      Subscript,
      Superscript
      // Math extensions can be added here if the dependency is installed
    ],
    onUpdate: (props: {
      editor: CoreEditor
      transaction: Transaction
      appendedTransactions: Transaction[]
    }) => {
      // Call the user-provided onUpdate with the precise VueTiptapEditor type.
      try {
        if (onUpdate) {
          onUpdate({
            editor: props.editor as unknown as VueTiptapEditor,
            transaction: props.transaction,
            appendedTransactions: props.appendedTransactions
          })
        }
      } catch (e) {
        // Swallow callback errors to avoid breaking the editor lifecycle
        console.error('Error in createTiptapEditor onUpdate callback:', e)
      }
    }
  }) as unknown as VueTiptapEditor
}

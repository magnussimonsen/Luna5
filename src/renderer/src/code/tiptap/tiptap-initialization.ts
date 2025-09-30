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
import { Mathematics } from '@tiptap/extension-mathematics'
// Subscript/superscript are optional
// Math (custom) - dynamically imported or added when dependency installed
import type { Transaction } from 'prosemirror-state'
import 'katex/dist/katex.min.css'
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
  const editorInstance = new Editor({
    editable,
    content,
    extensions: [
      StarterKit.configure({
        // @ts-expect-error TipTap types do not allow document config, but it works at runtime
        document: { content: 'block*' } as TiptapDocumentConfig,
        trailingNode: { node: 'paragraph', notAfter: ['heading'] }
      }) as unknown as Extension,
      Placeholder.configure({ placeholder: 'Rich text (Markdown-like) — start typing…' }),
      Highlight.configure({ multicolor: true }),
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
      Superscript,
      Mathematics.configure({
        inlineOptions: {
          onClick: (node, pos) => {
            const latex = (node as { attrs?: { latex?: string } })?.attrs?.latex || ''
            const updated = window.prompt('Inline math (LaTeX):', latex)
            if (updated != null && updated !== latex) {
              try {
                interface MathChain {
                  setNodeSelection: (p: number) => MathChain
                  updateInlineMath?: (o: { latex: string }) => MathChain
                  updateBlockMath?: (o: { latex: string }) => MathChain
                  focus: () => MathChain
                  run: () => boolean
                }
                interface ChainCapableEditor {
                  chain: () => MathChain
                }
                const chain = (editorInstance as unknown as ChainCapableEditor).chain()
                chain.setNodeSelection(pos).updateInlineMath?.({ latex: updated }).focus().run()
              } catch (e) {
                console.warn('[InlineMath edit] failed', e)
              }
            }
          }
        },
        blockOptions: {
          onClick: (node, pos) => {
            const latex = (node as { attrs?: { latex?: string } })?.attrs?.latex || ''
            const updated = window.prompt('Block math (LaTeX):', latex)
            if (updated != null && updated !== latex) {
              try {
                interface MathChain {
                  setNodeSelection: (p: number) => MathChain
                  updateInlineMath?: (o: { latex: string }) => MathChain
                  updateBlockMath?: (o: { latex: string }) => MathChain
                  focus: () => MathChain
                  run: () => boolean
                }
                interface ChainCapableEditor {
                  chain: () => MathChain
                }
                const chain = (editorInstance as unknown as ChainCapableEditor).chain()
                chain.setNodeSelection(pos).updateBlockMath?.({ latex: updated }).focus().run()
              } catch (e) {
                console.warn('[BlockMath edit] failed', e)
              }
            }
          }
        },
        katexOptions: { throwOnError: false }
      })
    ],
    onUpdate: (props: {
      editor: CoreEditor
      transaction: Transaction
      appendedTransactions: Transaction[]
    }) => {
      try {
        if (onUpdate) {
          onUpdate({
            editor: props.editor as unknown as VueTiptapEditor,
            transaction: props.transaction,
            appendedTransactions: props.appendedTransactions
          })
        }
      } catch (e) {
        console.error('Error in createTiptapEditor onUpdate callback:', e)
      }
    }
  }) as unknown as VueTiptapEditor
  return editorInstance as VueTiptapEditor
}

// (Math editing helpers inlined in onClick handlers above)

// src\renderer\src\types\tiptap-types.d.ts
import { Editor } from '@tiptap/vue-3'
import type { Editor as CoreEditor } from '@tiptap/core'
import StarterKit from '@tiptap/starter-kit'
import type { TiptapDocumentConfig } from '@renderer/types/tiptap-types'
import { Extension, InputRule } from '@tiptap/core'
import { Table } from '@tiptap/extension-table'
import TableRow from '@tiptap/extension-table-row'
import TableHeader from '@tiptap/extension-table-header'
import TableCell from '@tiptap/extension-table-cell'
import Subscript from '@tiptap/extension-subscript'
import Superscript from '@tiptap/extension-superscript'
import Highlight from '@tiptap/extension-highlight'

import Link from '@tiptap/extension-link'
// import Image from '@tiptap/extension-image'
import { ResizableImage } from '@renderer/code/tiptap/extensions/resizableImage'
import { Mathematics } from '@tiptap/extension-mathematics'
import { Placeholder } from '@tiptap/extension-placeholder'
import { NEW_TEXT_CELL_PLACEHOLDER } from '@renderer/constants/textcell-snippets/new-text-cell-placeholder'
import { useBottomPanelStore } from '@renderer/stores/UI/bottompanelStore'
import { useCellSelectionStore } from '@renderer/stores/toolbar-cell-communication/cellSelectionStore'
// Math (custom) - dynamically imported or added when dependency installed
import type { Transaction } from 'prosemirror-state'
import 'katex/dist/katex.min.css'
// Precise Editor type coming from the Vue wrapper. Use InstanceType to
// capture the actual runtime instance type exported by @tiptap/vue-3.
export type VueTiptapEditor = InstanceType<typeof import('@tiptap/vue-3').Editor>

// --------------------------------------------------------------------------------------
// Custom Math Input Rules Extension
// Enables automatic conversion of $...$ → inline math and $$...$$ → block math
// --------------------------------------------------------------------------------------
const MathInputRules = Extension.create({
  name: 'mathInputRules',

  addInputRules() {
    return [
      // Inline math: $...$ followed by space
      new InputRule({
        find: /\$([^$]+)\$\s$/,
        handler: ({ state, range, match }) => {
          const latex = match[1]
          const { tr } = state
          tr.replaceWith(range.from, range.to, state.schema.nodes['inlineMath'].create({ latex }))
          tr.insertText(' ')
        }
      }),
      // Block math: $$...$$ followed by enter/newline
      new InputRule({
        find: /^\$\$([^$]+)\$\$$/,
        handler: ({ state, range, match }) => {
          const latex = match[1]
          const { tr } = state
          tr.replaceWith(range.from, range.to, state.schema.nodes['blockMath'].create({ latex }))
        }
      })
    ]
  }
})

// createTiptapEditor
// Central factory for constructing a Luna text-cell TipTap editor instance.
// Responsibilities:
//   1. Assemble and deduplicate extensions (avoids duplicate name warnings & bugs).
//   2. Provide safe onUpdate callback plumbing (shielding user callback from throws).
//   3. Inject custom editing affordances (math editing + resizable images).
// No business logic (saving, persistence) lives here: caller wires that via onUpdate.
// --------------------------------------------------------------------------------------
/** Creates a configured TipTap editor instance for a text cell. */
export function createTiptapEditor(options: {
  editable: boolean
  content: string
  cellId?: string
  onUpdate?: (props: {
    editor: VueTiptapEditor
    transaction: Transaction
    appendedTransactions?: Transaction[]
  }) => void
}): VueTiptapEditor {
  const { editable, content, onUpdate, cellId } = options

  // Ensure no two extensions with the same internal name sneak in.
  const ensureUniqueExtensions = (extensions: Extension[]): Extension[] => {
    const seenNames = new Set<string>()
    const duplicates: string[] = []
    const getName = (ext: Extension): string | undefined => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const anyExt = ext as any
      return anyExt?.name || anyExt?.config?.name
    }
    const filtered = extensions.filter((extension) => {
      const name = getName(extension)
      if (!name) return true
      if (seenNames.has(name)) {
        duplicates.push(name)
        return false
      }
      seenNames.add(name)
      return true
    })
    if (duplicates.length) {
      // Dev-only console aid; harmless if it fires. Helps trace hidden duplicates (e.g. multiple Link instances).
      // Use consolidated message to avoid noisy logs.
      console.warn(
        '[createTiptapEditor] Removed duplicate extension(s):',
        Array.from(new Set(duplicates))
      )
    }
    return filtered
  }

  // ----------------------------------------------------------------------------------
  // Math editing click handler factory (both inline and block variants share logic)
  // ----------------------------------------------------------------------------------
  interface MathChainAPI {
    setNodeSelection: (pos: number) => MathChainAPI
    updateInlineMath?: (opts: { latex: string }) => MathChainAPI
    updateBlockMath?: (opts: { latex: string }) => MathChainAPI
    focus: () => MathChainAPI
    run: () => boolean
  }
  interface ChainCapableEditor {
    chain: () => MathChainAPI
  }

  const createMathClickHandler = (kind: 'inline' | 'block') => {
    return (node: { attrs?: { latex?: string }; nodeSize?: number } | undefined, pos: number) => {
      const bottomPanelStore = useBottomPanelStore()
      const cellSelectionStore = useCellSelectionStore()

      if (!editor?.isEditable) return

      const latex = node?.attrs?.latex ?? ''
      const nodeSize = node?.nodeSize ?? 0

      try {
        const chain = (editor as unknown as ChainCapableEditor).chain()
        chain.focus()
        chain.setNodeSelection(pos)
        chain.run()
      } catch (error) {
        console.warn('[Math node click] Failed to select math node.', error)
      }

      const selectionFrom = pos
      const selectionTo = pos + Math.max(nodeSize, 1)

      bottomPanelStore.configureKatexPanel({
        mode: kind,
        initialLatex: latex,
        interactionKind: 'edit',
        targetCellId: cellId ?? cellSelectionStore.selectedCellId ?? null,
        selectionFrom,
        selectionTo,
        targetNodePos: pos
      })
      bottomPanelStore.showPanel('insertKatexMath')
    }
  }

  const assembledExtensions = [
    StarterKit.configure({
      // @ts-expect-error TipTap types do not allow document config, but it works at runtime
      document: { content: 'block*' } as TiptapDocumentConfig,
      trailingNode: { node: 'paragraph', notAfter: ['heading'] },
      // Disable built-in link so we can supply our own configured Link extension below.
      link: false
    }),
    Placeholder.configure({ placeholder: NEW_TEXT_CELL_PLACEHOLDER }),
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
    ResizableImage,
    Mathematics.configure({
      inlineOptions: { onClick: createMathClickHandler('inline') },
      blockOptions: { onClick: createMathClickHandler('block') },
      katexOptions: { throwOnError: false }
    }),
    MathInputRules
  ] as Extension[]
  const extensions = ensureUniqueExtensions(assembledExtensions)

  // NOTE: The Vue wrapper returns an Editor subclass instance. Cast kept isolated here.
  const editor = new Editor({
    editable,
    content,
    extensions,
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
  return editor as VueTiptapEditor
}

// (Math editing helpers extracted above via createMathClickHandler)

<template>
  <!-- Toolbar is decoupled from the TextCell component tree; it looks up the
       currently selected cell's editor via the store. ...-->

  <div
    class="row-flex-wrap-base"
    :class="{ 'is-dark': isDarkMode }"
    role="toolbar"
    aria-label="Text cell formatting toolbar"
  >
    <div class="row-flex-wrap-base-child util-transparent-border">
      <!-- BOLD -->
      <button
        class="top-toolbar__button top-toolbar__button--icon icon-bold top-toolbar__button--transparent-when-disabled"
        type="button"
        :class="{ 'top-toolbar__button--active': isActive('bold') }"
        title="Bold (Ctrl+B)"
        aria-label="Bold"
        :disabled="
          !canRunCommand('toggleBold') ||
          isCellLockedComputed ||
          isCellHiddenComputed ||
          isMathNodeSelected
        "
        @click="toggleBold"
      ></button>

      <!-- ITALIC -->
      <button
        class="top-toolbar__button top-toolbar__button--icon icon-italic top-toolbar__button--transparent-when-disabled"
        type="button"
        :class="{ 'top-toolbar__button--active': isActive('italic') }"
        title="Italic (Ctrl+I)"
        aria-label="Italic"
        :disabled="
          !canRunCommand('toggleItalic') ||
          isCellLockedComputed ||
          isCellHiddenComputed ||
          isMathNodeSelected
        "
        @click="toggleItalic"
      ></button>

      <!-- UNDERLINE -->
      <button
        class="top-toolbar__button top-toolbar__button--icon icon-underline top-toolbar__button--transparent-when-disabled"
        type="button"
        :class="{ 'top-toolbar__button--active': isActive('underline') }"
        title="Underline"
        aria-label="Underline"
        :disabled="
          !canRunCommand('toggleUnderline') ||
          isCellLockedComputed ||
          isCellHiddenComputed ||
          isMathNodeSelected
        "
        @click="toggleUnderline"
      ></button>

      <!-- SUBSCRIPT -->
      <button
        class="top-toolbar__button top-toolbar__button--icon icon-subscript top-toolbar__button--transparent-when-disabled"
        type="button"
        :class="{ 'top-toolbar__button--active': isActive('subscript') }"
        title="Subscript"
        aria-label="Subscript"
        :disabled="
          !canRunCommand('toggleSubscript') ||
          isCellLockedComputed ||
          isCellHiddenComputed ||
          isMathNodeSelected
        "
        @click="toggleSubscript"
      ></button>

      <!-- SUPERSCRIPT -->
      <button
        class="top-toolbar__button top-toolbar__button--icon icon-superscript top-toolbar__button--transparent-when-disabled"
        type="button"
        :class="{ 'top-toolbar__button--active': isActive('superscript') }"
        title="Superscript"
        aria-label="Superscript"
        :disabled="
          !canRunCommand('toggleSuperscript') ||
          isCellLockedComputed ||
          isCellHiddenComputed ||
          isMathNodeSelected
        "
        @click="toggleSuperscript"
      ></button>

      <!-- BULLET LIST -->
      <button
        class="top-toolbar__button top-toolbar__button--icon icon-bullet-list top-toolbar__button--transparent-when-disabled"
        type="button"
        :class="{ 'top-toolbar__button--active': isActive('bulletList') }"
        title="Bullet list"
        aria-label="Bullet list"
        :disabled="
          !activeTextEditor || isCellLockedComputed || isCellHiddenComputed || isMathNodeSelected
        "
        @click="toggleBulletList"
      ></button>

      <!-- ORDERED LIST -->
      <button
        class="top-toolbar__button top-toolbar__button--icon icon-numbered-list top-toolbar__button--transparent-when-disabled"
        type="button"
        :class="{ 'top-toolbar__button--active': isActive('orderedList') }"
        title="Numbered list"
        aria-label="Numbered list"
        :disabled="
          !activeTextEditor || isCellLockedComputed || isCellHiddenComputed || isMathNodeSelected
        "
        @click="toggleOrderedList"
      ></button>

      <!-- HEADING 1-5 -->
      <button
        class="top-toolbar__button top-toolbar__button--icon icon-heading-1 top-toolbar__button--transparent-when-disabled"
        type="button"
        :class="{ 'top-toolbar__button--active': isActiveHeading(1) }"
        title="Heading 1"
        aria-label="Heading 1"
        :disabled="
          !activeTextEditor || isCellLockedComputed || isCellHiddenComputed || isMathNodeSelected
        "
        @click="toggleHeading(1)"
      ></button>
      <button
        class="top-toolbar__button top-toolbar__button--icon icon-heading-2 top-toolbar__button--transparent-when-disabled"
        type="button"
        :class="{ 'top-toolbar__button--active': isActiveHeading(2) }"
        title="Heading 2"
        aria-label="Heading 2"
        :disabled="
          !activeTextEditor || isCellLockedComputed || isCellHiddenComputed || isMathNodeSelected
        "
        @click="toggleHeading(2)"
      ></button>
      <button
        class="top-toolbar__button top-toolbar__button--icon icon-heading-3 top-toolbar__button--transparent-when-disabled"
        type="button"
        :class="{ 'top-toolbar__button--active': isActiveHeading(3) }"
        title="Heading 3"
        aria-label="Heading 3"
        :disabled="
          !activeTextEditor || isCellLockedComputed || isCellHiddenComputed || isMathNodeSelected
        "
        @click="toggleHeading(3)"
      ></button>
      <button
        class="top-toolbar__button top-toolbar__button--icon icon-heading-4 top-toolbar__button--transparent-when-disabled"
        type="button"
        :class="{ 'top-toolbar__button--active': isActiveHeading(4) }"
        title="Heading 4"
        aria-label="Heading 4"
        :disabled="
          !activeTextEditor || isCellLockedComputed || isCellHiddenComputed || isMathNodeSelected
        "
        @click="toggleHeading(4)"
      ></button>

      <!-- REMOVE HEADING 5 
    <button
      class="top-toolbar__button top-toolbar__button--icon icon-heading-5"
      type="button"
      :class="{ active: isActiveHeading(5) }"
      title="Heading 5"
      aria-label="Heading 5"
      :disabled="!activeTextEditor"
      @click="toggleHeading(5)"
    ></button>
    -->

      <button
        type="button"
        :style="{ backgroundColor: resolveHighlightColor('red-highlighting', isDarkMode) }"
        :class="[
          'top-toolbar__button',
          'top-toolbar__button--icon',
          'top-toolbar__button--highlight',
          'icon-highlight-pen',
          'top-toolbar__button--transparent-when-disabled',
          { 'top-toolbar__button--highlight-active': isHighlightActive('red-highlighting') }
        ]"
        title="Highlight Red"
        aria-label="Highlight Red"
        :disabled="
          !activeTextEditor || isCellLockedComputed || isCellHiddenComputed || isMathNodeSelected
        "
        @click="toggleHighlight('red-highlighting')"
      ></button>

      <button
        :class="[
          'top-toolbar__button',
          'top-toolbar__button--icon',
          'top-toolbar__button--highlight',
          'icon-highlight-pen',
          'top-toolbar__button--transparent-when-disabled',
          { 'top-toolbar__button--highlight-active': isHighlightActive('green-highlighting') }
        ]"
        type="button"
        :style="{ backgroundColor: resolveHighlightColor('green-highlighting', isDarkMode) }"
        title="Highlight Blue"
        aria-label="Highlight Blue"
        :disabled="
          !activeTextEditor || isCellLockedComputed || isCellHiddenComputed || isMathNodeSelected
        "
        @click="toggleHighlight('green-highlighting')"
      ></button>

      <button
        :class="[
          'top-toolbar__button',
          'top-toolbar__button--icon',
          'top-toolbar__button--highlight',
          'icon-highlight-pen',
          'top-toolbar__button--transparent-when-disabled',
          { 'top-toolbar__button--highlight-active': isHighlightActive('blue-highlighting') }
        ]"
        type="button"
        :style="{ backgroundColor: resolveHighlightColor('blue-highlighting', isDarkMode) }"
        title="Highlight Green"
        aria-label="Highlight Green"
        :disabled="
          !activeTextEditor || isCellLockedComputed || isCellHiddenComputed || isMathNodeSelected
        "
        @click="toggleHighlight('blue-highlighting')"
      ></button>
    </div>
    <!-- Highlight buttons: fixed four tokens; background set by resolver -->
    <!-- ORANGE REMOVED 
    <button
      class="top-toolbar__button top-toolbar__button--icon icon-highlight-pen"
      type="button"
      :style="{ backgroundColor: resolveHighlightColor('orange-highlighting', isDarkMode) }"
      :class="{ 'is-active': isHighlightActive('orange-highlighting') }"
      title="Highlight Orange"
      aria-label="Highlight Orange"
      @click="toggleHighlight('orange-highlighting')"
    ></button>
    -->

    <!-- Table controls cluster (mirrors link cluster pattern). Shows only insert button when not inside a table; reveals row/column/delete controls and active border when within a table -->

    <div
      class="row-flex-wrap-base-child util-transparent-border"
      :class="{
        'util-active-border': isTableActive
      }"
    >
      <button
        class="top-toolbar__button top-toolbar__button--icon icon-table top-toolbar__button--transparent-when-disabled"
        type="button"
        :class="{ 'top-toolbar__button--active': isTableActive }"
        title="Insert 3x3 table"
        aria-label="Insert table"
        :aria-pressed="isTableActive ? 'true' : 'false'"
        :disabled="
          !activeTextEditor || isCellLockedComputed || isCellHiddenComputed || isMathNodeSelected
        "
        @click="insertTable"
      ></button>
      <template v-if="isTableActive">
        <button
          :class="[
            'top-toolbar__button',
            'top-toolbar__button--icon',
            'top-toolbar__button--transparent-when-disabled',
            'icon-insert-table-row-below'
          ]"
          type="button"
          title="Add row after"
          aria-label="Add row"
          :disabled="
            !activeTextEditor || isCellLockedComputed || isCellHiddenComputed || isMathNodeSelected
          "
          @click="addRow"
        ></button>
        <button
          :class="[
            'top-toolbar__button',
            'top-toolbar__button--icon',
            'top-toolbar__button--transparent-when-disabled',
            'icon-insert-table-column-right'
          ]"
          type="button"
          title="Add column after"
          aria-label="Add column"
          :disabled="
            !activeTextEditor || isCellLockedComputed || isCellHiddenComputed || isMathNodeSelected
          "
          @click="addColumn"
        ></button>
        <button
          :class="[
            'top-toolbar__button',
            'top-toolbar__button--icon',
            'top-toolbar__button--transparent-when-disabled',
            'icon-delete-table-row'
          ]"
          type="button"
          title="Delete row"
          aria-label="Delete row"
          :disabled="
            !activeTextEditor || isCellLockedComputed || isCellHiddenComputed || isMathNodeSelected
          "
          @click="deleteRow"
        ></button>
        <button
          :class="[
            'top-toolbar__button',
            'top-toolbar__button--icon',
            'top-toolbar__button--transparent-when-disabled',
            'icon-delete-table-column'
          ]"
          type="button"
          title="Delete column"
          aria-label="Delete column"
          :disabled="
            !activeTextEditor || isCellLockedComputed || isCellHiddenComputed || isMathNodeSelected
          "
          @click="deleteColumn"
        ></button>
        <button
          :class="[
            'top-toolbar__button',
            'top-toolbar__button--icon',
            'top-toolbar__button--transparent-when-disabled',
            'icon-delete-table'
          ]"
          type="button"
          title="Delete table"
          aria-label="Delete table"
          :disabled="
            !activeTextEditor || isCellLockedComputed || isCellHiddenComputed || isMathNodeSelected
          "
          @click="deleteTable"
        ></button>
      </template>
    </div>

    <!-- INSERT / EDIT LINK -->

    <div
      class="row-flex-wrap-base-child util-transparent-border"
      :class="{
        'util-active-border': linkInputVisible
      }"
    >
      <button
        ref="linkButtonEl"
        :class="[
          'top-toolbar__button',
          'top-toolbar__button--icon',
          'icon-link',
          'top-toolbar__button--transparent-when-disabled',
          {
            'top-toolbar__button--active': linkInputVisible,
            'link-caret-flash': isCaretInsideLink && !linkInputVisible
          }
        ]"
        type="button"
        :title="
          linkInputVisible
            ? 'Close link editor'
            : isLinkActive
              ? 'Edit or remove link'
              : 'Insert link'
        "
        :aria-label="
          linkInputVisible
            ? 'Close link editor'
            : isLinkActive
              ? 'Edit or remove link'
              : 'Insert link'
        "
        :aria-pressed="isLinkActive || linkInputVisible ? 'true' : 'false'"
        :aria-expanded="linkInputVisible ? 'true' : 'false'"
        :disabled="
          !activeTextEditor || isCellLockedComputed || isCellHiddenComputed || isMathNodeSelected
        "
        @click="onClickLinkButton"
      ></button>
      <div v-if="linkInputVisible" class="inline-link-editor">
        <input
          ref="linkInputEl"
          v-model="linkUrlInput"
          type="text"
          class="inline-link-editor__input"
          placeholder="https://example.com"
          @keyup.enter.prevent="applyLinkFromInput"
          @keyup.esc.prevent="cancelLinkUI"
        />
        <button
          type="button"
          :class="[
            'top-toolbar__button',
            'top-toolbar__button--icon',
            'top-toolbar__button--transparent-when-disabled',
            isLinkActive ? 'icon-update' : 'icon-add'
          ]"
          :title="isLinkActive ? 'Update link' : 'Apply link'"
          :aria-label="isLinkActive ? 'Update link' : 'Apply link'"
          @click="applyLinkFromInput"
        ></button>
        <button
          v-if="isLinkActive"
          type="button"
          :class="[
            'top-toolbar__button',
            'top-toolbar__button--icon',
            'top-toolbar__button--transparent-when-disabled',
            'icon-delete'
          ]"
          title="Cancel link editing"
          @click="removeLinkViaUI"
        ></button>
      </div>
    </div>

    <div class="row-flex-wrap-base-child util-transparent-border">
      <!-- button placeholder for insert image-->
      <button
        class="top-toolbar__button top-toolbar__button--icon icon-image top-toolbar__button--transparent-when-disabled"
        type="button"
        title="Insert image"
        aria-label="Insert image"
        :disabled="
          !activeTextEditor || isCellLockedComputed || isCellHiddenComputed || isMathNodeSelected
        "
        @click="insertImage"
      ></button>

      <!-- 
    Math (placeholder)
    <button
      class="top-toolbar__button top-toolbar__button--icon icon-math top-toolbar__button--transparent-when-disabled"
      type="button"
      title="Insert Math Live Input Field with virtual keyboard (coming soon)"
      aria-label="Insert Math Live Input Field with virtual keyboard (coming soon)"
      :disabled="!activeTextEditor || isCellLockedComputed || isCellHiddenComputed || isMathNodeSelected"
      @click="placeholderMathLive"
    ></button>
    -->
      <button
        class="top-toolbar__button top-toolbar__button--icon icon-katex-inline top-toolbar__button--transparent-when-disabled"
        type="button"
        title="Insert inline math (LaTeX / KaTeX)"
        aria-label="Insert inline math (LaTeX / KaTeX)"
        :disabled="
          !activeTextEditor || isCellLockedComputed || isCellHiddenComputed || isMathNodeSelected
        "
        @click="insertKatexInline"
      ></button>
      <button
        class="top-toolbar__button top-toolbar__button--icon icon-katex-block top-toolbar__button--transparent-when-disabled"
        type="button"
        title="Insert block math (LaTeX / KaTeX)"
        aria-label="Insert block math (LaTeX / KaTeX)"
        :disabled="
          !activeTextEditor || isCellLockedComputed || isCellHiddenComputed || isMathNodeSelected
        "
        @click="insertKatexBlock"
      ></button>
    </div>
  </div>
</template>

<script setup lang="ts">
/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * TextCellToolbar.vue
 * A detached toolbar controlling the active text (Tiptap) editor. It resolves
 * the editor instance via the selection + textEditors stores so the toolbar
 * can live anywhere in the component tree.
 */
import { computed, unref, ref, nextTick, watch, onBeforeUnmount } from 'vue'
import { useThemeStore } from '@renderer/stores/themes/colorThemeStore'
import { useTextEditorsStore } from '@renderer/stores/editors/textEditorsStore'
import { useBottomPanelStore } from '@renderer/stores/UI/bottompanelStore'
import type { Editor } from '@tiptap/vue-3'
import type { HeadingLevel } from '@renderer/types/heading-level-type'
import type { HighlightColor } from '../../types/highlight-colors-types'
import { resolveHighlightColor } from '../../code/highlight/highlight-colors'
import { newInlineKatexExampleCode } from '@renderer/constants/katex-snippets/example-katex/new-inline-katex-example-snipplets'
import { newBlockKatexExampleCode } from '@renderer/constants/katex-snippets/example-katex/new-block-katex-example-snipplets'

// Stores
const themeStore = useThemeStore()
const textEditorsStore = useTextEditorsStore()
const bottomPanelStore = useBottomPanelStore()

// Props passed from ToolbarContainer.vue
const props = defineProps<{
  cellId?: string | null
  kind?: string | null
  isCellHidden?: boolean
  isSoftLocked?: boolean
  isHardLocked?: boolean
  isFlagged?: boolean
  inBin?: boolean
  parentNotebookId?: string | null
}>()

// Reactive refs
const isDarkMode = computed(() => !!themeStore.isDarkMode)
// Resolve the active TipTap editor via the passed-in cell id
const activeTextEditor = computed<Editor | null>(() =>
  textEditorsStore.getEditorByCellId(props.cellId)
)

// Cells can be locked/hidden via props supplied by ToolbarContainer
const isCellLockedComputed = computed(
  () => !!unref(props.isSoftLocked) || !!unref(props.isHardLocked)
)
const isCellHiddenComputed = computed(() => !!unref(props.isCellHidden))

// Check if current selection is within a mathematics node (inline or block)
const isMathNodeSelected = computed(() => {
  void selectionVersion.value // Make reactive to selection changes
  const editor = activeTextEditor.value
  if (!editor) return false

  try {
    return editor.isActive('inlineMath') || editor.isActive('blockMath')
  } catch {
    return false
  }
})

// A shared ref that increments on editor selection / transaction changes so
// isActive-style helpers become reactive.
const selectionVersion = ref(0)

function isHighlightActive(color: string): boolean {
  void selectionVersion.value
  const resolved = resolveHighlightColor(color as HighlightColor, isDarkMode.value)
  if (!activeTextEditor.value) return false
  try {
    return !!(activeTextEditor.value as any).isActive('highlight', { color: resolved })
  } catch {
    return false
  }
}

// ---------------------------------------------------------------------------
// Helper functions (use regular functions for clarity & easier debugging)
function runCommand(chainFn: (editor: Editor) => unknown): void {
  if (!activeTextEditor.value) return
  chainFn(activeTextEditor.value)
}

function canRunCommand(commandName: string): boolean {
  const editor = activeTextEditor.value
  if (!editor) return false
  try {
    // Using optional chaining-like guard for commands relying on can()
    switch (commandName) {
      case 'toggleBold':
        return editor.can().chain().focus().toggleBold().run()
      case 'toggleItalic':
        return editor.can().chain().focus().toggleItalic().run()
      case 'toggleUnderline':
        try {
          return !!(editor as any).can().chain().focus().toggleUnderline().run()
        } catch {
          return false
        }
      case 'toggleSubscript':
        try {
          return !!(editor as any).can().chain().focus().toggleSubscript().run()
        } catch {
          return false
        }
      case 'toggleSuperscript':
        try {
          return !!(editor as any).can().chain().focus().toggleSuperscript().run()
        } catch {
          return false
        }
      // Use electron ctrl+z and ctrl+y for undo/redo
      // case 'undo':
      //   return editor.can().chain().focus().undo().run()
      // case 'redo':
      //   return editor.can().chain().focus().redo().run()
      default:
        return true
    }
  } catch {
    return false
  }
}

function toggleBold(): void {
  runCommand((editor) => {
    editor.chain().focus().toggleBold().run()
  })
}

function toggleItalic(): void {
  runCommand((editor) => {
    editor.chain().focus().toggleItalic().run()
  })
}

function toggleUnderline(): void {
  runCommand((editor) => {
    const chain = (editor as any).chain().focus()
    if (typeof chain.toggleUnderline === 'function') {
      chain.toggleUnderline().run()
    }
  })
}

function toggleSubscript(): void {
  runCommand((editor) => {
    const chain = (editor as any).chain().focus()
    if (typeof chain.toggleSubscript === 'function') {
      chain.toggleSubscript().run()
    }
  })
}

function toggleSuperscript(): void {
  runCommand((editor) => {
    const chain = (editor as any).chain().focus()
    if (typeof chain.toggleSuperscript === 'function') {
      chain.toggleSuperscript().run()
    }
  })
}

function toggleBulletList(): void {
  runCommand((editor) => {
    editor.chain().focus().toggleBulletList().run()
  })
}

function toggleOrderedList(): void {
  runCommand((editor) => {
    editor.chain().focus().toggleOrderedList().run()
  })
}

function toggleHeading(level: HeadingLevel): void {
  runCommand((editor) => {
    editor.chain().focus().toggleHeading({ level }).run()
  })
}

function toggleHighlight(color: HighlightColor): void {
  const resolved = resolveHighlightColor(color, isDarkMode.value)
  runCommand((editor) => {
    const chain = (editor as any).chain().focus()
    if (typeof chain.toggleHighlight === 'function') {
      chain.toggleHighlight({ color: resolved }).run()
    }
  })
}

// Formatting action functions
type KatexMode = 'inline' | 'block'

function collectKatexContext(mode: KatexMode): {
  initialLatex: string
  selectionFrom: number
  selectionTo: number
} | null {
  const editor: any = activeTextEditor.value
  if (!editor) return null

  try {
    const { from, to } = editor.state.selection
    const delimiter = mode === 'inline' ? ' ' : '\n'
    let initialLatex = ''

    if (!editor.state.selection.empty) {
      initialLatex = editor.state.doc.textBetween(from, to, delimiter).trim()
    }

    if (!initialLatex) {
      initialLatex =
        mode === 'inline' ? (newInlineKatexExampleCode ?? '') : (newBlockKatexExampleCode ?? '')
    }

    return {
      initialLatex,
      selectionFrom: from,
      selectionTo: to
    }
  } catch (error) {
    console.warn('[collectKatexContext] Failed to derive KaTeX context.', error)
    return null
  }
}

function openKatexBottomPanel(config: {
  mode: KatexMode
  initialLatex: string
  selectionFrom: number
  selectionTo: number
}): void {
  bottomPanelStore.configureKatexPanel({
    mode: config.mode,
    initialLatex: config.initialLatex,
    interactionKind: 'insert',
    targetCellId: props.cellId ?? null,
    selectionFrom: config.selectionFrom,
    selectionTo: config.selectionTo
  })
  bottomPanelStore.showPanel('insertKatexMath')
}

function insertKatexInline(): void {
  const context = collectKatexContext('inline')
  if (!context) return
  openKatexBottomPanel({
    mode: 'inline',
    initialLatex: context.initialLatex,
    selectionFrom: context.selectionFrom,
    selectionTo: context.selectionTo
  })
}

function insertKatexBlock(): void {
  const context = collectKatexContext('block')
  if (!context) return
  openKatexBottomPanel({
    mode: 'block',
    initialLatex: context.initialLatex,
    selectionFrom: context.selectionFrom,
    selectionTo: context.selectionTo
  })
}

// Table helpers
const isTableActive = computed(() => isActive('table'))
function insertTable(): void {
  runCommand((editor) => {
    ;(editor as any).chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()
  })
}
function addRow(): void {
  runCommand((editor) => {
    ;(editor as any).chain().focus().addRowAfter().run()
  })
}
function addColumn(): void {
  runCommand((editor) => {
    ;(editor as any).chain().focus().addColumnAfter().run()
  })
}
function deleteRow(): void {
  runCommand((editor) => {
    ;(editor as any).chain().focus().deleteRow().run()
  })
}
function deleteColumn(): void {
  runCommand((editor) => {
    ;(editor as any).chain().focus().deleteColumn().run()
  })
}
function deleteTable(): void {
  runCommand((editor) => {
    ;(editor as any).chain().focus().deleteTable().run()
  })
}

/*function placeholderMathLive(): void {
  // Intentionally left blank; future MathLive support will hook in here.
  console.log('MathLive button in toolbar clicked.  Feature coming soon!')
}*/

// Active state helpers (reactive via selectionVersion)
function isActive(markOrNode: string, attrs?: Record<string, unknown>): boolean {
  void selectionVersion.value
  return !!activeTextEditor.value?.isActive(markOrNode, attrs)
}
function isActiveHeading(level: number): boolean {
  void selectionVersion.value
  return !!activeTextEditor.value?.isActive('heading', { level })
}

// ---------------------------------------------------------------------------
// Link handling (simplified)
const isLinkActive = computed(() => {
  void selectionVersion.value
  return !!activeTextEditor.value?.isActive('link')
})
// True only when caret (collapsed selection) is inside a link mark; used for flash indicator
const isCaretInsideLink = computed(() => {
  void selectionVersion.value
  const editor = activeTextEditor.value as any
  if (!editor) return false
  const { from, to } = editor.state.selection
  if (from !== to) return false // only flash on pure caret, not range selections
  try {
    return !!editor.isActive('link')
  } catch {
    return false
  }
})
const linkInputVisible = ref(false)
const linkUrlInput = ref('')
const linkInputEl = ref<HTMLInputElement | null>(null)

function normalizeUrl(raw: string): string {
  const s = raw.trim()
  if (!s) return ''
  return /^(https?:|mailto:|#|\/)/i.test(s) ? s : `https://${s}`
}

function focusLinkInput(): void {
  void nextTick(() => {
    try {
      linkInputEl.value?.focus()
      linkInputEl.value?.select()
    } catch {
      /* ignore */
    }
  })
}

function onClickLinkButton(): void {
  // Toggle behavior: if editor is already visible, close it.
  if (linkInputVisible.value) {
    linkInputVisible.value = false
    return
  }
  const ed: any = activeTextEditor.value
  if (!ed) return
  if (isLinkActive.value) {
    linkUrlInput.value = ed.getAttributes('link')?.href || ''
  } else {
    const { from, to } = ed.state.selection
    const selText = (ed.state.doc as any).textBetween(from, to, ' ')
    linkUrlInput.value = selText && selText.length < 150 ? selText : ''
  }
  linkInputVisible.value = true
  focusLinkInput()
}

function clearStoredLinkMark(ed: any): void {
  try {
    const linkType = ed.state.schema.marks.link
    if (linkType) {
      ed.view.dispatch(ed.state.tr.removeStoredMark(linkType))
    }
  } catch {
    /* ignore */
  }
}

function moveCaretToEnd(ed: any): void {
  try {
    const endPos = ed.state.selection.to
    ed.commands.setTextSelection(endPos)
  } catch {
    /* ignore */
  }
}

function applyLinkFromInput(): void {
  const ed: any = activeTextEditor.value
  if (!ed) return
  const finalUrl = normalizeUrl(linkUrlInput.value)

  // Remove link if url cleared
  if (!finalUrl) {
    if (isLinkActive.value) {
      ed.chain().focus().extendMarkRange('link').unsetLink().run()
    }
    linkInputVisible.value = false
    return
  }

  const { from, to } = ed.state.selection
  if (isLinkActive.value) {
    ed.chain().focus().extendMarkRange('link').setLink({ href: finalUrl }).run()
  } else if (from === to) {
    // Insert text for URL then apply link
    ed.chain()
      .focus()
      .insertContent(finalUrl)
      .setTextSelection({ from, to: from + finalUrl.length })
      .setLink({ href: finalUrl })
      .run()
  } else {
    ed.chain().focus().setLink({ href: finalUrl }).run()
  }

  moveCaretToEnd(ed)
  clearStoredLinkMark(ed)
  linkInputVisible.value = false
}

function removeLinkViaUI(): void {
  const ed: any = activeTextEditor.value
  if (!ed) return
  ed.chain().focus().extendMarkRange('link').unsetLink().run()
  linkInputVisible.value = false
}

function cancelLinkUI(): void {
  linkInputVisible.value = false
}

// ---------------------------------------------------------------------------
// Image insertion flow (data URI based for first iteration)
async function insertImage(): Promise<void> {
  if (!activeTextEditor.value) return
  if (isCellLockedComputed.value || isCellHiddenComputed.value) return
  try {
    // Cast to any to use newly added preload API before local ambient types refresh everywhere.
    const res = await (window as any).api.pickImageFile()
    if (!res || res.canceled || !res.dataUri) return
    const ed: any = activeTextEditor.value
    // Use TipTap image extension if present
    try {
      ed.chain()
        .focus()
        .setImage({ src: res.dataUri, alt: res.alt || '' })
        .run()
    } catch {
      // Fallback: raw HTML insertion
      ed.chain()
        .focus()
        .insertContent(
          `<img src="${res.dataUri}" alt="${(res.alt || '').replace(/"/g, '&quot;')}" />`
        )
        .run()
    }
  } catch (e) {
    console.warn('[insertImage] failed', e)
  }
}

// ---------------------------------------------------------------------------
// Selection / transaction event bridging for reactivity
const detachHandlers: Array<() => void> = []
watch(
  () => activeTextEditor.value,
  (editor) => {
    while (detachHandlers.length) {
      try {
        detachHandlers.pop()?.()
      } catch {
        /* ignore */
      }
    }
    if (!editor) return
    const events = ['selectionUpdate', 'transaction', 'update', 'focus', 'blur']
    events.forEach((evt) => {
      const handler = (): void => {
        if (!(handler as any)._scheduled) {
          ;(handler as any)._scheduled = true
          requestAnimationFrame(() => {
            ;(handler as any)._scheduled = false
            selectionVersion.value++
          })
        }
      }
      ;(editor as any).on(evt, handler)
      detachHandlers.push(() => {
        try {
          ;(editor as any).off(evt, handler)
        } catch {
          /* ignore */
        }
      })
    })
    selectionVersion.value++
  },
  { immediate: true }
)

onBeforeUnmount(() => {
  while (detachHandlers.length) {
    try {
      detachHandlers.pop()?.()
    } catch {
      /* ignore */
    }
  }
})
</script>

<style scoped>
.inline-link-editor {
  display: inline-flex;
  gap: 0px;
  align-items: center;
  padding: 0px 0px;
}
.inline-link-editor__input {
  font: inherit;
  padding: 0px 0.5em;
  margin: 0px 2px;
  min-width: 180px;
  border: 0px solid var(--button-border-color, #ccc);
  border-radius: var(--border-radius, 4px);
  background: transparent;
  color: var(--text-color, #222);
}
</style>

<!-- src\renderer\src\components\toolbars\TextCellToolbar.vue -->
<template>
  <!-- Toolbar is decoupled from the TextCell component tree; it looks up the
       currently selected cell's editor via the store. ...-->
  <div
    class="button-row-flex-wrap-base"
    :class="{ 'is-dark': isDarkMode }"
    role="toolbar"
    aria-label="Text cell formatting toolbar"
  >
    <!-- BOLD -->
    <button
      class="top-toolbar__button top-toolbar__button--icon icon-bold top-toolbar__button--transparent-when-disabled"
      type="button"
      :class="{ 'top-toolbar__button--active': isActive('bold') }"
      title="Bold (Ctrl+B)"
      aria-label="Bold"
      :disabled="!canRunCommand('toggleBold') || isCellLockedComputed || isCellHiddenComputed"
      @click="toggleBold"
    ></button>

    <!-- ITALIC -->
    <button
      class="top-toolbar__button top-toolbar__button--icon icon-italic top-toolbar__button--transparent-when-disabled"
      type="button"
      :class="{ 'top-toolbar__button--active': isActive('italic') }"
      title="Italic (Ctrl+I)"
      aria-label="Italic"
      :disabled="!canRunCommand('toggleItalic') || isCellLockedComputed || isCellHiddenComputed"
      @click="toggleItalic"
    ></button>

    <!-- UNDERLINE -->
    <button
      class="top-toolbar__button top-toolbar__button--icon icon-underline top-toolbar__button--transparent-when-disabled"
      type="button"
      :class="{ 'top-toolbar__button--active': isActive('underline') }"
      title="Underline"
      aria-label="Underline"
      :disabled="!canRunCommand('toggleUnderline') || isCellLockedComputed || isCellHiddenComputed"
      @click="toggleUnderline"
    ></button>

    <!-- SUBSCRIPT -->
    <button
      class="top-toolbar__button top-toolbar__button--icon icon-subscript top-toolbar__button--transparent-when-disabled"
      type="button"
      :class="{ 'top-toolbar__button--active': isActive('subscript') }"
      title="Subscript"
      aria-label="Subscript"
      :disabled="!canRunCommand('toggleSubscript') || isCellLockedComputed || isCellHiddenComputed"
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
        !canRunCommand('toggleSuperscript') || isCellLockedComputed || isCellHiddenComputed
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
      :disabled="!activeTextEditor || isCellLockedComputed || isCellHiddenComputed"
      @click="toggleBulletList"
    ></button>

    <!-- ORDERED LIST -->
    <button
      class="top-toolbar__button top-toolbar__button--icon icon-numbered-list top-toolbar__button--transparent-when-disabled"
      type="button"
      :class="{ active: isActive('orderedList') }"
      title="Numbered list"
      aria-label="Numbered list"
      :disabled="!activeTextEditor || isCellLockedComputed || isCellHiddenComputed"
      @click="toggleOrderedList"
    ></button>

    <!-- HEADING 1-5 -->
    <button
      class="top-toolbar__button top-toolbar__button--icon icon-heading-1 top-toolbar__button--transparent-when-disabled"
      type="button"
      :class="{ 'top-toolbar__button--active': isActiveHeading(1) }"
      title="Heading 1"
      aria-label="Heading 1"
      :disabled="!activeTextEditor || isCellLockedComputed || isCellHiddenComputed"
      @click="toggleHeading(1)"
    ></button>
    <button
      class="top-toolbar__button top-toolbar__button--icon icon-heading-2 top-toolbar__button--transparent-when-disabled"
      type="button"
      :class="{ 'top-toolbar__button--active': isActiveHeading(2) }"
      title="Heading 2"
      aria-label="Heading 2"
      :disabled="!activeTextEditor || isCellLockedComputed || isCellHiddenComputed"
      @click="toggleHeading(2)"
    ></button>
    <button
      class="top-toolbar__button top-toolbar__button--icon icon-heading-3 top-toolbar__button--transparent-when-disabled"
      type="button"
      :class="{ 'top-toolbar__button--active': isActiveHeading(3) }"
      title="Heading 3"
      aria-label="Heading 3"
      :disabled="!activeTextEditor || isCellLockedComputed || isCellHiddenComputed"
      @click="toggleHeading(3)"
    ></button>
    <button
      class="top-toolbar__button top-toolbar__button--icon icon-heading-4 top-toolbar__button--transparent-when-disabled"
      type="button"
      :class="{ 'top-toolbar__button--active': isActiveHeading(4) }"
      title="Heading 4"
      aria-label="Heading 4"
      :disabled="!activeTextEditor || isCellLockedComputed || isCellHiddenComputed"
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
    <!-- button placeholder for insert link-->
    <button
      class="top-toolbar__button top-toolbar__button--icon icon-link top-toolbar__button--transparent-when-disabled"
      type="button"
      title="Insert link (coming soon)"
      aria-label="Insert link (coming soon)"
      :disabled="!activeTextEditor || isCellLockedComputed || isCellHiddenComputed"
      @click="() => {}"
    ></button>
    <!-- button placeholder for insert image-->
    <button
      class="top-toolbar__button top-toolbar__button--icon icon-image top-toolbar__button--transparent-when-disabled"
      type="button"
      title="Insert image (coming soon)"
      aria-label="Insert image (coming soon)"
      :disabled="!activeTextEditor || isCellLockedComputed || isCellHiddenComputed"
      @click="() => {}"
    ></button>

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
      :disabled="!activeTextEditor || isCellLockedComputed || isCellHiddenComputed"
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
      :disabled="!activeTextEditor || isCellLockedComputed || isCellHiddenComputed"
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
      :disabled="!activeTextEditor || isCellLockedComputed || isCellHiddenComputed"
      @click="toggleHighlight('blue-highlighting')"
    ></button>

    <!-- Table controls with disabled states -->

    <button
      class="top-toolbar__button top-toolbar__button--icon icon-table top-toolbar__button--transparent-when-disabled"
      type="button"
      title="Insert 3x3 table"
      aria-label="Insert table"
      :disabled="!activeTextEditor || isCellLockedComputed || isCellHiddenComputed"
      @click="insertTable"
    ></button>
    <button
      :class="[
        'top-toolbar__button',
        'top-toolbar__button--icon',
        'top-toolbar__button--transparent-when-disabled',
        { 'top-toolbar__button--disabled': !isTableActive },
        'icon-insert-table-row-below'
      ]"
      type="button"
      title="Add row after"
      aria-label="Add row"
      :disabled="
        !activeTextEditor || !isTableActive || isCellLockedComputed || isCellHiddenComputed
      "
      @click="addRow"
    ></button>
    <button
      :class="[
        'top-toolbar__button',
        'top-toolbar__button--icon',
        'top-toolbar__button--transparent-when-disabled',
        { 'top-toolbar__button--disabled': !isTableActive },
        'icon-insert-table-column-right'
      ]"
      type="button"
      title="Add column after"
      aria-label="Add column"
      :disabled="
        !activeTextEditor || !isTableActive || isCellLockedComputed || isCellHiddenComputed
      "
      @click="addColumn"
    ></button>
    <button
      :class="[
        'top-toolbar__button',
        'top-toolbar__button--icon',
        'top-toolbar__button--transparent-when-disabled',
        { 'top-toolbar__button--disabled': !isTableActive },
        'icon-delete-table-row'
      ]"
      type="button"
      title="Delete row"
      aria-label="Delete row"
      :disabled="
        !activeTextEditor || !isTableActive || isCellLockedComputed || isCellHiddenComputed
      "
      @click="deleteRow"
    ></button>
    <button
      :class="[
        'top-toolbar__button',
        'top-toolbar__button--icon',
        'top-toolbar__button--transparent-when-disabled',
        { 'top-toolbar__button--disabled': !isTableActive },
        'icon-delete-table-column'
      ]"
      type="button"
      title="Delete column"
      aria-label="Delete column"
      :disabled="
        !activeTextEditor || !isTableActive || isCellLockedComputed || isCellHiddenComputed
      "
      @click="deleteColumn"
    ></button>
    <button
      :class="[
        'top-toolbar__button',
        'top-toolbar__button--icon',
        'top-toolbar__button--transparent-when-disabled',
        { 'top-toolbar__button--disabled': !isTableActive },
        'icon-delete-table'
      ]"
      type="button"
      title="Delete table"
      aria-label="Delete table"
      :disabled="
        !activeTextEditor || !isTableActive || isCellLockedComputed || isCellHiddenComputed
      "
      @click="deleteTable"
    ></button>

    <!-- visual separator -->

    <!-- Math (placeholder) -->
    <button
      class="top-toolbar__button top-toolbar__button--icon icon-math top-toolbar__button--transparent-when-disabled"
      type="button"
      title="Insert Math Live Input Field with virtual keyboard (coming soon)"
      aria-label="Insert Math Live Input Field with virtual keyboard (coming soon)"
      :disabled="!activeTextEditor || isCellLockedComputed || isCellHiddenComputed"
      @click="placeholderMathLive"
    ></button>

    <button
      class="top-toolbar__button top-toolbar__button--icon icon-LaTeX top-toolbar__button--transparent-when-disabled"
      type="button"
      title="Insert LaTeX input field with KaTeX (coming soon)"
      aria-label="Insert LaTeX input field with KaTeX (coming soon)"
      :disabled="!activeTextEditor || isCellLockedComputed || isCellHiddenComputed"
      @click="placeholderKaTeX"
    ></button>
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
import { computed, unref } from 'vue'
import { useThemeStore } from '@renderer/stores/themes/colorThemeStore'
import { useTextEditorsStore } from '@renderer/stores/editors/textEditorsStore'
import type { Editor } from '@tiptap/vue-3'
import type { HeadingLevel } from '@renderer/types/heading-level-type'
import type { HighlightColor } from '../../types/highlight-colors-types'
import { resolveHighlightColor } from '../../code/highlight/highlight-colors'

// Stores
const themeStore = useThemeStore()
const textEditorsStore = useTextEditorsStore()

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

function isHighlightActive(color: string): boolean {
  // Simplified active check: toolbar now always applies resolved hex values,
  // so we only need to check the editor for the concrete hex. Keep a try/catch
  // to defensively handle editors that may not expose the mark in some contexts.
  const resolved = resolveHighlightColor(color as HighlightColor, isDarkMode.value)
  if (!activeTextEditor.value) return false
  const edAny = activeTextEditor.value as any
  try {
    return !!edAny.isActive('highlight', { color: resolved })
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

// Formatting action functions
function toggleBold(): void {
  runCommand((editor) => editor.chain().focus().toggleBold().run())
}
function toggleItalic(): void {
  runCommand((editor) => editor.chain().focus().toggleItalic().run())
}
function toggleUnderline(): void {
  runCommand((editor) => editor.chain().focus().toggleUnderline().run())
}
function toggleHighlight(color?: HighlightColor): void {
  runCommand((editor) => {
    // TipTap highlight expects attribute { color } when multicolor: true
    const resolved = color ? resolveHighlightColor(color, isDarkMode.value) : undefined
    ;(editor as any)
      .chain()
      .focus()
      .toggleHighlight(resolved ? { color: resolved } : undefined)
      .run()
  })
}
function toggleSubscript(): void {
  runCommand((editor) => {
    ;(editor as any).chain().focus().toggleSubscript().run()
  })
}
function toggleSuperscript(): void {
  runCommand((editor) => {
    ;(editor as any).chain().focus().toggleSuperscript().run()
  })
}
function toggleBulletList(): void {
  runCommand((editor) => editor.chain().focus().toggleBulletList().run())
}
function toggleOrderedList(): void {
  runCommand((editor) => editor.chain().focus().toggleOrderedList().run())
}

function toggleHeading(level: HeadingLevel): void {
  runCommand((ed) => ed.chain().focus().toggleHeading({ level }).run())
}

/* History: Use electron ctrl+z and ctrl+y for undo/redo
function undo(): void {
  runCommand((ed) => ed.chain().focus().undo().run())
}
function redo(): void {
  runCommand((ed) => ed.chain().focus().redo().run())
}
*/

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

function placeholderMathLive(): void {
  // Intentionally left blank; future MathLive support will hook in here.
  console.log('MathLive button in toolbar clicked.  Feature coming soon!')
}
function placeholderKaTeX(): void {
  // Intentionally left blank; future KaTeX support will hook in here.
  console.log('KaTeX button in toolbar clicked.  Feature coming soon!')
}

// Active state helpers
function isActive(markOrNode: string, attrs?: Record<string, unknown>): boolean {
  return !!activeTextEditor.value?.isActive(markOrNode, attrs)
}
function isActiveHeading(level: number): boolean {
  const result = !!activeTextEditor.value?.isActive('heading', { level })
  console.log('isActiveHeading', level, result)
  return result
}
</script>

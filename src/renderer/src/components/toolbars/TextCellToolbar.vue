<template>
  <!-- Toolbar is decoupled from the TextCell component tree; it looks up the
       currently selected cell's editor via the store. -->
  <div
    v-if="activeTextEditor"
    class="button-row-flex-wrap-base"
    :class="{ 'is-dark': isDarkMode }"
    role="toolbar"
    aria-label="Text cell formatting toolbar"
  >
    <!-- BOLD -->
    <button
      class="top-toolbar-button icon icon-bold"
      type="button"
      :class="{ active: isActive('bold') }"
      title="Bold (Ctrl+B)"
      aria-label="Bold"
      :disabled="!canRunCommand('toggleBold')"
      @click="toggleBold"
    ></button>

    <!-- ITALIC -->
    <button
      class="top-toolbar-button icon icon-italic"
      type="button"
      :class="{ active: isActive('italic') }"
      title="Italic (Ctrl+I)"
      aria-label="Italic"
      :disabled="!canRunCommand('toggleItalic')"
      @click="toggleItalic"
    ></button>

    <!-- UNDERLINE -->
    <button
      class="top-toolbar-button icon icon-underline"
      type="button"
      :class="{ active: isActive('underline') }"
      title="Underline"
      aria-label="Underline"
      :disabled="!canRunCommand('toggleUnderline')"
      @click="toggleUnderline"
    ></button>

    <!-- SUBSCRIPT -->
    <button
      class="top-toolbar-button icon icon-subscript"
      type="button"
      :class="{ active: isActive('subscript') }"
      title="Subscript"
      aria-label="Subscript"
      :disabled="!canRunCommand('toggleSubscript')"
      @click="toggleSubscript"
    ></button>

    <!-- SUPERSCRIPT -->
    <button
      class="top-toolbar-button icon icon-superscript"
      type="button"
      :class="{ active: isActive('superscript') }"
      title="Superscript"
      aria-label="Superscript"
      :disabled="!canRunCommand('toggleSuperscript')"
      @click="toggleSuperscript"
    ></button>

    <!-- BULLET LIST -->
    <button
      class="top-toolbar-button icon icon-bullet-list"
      type="button"
      :class="{ active: isActive('bulletList') }"
      title="Bullet list"
      aria-label="Bullet list"
      :disabled="!activeTextEditor"
      @click="toggleBulletList"
    ></button>

    <!-- ORDERED LIST -->
    <button
      class="top-toolbar-button icon icon-numbered-list"
      type="button"
      :class="{ active: isActive('orderedList') }"
      title="Numbered list"
      aria-label="Numbered list"
      :disabled="!activeTextEditor"
      @click="toggleOrderedList"
    ></button>

    <!-- HEADING 1-5 -->
    <button
      class="top-toolbar-button icon icon-heading-1"
      type="button"
      :class="{ active: isActiveHeading(1) }"
      title="Heading 1"
      aria-label="Heading 1"
      :disabled="!activeTextEditor"
      @click="toggleHeading(1)"
    ></button>
    <button
      class="top-toolbar-button icon icon-heading-2"
      type="button"
      :class="{ active: isActiveHeading(2) }"
      title="Heading 2"
      aria-label="Heading 2"
      :disabled="!activeTextEditor"
      @click="toggleHeading(2)"
    ></button>
    <button
      class="top-toolbar-button icon icon-heading-3"
      type="button"
      :class="{ active: isActiveHeading(3) }"
      title="Heading 3"
      aria-label="Heading 3"
      :disabled="!activeTextEditor"
      @click="toggleHeading(3)"
    ></button>
    <button
      class="top-toolbar-button icon icon-heading-4"
      type="button"
      :class="{ active: isActiveHeading(4) }"
      title="Heading 4"
      aria-label="Heading 4"
      :disabled="!activeTextEditor"
      @click="toggleHeading(4)"
    ></button>
    <button
      class="top-toolbar-button icon icon-heading-5"
      type="button"
      :class="{ active: isActiveHeading(5) }"
      title="Heading 5"
      aria-label="Heading 5"
      :disabled="!activeTextEditor"
      @click="toggleHeading(5)"
    ></button>

    <!-- Highlight buttons: fixed four tokens; background set by resolver -->
    <button
      class="top-toolbar-button icon icon-highlight-pen"
      type="button"
      :style="{ backgroundColor: resolveHighlightColor('orange-highlighting', isDarkMode) }"
      :class="{ 'is-active': isHighlightActive('orange-highlighting') }"
      title="Highlight Orange"
      aria-label="Highlight Orange"
      @click="toggleHighlight('orange-highlighting')"
    ></button>

    <button
      class="top-toolbar-button icon icon-highlight-pen"
      type="button"
      :style="{ backgroundColor: resolveHighlightColor('blue-highlighting', isDarkMode) }"
      :class="{ 'is-active': isHighlightActive('blue-highlighting') }"
      title="Highlight Blue"
      aria-label="Highlight Blue"
      @click="toggleHighlight('blue-highlighting')"
    ></button>

    <button
      class="top-toolbar-button icon icon-highlight-pen"
      type="button"
      :style="{ backgroundColor: resolveHighlightColor('green-highlighting', isDarkMode) }"
      :class="{ 'is-active': isHighlightActive('green-highlighting') }"
      title="Highlight Green"
      aria-label="Highlight Green"
      @click="toggleHighlight('green-highlighting')"
    ></button>

    <button
      class="top-toolbar-button icon icon-highlight-pen"
      type="button"
      :style="{ backgroundColor: resolveHighlightColor('red-highlighting', isDarkMode) }"
      :class="{ 'is-active': isHighlightActive('red-highlighting') }"
      title="Highlight Red"
      aria-label="Highlight Red"
      @click="toggleHighlight('red-highlighting')"
    ></button>

    <!-- Table controls -->
    <button
      class="top-toolbar-button icon icon-table"
      type="button"
      title="Insert 3x3 table"
      aria-label="Insert table"
      :disabled="!activeTextEditor"
      @click="insertTable"
    ></button>
    <button
      class="top-toolbar-button icon icon-insert-table-row-below"
      type="button"
      title="Add row after"
      aria-label="Add row"
      :disabled="!isTableActive"
      @click="addRow"
    ></button>
    <button
      class="top-toolbar-button icon icon-insert-table-column-right"
      type="button"
      title="Add column after"
      aria-label="Add column"
      :disabled="!isTableActive"
      @click="addColumn"
    ></button>
    <button
      class="top-toolbar-button icon delete-button icon-delete-table-row"
      type="button"
      title="Delete row"
      aria-label="Delete row"
      :disabled="!isTableActive"
      @click="deleteRow"
    ></button>
    <button
      class="top-toolbar-button icon delete-button icon-delete-table-column"
      type="button"
      title="Delete column"
      aria-label="Delete column"
      :disabled="!isTableActive"
      @click="deleteColumn"
    ></button>
    <button
      class="top-toolbar-button icon delete-button icon-delete-table"
      type="button"
      title="Delete table"
      aria-label="Delete table"
      :disabled="!isTableActive"
      @click="deleteTable"
    ></button>

    <!-- Math (placeholder) -->
    <button
      class="top-toolbar-button icon icon-math-live-block"
      type="button"
      title="Math Live Input Field with virtual keyboard (coming soon)"
      aria-label="Math Live (coming soon)"
      :disabled="!activeTextEditor"
      @click="placeholderMathLive"
    ></button>

    <button
      class="top-toolbar-button icon icon-math-katex-block"
      type="button"
      title="KaTeX (coming soon)"
      aria-label="LaTeX input field with KaTeX(coming soon)"
      :disabled="!activeTextEditor"
      @click="placeholderKaTeX"
    ></button>
  </div>
  <div v-else class="text-cell-toolbar placeholder" aria-hidden="true">Editor not ready</div>
</template>

<script setup lang="ts">
/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * TextCellToolbar.vue
 * A detached toolbar controlling the active text (Tiptap) editor. It resolves
 * the editor instance via the selection + textEditors stores so the toolbar
 * can live anywhere in the component tree.
 */
import { computed } from 'vue'
import { useThemeStore } from '@renderer/stores/themes/colorThemeStore'
import { useCellSelectionStore } from '@renderer/stores/toolbar-cell-communication/cellSelectionStore'
import { useTextEditorsStore } from '@renderer/stores/editors/textEditorsStore'
import type { Editor } from '@tiptap/vue-3'
import type { HeadingLevel } from '@renderer/types/heading-level-type'
import type { HighlightColor } from '../../types/highlight-colors-types'
import { resolveHighlightColor } from '../../code/highlight/highlight-colors'
// Stores
const themeStore = useThemeStore()
const cellSelectionStore = useCellSelectionStore()
const textEditorsStore = useTextEditorsStore()

// Reactive refs
const isDarkMode = computed(() => !!themeStore.isDarkMode)
const activeTextEditor = computed<Editor | null>(() =>
  textEditorsStore.getEditorByCellId(cellSelectionStore.selectedCellId)
)

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

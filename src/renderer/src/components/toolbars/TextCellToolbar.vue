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
    <!--  BOLD -->
    <button
      class="top-toolbar-button icon icon-bold"
      type="button"
      :class="{ active: isActive('bold') }"
      title="Bold (Ctrl+B)"
      aria-label="Bold"
      :disabled="!canRunCommand('toggleBold')"
      @click="toggleBold"
    ></button>
    <!--  ITALIC -->
    <button
      class="top-toolbar-button icon icon-italic"
      type="button"
      :class="{ active: isActive('italic') }"
      title="Italic (Ctrl+I)"
      aria-label="Italic"
      :disabled="!canRunCommand('toggleItalic')"
      @click="toggleItalic"
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
    <!-- HEADING 1 -->
    <button
      class="top-toolbar-button icon icon-heading-1"
      type="button"
      :class="{ active: isActiveHeading(1) }"
      title="Heading 1"
      aria-label="Heading 1"
      :disabled="!activeTextEditor"
      @click="toggleHeading(1)"
    ></button>
    <!-- HEADING 2 -->
    <button
      class="top-toolbar-button icon icon-heading-2"
      type="button"
      :class="{ active: isActiveHeading(2) }"
      title="Heading 2"
      aria-label="Heading 2"
      :disabled="!activeTextEditor"
      @click="toggleHeading(2)"
    ></button>
    <!-- HEADING 3 -->
    <button
      class="top-toolbar-button icon icon-heading-3"
      type="button"
      :class="{ active: isActiveHeading(3) }"
      title="Heading 3"
      aria-label="Heading 3"
      :disabled="!activeTextEditor"
      @click="toggleHeading(3)"
    ></button>
    <!-- HEADING 4 -->
    <button
      class="top-toolbar-button icon  icon-heading-4"
      type="button"
      :class="{ active: isActiveHeading(4) }"
      title="Heading 4"
      aria-label="Heading 4"
      :disabled="!activeTextEditor"
      @click="toggleHeading(4)"
    ></button>
    <!-- HEADING 5 -->
    <button
      class="top-toolbar-button icon icon-heading-5"
      type="button"
      :class="{ active: isActiveHeading(5) }"
      title="Heading 5"
      aria-label="Heading 5"
      :disabled="!activeTextEditor"
      @click="toggleHeading(5)"
    ></button>


    <!-- Tables -->
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


    <!-- Math (placeholder button - feature removed, kept for future implementation) -->
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


    <!-- History: Use electron ctrl+z and ctrl+y for undo/redo
    <button
      class="toolbar-btn icon-undo"
      type="button"
      title="Undo (Ctrl+Z)"
      aria-label="Undo"
      :disabled="!canRunCommand('undo')"
      @click="undo"
    />
    <button
      class="toolbar-btn icon-redo"
      type="button"
      title="Redo (Ctrl+Y)"
      aria-label="Redo"
      :disabled="!canRunCommand('redo')"
      @click="redo"
    />-->
  </div>
  <div v-else class="text-cell-toolbar placeholder" aria-hidden="true">Editor not ready</div>
</template>

<script setup lang="ts">
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
// Stores
const themeStore = useThemeStore()
const cellSelectionStore = useCellSelectionStore()
const textEditorsStore = useTextEditorsStore()

// Reactive refs
const isDarkMode = computed(() => !!themeStore.isDarkMode)
const activeTextEditor = computed<Editor | null>(() =>
  textEditorsStore.getEditorByCellId(cellSelectionStore.selectedCellId)
)

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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;(editor as any).chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()
  })
}
function addRow(): void {
  runCommand((editor) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;(editor as any).chain().focus().addRowAfter().run()
  })
}
function addColumn(): void {
  runCommand((editor) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;(editor as any).chain().focus().addColumnAfter().run()
  })
}
function deleteRow(): void {
  runCommand((editor) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;(editor as any).chain().focus().deleteRow().run()
  })
}
function deleteColumn(): void {
  runCommand((editor) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;(editor   as any).chain().focus().deleteColumn().run()
  })
}
function deleteTable(): void {
  runCommand((editor) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

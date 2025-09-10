<template>
  <!-- Toolbar is decoupled from the TextCell component tree; it looks up the
       currently selected cell's editor via the store. -->
  <div
    v-if="activeTextEditor"
    class="text-cell-toolbar"
    :class="{ 'is-dark': isDarkMode }"
    role="toolbar"
    aria-label="Text cell formatting toolbar"
  >
    <!-- Inline Formatting -->
    <button
      class="toolbar-btn icon-bold"
      type="button"
      :class="{ active: isActive('bold') }"
      title="Bold (Ctrl+B)"
      aria-label="Bold"
      :disabled="!canRunCommand('toggleBold')"
      @click="toggleBold"
    />
    <button
      class="toolbar-btn icon-italic"
      type="button"
      :class="{ active: isActive('italic') }"
      title="Italic (Ctrl+I)"
      aria-label="Italic"
      :disabled="!canRunCommand('toggleItalic')"
      @click="toggleItalic"
    />

    <!-- Lists -->
    <button
      class="toolbar-btn icon-bullet-list"
      type="button"
      :class="{ active: isActive('bulletList') }"
      title="Bullet list"
      aria-label="Bullet list"
      :disabled="!activeTextEditor"
      @click="toggleBulletList"
    />
    <button
      class="toolbar-btn icon-numbered-list"
      type="button"
      :class="{ active: isActive('orderedList') }"
      title="Numbered list"
      aria-label="Numbered list"
      :disabled="!activeTextEditor"
      @click="toggleOrderedList"
    />

    <!-- Headings (compact render from config array) -->
    <template v-for="heading in headingLevels" :key="'heading-' + heading">
      <button
        class="toolbar-btn"
        :class="['icon-heading-' + heading, { active: isActiveHeading(heading) }]"
        type="button"
        :title="'Heading ' + heading"
        :aria-label="'Heading ' + heading"
        :disabled="!activeTextEditor"
        @click="toggleHeading(heading)"
      />
    </template>

    <span class="sep" aria-hidden="true">|</span>

    <!-- Tables -->
    <button
      class="toolbar-btn icon-table"
      type="button"
      title="Insert 3x3 table"
      aria-label="Insert table"
      :disabled="!activeTextEditor"
      @click="insertTable"
    />
    <button
      class="toolbar-btn icon-insert-table-row-below"
      type="button"
      title="Add row after"
      aria-label="Add row"
      :disabled="!isTableActive"
      @click="addRow"
    />
    <button
      class="toolbar-btn icon-insert-table-column-right"
      type="button"
      title="Add column after"
      aria-label="Add column"
      :disabled="!isTableActive"
      @click="addColumn"
    />
    <button
      class="toolbar-btn delete-button icon-delete-table-row"
      type="button"
      title="Delete row"
      aria-label="Delete row"
      :disabled="!isTableActive"
      @click="deleteRow"
    />
    <button
      class="toolbar-btn delete-button icon-delete-table-column"
      type="button"
      title="Delete column"
      aria-label="Delete column"
      :disabled="!isTableActive"
      @click="deleteColumn"
    />
    <button
      class="toolbar-btn delete-button icon-delete-table"
      type="button"
      title="Delete table"
      aria-label="Delete table"
      :disabled="!isTableActive"
      @click="deleteTable"
    />

    <span class="sep" aria-hidden="true">|</span>

    <!-- Math (placeholder button - feature removed, kept for future implementation) -->
    <button
      class="toolbar-btn icon-math-live-block"
      type="button"
      title="Math Live Input Field with virtual keyboard (coming soon)"
      aria-label="Math Live (coming soon)"
      :disabled="!activeTextEditor"
      @click="placeholderMathLive"
    />

    <button
      class="toolbar-btn icon-math-katex-block"
      type="button"
      title="KaTeX (coming soon)"
      aria-label="LaTeX input field with KaTeX(coming soon)"
      :disabled="!activeTextEditor"
      @click="placeholderKaTeX"
    />

    <span class="sep" aria-hidden="true">|</span>

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
import { useCellSelectionStore } from '@renderer/stores/toolbar_cell_communication/cellSelectionStore'
import { useTextEditorsStore } from '@renderer/stores/editors/textEditorsStore'
import type { Editor } from '@tiptap/vue-3'

// Stores
const themeStore = useThemeStore()
const cellSelectionStore = useCellSelectionStore()
const textEditorsStore = useTextEditorsStore()

// Reactive refs
const isDarkMode = computed(() => !!themeStore.isDarkMode)
const activeTextEditor = computed<Editor | null>(() =>
  textEditorsStore.getEditorByCellId(cellSelectionStore.selectedCellId)
)

// Simple config for heading buttons
type HeadingLevel = 1 | 2 | 3 | 4
const headingLevels: HeadingLevel[] = [1, 2, 3, 4]

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
  runCommand((ed) => ed.chain().focus().toggleBold().run())
}
function toggleItalic(): void {
  runCommand((ed) => ed.chain().focus().toggleItalic().run())
}
function toggleBulletList(): void {
  runCommand((ed) => ed.chain().focus().toggleBulletList().run())
}
function toggleOrderedList(): void {
  runCommand((ed) => ed.chain().focus().toggleOrderedList().run())
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
  runCommand((ed) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;(ed as any).chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()
  })
}
function addRow(): void {
  runCommand((ed) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;(ed as any).chain().focus().addRowAfter().run()
  })
}
function addColumn(): void {
  runCommand((ed) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;(ed as any).chain().focus().addColumnAfter().run()
  })
}
function deleteRow(): void {
  runCommand((ed) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;(ed as any).chain().focus().deleteRow().run()
  })
}
function deleteColumn(): void {
  runCommand((ed) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;(ed as any).chain().focus().deleteColumn().run()
  })
}
function deleteTable(): void {
  runCommand((ed) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;(ed as any).chain().focus().deleteTable().run()
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
  return !!activeTextEditor.value?.isActive('heading', { level })
}
</script>

<style scoped>
@import '../../css/main-imports-this-css/design.css'; /* ensure design tokens (height, padding vars) are available */
@import '../../css/toolbar-base.css';
/* Base styling moved to toolbar-base.css; only overrides below */

/* Rely on shared .toolbar-btn styles from toolbar-base.css; only override active state if needed */
.toolbar-btn.active {
  background: var(--button-on-color, #2563eb);
  color: #fff;
  border: var(--toolbar-button-border-hover, 1px solid #2563eb);
}
.sep {
  opacity: 0.5;
  user-select: none;
}

/* Dark mode specific fine-tuning (variables already swapped by theme store) */
/* Optional dark-mode fallback (variables should already swap) */
.text-cell-toolbar.is-dark {
  background: var(--toolbar-background, #1f2937);
}
.text-cell-toolbar.is-dark .toolbar-btn.active {
  /* Ensure contrast in dark mode if button-on-color is dark */
  color: var(--button-active-fg-dark, #fff);
}

/* Normalize icon-only button glyph metrics so all buttons visually share same height */
.toolbar-btn[class*='icon-'] {
  line-height: 1; /* remove font ascent differences */
  font-size: var(--toolbar-font-size, 1em); /* keep consistent with text buttons */
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: var(--toolbar-button-height, 1.5em); /* use design token; fallback if not loaded */
  padding: var(--toolbar-button-padding, 0.1em 0.4em 0.1em 0.4em);
}
</style>

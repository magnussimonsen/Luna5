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
      class="tb-btn"
      type="button"
      :class="{ active: isActive('bold') }"
      :disabled="!canRunCommand('toggleBold')"
      @click="toggleBold"
    >
      Bold
    </button>
    <button
      class="tb-btn"
      type="button"
      :class="{ active: isActive('italic') }"
      title="Italic (Ctrl+I)"
      :disabled="!canRunCommand('toggleItalic')"
      @click="toggleItalic"
    >
      <i>Italic</i>
    </button>

    <!-- Lists -->
    <button
      class="tb-btn"
      type="button"
      :class="{ active: isActive('bulletList') }"
      title="Bullet list"
      :disabled="!activeTextEditor"
      @click="toggleBulletList"
    >
      • List
    </button>
    <button
      class="tb-btn"
      type="button"
      :class="{ active: isActive('orderedList') }"
      title="Numbered list"
      :disabled="!activeTextEditor"
      @click="toggleOrderedList"
    >
      1. List
    </button>

    <!-- Headings (compact render from config array) -->
    <template v-for="heading in headingLevels" :key="'heading-' + heading">
      <button
        class="tb-btn"
        type="button"
        :class="{ active: isActiveHeading(heading) }"
        :title="'Heading ' + heading"
        :disabled="!activeTextEditor"
        @click="toggleHeading(heading)"
      >
        H{{ heading }}
      </button>
    </template>

    <span class="sep" aria-hidden="true">|</span>

    <!-- History -->
    <button
      class="tb-btn"
      type="button"
      title="Undo (Ctrl+Z)"
      :disabled="!canRunCommand('undo')"
      @click="undo"
    >
      Undo
    </button>
    <button
      class="tb-btn"
      type="button"
      title="Redo (Ctrl+Y)"
      :disabled="!canRunCommand('redo')"
      @click="redo"
    >
      Redo
    </button>
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
      case 'undo':
        return editor.can().chain().focus().undo().run()
      case 'redo':
        return editor.can().chain().focus().redo().run()
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
function undo(): void {
  runCommand((ed) => ed.chain().focus().undo().run())
}
function redo(): void {
  runCommand((ed) => ed.chain().focus().redo().run())
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
@import '../../css/toolbar-base.css';
.text-cell-toolbar {
  display: flex;
  align-items: center;
  gap: 0.2em;
  font-size: 0.8em;
  padding: 0.4em 0.4em;
  /* Use theme variables coming from colorThemeStore */
  background: var(--toolbar-background, var(--app-background, #f3f5f7));
  border-bottom: 1px solid var(--border-color, #d0d7de);
  color: var(--ui-text-color, var(--text-color, #222));
  font-weight: 500;
}

.text-cell-toolbar.placeholder {
  opacity: 0.6;
  font-style: italic;
}

.tb-btn {
  font: inherit;
  padding: 0.15rem 0.45rem;
  border: 1px solid var(--button-border-color, var(--border-color, #d0d7de));
  background: var(--button-background-color, #ffffff);
  border-radius: 3px;
  cursor: pointer;
  line-height: 1.1;
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  color: inherit;
  transition:
    background-color 120ms ease,
    border-color 120ms ease,
    color 120ms ease;
}
.tb-btn:hover:not(:disabled) {
  background: var(--button-hover-color, #eef2f5);
  border-color: var(--button-border-hover-color, var(--button-border-color, #d0d7de));
}
.tb-btn:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}
.tb-btn.active {
  background: var(--button-on-color, #2563eb);
  color: #fff;
  border-color: var(--button-border-hover-color, var(--button-on-color, #2563eb));
}
.sep {
  opacity: 0.5;
  user-select: none;
}

/* Dark mode specific fine-tuning (variables already swapped by theme store) */
.text-cell-toolbar.is-dark {
  /* Provide subtle fallback just in case theme variables haven't applied yet */
  background: var(--toolbar-background, #1f2937);
  border-bottom: 1px solid var(--border-color, #374151);
  color: var(--ui-text-color, #e5e7eb);
}
.text-cell-toolbar.is-dark .tb-btn.active {
  /* Ensure contrast in dark mode if button-on-color is dark */
  color: var(--button-active-fg-dark, #fff);
}
</style>

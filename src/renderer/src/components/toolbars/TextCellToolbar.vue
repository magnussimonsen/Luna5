<template>
  <div
    v-if="editor"
    class="text-cell-toolbar"
    :class="{ 'is-dark': isDark }"
    role="toolbar"
    aria-label="Text cell toolbar"
  >
    <button
      class="tb-btn"
      :class="{ active: editor?.isActive('bold') }"
      type="button"
      :disabled="!editor?.can().chain().focus().toggleBold().run()"
      @click="editor?.chain().focus().toggleBold().run()"
    >
      Bold
    </button>
    <button
      class="tb-btn"
      :class="{ active: editor?.isActive('italic') }"
      type="button"
      title="Italic (Ctrl+I)"
      :disabled="!editor?.can().chain().focus().toggleItalic().run()"
      @click="editor?.chain().focus().toggleItalic().run()"
    >
      <i>Italic</i>
    </button>
    <button
      class="tb-btn"
      :class="{ active: editor?.isActive('bulletList') }"
      type="button"
      title="Bullet list"
      :disabled="!editor"
      @click="editor?.chain().focus().toggleBulletList().run()"
    >
      • List
    </button>
    <button
      class="tb-btn"
      :class="{ active: editor?.isActive('orderedList') }"
      type="button"
      title="Numbered list"
      :disabled="!editor"
      @click="editor?.chain().focus().toggleOrderedList().run()"
    >
      1. List
    </button>
    <button
      class="tb-btn"
      :class="{ active: editor?.isActive('heading', { level: 1 }) }"
      type="button"
      title="Heading 1"
      :disabled="!editor"
      @click="editor?.chain().focus().toggleHeading({ level: 1 }).run()"
    >
      H1
    </button>
    <button
      class="tb-btn"
      :class="{ active: editor?.isActive('heading', { level: 2 }) }"
      type="button"
      title="Heading 2"
      :disabled="!editor"
      @click="editor?.chain().focus().toggleHeading({ level: 2 }).run()"
    >
      H2
    </button>
      <button
      class="tb-btn"
      :class="{ active: editor?.isActive('heading', { level: 3 }) }"
      type="button"
      title="Heading 3"
      :disabled="!editor"
      @click="editor?.chain().focus().toggleHeading({ level: 3 }).run()"
    >
      H3
    </button>
      <button
      class="tb-btn"
      :class="{ active: editor?.isActive('heading', { level: 4 }) }"
      type="button"
      title="Heading 4"
      :disabled="!editor"
      @click="editor?.chain().focus().toggleHeading({ level: 4 }).run()"
    >
      H4
    </button>
    <span class="sep" aria-hidden="true">|</span>
    <button
      class="tb-btn"
      type="button"
      title="Undo (Ctrl+Z)"
      :disabled="!editor?.can().chain().focus().undo().run()"
      @click="editor?.chain().focus().undo().run()"
    >
      Undo
    </button>
    <button
      class="tb-btn"
      type="button"
      title="Redo (Ctrl+Y)"
      :disabled="!editor?.can().chain().focus().redo().run()"
      @click="editor?.chain().focus().redo().run()"
    >
      Redo
    </button>
  </div>
  <div v-else class="text-cell-toolbar placeholder" aria-hidden="true">Editor not ready</div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useThemeStore } from '@renderer/stores/themes/colorThemeStore'
import { useCellSelectionStore } from '@renderer/stores/toolbar_cell_communication/cellSelectionStore'
import { useTextEditorsStore } from '@renderer/stores/editors/textEditorsStore'

const themeStore = useThemeStore()
const isDark = computed(() => !!themeStore.isDarkMode)
const selectionStore = useCellSelectionStore()
const textEditorsStore = useTextEditorsStore()
const editor = computed(() => textEditorsStore.getEditor(selectionStore.selectedCellId))
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

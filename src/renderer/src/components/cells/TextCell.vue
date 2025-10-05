<template>
  <div class="text-cell-wrapper" :data-locked="isCellLocked ? 'true' : null">
    <div
      v-if="editor"
      class="tiptap-editor"
      :class="{ 'is-locked': isCellLocked }"
      :style="{
        fontSize: textCellFontSize,
        fontFamily: 'var(--text-font, var(--content-font, inherit))'
      }"
      data-primary-editor="true"
    >
      <EditorContent :editor="editor" />
    </div>
    <div v-else class="tiptap-loading" :style="{ fontSize: textCellFontSize }">Loading editor…</div>
  </div>
</template>

<script setup lang="ts">
/**
 * TextCell.vue
 * Renders a rich text (Tiptap) editor inside a notebook cell. The editor
 * persists its HTML content to the workspace store and exposes its instance
 * through a central registry so that a detached toolbar component can issue
 * formatting commands.
 */
import { computed, onBeforeUnmount, watch } from 'vue'
import { useFontSizeStore } from '@renderer/stores/fonts/fontSizeStore'
import { useWorkspaceStore } from '@renderer/stores/workspaces/workspaceStore'
import type { TextCell } from '@renderer/types/notebook-cell-types'
import { EditorContent } from '@tiptap/vue-3'
import { createTiptapEditor, VueTiptapEditor } from '@renderer/code/tiptap/tiptap-initialization'
import { useTextEditorsStore } from '@renderer/stores/editors/textEditorsStore'

// Props
const { cell } = defineProps<{ cell: TextCell }>()

// Stores
const fontSizeStore = useFontSizeStore()
const workspaceStore = useWorkspaceStore()
const textEditorsStore = useTextEditorsStore()

// Derived reactive values
const textCellFontSize = computed(() => fontSizeStore.fontSizes.textEditorCellFontSize)
const isCellLocked = computed<boolean>(function computeIsLocked() {
  return !!cell.hidden || !!cell.softLocked || !!cell.hardLocked || !!cell.softDeleted
})

// -- Editor Initialization --------------------------------------------------
const tiptapEditor = createTiptapEditor({
  editable: !isCellLocked.value,
  content: cell.cellInputContent || '',
  cellId: cell.id,
  onUpdate: ({ editor }) => {
    if (isCellLocked.value) return
    const htmlContent = (editor as VueTiptapEditor).getHTML()
    workspaceStore.setCellInputContent(cell.id, htmlContent)
  }
})

// Register editor so toolbar can find it via selected cell id
textEditorsStore.registerEditorForCell(cell.id, tiptapEditor)

// -- Watchers ---------------------------------------------------------------
/** Keep editor editable state synced with lock flags. */
watch(isCellLocked, function onLockStateChanged(locked) {
  tiptapEditor.setEditable(!locked)
})

/**
 * If external cell content changes (e.g., file load), update the editor only
 * when different to avoid resetting selection unnecessarily.
 */
watch(
  () => cell.cellInputContent,
  function onExternalContentChange(nextContent) {
    const currentHtml = tiptapEditor.getHTML()
    const incomingHtml = nextContent || ''
    if (incomingHtml !== currentHtml) {
      tiptapEditor.commands.setContent(incomingHtml)
    }
  }
)

// -- Cleanup ----------------------------------------------------------------
onBeforeUnmount(function onBeforeUnmountTextCell() {
  textEditorsStore.unregisterEditorForCell(cell.id)
  tiptapEditor.destroy()
})

// Expose to template
const editor = tiptapEditor
</script>

<style scoped>
.text-cell-wrapper {
  position: relative;
  border: 1px solid var(--cell-border-color);
  background: var(--cell-background, #fff);
  border-radius: 2px;
  width: 100%;
  padding: 0;
}
.tiptap-editor.is-locked {
  opacity: 0.75;
  pointer-events: none;
  filter: grayscale(0.15);
}
.tiptap-editor :deep(.ProseMirror) {
  outline: none;
  min-height: 1.5em;
  line-height: 1.4;
  /* Prefer --text-font, fall back to legacy --content-font, then inherit */
  font-family: var(--text-font, var(--content-font, inherit));
  color: var(--text-color, #222);
  padding: 0em 0.4em; /* Added horizontal padding for better text spacing */
}
.tiptap-editor :deep(.ProseMirror p) {
  margin: 0 0 0.5em;
}

.tiptap-editor :deep(.ProseMirror h1),
.tiptap-editor :deep(.ProseMirror h2),
.tiptap-editor :deep(.ProseMirror h3),
.tiptap-editor :deep(.ProseMirror h4),
.tiptap-editor :deep(.ProseMirror h5),
.tiptap-editor :deep(.ProseMirror h6) {
  margin: 0em;
}
.tiptap-editor :deep(.ProseMirror p:last-child) {
  margin-bottom: 0;
}
/* Ensure math block occupies full row width */
.tiptap-editor :deep(.ProseMirror > div[data-math-block]),
.tiptap-editor :deep(.ProseMirror > [data-node-view-wrapper][data-math-block]) {
  display: block;
  width: 100%;
  max-width: 100%;
}
.tiptap-editor :deep(.tiptap-mathematics-render[data-type='inline-math']) {
  display: inline-flex;
  align-items: center;
  padding: 0.1em 0.35em;
  border-radius: 6px;
  transition:
    background-color 0.12s ease-in-out,
    box-shadow 0.12s ease-in-out;
  cursor: pointer;
  background-color: transparent;
}
.tiptap-editor :deep(.tiptap-mathematics-render[data-type='inline-math']:hover),
.tiptap-editor :deep(.ProseMirror-selectednode.tiptap-mathematics-render[data-type='inline-math']) {
  background-color: var(--math-inline-hover, rgba(91, 141, 239, 0.18));
  box-shadow: inset 0 0 0 1px rgba(91, 141, 239, 0.25);
}
.tiptap-editor :deep(.tiptap-mathematics-render[data-type='block-math']) {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 0.85em auto;
  padding: 0.65em 1em;
  border-radius: 10px;
  max-width: 90%;
  transition:
    background-color 0.12s ease-in-out,
    box-shadow 0.12s ease-in-out;
  cursor: pointer;
  background-color: transparent;
}
.tiptap-editor :deep(.tiptap-mathematics-render[data-type='block-math'] .block-math-inner) {
  width: 100%;
  text-align: center;
}
.tiptap-editor :deep(.tiptap-mathematics-render[data-type='block-math']:hover),
.tiptap-editor :deep(.ProseMirror-selectednode.tiptap-mathematics-render[data-type='block-math']) {
  background-color: var(--math-block-hover, rgba(91, 141, 239, 0.14));
  box-shadow: inset 0 0 0 1px rgba(91, 141, 239, 0.2);
}
/* Table styling */
.tiptap-editor :deep(table) {
  border-collapse: collapse;
  width: 100%;
  margin: 0.4em 0 0.8em;
}
.tiptap-editor :deep(th),
.tiptap-editor :deep(td) {
  border: 1px solid var(--border-color, #d0d7de);
  padding: 0.25em 0.4em;
  vertical-align: top;
  min-width: 2em;
}
.tiptap-editor :deep(th) {
  background: var(--cell-margin-background-color, #f3f5f7);
  font-weight: 600;
}
.tiptap-editor :deep(.selectedCell) {
  outline: 2px solid var(--active-border-color, lightgreen);
  outline-offset: -2px;
}
.tiptap-loading {
  font-style: italic;
  opacity: 0.7;
  padding: 0.25em 0.4em;
}
</style>

<template>
  <div class="text-cell-wrapper" :data-locked="isLocked ? 'true' : null">
    <div
      v-if="editor"
      class="tiptap-editor"
      :class="{ 'is-locked': isLocked }"
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
import { Editor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import { useTextEditorsStore } from '@renderer/stores/editors/textEditorsStore'

// Props
const { cell } = defineProps<{ cell: TextCell }>()

// Stores
const fontSizeStore = useFontSizeStore()
const workspaceStore = useWorkspaceStore()
const textEditorsStore = useTextEditorsStore()

// Derived reactive values
const textCellFontSize = computed(() => fontSizeStore.fontSizes.textEditorCellFontSize)
const isLocked = computed<boolean>(function computeIsLocked() {
  return !!cell.hidden || !!cell.softLocked || !!cell.hardLocked || !!cell.softDeleted
})

// -- Editor Initialization --------------------------------------------------
/**
 * Create the Tiptap editor. We only include core StarterKit now; math, links,
 * media, etc. can be added later. Placeholder guides the user.
 */
const tiptapEditor = new Editor({
  editable: !isLocked.value,
  content: cell.cellInputContent || '',
  extensions: [
    StarterKit.configure({}),
    Placeholder.configure({ placeholder: 'Rich text (Markdown-like) — start typing…' })
  ],
  /**
   * Persist HTML whenever the document changes (unless locked). We store HTML
   * for now; a markdown / JSON representation could be added later.
   */
  onUpdate: function handleEditorUpdate({ editor }) {
    if (isLocked.value) return
    const htmlContent = editor.getHTML()
    workspaceStore.setCellInputContent(cell.id, htmlContent)
  }
})

// Register editor so toolbar can find it via selected cell id
textEditorsStore.registerEditorForCell(cell.id, tiptapEditor)

// -- Watchers ---------------------------------------------------------------
/** Keep editor editable state synced with lock flags. */
watch(isLocked, function onLockStateChanged(locked) {
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
      tiptapEditor.commands.setContent(incomingHtml, false)
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
  padding: 0.25rem 0.4rem;
}
.tiptap-editor :deep(.ProseMirror p) {
  margin: 0 0 0.5em;
}
.tiptap-editor :deep(.ProseMirror p:last-child) {
  margin-bottom: 0;
}
.tiptap-loading {
  font-style: italic;
  opacity: 0.7;
  padding: 0.25rem 0.4rem;
}
</style>

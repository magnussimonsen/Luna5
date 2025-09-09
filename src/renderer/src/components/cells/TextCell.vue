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
import { computed, onBeforeUnmount, watch } from 'vue'
import { useFontSizeStore } from '@renderer/stores/fonts/fontSizeStore'
import { useWorkspaceStore } from '@renderer/stores/workspaces/workspaceStore'
import type { TextCell } from '@renderer/types/notebook-cell-types'
import { Editor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import { useTextEditorsStore } from '@renderer/stores/editors/textEditorsStore'

const { cell } = defineProps<{ cell: TextCell }>()

const fontSizeStore = useFontSizeStore()
const textCellFontSize = computed(() => fontSizeStore.fontSizes.textEditorCellFontSize)
const workspaceStore = useWorkspaceStore()

const isLocked = computed<boolean>(
  () => !!cell.hidden || !!cell.softLocked || !!cell.hardLocked || !!cell.softDeleted
)

// Initialize Tiptap editor
const textEditorsStore = useTextEditorsStore()

const editor = new Editor({
  editable: !isLocked.value,
  content: cell.cellInputContent || '',
  extensions: [
    StarterKit.configure({}),
    Placeholder.configure({
      placeholder: 'Rich text (Markdown-like) — start typing…'
    })
  ],
  onUpdate: ({ editor }) => {
    if (isLocked.value) return
    const html = editor.getHTML()
    workspaceStore.setCellInputContent(cell.id, html)
  }
})

// Register for toolbar access
textEditorsStore.register(cell.id, editor)

// React to lock state changes
watch(isLocked, (locked) => {
  editor.setEditable(!locked)
})

// React to external model updates for this cell
watch(
  () => cell.cellInputContent,
  (next) => {
    const current = editor.getHTML()
    const incoming = next || ''
    if (incoming !== current) {
      // Attempt minimal update (avoid resetting selection if unchanged)
      editor.commands.setContent(incoming, false)
    }
  }
)

onBeforeUnmount(() => {
  textEditorsStore.unregister(cell.id)
  editor.destroy()
})
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

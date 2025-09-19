<template>
  <!-- Toolbar is decoupled from the TextCell component tree; it looks up the
       currently selected cell's editor via the store. -->
  <div
    class="button-row-flex-wrap-base"
    :class="{ 'is-dark': isDarkMode }"
    role="toolbar"
    aria-label="Placeholder toolbar - no cell selected"
    :style="{
      fontSize: 'var(--top-toolbar-font-size)',
      fontFamily: 'var(--ui-font)'
    }"
  >
    <button
      class="top-toolbar__button"
      type="button"
      title="No cell selected"
      aria-label="No cell selected button placeholder"
      :style="{
        fontSize: 'var(--top-toolbar-font-size)',
        fontFamily: 'var(--ui-font)'
      }"
      @click="handlePlaceholdeButtonPressed"
    >
      No cell selected button placeholder
    </button>
    <!-- <button class="top-toolbar-button" type="button" @click="handleInsertTextCell">Insert text cell</button> -->
    <!-- <button class="top-toolbar-button" type="button" @click="handleInsertPythonCell">Insert Python cell</button> -->
  </div>
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

// Stores
const themeStore = useThemeStore()
// import { useWorkspaceStore } from '@renderer/stores/workspaces/workspaceStore'
// const workspaceStore = useWorkspaceStore()

// Reactive refs
const isDarkMode = computed(() => !!themeStore.isDarkMode)
const handlePlaceholdeButtonPressed = (): void => {
  console.log('Toolbar button pressed - no action assigned yet')
}

/*const handleInsertTextCell = (): void => {
 
    workspaceStore.addTextCell()
}
const handleInsertPythonCell = (): void => {
  workspaceStore.addPythonCell()
}*/
</script>

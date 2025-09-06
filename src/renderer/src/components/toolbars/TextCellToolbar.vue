<template>
  <div
    class="text-cell-toolbar"
    :class="{ 'is-dark': isDark }"
    role="toolbar"
    aria-label="Text cell toolbar"
  >
    Text cell toolbar
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useThemeStore } from '@renderer/stores/themes/colorThemeStore'

// Placeholder: future actions (bold, italic, etc.) will go here.

const themeStore = useThemeStore()
const isDark = computed(() => !!themeStore.isDarkMode)
</script>

<style scoped>
@import '../../css/toolbar-base.css';
.text-cell-toolbar {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.8rem;
  padding: 0.4rem 0.75rem;
  background: var(--toolbar-bg, #f3f5f7);
  border-bottom: 1px solid var(--toolbar-border, #d0d7de);
  color: var(--toolbar-fg, #222);
  font-weight: 500;
}

.text-cell-toolbar.is-dark {
  background: var(--toolbar-bg-dark, #1f2937);
  border-bottom: 1px solid var(--toolbar-border-dark, #374151);
  color: var(--toolbar-fg-dark, #e5e7eb);
}
</style>

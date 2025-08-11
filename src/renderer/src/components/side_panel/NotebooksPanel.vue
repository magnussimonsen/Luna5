<template>
  <div class="notebooks-panel">
    <div class="header">
      <h3 class="title">Notebooks</h3>
      <button type="button" class="add-btn" aria-label="Create notebook" @click="onAdd">＋</button>
    </div>
    <ul v-if="notebookEntries.length" class="notebook-list" role="list">
      <li
        v-for="nb in notebookEntries"
        :key="nb.id"
        :class="['notebook-item', nb.id === currentId && 'is-active']"
        role="listitem"
      >
        <button
          type="button"
          class="nb-btn"
          :title="nb.title"
          :aria-current="nb.id === currentId ? 'true' : undefined"
          @click="select(nb.id)"
        >
          <span class="nb-title">{{ nb.title }}</span>
        </button>
      </li>
    </ul>
    <div v-else class="empty">No notebooks yet.</div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useWorkspaceStore } from '@renderer/stores/workspaces/workspaceStore'

const workspaceStore = useWorkspaceStore()

const workspace = computed(() => workspaceStore.getWorkspace())
const currentId = computed(() => workspaceStore.currentNotebookId)
const notebookEntries = computed(() => Object.values(workspace.value.notebooks))

function select(id: string): void {
  workspaceStore.selectNotebook(id)
}

function onAdd(): void {
  const base = 'Notebook'
  let idx = notebookEntries.value.length + 1
  let title = `${base} ${idx}`
  const titles = new Set(notebookEntries.value.map((n) => n.title))
  while (titles.has(title)) {
    idx += 1
    title = `${base} ${idx}`
  }
  workspaceStore.createNotebook(title)
}
</script>

<style scoped>
.notebooks-panel {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 0.6rem 0.6rem 1rem;
  font-size: 0.8rem;
}
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.title {
  margin: 0;
  font-size: 0.85rem;
  font-weight: 600;
}
.add-btn {
  cursor: pointer;
  border: 1px solid var(--cell-border-color, #ccc);
  background: #fff;
  padding: 0 0.4rem;
  border-radius: 4px;
  font-size: 0.9rem;
  line-height: 1.2;
  min-height: 1.6rem;
}
.add-btn:hover {
  background: var(--cell-selected-border, #2563eb);
  color: #fff;
  border-color: var(--cell-selected-border, #2563eb);
}
.notebook-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}
.notebook-item {
  background: yellowgreen;
}
.nb-btn {
  width: 100%;
  text-align: left;
  background: transparent;
  border: 1px solid transparent;
  padding: 0.35rem 0.45rem;
  border-radius: 4px;
  cursor: pointer;
  font: inherit;
  display: flex;
  align-items: center;
  gap: 0.4rem;
}
.nb-btn:hover {
  background: rgba(0, 0, 0, 0.05);
}
.notebook-item.is-active .nb-btn {
  background: var(--cell-selected-bg, rgba(37, 99, 235, 0.08));
  border-color: var(--cell-selected-border, #2563eb);
}
.empty {
  opacity: 0.7;
  font-style: italic;
}
</style>

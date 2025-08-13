<template>
  <div class="notebooks-panel">
    <div class="header">
      <div class="toggle-group" role="tablist" aria-label="Notebook views">
        <button
          type="button"
          :class="mode === 'active' && 'is-active'"
          class="toggle-btn"
          role="tab"
          :aria-selected="mode === 'active'"
          @click="mode = 'active'"
        >
          Notebooks
        </button>
        <button
          type="button"
          :class="mode === 'bin' && 'is-active'"
          class="toggle-btn"
          role="tab"
          :aria-selected="mode === 'bin'"
          @click="mode = 'bin'"
        >
          Bin
        </button>
      </div>
      <div v-if="mode === 'active'" class="actions">
        <button type="button" class="add-btn" aria-label="Create notebook" @click="onAdd">
          New

        </button>
        <button
          type="button"
          class="delete-btn"
          aria-label="Delete selected notebook"
          :disabled="!currentId"
          @click="onDelete"
        >
        Move to Bin
        </button>
      </div>
      <div v-else class="actions">
        <!-- Placeholder for future restore / empty bin actions -->
      </div>
    </div>
    <!-- Here we need a v-if that toggles between rendering the notebook-list of noteooks that are not deleted
     and the notebook-list of notebooks that are deleted, plus a notbook that is on top that contains all the cells that are
     deleted without deleting a notebook -->
    <ul v-if="mode === 'active' && activeNotebooks.length" class="notebook-list" role="list">
      <li
        v-for="nb in activeNotebooks"
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
    <div v-else-if="mode === 'active'" class="empty">No notebooks yet.</div>

    <ul
      v-if="mode === 'bin' && deletedNotebooks.length"
      class="notebook-list"
      role="list"
      aria-label="Deleted notebooks"
    >
      <li
        v-for="nb in deletedNotebooks"
        :key="nb.id"
        class="notebook-item is-deleted"
        role="listitem"
      >
        <div class="nb-btn deleted" :title="nb.title">
          <span class="nb-title">{{ nb.title }}</span>
          <span class="nb-meta">{{ formatDate(nb.deletedAt) }}</span>
        </div>
      </li>
    </ul>
    <div v-else-if="mode === 'bin'" class="empty">Bin is empty.</div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useWorkspaceStore } from '@renderer/stores/workspaces/workspaceStore'

const workspaceStore = useWorkspaceStore()

const workspace = computed(() => workspaceStore.getWorkspace())
const currentId = computed(() => workspaceStore.currentNotebookId)
const notebookEntries = computed(() => Object.values(workspace.value.notebooks))
// Mode toggle: active notebooks vs recycle bin list
const mode = ref<'active' | 'bin'>('active')

// Active notebooks are those present in workspace.notebooks
const activeNotebooks = computed(() => notebookEntries.value)
// Deleted notebooks come from recycle bin order for stable display
const deletedNotebooks = computed(() => {
  const ws = workspace.value
  return ws.recycleBin.notebookOrder.map((id) => ws.recycleBin.notebooks[id])
})

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

function onDelete(): void {
  if (!currentId.value) return
  // Simple confirm for now; replace with modal later
  const ok = window.confirm(
    'Delete this notebook? It will move to the Bin and can be restored later.'
  )
  if (!ok) return
  workspaceStore.deleteNotebook(currentId.value)
}

function formatDate(iso?: string): string {
  if (!iso) return ''
  try {
    const d = new Date(iso)
    return d.toLocaleDateString() + ' ' + d.toLocaleTimeString()
  } catch {
    return iso
  }
}
</script>

<style scoped>
.notebooks-panel {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 0.6rem 0.6rem 1rem;
  /* Centralized font control for entire component */
  font-family: var(--ui-font, 'Arial', sans-serif);
  font-size: var(--side-panel-menu-bar-font-size, 1em);
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
.toggle-group {
  display: flex;
  gap: 0.25rem;
}
.toggle-btn {
  cursor: pointer;
  border: 1px solid var(--button-border-color, #ccc);
  background: var(--button-transparent-off-color, transparent);
  color: var(--text-color, #222);
  padding: 0.25rem 0.5rem;
  border-radius: var(--border-radius, 4px);
  /* Inherit font settings from root */
  font: inherit;
}

.toggle-btn:hover {
  background: var(--button-hover-color, #2563eb);
  border-color: var(--button-border-hover-color, #2563eb);
}
.toggle-btn.is-active {
  background: var(--active-background-color, #2563eb);
  color: var(--text-color);
  border-color: var(--active-border-color, #2563eb);
}
.toggle-btn.is-active:hover {
  background: var(--button-hover-color, #1d4ed8);
  color: var(--text-color);
  border-color: var(--button-border-hover-color, #1d4ed8);
}
.actions {
  display: flex;
  gap: 0.25rem;
  align-items: center;
}
.add-btn {
  cursor: pointer;
  border: 1px solid var(--button-border-color, #ccc);
  background: var(--button-background-color, #fff);
  padding: 0 0.4rem;
  border-radius: 4px;
  line-height: 1.2;
  min-height: 1.6rem;
  /*Bold text*/
  font-weight: bold;
  font: inherit;
}
.add-btn:hover {
  background: var(--button-border-hover-color, #2563eb);
  color: var(--text-color, #fff);
  border-color: var(--button-border-hover-color, #2563eb);
}
.delete-btn {
  cursor: pointer;
  border: 1px solid var(--button-border-color, #ccc);
  background: var(--button-transparent-off-color, transparent);
  color: var(--text-color, #222);
  padding: 0 0.4rem;
  border-radius: 4px;
  line-height: 1.2;
  min-height: 1.6rem;
  /*Bold text*/
  font-weight: bold;
  font: inherit;
}
.delete-btn:hover {
  background: var(--delete-button-hover-color, #2563eb);
  color: var(--text-color, #fff);
  border-color: var(--delete-button-hover-color, #2563eb);
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
  background: white;
}
.nb-btn {
  width: 100%;
  text-align: left;
  background: transparent;
  border: 1px solid var(--button-border-color, #ccc);
  padding: 0.35rem 0.45rem;
  border-radius: 4px;
  cursor: pointer;
  font: inherit;
  display: flex;
  align-items: center;
  gap: 0.4rem;
}
.nb-btn:hover {
  background: var(--button-hover-color, #2563eb);
}
.notebook-item.is-active .nb-btn {
  background: var(--active-background-color, rgba(37, 99, 235, 0.08));
  border-color: var(--active-border-color, #2563eb);
}
.notebook-item.is-deleted .nb-btn,
.nb-btn.deleted {
  opacity: 0.7;
  cursor: default;
  border: 1px dashed var(--button-border-color, #ccc);
}
.nb-meta {
  margin-left: auto;
  font-size: 0.6rem;
  opacity: 0.8;
}
.empty {
  opacity: 0.7;
  font-style: italic;
}
</style>

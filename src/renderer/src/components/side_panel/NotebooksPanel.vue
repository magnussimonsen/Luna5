<template>
  <div class="notebooks-panel">
    <div class="header">
      <!-- Row 1: view toggles + move up/down -->
      <div class="row" role="tablist" aria-label="Notebook views">
        <button
          type="button"
          class="toggle-btn"
          :class="mode === 'active' && 'is-active'"
          role="tab"
          :aria-selected="mode === 'active'"
          @click="mode = 'active'"
        >
          Notebooks
        </button>
        <button
          type="button"
          class="toggle-btn"
          :class="mode === 'bin' && 'is-active'"
          role="tab"
          :aria-selected="mode === 'bin'"
          @click="mode = 'bin'"
        >
          Bin
        </button>
        <button type="button" class="toggle-btn" :disabled="!currentId" @click="moveNotebookUp">
          <span class="icon" aria-label="Move notebook up">↑</span>
        </button>
        <button type="button" class="toggle-btn" :disabled="!currentId" @click="moveNotebookDown">
          <span class="icon" aria-label="Move notebook down">↓</span>
        </button>
      </div>

      <!-- Row 2: action buttons (depends on mode) -->
      <div class="row">
        <template v-if="mode === 'active'">
          <button type="button" class="add-btn" aria-label="Create notebook" @click="onAdd">
            New notebook
          </button>
          <!-- Move selected cell to the mirrored notebook in the bin -->
          <button
            type="button"
            class="delete-btn"
            aria-label="Move selected cell to bin"
            :disabled="!currentId"
            @click="onSelectedCellDelete"
          >
            Cell &#10132; Bin
          </button>
          <!-- Move notebook to bin -->
          <button
            type="button"
            class="delete-btn"
            aria-label="Delete selected notebook"
            :disabled="!currentId"
            @click="onSelectedNotebookDelete"
          >
            Notebook &#10132; Bin
          </button>
        </template>
        <template v-else>
          <button
            type="button"
            class="restore-btn"
            aria-label="Restore selected notebook"
            :disabled="!currentId || !isBinActiveNotebook"
            @click="onRestoreSelectedCell"
          >
            Restore cell
          </button>
          <button
            type="button"
            class="restore-btn"
            aria-label="Restore selected notebook"
            :disabled="!currentId"
            @click="onRestoreSelectedNotebook"
          >
            Restore notebook
          </button>
          <button type="button" class="empty-bin-btn" aria-label="Empty bin" @click="onEmptyBin">
            Empty Bin
          </button>
        </template>
      </div>
    </div>
    <!-- Active notebooks list -->
    <ul v-if="mode === 'active' && activeNotebooks.length" class="notebook-list" role="list">
      <li
        v-for="nb in activeNotebooks"
        :key="nb.id"
        :class="['notebook-item', nb.id === currentId && 'is-active']"
        role="listitem"
      >
        <button
          v-if="editingId !== nb.id"
          type="button"
          class="nb-btn"
          :title="nb.title"
          :aria-current="nb.id === currentId ? 'true' : undefined"
          @click="select(nb.id)"
          @dblclick="startEditing(nb.id, nb.title)"
        >
          <span class="nb-title">{{ nb.title }}</span>
        </button>
        <div v-else class="nb-btn">
          <input
            :ref="setRenameInputRef"
            v-model="editingTitle"
            class="rename-input"
            type="text"
            @keydown.stop
            @click.stop
            @keyup.enter="commitRename(nb.id)"
            @blur="commitRename(nb.id)"
          />
        </div>
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
        <button
          type="button"
          class="nb-btn deleted"
          :class="[nb.id === currentId && 'is-active']"
          :title="nb.title"
          @click="workspaceStore.selectNotebookInBin(nb.id)"
        >
          <span class="nb-title">{{ nb.title }}</span>
          <span class="nb-meta">{{ formatDate(nb.deletedAt) }}</span>
        </button>
      </li>
    </ul>
    <div v-else-if="mode === 'bin'" class="empty">Bin is empty.</div>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, ref } from 'vue'
import type { ComponentPublicInstance } from 'vue'
import { useWorkspaceStore } from '@renderer/stores/workspaces/workspaceStore'
import type { ElectronAPI } from '@electron-toolkit/preload'

const workspaceStore = useWorkspaceStore()

const workspace = computed(() => workspaceStore.getWorkspace())
// Bind mode to store viewMode
const mode = computed<'active' | 'bin'>({
  get: () => workspaceStore.viewMode,
  set: (m) => workspaceStore.setViewMode(m)
})
const currentId = computed(() =>
  mode.value === 'bin' ? workspaceStore.binSelectedNotebookId : workspaceStore.currentNotebookId
)
// In bin mode, only allow restoring a cell if the selected bin notebook still exists (active)
const isBinActiveNotebook = computed(() => {
  if (mode.value !== 'bin') return false
  const id = workspaceStore.binSelectedNotebookId
  if (!id) return false
  return !!workspace.value.notebooks[id]
})
// Inline rename state
const editingId = ref<string | null>(null)
const editingTitle = ref('')
const renameInputRef = ref<HTMLInputElement | null>(null)
// function ref compatible with Vue's VNodeRef signature
function setRenameInputRef(el: Element | ComponentPublicInstance | null): void {
  renameInputRef.value = (el as HTMLInputElement | null) ?? null
}

// Active notebooks ordered by workspace.notebookOrder (with fallback handled in store)
const activeNotebooks = computed(() => workspaceStore.getNotebookList)
// Bin notebooks list = deleted notebooks + active notebooks that have soft-deleted cells
type BinListItem = { id: string; title: string; deletedAt?: string }
const deletedNotebooks = computed<BinListItem[]>(() => {
  const ws = workspace.value
  const binDeleted: BinListItem[] = ws.recycleBin.notebookOrder.map(
    (id) => ws.recycleBin.notebooks[id]
  )
  // Active notebooks which have at least one soft-deleted cell
  const activeWithDeleted: BinListItem[] = activeNotebooks.value
    .filter((nb) => nb.cellOrder.some((cid) => ws.cells[cid]?.softDeleted))
    .map((nb) => {
      // Compute latest deletedAt from recycleBin entries for this notebook
      let latest: string | undefined
      for (const cid of nb.cellOrder) {
        const meta = ws.recycleBin.cells[cid]
        if (meta && meta.notebookId === nb.id) {
          const ts = meta.deletedAt
          if (!latest || ts > latest) latest = ts
        }
      }
      return { id: nb.id, title: nb.title, deletedAt: latest }
    })
  // Merge by id, prefer deleted notebook meta (it has a deletedAt)
  const seen = new Set<string>()
  const merged: BinListItem[] = []
  for (const item of binDeleted) {
    merged.push(item)
    seen.add(item.id)
  }
  for (const item of activeWithDeleted) {
    if (!seen.has(item.id)) merged.push(item)
  }
  return merged
})

function select(id: string): void {
  workspaceStore.selectNotebook(id)
}

function onAdd(): void {
  const base = 'Notebook'
  const baseRename = '(double click to rename)'
  let idx = activeNotebooks.value.length + 1
  let title = `${base} ${idx} ${baseRename}`
  const titles = new Set(activeNotebooks.value.map((n) => n.title))
  while (titles.has(title)) {
    idx += 1
    title = `${base} ${idx} ${baseRename}`
  }
  workspaceStore.createNotebook(title)
}

function moveNotebookUp(): void {
  const ok = workspaceStore.moveCurrentNotebookUp()
  if (!ok) console.warn('Cannot move notebook up')
}
function moveNotebookDown(): void {
  const ok = workspaceStore.moveCurrentNotebookDown()
  if (!ok) console.warn('Cannot move notebook down')
}

function startEditing(id: string, currentTitle: string): void {
  editingId.value = id
  editingTitle.value = currentTitle
  // focus after DOM updates
  nextTick(() => {
    renameInputRef.value?.focus()
    renameInputRef.value?.select()
  })
}
function commitRename(id: string): void {
  const title = editingTitle.value.trim()
  if (title) {
    workspaceStore.renameNotebook(title, id)
  }
  editingId.value = null
  editingTitle.value = ''
}

// Active-mode: move current notebook to Bin
function onSelectedNotebookDelete(): void {
  if (!currentId.value) return
  const ok = window.confirm('Move this notebook to the Bin?')
  if (!ok) return
  workspaceStore.deleteNotebook(currentId.value)
}

// Active-mode: move selected cell to Bin (soft-delete)
function onSelectedCellDelete(): void {
  const ok = workspaceStore.softDeleteSelectedCell()
  if (!ok) {
    console.warn('No cell selected or cannot delete')
    return
  }
  // Switch to bin view and focus this notebook in bin list
  mode.value = 'bin'
  if (currentId.value) {
    workspaceStore.selectNotebookInBin(currentId.value)
  }
}

// Bin-mode: restore selected cell
function onRestoreSelectedCell(): void {
  const ok = workspaceStore.restoreSelectedCellFromBin()
  if (!ok) console.warn('No cell selected to restore')
}

// Bin-mode: restore selected notebook (from recycle bin)
function onRestoreSelectedNotebook(): void {
  const id = currentId.value
  if (!id) return
  const ok = workspaceStore.restoreNotebookFromBin(id)
  if (!ok) console.warn('No notebook to restore for id:', id)
}

function onEmptyBin(): void {
  // Use Electron native modal for confirmation
  const electronExposed = (window.electron as unknown) as ElectronAPI & {
    confirmEmptyBin?: () => Promise<boolean>
  }
  const ask = electronExposed?.confirmEmptyBin?.()
  if (!ask) {
    // Fallback to web confirm if API missing
    const ok = window.confirm('Permanently delete all items in the Bin? This cannot be undone.')
    if (ok) workspaceStore.emptyRecycleBin()
    return
  }
  ask.then((ok) => {
    if (ok) workspaceStore.emptyRecycleBin()
  })
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
  flex-direction: column;
  gap: 0.4rem;
}

.title {
  margin: 0;
  font-size: 0.85rem;
  font-weight: 600;
}
.row {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}
.toggle-btn {
  cursor: pointer;
  border: var(--border-thickness, 2px) solid var(--button-border-color, #ccc);
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
.add-btn,
.restore-btn {
  cursor: pointer;
  color: var(--text-color, blue);
  border: var(--border-thickness, 2px) solid var(--button-border-color, #ccc);
  background: var(--button-background-color, #fff);
  padding: 0 0.4rem;
  border-radius: 4px;
  line-height: 1.2;
  min-height: 1.6rem;
  /*Bold text*/
  font-weight: bold;
  font: inherit;
}
.restore-btn:disabled {
  opacity: 0.45;
  filter: grayscale(0.6) blur(0.5px);
  cursor: not-allowed;
}
.add-btn:hover,
.restore-btn:hover {
  background: var(--button-hover-color, #2563eb);
  color: var(--text-color, #fff);
  border-color: var(--button-border-hover-color, #2563eb);
}
.delete-btn,
.empty-bin-btn {
  cursor: pointer;
  border: var(--border-thickness, 2px) solid var(--button-border-color, #ccc);
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
.delete-btn:hover,
.empty-bin-btn:hover {
  background: var(--delete-button-hover-color, #2563eb);
  color: var(--text-color, #fff);
  border-color: var(--button-border-hover-color, #2563eb);
}

.icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.2em;
  height: 1.2em;
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
  background: var(--side-panel-background, red);
}
.nb-btn {
  width: 100%;
  text-align: left;
  color: var(--text-color, #222);
  background: var(--side-panel-background, red);
  border: var(--border-thickness, 2px) solid var(--button-border-color, #ccc);
  padding: 0.35rem 0.45rem;
  border-radius: 4px;
  cursor: pointer;
  font: inherit;
  display: flex;
  align-items: center;
  gap: 0.4rem;
}
.rename-input {
  width: 100%;
  font: inherit;
  padding: 0.2rem 0.3rem;
  border: var(--border-thickness, 2px) solid var(--button-border-color, #ccc);
  border-radius: 4px;
}
.nb-btn:hover,
.notebook-item.is-active .nb-btn:hover {
  /* background: var(--button-hover-color, #2563eb); */
  border-color: var(--button-border-hover-color, #2563eb);
}
.notebook-item.is-active .nb-btn {
  background: var(--active-background-color, rgba(37, 99, 235, 0.08));
  border-color: var(--active-border-color, #2563eb);
}
.nb-btn.is-active {
  background: var(--active-background-color, rgba(37, 99, 235, 0.08));
  border-color: var(--active-border-color, #2563eb);
}
.notebook-item.is-deleted .nb-btn,
.nb-btn.deleted {
  opacity: 0.7;
  cursor: pointer;
  border: var(--border-thickness, 2px) dashed var(--button-border-color, #ccc);
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

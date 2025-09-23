<template>
  <div class="sidepanel-container-inside-resize-border-padding">
    <div
      :class="[
        'sidepanel-row-flex-wrap',
        'sidepanel-color-font-styling',
        'sidepanel-bottom-row-margin'
      ]"
      role="tablist"
      aria-label="Notebook views"
    >
      <button
        type="button"
        class="sidepanel__button sidepanel-color-font-styling"
        :class="mode === 'notebooks' && 'sidepanel__button--active'"
        role="tab"
        :aria-selected="mode === 'notebooks'"
        @click="onClickNotebooksTab"
      >
        Notebooks
      </button>
      <button
        type="button"
        class="sidepanel__button sidepanel-color-font-styling"
        :class="mode === 'bin' && 'sidepanel__button--active'"
        role="tab"
        :aria-selected="mode === 'bin'"
        @click="onClickBinTab"
      >
        Recycle Bin
      </button>
      <button
        type="button"
        class="sidepanel__button sidepanel__button-icon sidepanel-color-font-styling"
        :disabled="!currentId || mode === 'bin'"
        @click="moveNotebookUp"
      >
        <span aria-label="Move notebook up" class="icon-move-up"></span>
      </button>
      <button
        type="button"
        class="sidepanel__button sidepanel__button-icon sidepanel-color-font-styling"
        :disabled="!currentId || mode === 'bin'"
        @click="moveNotebookDown"
      >
        <span aria-label="Move notebook down" class="icon-move-down"></span>
      </button>
      <button
        type="button"
        title="Flag selected notebook (Not implemented yet)"
        class="sidepanel__button sidepanel__button-icon sidepanel-color-font-styling"
        :disabled="!currentId || mode === 'bin'"
        @click="
          () => {
            console.log('Flag notebook - not implemented yet')
          }
        "
      >
        <span aria-label="Flag selected notebook (Not implemented yet)" class="icon-flag"></span>
      </button>
    </div>

    <!-- Row 2: action buttons (depends on mode) -->
    <div
      :class="[
        'sidepanel-row-flex-wrap',
        'sidepanel-bottom-row-margin',
        'sidepanel-color-font-styling'
      ]"
    >
      <template v-if="mode === 'notebooks'">
        <button
          type="button"
          class="sidepanel__button sidepanel-color-font-styling"
          aria-label="Create new notebook"
          @click="onAdd"
        >
          Create new notebook
        </button>
        <!-- Temporarily disabled: these actions are moved to the Edit menu.       <button
        type="button"
        class="delete-btn"
        aria-label="Move selected cell to bin"
        :disabled="!currentId"
        @click="onSelectedCellDelete"
      >
        Delete cell
      </button>
      <button
        type="button"
        class="delete-btn"
        aria-label="Delete selected notebook"
        :disabled="!currentId"
        @click="onSelectedNotebookDelete"
      >
        Delete notebook
      </button>
      -->
      </template>
      <template v-else>
        <button
          type="button"
          class="sidepanel__button sidepanel-color-font-styling"
          aria-label="Restore selected notebook"
          :disabled="!currentId || !isBinActiveNotebook"
          @click="onRestoreSelectedCell"
        >
          Restore cell
        </button>
        <button
          type="button"
          class="sidepanel__button sidepanel-color-font-styling"
          aria-label="Restore selected notebook"
          :disabled="!currentId || isBinActiveNotebook || isBinEmpty"
          @click="onRestoreSelectedNotebook"
        >
          Restore notebook
        </button>
        <button
          type="button"
          class="sidepanel__button sidepanel__button--delete sidepanel-color-font-styling"
          aria-label="Empty bin"
          :disabled="isBinEmpty"
          @click="onEmptyBin"
        >
          Empty Bin
        </button>
      </template>
    </div>

    <!-- Divider -->
    <Divider />

    <!-- Main content: notebooks list or bin list -->
    <!-- Use a single scroll container for the entire list -->
    <ul
      v-if="mode === 'notebooks' && activeNotebooks.length"
      :class="[
        'sidepanel-flex-column-overflow-y',
        'sidepanel-color-font-styling',
        'util-padding-zero',
        'util-margin-zero',
        'sidepanel-top-row-margin',
        'util-liststyle-none'
      ]"
      role="list"
    >
      <li
        v-for="notebook in activeNotebooks"
        :key="notebook.id"
        :class="[
          'sidepanel__notebook-item',
          'sidepanel-bottom-row-margin',
          notebook.id === currentId && 'sidepanel__notebook-item sidepanel__notebook-item--active'
        ]"
        role="listitem"
        :title="notebook.title"
        :aria-current="notebook.id === currentId ? 'true' : undefined"
        @click="select(notebook.id)"
        @dblclick="startEditing(notebook.id, notebook.title)"
      >
        <span v-if="editingId !== notebook.id">{{ notebook.title }}</span>
        <div v-else>
          <input
            :ref="setRenameInputRef"
            v-model="editingTitle"
            class="sidepanel__notebook-rename-input"
            size="100"
            type="text"
            @keydown.stop
            @click.stop
            @keyup.enter="commitRename(notebook.id)"
            @blur="commitRename(notebook.id)"
          />
        </div>
      </li>
    </ul>
    <div
      v-else-if="mode === 'notebooks'"
      :class="[
        'sidepanel-flex-column-overflow-y',
        'sidepanel-color-font-styling',
        'util-padding-zero',
        'util-margin-zero',
        'sidepanel-top-row-margin',
        'util-liststyle-none'
      ]"
    >
      <span class="sidepanel__text-message--empty"> No notebooks yet.</span>
    </div>

    <ul
      v-if="mode === 'bin' && deletedNotebooks.length"
      :class="[
        'sidepanel-flex-column-overflow-y',
        'sidepanel-color-font-styling',
        'util-padding-zero',
        'util-margin-zero',
        'sidepanel-top-row-margin',
        'util-liststyle-none'
      ]"
      role="list"
      aria-label="Deleted notebooks"
    >
      <li
        v-for="notebook in deletedNotebooks"
        :key="notebook.id"
        :class="[
          'sidepanel__notebook-item',
          'sidepanel-bottom-row-margin',
          'sidepanel__notebook-item--notebook-in-bin',
          notebook.id === currentId &&
            'sidepanel__notebook-item--active sidepanel__notebook-item--notebook-in-bin'
        ]"
        role="listitem"
        :title="notebook.title"
        @click="workspaceStore.selectNotebookInBin(notebook.id)"
      >
        <span>{{ notebook.title }}</span>
        <span class="sidepanel__notebook_meta-info">👻 {{ formatDate(notebook.deletedAt) }} </span>
      </li>
    </ul>
    <div
      v-else-if="mode === 'bin'"
      :class="[
        'sidepanel-flex-column-overflow-y',
        'sidepanel-color-font-styling',
        'util-padding-zero',
        'util-margin-zero',
        'sidepanel-top-row-margin',
        'util-liststyle-none'
      ]"
    >
      <div
        :class="['sidepanel__text-message--empty', 'sidepanel__notebook-item-transparent-border']"
      >
        Bin is empty.
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, ref } from 'vue'
import type { ComponentPublicInstance } from 'vue'
import { useWorkspaceStore } from '@renderer/stores/workspaces/workspaceStore'
import type { ElectronAPI } from '@electron-toolkit/preload'
import Divider from '@renderer/components/UI/Divider.vue'

const workspaceStore = useWorkspaceStore()

const workspace = computed(() => workspaceStore.getWorkspace())
// Bind mode to store viewMode
const mode = computed<'notebooks' | 'bin'>({
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

const isBinEmpty = computed(() => workspace.value.recycleBin.notebookOrder.length === 0)

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
    .filter((notebook) => notebook.cellOrder.some((cid) => ws.cells[cid]?.softDeleted))
    .map((notebook) => {
      // Compute latest deletedAt from recycleBin entries for this notebook
      let latest: string | undefined
      for (const cid of notebook.cellOrder) {
        const meta = ws.recycleBin.cells[cid]
        if (meta && meta.notebookId === notebook.id) {
          const ts = meta.deletedAt
          if (!latest || ts > latest) latest = ts
        }
      }
      return { id: notebook.id, title: notebook.title, deletedAt: latest }
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

// Explicit handlers for tabs to enforce restore-or-clear selection logic
function onClickNotebooksTab(): void {
  workspaceStore.setViewMode('notebooks')
}
function onClickBinTab(): void {
  // Prefer the remembered bin notebook if available, otherwise let store decide
  const ws = workspace.value
  const rememberedBinId = ws.recycleBin.lastSelectedNotebookId || null
  workspaceStore.setViewMode('bin')
  if (rememberedBinId) {
    workspaceStore.selectNotebookInBin(rememberedBinId)
  }
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

/*
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
  // Stay in active view per UX; selection moves to neighbor handled in store.
}
*/

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
  const electronExposed = window.electron as unknown as ElectronAPI & {
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
/** Styles for the notebooks panel are in the css folder */
</style>

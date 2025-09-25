<!-- ONGOING MAJOR CSS DEBUGGING AND REFACTORING -->
<!-- ONGOING MAJOR CSS DEBUGGING AND REFACTORING -->
<!-- ONGOING MAJOR CSS DEBUGGING AND REFACTORING -->
<!-- ONGOING MAJOR CSS DEBUGGING AND REFACTORING -->
<!-- ONGOING MAJOR CSS DEBUGGING AND REFACTORING -->
<!-- ONGOING MAJOR CSS DEBUGGING AND REFACTORING -->

<script setup lang="ts">
// Example of how to use the IPC mechanism if needed
// const ipcHandle = (): void => window.electron.ipcRenderer.send('ping')

import Menubar from '@renderer/components/navigation-bars/Menubar.vue'
import Toolbar from '@renderer/components/conteiners/ToolbarContainer.vue'
import CellList from '@renderer/components/conteiners/CellList.vue'
import Statusbar from '@renderer/components/navigation-bars/Statusbar.vue'
import Sidepanel from '@renderer/components/sidepanel/Sidepanel.vue'
import AboutLunaModal from '@renderer/components/modals/AboutLunaModal.vue'
import { useModalStore } from '@renderer/stores/UI/modalStore'
// Modals and sidepanel are currently not referenced directly in this file.
// They are imported where needed by child components.
// import SaveAsModal from '@renderer/components/modals/SaveAsModal.vue'
// import { useModalStore } from '@renderer/stores/UI/modalStore'
import { useWorkspaceStore } from '@renderer/stores/workspaces/workspaceStore'
import { useGeneralSettingsStore } from '@renderer/stores/settings/generalSettingsStore'
import { useMenubarStore } from '@renderer/stores/UI/menubarStore'
import { computed, ref, watch, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { useToolbarStore } from '@renderer/stores/UI/toolbarStore'
import { useSidepanelStore } from '@renderer/stores/UI/sidepanelStore'
import { saveOrSaveAs } from '@renderer/code/files/save-file'
import { storeToRefs } from 'pinia'
import { autosaveWatchFunction } from '@renderer/utils/save-and-load/autosave-watch-function'

const menubarStore = useMenubarStore()
const toolbarStore = useToolbarStore()
const sidepanelStore = useSidepanelStore()
const modalStore = useModalStore()
const { workspaceLayoutMode: layoutMode } = storeToRefs(menubarStore)
const workspaceStore = useWorkspaceStore()
const generalSettingsStore = useGeneralSettingsStore()

//------------------------------------------------------------------------------//
// Autosave section
// Autosave: save after N input changes if enabled (N > 0)
const autosaveInterval = computed(() => generalSettingsStore.autosaveChangeIntervalGetter)
const changeCount = computed(() => workspaceStore.inputChangesSinceLastSave)
const isSaving = ref(false)
// Watch for changes in autosave interval or change count
watch([autosaveInterval, changeCount], async ([interval, count]) => {
  await autosaveWatchFunction(interval, count, isSaving, saveOrSaveAs)
})
//------------------------------------------------------------------------------//

// --- Top chrome measurement (menubar + toolbar) ----------------------------
const menubarRef = ref<HTMLElement | null>(null)
const toolbarRef = ref<HTMLElement | null>(null)
const statusbarRef = ref<HTMLElement | null>(null)
let menubarObserver: ResizeObserver | null = null
let toolbarObserver: ResizeObserver | null = null

onMounted(async () => {
  await nextTick()
  if (menubarRef.value) {
    menubarObserver = new ResizeObserver((entries) => {
      const h = entries[0]?.contentRect?.height ?? 0
      toolbarStore.setMenubarHeight(h)
      sidepanelStore.setMenubarHeight(h)
      // Update CSS var for top chrome height (menubar + toolbar)
      const top = h + (sidepanelStore.toolbarHeight ?? 0)
      document.documentElement.style.setProperty('--top-chrome-height', `${top}px`)
    })
    menubarObserver.observe(menubarRef.value)
  }
  if (toolbarRef.value) {
    toolbarObserver = new ResizeObserver((entries) => {
      const h = entries[0]?.contentRect?.height ?? 0
      toolbarStore.setToolbarHeight(h)
      sidepanelStore.setToolbarHeight(h)
      const top = h + (sidepanelStore.menubarHeight ?? 0)
      document.documentElement.style.setProperty('--top-chrome-height', `${top}px`)
    })
    toolbarObserver.observe(toolbarRef.value)
  }
  if (statusbarRef.value) {
    const statusObserver = new ResizeObserver((entries) => {
      const h = entries[0]?.contentRect?.height ?? 0
      sidepanelStore.setStatusbarHeight(h)
      document.documentElement.style.setProperty('--bottom-chrome-height', `${h}px`)
    })
    statusObserver.observe(statusbarRef.value)
  }
})

onBeforeUnmount(() => {
  menubarObserver?.disconnect()
  toolbarObserver?.disconnect()
})
</script>
<template>
  <div id="app-layout">
    <div ref="menubarRef">
      <Menubar />
    </div>
    <div ref="toolbarRef">
      <Toolbar />
    </div>
    <div class="scroll-container">
      <div v-if="layoutMode === 'web'" class="workspace-web-layout-container">
        <CellList />
      </div>
      <div
        v-else-if="layoutMode === 'a4Preview'"
        class="workspace-a4-preview-layout-container"
        :style="{ display: 'flex', justifyContent: 'center', alignItems: 'center' }"
      >
        A4 preview layout mode (coming soon)
      </div>
    </div>
    <Sidepanel />

    <!-- Global modals (kept at root so they can render overlays) -->
    <AboutLunaModal v-if="modalStore.isAboutLunaModalOpen" />

    <div ref="statusbarRef" class="statusbar-container">
      <Statusbar />
    </div>
  </div>
</template>

<style scoped>
#app-layout {
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
}

.scroll-container {
  position: relative;
  flex: 1 1 auto; /* take up all available space */
  min-height: 0; /* allow inner scrollers to work */
  min-width: 0; /* prevent horizontal overflow from inner scrollers */
  overflow: scroll; /* this container should not scroll */
  border: 5px red solid;
}

.statusbar-container {
  flex: 0 0 auto;
  width: 100%;
  /* Prevent it from growing */
}
</style>

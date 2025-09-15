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

// Modals and sidepanel are currently not referenced directly in this file.
// They are imported where needed by child components.
// import AboutLunaModal from '@renderer/components/modals/AboutLunaModal.vue'
// import SaveAsModal from '@renderer/components/modals/SaveAsModal.vue'
// import { useModalStore } from '@renderer/stores/UI/modalStore'
import { useWorkspaceStore } from '@renderer/stores/workspaces/workspaceStore'
import { useGeneralSettingsStore } from '@renderer/stores/settings/generalSettingsStore'
import { useMenubarStore } from '@renderer/stores/UI/menubarStore'
import { computed, ref, watch } from 'vue'
import { saveOrSaveAs } from '@renderer/code/files/save-file'
import { storeToRefs } from 'pinia'
import { autosaveWatchFunction } from '@renderer/utils/save-and-load/autosave-watch-function'

const menubarStore = useMenubarStore()
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
</script>
<template>
  <div id="app-layout">
    <Menubar />
    <Toolbar />
    

    <div v-if="layoutMode === 'web'" class="workspace-web-layout-container">
      <CellList />
      <Sidepanel />
    </div>
    <div v-else-if="layoutMode === 'a4Preview'" class="workspace-a4-preview-layout-container">
      A4
    </div>
    <div class="statusbar-container">
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
/* ----------------------------------------------------------------------- */
/* Section:  Container for statusbar at bottom of app                      */

.statusbar-container {
  flex: 0 0 auto;
  width: 100%;
  /* Prevent it from growing */
}

/* ----------------------------------------------------------------------- */
/* Section: Workspace and side panel web layout mode                       */
.web--workspace-layout {
  position: relative;
  display: flex;
  flex: 1 1 auto;
  border: 9px solid green;
  color: black;
  /* Take remaining space between menuBar-toolbar and statusbar */
}

/* ----------------------------------------------------------------------- */
/* Section: Workspace and side panel A4 Preview layout mode                       */
</style>

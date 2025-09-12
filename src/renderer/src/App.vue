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
import WorkspaceContainer from '@renderer/components/conteiners/WorkspaceContainer.vue'
import Toolbar from '@renderer/components/conteiners/ToolbarContainer.vue'
import CellList from '@renderer/components/conteiners/CellList.vue'
import Statusbar from '@renderer/components/navigation-bars/Statusbar.vue'
import AboutLunaModal from '@renderer/components/modals/AboutLunaModal.vue'
import SaveAsModal from '@renderer/components/modals/SaveAsModal.vue'
import Sidepanel from '@renderer/components/sidepanel/Sidepanel.vue'
import { useModalStore } from '@renderer/stores/UI/modalStore'
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
    <div class="menubar-and-toolbar-container">
      <Menubar />
      <Toolbar />|
    </div>
    <div v-if="layoutMode === 'web'" class="web--workspace-layout">
      <CellList />
      <Sidepanel />
      <div v-if="layoutMode === 'a4Preview'" class="a4--workspace-layout">A4</div>
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
}
/* ----------------------------------------------------------------------- */
/* Section: Top level menubar-toolbar, workspace and statusbar containers  */
.menubar-and-toolbar-container {
  display: flex;
  flex-direction: column;
  /* Stack menubar and toolbar vertically */
  flex: 0 0 auto;
  /* Prevent it from growing */
}
.workspace-and-sidepanel-container {
  display: flex;
  width: 100%;
  background: transparent;
  border: 1px solid blue;
}
.statusbar-container {
  flex: 0 0 auto;
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

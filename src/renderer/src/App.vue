<script setup lang="ts">
import MenuBar from '@renderer/components/navigation_bars/MenuBar.vue'
import WorkspaceContainer from '@renderer/components/conteiners/WorkspaceContainer.vue'
import Toolbar from '@renderer/components/conteiners/ToolbarContainer.vue'
import CellList from '@renderer/components/conteiners/CellList.vue'
import StatusBar from '@renderer/components/navigation_bars/StatusBar.vue'
import AboutLunaModal from '@renderer/components/modals/AboutLunaModal.vue'
import SaveAsModal from '@renderer/components/modals/SaveAsModal.vue'
/*import SidePanel from '@renderer/components/side_panel/SidePanel.vue'*/
import { useModalStore } from '@renderer/stores/UI/modalStore'
import { useWorkspaceStore } from '@renderer/stores/workspaces/workspaceStore'
import { useGeneralSettingsStore } from '@renderer/stores/settings/generalSettingsStore'
import { computed, ref, watch } from 'vue'
import { saveOrSaveAs } from '@renderer/code/files/save-file'

const modalStore = useModalStore()
const workspaceStore = useWorkspaceStore()
const generalSettingsStore = useGeneralSettingsStore()

// Autosave: save after N input changes if enabled (N > 0)
const autosaveInterval = computed(() => generalSettingsStore.autosaveChangeIntervalGetter)
const changeCount = computed(() => workspaceStore.inputChangesSinceLastSave)
const isSaving = ref(false)

// Layout mode for conditional rendering of SidePanel
import { storeToRefs } from 'pinia'
import { useMenubarStore } from '@renderer/stores/UI/menubarStore'
import SidePanel from '@renderer/components/side_panel/SidePanel.vue'
const menubarStore = useMenubarStore()
const { workspaceLayoutMode: layoutMode } = storeToRefs(menubarStore)

watch([autosaveInterval, changeCount], async ([interval, count]) => {
  if (!interval || interval <= 0) return
  if (count < interval) return
  if (isSaving.value) return
  isSaving.value = true
  try {
    const res = await saveOrSaveAs()
    if (!res.success) {
      // Leave counter as-is; user may continue editing, and Save As may be canceled
      // Optionally log in dev
      // console.warn('Autosave failed or canceled:', res.error)
    }
  } finally {
    isSaving.value = false
  }
})
// Example of how to use the IPC mechanism if needed
// const ipcHandle = (): void => window.electron.ipcRenderer.send('ping')
</script>

<template>
  <div id="app-layout">
    <div class="top-bar-container">
      <MenuBar />
      <Toolbar />
    </div>
    <WorkspaceContainer>
      <CellList />
    </WorkspaceContainer>
    <SidePanel v-if="layoutMode === 'a4Preview'" class="side-panel-overlay" />
    <StatusBar />
  </div>
  <!-- Modal layer outside the app layout for proper centering -->
  <div v-if="modalStore.isAboutLunaModalOpen" class="modal-container">
    <AboutLunaModal />
  </div>
  <SaveAsModal v-if="modalStore.isSaveAsModalOpen" />
</template>

<style scoped>
#app-layout {
  display: flex;
  flex-direction: column;
  height: 100vh;
  /* Fixed height instead of min-height */
  width: 100%;
  min-width: 0;
  overflow: hidden;
  /* Prevent layout from expanding beyond viewport */
  background: var(--main-panel-background, #f0f0f0);
}

.top-bar-container {
  /* Ensure it stays on top */
  flex: 0 0 auto;
  display: flex;
  flex-direction: column;
  width: 100%;
  z-index: 1000;
}

/* A4 mode overlay: fixed, no layout impact */
.side-panel-overlay {
  position: fixed; /* out of flow => won't resize workspace */
  right: 0;
  top: 4em;/* start below top bars */
  width: 25%;
  max-width: 75%; /* safety on small screens */
  height: auto;
  z-index: 2000; /* above workspace, below modals (9999) */
  display: flex; /* typical panel internals */
  flex-direction: column;
  pointer-events: auto;
}
.modal-container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  /* Higher than any other element */
  background-color: rgba(0, 0, 0, 0.5);
  /* Semi-transparent overlay */
}
</style>

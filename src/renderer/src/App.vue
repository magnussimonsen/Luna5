<script setup lang="ts">
import MenuBar from '@renderer/components/navigation_bars/MenuBar.vue'
import WorkspaceContainer from '@renderer/components/conteiners/WorkspaceContainer.vue'
import Toolbar from '@renderer/components/conteiners/ToolbarContainer.vue'
import CellList from '@renderer/components/conteiners/CellList.vue'
import StatusBar from '@renderer/components/navigation_bars/StatusBar.vue'
import AboutLunaModal from '@renderer/components/modals/AboutLunaModal.vue'
import GeneralSettingsModal from '@renderer/components/modals/settings_modals/SettingsModal.vue'
import SaveAsModal from '@renderer/components/modals/SaveAsModal.vue'
import SidePanel from '@renderer/components/side_panel/SidePanel.vue'
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
    <MenuBar />
    <Toolbar />
    <div class="workspace-container">
      <div class="main-panel">
        <!-- Add your main app content (cells) here -->
      </div>
      <WorkspaceContainer>
        <CellList />
      </WorkspaceContainer>
      <SidePanel />
    </div>
    <StatusBar />
  </div>
  <!-- Modal layer outside the app layout for proper centering -->
  <div v-if="modalStore.isAboutLunaModalOpen" class="modal-container">
    <AboutLunaModal />
  </div>
  <div v-if="modalStore.isSettingsModalOpen" class="modal-container">
    <GeneralSettingsModal />
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
}

.workspace-container {
  position: relative;
  flex: 1 1 auto;
  min-height: 0;
  min-width: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  /* Allow inner areas to manage their own overflow; do not clip scrollbars */
  overflow: visible;
}

.main-panel {
  flex: 1 1 0;
  height: 100%;
  min-height: 0;
  min-width: 0;
  position: relative;
  z-index: 1000;
  overflow-y: auto;
  background: var(--main-panel-background, #f0f0f0);
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

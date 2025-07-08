<script setup lang="ts">
import MenuBar from '@renderer/components/navigation_bars/MenuBar.vue'
import Toolbar from '@renderer/components/navigation_bars/Toolbar.vue'
import StatusBar from '@renderer/components/navigation_bars/StatusBar.vue'
import AboutLunaModal from '@renderer/components/modals/AboutLunaModal.vue'
import GeneralSettingsModal from '@renderer/components/modals/settings_modals/SettingsModal.vue'
import SidePanel from '@renderer/components/side_panel/SidePanel.vue'
import { useModalStore } from '@renderer/stores/UI/modalStore'

const modalStore = useModalStore()
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
        TESTtext: some text
        <p>Welcome to Luna!</p>
        <p>Click on the side panel to open it.</p>
        <p>Use the toolbar to access various features.</p>
        <p>Explore the menu bar for more options.</p>
        <p>Enjoy your coding experience!</p>
        <p>Feel free to customize this layout as needed.</p>
        <p>Have fun coding with Luna!</p>
        <p>Remember to save your work frequently.</p>
        <p>Check out the documentation for more information.</p>
        <p>If you have any questions, feel free to ask.</p>
        <p>Happy coding!</p>
        <p>More test text</p>
        <p>More test text</p>
        <p>More test text</p>
        <p>More test text</p>
        <p>More test text</p>
      </div>
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
  overflow: hidden;
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

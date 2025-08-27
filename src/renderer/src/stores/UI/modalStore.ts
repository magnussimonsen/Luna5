/* Filepath: luna/src/renderer/src/stores/UI/modalStore.ts */
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useModalStore = defineStore('modal', () => {
  // State for About Luna modal
  const isAboutLunaModalOpen = ref(false)
  // State for Settings modal
  const isSettingsModalOpen = ref(false)
  // State for Save As modal
  const isSaveAsModalOpen = ref(false)

  // Actions
  function openAboutLunaModal(): void {
    isAboutLunaModalOpen.value = true
  }
  function closeAboutLunaModal(): void {
    isAboutLunaModalOpen.value = false
  }
  function openSettingsModal(): void {
    isSettingsModalOpen.value = true
  }
  function closeSettingsModal(): void {
    isSettingsModalOpen.value = false
  }
  function openSaveAsModal(): void {
    isSaveAsModalOpen.value = true
  }
  function closeSaveAsModal(): void {
    isSaveAsModalOpen.value = false
  }

  return {
    isAboutLunaModalOpen,
    openAboutLunaModal,
    closeAboutLunaModal,
    isSettingsModalOpen,
    openSettingsModal,
    closeSettingsModal,
    isSaveAsModalOpen,
    openSaveAsModal,
    closeSaveAsModal
  }
})

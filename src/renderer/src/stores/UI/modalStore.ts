/* Filepath: luna/src/renderer/src/stores/UI/modalStore.ts */
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useModalStore = defineStore('modal', () => {
  // State for About Luna modal
  const isAboutLunaModalOpen = ref(false)
  // State for Settings modal
  const isSettingsModalOpen = ref(false)

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

  return {
    isAboutLunaModalOpen,
    openAboutLunaModal,
    closeAboutLunaModal,
    isSettingsModalOpen,
    openSettingsModal,
    closeSettingsModal
  }
})

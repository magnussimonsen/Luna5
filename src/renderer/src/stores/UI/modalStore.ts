/* Filepath: luna/src/renderer/src/stores/UI/modalStore.ts */
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useModalStore = defineStore('modal', () => {
  // State for About Luna modal
  const isAboutLunaModalOpen = ref(false)
  // State for Settings modal (To do: Check if this is still used)
  const isSettingsModalOpen = ref(false)
  // State for Save As modal
  const isSaveAsModalOpen = ref(false)
  // State for Student Info modal
  const isStudentInfoModalOpen = ref(false)
  // State for Katex Input modal
  const isKatexInputModalOpen = ref(false)
  const katexInsertionMode = ref<'inline' | 'block'>('inline')
  const katexInitialLatex = ref('')
  const katexTargetCellId = ref<string | null>(null)
  const katexSelectionRange = ref<{ from: number; to: number } | null>(null)
  const katexInteractionKind = ref<'insert' | 'edit'>('insert')
  const katexTargetNodePos = ref<number | null>(null)

  // Actions
  function openAboutLunaModal(): void {
    isAboutLunaModalOpen.value = true
  }
  function closeAboutLunaModal(): void {
    isAboutLunaModalOpen.value = false
  }
  /* 
  Settings Modal is replaced with the settings side panel.
  To do: Check if this can be removed
  */
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
  function openStudentInfoModal(): void {
    isStudentInfoModalOpen.value = true
  }
  function closeStudentInfoModal(): void {
    isStudentInfoModalOpen.value = false
  }

  /* Katex Input Modal*/
  function openKatexInputModal(options?: {
    mode?: 'inline' | 'block'
    initialLatex?: string
    targetCellId?: string | null
    selectionFrom?: number | null
    selectionTo?: number | null
    intent?: 'insert' | 'edit'
    nodePos?: number | null
  }): void {
    katexInsertionMode.value = options?.mode ?? 'inline'
    katexInitialLatex.value = options?.initialLatex ?? ''
    katexTargetCellId.value = options?.targetCellId ?? null
    katexInteractionKind.value = options?.intent ?? 'insert'
    katexTargetNodePos.value = options?.nodePos ?? null
    if (options?.intent === 'edit') {
      katexSelectionRange.value = null
    } else if (
      options?.selectionFrom != null &&
      options?.selectionTo != null &&
      options.selectionFrom <= options.selectionTo
    ) {
      katexSelectionRange.value = {
        from: options.selectionFrom,
        to: options.selectionTo
      }
    } else {
      katexSelectionRange.value = null
    }
    isKatexInputModalOpen.value = true
  }
  function closeKatexInputModal(): void {
    isKatexInputModalOpen.value = false
    katexTargetCellId.value = null
    katexSelectionRange.value = null
    katexInteractionKind.value = 'insert'
    katexTargetNodePos.value = null
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
    closeSaveAsModal,
    isStudentInfoModalOpen,
    openStudentInfoModal,
    closeStudentInfoModal,
    isKatexInputModalOpen,
    katexInsertionMode,
    katexInitialLatex,
    katexTargetCellId,
    katexSelectionRange,
    katexInteractionKind,
    katexTargetNodePos,
    openKatexInputModal,
    closeKatexInputModal
  }
})

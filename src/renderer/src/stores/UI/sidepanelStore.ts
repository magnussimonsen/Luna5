/* Filepath: src/renderer/src/stores/UI/sidepanelStore.ts */

import { defineStore } from 'pinia'
import { ref } from 'vue'
import { PanelName } from '@renderer/types/side-panel-types'

export const useSidepanelStore = defineStore('sidepanel', () => {
  const allowedPanels = ['flashcards', 'notebooks', 'toc', 'variables', 'help', 'settings'] // Must match the types in side-panel-types.ts (not elegant...)
  const activePanel = ref<PanelName | null>(null)
  // Store the last width of the side panel (in px)

  function getAppWidthInPx(): number {
    const appWidth =
      window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth
    return typeof appWidth === 'number' && !isNaN(appWidth) ? appWidth * 0.33 : 400
  }

  const lastPanelWidth = ref<number>(getAppWidthInPx()) 
  // Store the last scroll Y position of the side panel
  const lastPanelScrollY = ref<number>(0)

  function showPanel(name: string): void {
    if (allowedPanels.includes(name as PanelName)) {
      activePanel.value = name as PanelName
    }
  }

  function hidePanel(): void {
    activePanel.value = null
  }

  function togglePanel(name: string): void {
    if (allowedPanels.includes(name as PanelName)) {
      activePanel.value = activePanel.value === name ? null : (name as PanelName)
    }
  }

  function setLastPanelWidth(width: number): void {
    lastPanelWidth.value = width
  }

  function setLastPanelScrollY(y: number): void {
    lastPanelScrollY.value = y
  }

  return {
    activePanel,
    showPanel,
    hidePanel,
    togglePanel,
    allowedPanels,
    lastPanelWidth,
    setLastPanelWidth,
    lastPanelScrollY,
    setLastPanelScrollY
  }
})

import { defineStore } from 'pinia'
import { ref } from 'vue'

const clamp = (value: number, min: number, max: number): number => {
  if (Number.isNaN(value)) return min
  if (min > max) return min
  return Math.min(Math.max(value, min), max)
}

export const useBottomPanelStore = defineStore('bottompanel', () => {
  const isOpen = ref(false)
  const isResizing = ref(false)
  const panelHeight = ref(320)
  const minHeight = ref(220)
  const maxHeight = ref(600)

  function openBottomPanel(): void {
    isOpen.value = true
  }

  function closeBottomPanel(): void {
    isOpen.value = false
  }

  function toggleBottomPanel(): void {
    isOpen.value = !isOpen.value
  }

  function setPanelHeight(height: number): void {
    panelHeight.value = clamp(height, minHeight.value, maxHeight.value)
  }

  function setHeightBounds(bounds: { min?: number; max?: number }): void {
    if (typeof bounds.min === 'number' && bounds.min > 0) {
      minHeight.value = Math.min(bounds.min, bounds.max ?? bounds.min)
    }
    if (typeof bounds.max === 'number' && bounds.max > 0) {
      maxHeight.value = Math.max(bounds.max, minHeight.value + 50)
    }
    setPanelHeight(panelHeight.value)
  }

  function beginResize(): void {
    isResizing.value = true
  }

  function endResize(): void {
    isResizing.value = false
  }

  return {
    isOpen,
    isResizing,
    panelHeight,
    minHeight,
    maxHeight,
    openBottomPanel,
    closeBottomPanel,
    toggleBottomPanel,
    setPanelHeight,
    setHeightBounds,
    beginResize,
    endResize
  }
})

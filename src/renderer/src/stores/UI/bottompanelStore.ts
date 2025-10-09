import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { PanelName } from '@renderer/types/sidepanel-types' // Reuse PanelName type for bottom panel

const allowedPanels: PanelName[] = ['insertKatexMath']

const DEFAULT_PANEL_HEIGHT = 320
const DEFAULT_MIN_HEIGHT = 100
const DEFAULT_MAX_HEIGHT = 800
const MIN_MAX_HEIGHT_GAP = 50

type KatexSelectionRange = { from: number; to: number }
type KatexPanelInsertion = {
  latex: string
  selectionStartOffset?: number
  selectionEndOffset?: number
}

const clamp = (value: number, min: number, max: number): number => {
  if (Number.isNaN(value)) return min
  if (min > max) return min
  return Math.min(Math.max(value, min), max)
}

export const useBottomPanelStore = defineStore('bottompanel', () => {
  // -------------------------------------------------------------------------
  // Visibility and active panel state
  // -------------------------------------------------------------------------
  const isOpen = ref(false)
  const activePanel = ref<PanelName | null>(null)

  // -------------------------------------------------------------------------
  // Resizing state
  // -------------------------------------------------------------------------
  const isResizing = ref(false)
  const panelHeight = ref(DEFAULT_PANEL_HEIGHT)
  const minHeight = ref(DEFAULT_MIN_HEIGHT)
  const maxHeight = ref(DEFAULT_MAX_HEIGHT)

  // -----------------------------------------------------------------------
  // KaTeX bottom panel state
  // -----------------------------------------------------------------------
  const katexPanelLatex = ref('')
  const katexPanelError = ref('')
  const katexPanelMode = ref<'inline' | 'block'>('inline')
  const katexPanelInteractionKind = ref<'insert' | 'edit'>('insert')
  const katexPanelTargetCellId = ref<string | null>(null)
  const katexPanelSelectionRange = ref<KatexSelectionRange | null>(null)
  const katexPanelTargetNodePos = ref<number | null>(null)
  const katexPanelPendingInsertion = ref<KatexPanelInsertion | null>(null)

  const defaultPanel = computed<PanelName | null>(() => allowedPanels[0] ?? null)

  function setActivePanel(panel: PanelName | null): void {
    activePanel.value = panel
  }

  function openBottomPanel(): void {
    if (!activePanel.value && defaultPanel.value) {
      activePanel.value = defaultPanel.value
    }
    isOpen.value = true
  }

  function closeBottomPanel(): void {
    isOpen.value = false
    activePanel.value = null
    resetKatexPanel()
  }

  function toggleBottomPanel(): void {
    if (isOpen.value) {
      closeBottomPanel()
      return
    }
    openBottomPanel()
  }

  function setPanelHeight(height: number): void {
    panelHeight.value = clamp(height, minHeight.value, maxHeight.value)
  }

  function setHeightBounds(bounds: { min?: number; max?: number }): void {
    if (typeof bounds.min === 'number' && bounds.min > 0) {
      minHeight.value = Math.min(bounds.min, bounds.max ?? bounds.min)
    }
    if (typeof bounds.max === 'number' && bounds.max > 0) {
      maxHeight.value = Math.max(bounds.max, minHeight.value + MIN_MAX_HEIGHT_GAP)
    }
    setPanelHeight(panelHeight.value)
  }

  function beginResize(): void {
    isResizing.value = true
  }

  function endResize(): void {
    isResizing.value = false
  }

  function showPanel(name: PanelName): void {
    if (!allowedPanels.includes(name)) return
    setActivePanel(name)
    openBottomPanel()
  }

  function hidePanel(): void {
    closeBottomPanel()
  }

  function togglePanel(name: PanelName): void {
    if (!allowedPanels.includes(name)) return
    if (activePanel.value === name && isOpen.value) {
      hidePanel()
    } else {
      setActivePanel(name)
      openBottomPanel()
    }
  }

  function resetKatexPanel(): void {
    katexPanelLatex.value = ''
    katexPanelError.value = ''
    katexPanelMode.value = 'inline'
    katexPanelInteractionKind.value = 'insert'
    katexPanelTargetCellId.value = null
    katexPanelSelectionRange.value = null
    katexPanelTargetNodePos.value = null
    katexPanelPendingInsertion.value = null
  }

  function configureKatexPanel(options: {
    mode: 'inline' | 'block'
    initialLatex?: string
    interactionKind?: 'insert' | 'edit'
    targetCellId?: string | null
    selectionFrom?: number | null
    selectionTo?: number | null
    targetNodePos?: number | null
  }): void {
    katexPanelMode.value = options.mode
    katexPanelLatex.value = options.initialLatex ?? ''
    katexPanelInteractionKind.value = options.interactionKind ?? 'insert'
    katexPanelTargetCellId.value = options.targetCellId ?? null
    katexPanelTargetNodePos.value =
      typeof options.targetNodePos === 'number' ? options.targetNodePos : null

    const hasSelection =
      options.selectionFrom != null &&
      options.selectionTo != null &&
      options.selectionFrom <= options.selectionTo

    katexPanelSelectionRange.value = hasSelection
      ? { from: options.selectionFrom as number, to: options.selectionTo as number }
      : null
    katexPanelError.value = ''
  }

  function updateKatexPanelLatex(latex: string): void {
    katexPanelLatex.value = latex
  }

  function setKatexPanelError(message: string): void {
    katexPanelError.value = message
  }

  function clearKatexPanelError(): void {
    katexPanelError.value = ''
  }

  function queueKatexPanelInsertion(payload: KatexPanelInsertion): void {
    katexPanelPendingInsertion.value = { ...payload }
  }

  function clearKatexPanelPendingInsertion(): void {
    katexPanelPendingInsertion.value = null
  }

  return {
    isOpen,
    isResizing,
    panelHeight,
    minHeight,
    maxHeight,
    allowedPanels,
    activePanel,
    openBottomPanel,
    closeBottomPanel,
    toggleBottomPanel,
    setPanelHeight,
    setHeightBounds,
    beginResize,
    endResize,
    showPanel,
    hidePanel,
    togglePanel,
    setActivePanel,
    // KaTeX panel API
    katexPanelLatex,
    katexPanelError,
    katexPanelMode,
    katexPanelInteractionKind,
    katexPanelTargetCellId,
    katexPanelSelectionRange,
    katexPanelTargetNodePos,
    katexPanelPendingInsertion,
    configureKatexPanel,
    updateKatexPanelLatex,
    setKatexPanelError,
    clearKatexPanelError,
    queueKatexPanelInsertion,
    clearKatexPanelPendingInsertion,
    resetKatexPanel
  }
})

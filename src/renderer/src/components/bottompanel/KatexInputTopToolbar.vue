<!--
Top toolbar for the KaTeX bottom panel.
Mirrors the layout of TextCellToolbar so both toolbars share the same
interaction patterns and CSS styling.
-->

<template>
  <div
    class="row-flex-wrap-base"
    :class="{ 'is-dark': isDarkMode }"
    role="toolbar"
    aria-label="KaTeX bottom panel toolbar"
  >
    <div class="row-flex-wrap-base-child util-transparent-border">
      <button
        class="top-toolbar__button top-toolbar__button--runcode"
        type="button"
        title="Insert math"
        aria-label="Insert math"
        :disabled="isInsertDisabled"
        @click="handleInsertClick"
      >
        Insert
      </button>
      <button
        class="top-toolbar__button top-toolbar__button--reset"
        type="button"
        title="Cancel"
        aria-label="Cancel"
        :disabled="isToolbarDisabled"
        @click="handleCancelClick"
      >
        Cancel
      </button>

      <button
        v-for="snippet in quickActionSnippets"
        :key="snippet.id"
        class="top-toolbar__button top-toolbar__button--icon"
        type="button"
        :title="snippet.label"
        :aria-label="`Insert ${snippet.label}`"
        :disabled="isToolbarDisabled"
        @click="handleSnippetButton(snippet)"
      >
        {{ snippet.symbol ?? snippet.label }}
      </button>
      <label class="top-toolbar__button top-toolbar__button--select-label">
        <select
          v-model="greekLowercaseSelectValue"
          class="top-toolbar__button--select"
          aria-label="Insert Greek letter"
          :disabled="isToolbarDisabled"
          @change="handleGreekLowercaseSelect"
        >
          <option
            v-for="snippet in greekLowercaseSnippets"
            :key="snippet.id"
            :value="snippet.id"
            :title="snippet.label"
          >
            {{ snippet.symbol ?? snippet.label }}
          </option>
        </select>
      </label>
      <label class="top-toolbar__button top-toolbar__button--select-label">
        <select
          v-model="greekCapitalSelectValue"
          class="top-toolbar__button--select"
          aria-label="Insert Greek letter"
          :disabled="isToolbarDisabled"
          @change="handleGreekCapitalSelect"
        >
          <option
            v-for="snippet in greekCapitalSnippets"
            :key="snippet.id"
            :value="snippet.id"
            :title="snippet.label"
          >
            {{ snippet.symbol ?? snippet.label }}
          </option>
        </select>
      </label>
      <label class="top-toolbar__button top-toolbar__button--select-label">
        <select
          v-model="comparisonSelectValue"
          class="top-toolbar__button--select"
          aria-label="Insert comparison symbol"
          :disabled="isToolbarDisabled"
          @change="handleComparisonSelect"
        >
          <option
            v-for="snippet in comparisonSnippets"
            :key="snippet.id"
            :value="snippet.id"
            :title="snippet.label"
          >
            {{ snippet.symbol ?? snippet.label }}
          </option>
        </select>
      </label>
      <label class="top-toolbar__button top-toolbar__button--select-label">
        <select
          v-model="accentSelectValue"
          class="top-toolbar__button--select"
          aria-label="Insert accent"
          :disabled="isToolbarDisabled"
          @change="handleAccentSelect"
        >
          <option
            v-for="snippet in accentSnippets"
            :key="snippet.id"
            :value="snippet.id"
            :title="snippet.label"
          >
            {{ snippet.symbol ?? snippet.label }}
          </option>
        </select>
      </label>
      <label class="top-toolbar__button top-toolbar__button--select-label">
        <select
          v-model="parenthesesSelectValue"
          class="top-toolbar__button--select"
          aria-label="Insert parentheses"
          :disabled="isToolbarDisabled"
          @change="handleParenthesesSelect"
        >
          <option
            v-for="snippet in parenthesesSnippets"
            :key="snippet.id"
            :value="snippet.id"
            :title="snippet.label"
          >
            {{ snippet.symbol ?? snippet.label }}
          </option>
        </select>
      </label>
      <label class="top-toolbar__button top-toolbar__button--select-label">
        <select
          v-model="trigonometrySelectValue"
          class="top-toolbar__button--select"
          aria-label="Insert trigonometry function"
          :disabled="isToolbarDisabled"
          @change="handleTrigonometrySelect"
        >
          <option
            v-for="snippet in trigonometrySnippets"
            :key="snippet.id"
            :value="snippet.id"
            :title="snippet.label"
          >
            {{ snippet.symbol ?? snippet.label }}
          </option>
        </select>
      </label>
      <label class="top-toolbar__button top-toolbar__button--select-label">
        <select
          v-model="calculusSelectValue"
          class="top-toolbar__button--select"
          aria-label="Insert calculus formula"
          :disabled="isToolbarDisabled"
          @change="handleCalculusSelect"
        >
          <option
            v-for="snippet in calculusSnippets"
            :key="snippet.id"
            :value="snippet.id"
            :title="snippet.label"
          >
            {{ snippet.symbol ?? snippet.label }}
          </option>
        </select>
      </label>
      <label class="top-toolbar__button top-toolbar__button--select-label">
        <select
          v-model="probabilitySelectValue"
          class="top-toolbar__button--select"
          aria-label="Insert probability formula"
          :disabled="isToolbarDisabled"
          @change="handleProbabilitySelect"
        >
          <option
            v-for="snippet in probabilitySnippets"
            :key="snippet.id"
            :value="snippet.id"
            :title="snippet.label"
          >
            {{ snippet.symbol ?? snippet.label }}
          </option>
        </select>
      </label>
      <label class="top-toolbar__button top-toolbar__button--select-label">
        <select
          v-model="geometrySelectValue"
          class="top-toolbar__button--select"
          aria-label="Insert geometry formula"
          :disabled="isToolbarDisabled"
          @change="handleGeometrySelect"
        >
          <option
            v-for="snippet in geometrySnippets"
            :key="snippet.id"
            :value="snippet.id"
            :title="snippet.label"
          >
            {{ snippet.symbol ?? snippet.label }}
          </option>
        </select>
      </label>
      <label class="top-toolbar__button top-toolbar__button--select-label">
        <select
          v-model="scienceSelectValue"
          class="top-toolbar__button--select"
          aria-label="Insert famous formula"
          :disabled="isToolbarDisabled"
          @change="handleScienceSelect"
        >
          <option
            v-for="snippet in scienceSnippets"
            :key="snippet.id"
            :value="snippet.id"
            :title="snippet.label"
          >
            {{ snippet.symbol ?? snippet.label }}
          </option>
        </select>
      </label>
      <label class="top-toolbar__button top-toolbar__button--select-label">
        <select
          v-model="constantsSelectValue"
          class="top-toolbar__button--select"
          aria-label="Insert scientific constant"
          :disabled="isToolbarDisabled"
          @change="handleConstantsSelect"
        >
          <option
            v-for="snippet in fundamentalConstantSnippets"
            :key="snippet.id"
            :value="snippet.id"
            :title="snippet.label"
          >
            {{ snippet.symbol ?? snippet.label }}
          </option>
        </select>
      </label>
      <label class="top-toolbar__button top-toolbar__button--select-label">
        <select
          v-model="seriesSelectValue"
          class="top-toolbar__button--select"
          aria-label="Insert series expression or sum"
          :disabled="isToolbarDisabled"
          @change="handleSeriesSelect"
        >
          <option
            v-for="snippet in seriesSnippets"
            :key="snippet.id"
            :value="snippet.id"
            :title="snippet.label"
          >
            {{ snippet.symbol ?? snippet.label }}
          </option>
        </select>
      </label>
      <label class="top-toolbar__button top-toolbar__button--select-label">
        <select
          v-model="numberSetSelectValue"
          class="top-toolbar__button--select"
          aria-label="Insert number set"
          :disabled="isToolbarDisabled"
          @change="handleNumberSetSelect"
        >
          <option
            v-for="snippet in numberSetSnippets"
            :key="snippet.id"
            :value="snippet.id"
            :title="snippet.label"
          >
            {{ snippet.symbol ?? snippet.label }}
          </option>
        </select>
      </label>
      <label class="top-toolbar__button top-toolbar__button--select-label">
        <select
          v-model="matrixBracketSelectValue"
          class="top-toolbar__button--select"
          aria-label="Insert matrix with brackets"
          :disabled="isToolbarDisabled"
          @change="handleMatrixBracketSelect"
        >
          <option
            v-for="snippet in matrixBracketOptions"
            :key="snippet.id"
            :value="snippet.id"
            :title="snippet.label"
          >
            {{ snippet.symbol ?? snippet.label }}
          </option>
        </select>
      </label>
      <label class="top-toolbar__button top-toolbar__button--select-label">
        <select
          v-model="matrixParenthesisSelectValue"
          class="top-toolbar__button--select"
          aria-label="Insert matrix with parentheses"
          :disabled="isToolbarDisabled"
          @change="handleMatrixParenthesisSelect"
        >
          <option
            v-for="snippet in matrixParenthesisOptions"
            :key="snippet.id"
            :value="snippet.id"
            :title="snippet.label"
          >
            {{ snippet.symbol ?? snippet.label }}
          </option>
        </select>
      </label>
      <label class="top-toolbar__button top-toolbar__button--select-label">
        <select
          v-model="matrixDeterminantSelectValue"
          class="top-toolbar__button--select"
          aria-label="Insert matrix with determinant bars"
          :disabled="isToolbarDisabled"
          @change="handleMatrixDeterminantSelect"
        >
          <option
            v-for="snippet in matrixDeterminantOptions"
            :key="snippet.id"
            :value="snippet.id"
            :title="snippet.label"
          >
            {{ snippet.symbol ?? snippet.label }}
          </option>
        </select>
      </label>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import type { Ref } from 'vue'
import { useThemeStore } from '@renderer/stores/themes/colorThemeStore'
import { useBottomPanelStore } from '@renderer/stores/UI/bottompanelStore'
import { useTextEditorsStore } from '@renderer/stores/editors/textEditorsStore'
import { useCellSelectionStore } from '@renderer/stores/toolbar-cell-communication/cellSelectionStore'
import type { Editor } from '@tiptap/vue-3'
import type { KatexSnippetDefinition } from '@renderer/types/katex-snippet-definition'
import {
  accentSnippets as accentSnippetDefinitions,
  alignedSnippets as alignedSnippetDefinitions,
  calculusSnippets as calculusSnippetDefinitions,
  chemistryFormulaSnippets as chemistryFormulaSnippetDefinitions,
  comparisonSnippets as comparisonSnippetDefinitions,
  fundamentalConstantSnippets as fundamentalConstantSnippetDefinitions,
  geometrySnippets as geometrySnippetDefinitions,
  greekCapitalSnippets as greekCapitalSnippetDefinitions,
  greekLowercaseSnippets as greekLowercaseSnippetDefinitions,
  matrixBracketSnippets as matrixBracketSnippetDefinitions,
  matrixDeterminantSnippets as matrixDeterminantSnippetDefinitions,
  matrixParenthesisSnippets as matrixParenthesisSnippetDefinitions,
  nuclidesSnippets as nuclidesSnippetDefinitions,
  numberSetSnippets as numberSetSnippetDefinitions,
  operatorQuantorSnippets as operatorQuantorSnippetDefinitions,
  parenthesesSnippets as parenthesesSnippetDefinitions,
  physicsFormulaSnippets as physicsFormulaSnippetDefinitions,
  piecewiseSnippets as piecewiseSnippetDefinitions,
  probabilitySnippets as probabilitySnippetDefinitions,
  quickActionMathSnippets as quickActionMathSnippetDefinitions,
  seriesSnippets as seriesSnippetDefinitions,
  trigonometrySnippets as trigonometrySnippetDefinitions
} from '@renderer/constants/katex-snippets/import-export-all-katex-snippets'

type MathCommandChain = ReturnType<Editor['chain']> & {
  insertInlineMath: (opts: { latex: string }) => MathCommandChain
  insertBlockMath: (opts: { latex: string }) => MathCommandChain
  updateInlineMath?: (opts: { latex: string }) => MathCommandChain
  updateBlockMath?: (opts: { latex: string }) => MathCommandChain
}

const themeStore = useThemeStore()
const bottomPanelStore = useBottomPanelStore()
const textEditorsStore = useTextEditorsStore()
const cellSelectionStore = useCellSelectionStore()

const isDarkMode = computed(() => !!themeStore.isDarkMode)

const targetCellId = computed(
  () => bottomPanelStore.katexPanelTargetCellId ?? cellSelectionStore.selectedCellId ?? null
)

const activeEditor = computed<Editor | null>(() => {
  const cellId = targetCellId.value
  if (!cellId) return null
  return (textEditorsStore.getEditorByCellId(cellId) as Editor | null) ?? null
})

const isToolbarDisabled = computed(() => !activeEditor.value)

const isInsertDisabled = computed(() => {
  if (isToolbarDisabled.value) return true
  if (bottomPanelStore.katexPanelLatex.trim().length === 0) return true
  return !!bottomPanelStore.katexPanelError
})
/*------------------------------ */
/* const for snippet definitions */
/*------------------------------ */
const accentSnippets = accentSnippetDefinitions
const alignedSnippets = alignedSnippetDefinitions
const calculusSnippets = calculusSnippetDefinitions
const chemistryFormulaSnippets = chemistryFormulaSnippetDefinitions
const comparisonSnippets = comparisonSnippetDefinitions
const fundamentalConstantSnippets = fundamentalConstantSnippetDefinitions
const geometrySnippets = geometrySnippetDefinitions
const greekCapitalSnippets = greekCapitalSnippetDefinitions
const greekLowercaseSnippets = greekLowercaseSnippetDefinitions
const matrixBracketOptions = matrixBracketSnippetDefinitions
const matrixDeterminantOptions = matrixDeterminantSnippetDefinitions
const matrixParenthesisOptions = matrixParenthesisSnippetDefinitions
const nuclidesSnippets = nuclidesSnippetDefinitions
const numberSetSnippets = numberSetSnippetDefinitions
const operatorQuantorSnippets = operatorQuantorSnippetDefinitions
const parenthesesSnippets = parenthesesSnippetDefinitions
const physicsFormulaSnippets = physicsFormulaSnippetDefinitions
const piecewiseSnippets = piecewiseSnippetDefinitions
const probabilitySnippets = probabilitySnippetDefinitions
const quickActionSnippets = quickActionMathSnippetDefinitions
const seriesSnippets = seriesSnippetDefinitions
const trigonometrySnippets = trigonometrySnippetDefinitions
/*----------------------- */
/* refs for select values */
/*----------------------- */
const accentSelectValue = ref(accentSnippets[0]?.id ?? '')
const calculusSelectValue = ref(calculusSnippets[0]?.id ?? '')
const chemistryFormulaSelectValue = ref(chemistryFormulaSnippets[0]?.id ?? '')
const comparisonSelectValue = ref(comparisonSnippets[0]?.id ?? '')
const fundamentalConstantSelectValue = ref(fundamentalConstantSnippets[0]?.id ?? '')
const geometrySelectValue = ref(geometrySnippets[0]?.id ?? '')
const greekCapitalSelectValue = ref(greekCapitalSnippets[0]?.id ?? '')
const greekLowercaseSelectValue = ref(greekLowercaseSnippets[0]?.id ?? '')
const matrixBracketSelectValue = ref(matrixBracketOptions[0]?.id ?? '')
const matrixDeterminantSelectValue = ref(matrixDeterminantOptions[0]?.id ?? '')
const matrixParenthesisSelectValue = ref(matrixParenthesisOptions[0]?.id ?? '')
const nulidesSelectValue = ref(nuclidesSnippets[0]?.id ?? '')
const numberSetSelectValue = ref(numberSetSnippets[0]?.id ?? '')
const operatorQuantorSelectValue = ref(operatorQuantorSnippets[0]?.id ?? '')
const parenthesesSelectValue = ref(parenthesesSnippets[0]?.id ?? '')
const physicsFormulaSelectValue = ref(physicsFormulaSnippets[0]?.id ?? '')
const piecewiseSelectValue = ref(piecewiseSnippets[0]?.id ?? '')
const probabilitySelectValue = ref(probabilitySnippets[0]?.id ?? '')
const quickActionSelectValue = ref(quickActionSnippets[0]?.id ?? '')
const seriesSelectValue = ref(seriesSnippets[0]?.id ?? '')
const trigonometrySelectValue = ref(trigonometrySnippets[0]?.id ?? '')

function createSnippetSelectHandler(
  selectValue: Ref<string>,
  snippetList: KatexSnippetDefinition[]
): () => void {
  return (): void => {
    const snippetId = selectValue.value
    if (!snippetId) return
    const snippet = snippetList.find((item) => item.id === snippetId)
    queueSnippet(snippet)
    selectValue.value = snippetId
  }
}

const handleAccentSelect = createSnippetSelectHandler(accentSelectValue, accentSnippets)
const handleCalculusSelect = createSnippetSelectHandler(calculusSelectValue, calculusSnippets)
const handleChemistryFormulaSelect = createSnippetSelectHandler(
  chemistryFormulaSelectValue,
  chemistryFormulaSnippets
)
const handleComparisonSelect = createSnippetSelectHandler(comparisonSelectValue, comparisonSnippets)
const handleFundamentalConstantSelect = createSnippetSelectHandler(
  fundamentalConstantSelectValue,
  fundamentalConstantSnippets
)
const handleGeometrySelect = createSnippetSelectHandler(geometrySelectValue, geometrySnippets)
const handleGreekCapitalSelect = createSnippetSelectHandler(
  greekCapitalSelectValue,
  greekCapitalSnippets
)
const handleGreekLowercaseSelect = createSnippetSelectHandler(
  greekLowercaseSelectValue,
  greekLowercaseSnippets
)
const handleMatrixBracketSelect = createSnippetSelectHandler(
  matrixBracketSelectValue,
  matrixBracketOptions
)
const handleMatrixDeterminantSelect = createSnippetSelectHandler(
  matrixDeterminantSelectValue,
  matrixDeterminantOptions
)
const handleMatrixParenthesisSelect = createSnippetSelectHandler(
  matrixParenthesisSelectValue,
  matrixParenthesisOptions
)
const handleNulidesSelect = createSnippetSelectHandler(nulidesSelectValue, nuclidesSnippets)
const handleNumberSetSelect = createSnippetSelectHandler(numberSetSelectValue, numberSetSnippets)
const handleOperatorQuantorSelect = createSnippetSelectHandler(
  operatorQuantorSelectValue,
  operatorQuantorSnippets
)
const handleParenthesesSelect = createSnippetSelectHandler(
  parenthesesSelectValue,
  parenthesesSnippets
)
const handlePhysicsFormulaSelect = createSnippetSelectHandler(
  physicsFormulaSelectValue,
  physicsFormulaSnippets
)
const handlePiecewiseSelect = createSnippetSelectHandler(piecewiseSelectValue, piecewiseSnippets)
const handleProbabilitySelect = createSnippetSelectHandler(
  probabilitySelectValue,
  probabilitySnippets
)
const handleQuickActionSelect = createSnippetSelectHandler(
  quickActionSelectValue,
  quickActionSnippets
)
const handleSeriesSelect = createSnippetSelectHandler(seriesSelectValue, seriesSnippets)
const handleTrigonometrySelect = createSnippetSelectHandler(
  trigonometrySelectValue,
  trigonometrySnippets
)

function queueSnippet(snippet: KatexSnippetDefinition | undefined): void {
  if (!snippet) return

  bottomPanelStore.queueKatexPanelInsertion({
    latex: snippet.latex,
    selectionStartOffset: snippet.selection?.startOffset,
    selectionEndOffset: snippet.selection?.endOffset
  })
}

function handleSnippetButton(snippet: KatexSnippetDefinition): void {
  queueSnippet(snippet)
}

function handleInsertClick(): void {
  const latex = bottomPanelStore.katexPanelLatex.trim()
  if (!latex) {
    bottomPanelStore.setKatexPanelError('Enter a LaTeX expression to insert.')
    return
  }

  const editor = activeEditor.value
  if (!editor) {
    bottomPanelStore.setKatexPanelError('Select a text cell before inserting.')
    return
  }

  try {
    bottomPanelStore.clearKatexPanelError()
    const chain = editor.chain().focus() as MathCommandChain
    const interactionKind = bottomPanelStore.katexPanelInteractionKind
    const selection = bottomPanelStore.katexPanelSelectionRange
    const mode = bottomPanelStore.katexPanelMode

    if (interactionKind === 'edit') {
      const nodePos = bottomPanelStore.katexPanelTargetNodePos
      if (typeof nodePos === 'number') {
        chain.setNodeSelection(nodePos)
      } else if (selection) {
        chain.setTextSelection({ from: selection.from, to: selection.to })
      }

      const updateResult =
        mode === 'inline' ? chain.updateInlineMath?.({ latex }) : chain.updateBlockMath?.({ latex })

      if (!updateResult) {
        bottomPanelStore.setKatexPanelError('Updating math is unavailable in this editor.')
        return
      }
    } else {
      if (selection) {
        chain.setTextSelection({ from: selection.from, to: selection.to })
      }

      if (mode === 'inline') {
        chain.insertInlineMath({ latex })
      } else {
        chain.insertBlockMath({ latex })
      }
    }

    const success = chain.run()
    if (!success) {
      bottomPanelStore.setKatexPanelError('Failed to insert math expression.')
      return
    }
    bottomPanelStore.hidePanel()
  } catch (error) {
    console.warn('[KatexInputTopToolbar] Failed to insert math expression.', error)
    bottomPanelStore.setKatexPanelError('Failed to insert math expression.')
  }
}

function handleCancelClick(): void {
  bottomPanelStore.hidePanel()
}
</script>

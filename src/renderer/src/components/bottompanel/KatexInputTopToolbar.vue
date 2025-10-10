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
        title="Insert math (Ctrl+Enter)"
        aria-label="Insert math"
        :disabled="isInsertDisabled"
        @click="handleInsertClick"
      >
        Insert
      </button>
      <button
        class="top-toolbar__button top-toolbar__button--reset"
        type="button"
        title="Cancel (Esc)"
        aria-label="Cancel"
        :disabled="isToolbarDisabled"
        @click="handleCancelClick"
      >
        Cancel
      </button>

      <!-- insert button for alignedSnippetDefinitions -->
      <button
        class="top-toolbar__button top-toolbar__button--icon"
        type="button"
        title="Insert aligned equation"
        aria-label="Insert aligned equation"
        :disabled="isToolbarDisabled"
        @click="handleInsertAlignedEquation"
      >
        <span class="top-toolbar__button-icon">Aligned</span>
      </button>
      <!-- insert button for piecewiseSnippetDefinitions -->
      <button
        class="top-toolbar__button top-toolbar__button--icon"
        type="button"
        title="Insert piecewise function"
        aria-label="Insert piecewise function"
        :disabled="isToolbarDisabled"
        @click="handleInsertPiecewiseFunction"
      >
        <span class="top-toolbar__button-icon">Piecewise</span>
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
          v-model="trigonometrySelectValue"
          class="top-toolbar__button--select"
          aria-label="Insert trigonometry function"
          :disabled="isToolbarDisabled"
          @change="handleTrigonometrySelect"
        >
          <option value="" disabled>
            {{ katexSnippetsPlaceholder(trigonometrySnippets[0], 'Select trig function...') }}
          </option>
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
          v-model="parenthesesSelectValue"
          class="top-toolbar__button--select"
          aria-label="Insert parentheses"
          :disabled="isToolbarDisabled"
          @change="handleParenthesesSelect"
        >
          <option value="" disabled>
            {{ katexSnippetsPlaceholder(parenthesesSnippets[0], 'Select parentheses...') }}
          </option>
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
          v-model="comparisonSelectValue"
          class="top-toolbar__button--select"
          aria-label="Insert comparison symbol"
          :disabled="isToolbarDisabled"
          @change="handleComparisonSelect"
        >
          <option value="" disabled>
            {{ katexSnippetsPlaceholder(comparisonSnippets[0], 'Select comparison...') }}
          </option>
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
          v-model="arrowsSelectValue"
          class="top-toolbar__button--select"
          aria-label="Insert arrows symbol"
          :disabled="isToolbarDisabled"
          @change="handleArrowsSelect"
        >
          <option value="" disabled>
            {{ katexSnippetsPlaceholder(arrowsSnippets[0], 'Select arrow...') }}
          </option>
          <option
            v-for="snippet in arrowsSnippets"
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
          v-model="operatorQuantorSelectValue"
          class="top-toolbar__button--select"
          aria-label="Insert set symbol"
          :disabled="isToolbarDisabled"
          @change="handleOperatorQuantorSelect"
        >
          <option value="" disabled>
            {{ katexSnippetsPlaceholder(operatorQuantorSnippets[0], 'Select operator...') }}
          </option>
          <option
            v-for="snippet in operatorQuantorSnippets"
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
          v-model="setSelectValue"
          class="top-toolbar__button--select"
          aria-label="Insert set symbol"
          :disabled="isToolbarDisabled"
          @change="handleSetSelect"
        >
          <option value="" disabled>
            {{ katexSnippetsPlaceholder(setSnippets[0], 'Select set...') }}
          </option>
          <option
            v-for="snippet in setSnippets"
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
          aria-label="Insert set symbol"
          :disabled="isToolbarDisabled"
          @change="handleNumberSetSelect"
        >
          <option value="" disabled>
            {{ katexSnippetsPlaceholder(numberSetSnippets[0], 'Select number set...') }}
          </option>
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
          v-model="greekAllLettersSelectValue"
          class="top-toolbar__button--select"
          aria-label="Insert Greek letter"
          :disabled="isToolbarDisabled"
          @change="handleGreekAllLettersSelect"
        >
          <option value="" disabled>
            {{ katexSnippetsPlaceholder(greekAllLettersSnippets[0], 'Select Greek letter...') }}
          </option>
          <option
            v-for="snippet in greekAllLettersSnippets"
            :key="snippet.id"
            :value="snippet.id"
            :title="snippet.label"
          >
            {{ snippet.symbol ?? snippet.label }}
          </option>
        </select>
      </label>

      <!--
      <label class="top-toolbar__button top-toolbar__button--select-label">
        <select
          v-model="greekLowercaseSelectValue"
          class="top-toolbar__button--select"
          aria-label="Insert Greek letter"
          :disabled="isToolbarDisabled"
          @change="handleGreekLowercaseSelect"
        >
          <option value="" disabled>
            {{ katexSnippetsPlaceholder(greekLowercaseSnippets[0], 'Select Greek letter...') }}
          </option>
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
          <option value="" disabled>
            {{ katexSnippetsPlaceholder(greekCapitalSnippets[0], 'Select Greek capital...') }}
          </option>
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
      -->

      <label class="top-toolbar__button top-toolbar__button--select-label">
        <select
          v-model="geometrySymbolsSelectValue"
          class="top-toolbar__button--select"
          aria-label="Insert geometry symbol"
          :disabled="isToolbarDisabled"
          @change="handleGeometrySymbolsSelect"
        >
          <option value="" disabled>
            {{ katexSnippetsPlaceholder(geometrySymbolsSnippets[0], 'Select geometry...') }}
          </option>
          <option
            v-for="snippet in geometrySymbolsSnippets"
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
          <option value="" disabled>
            {{ katexSnippetsPlaceholder(accentSnippets[0], 'Select accent...') }}
          </option>
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
          v-model="matrixBracketSelectValue"
          class="top-toolbar__button--select"
          aria-label="Insert matrix bracket"
          :disabled="isToolbarDisabled"
          @change="handleMatrixBracketSelect"
        >
          <option value="" disabled>
            {{ katexSnippetsPlaceholder(matrixBracketSnippets[0], 'Select matrix [...]') }}
          </option>
          <option
            v-for="snippet in matrixBracketSnippets"
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
          aria-label="Insert matrix parenthesis"
          :disabled="isToolbarDisabled"
          @change="handleMatrixParenthesisSelect"
        >
          <option value="" disabled>
            {{ katexSnippetsPlaceholder(matrixParenthesisSnippets[0], 'Select matrix (...)') }}
          </option>
          <option
            v-for="snippet in matrixParenthesisSnippets"
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
          aria-label="Insert matrix determinant"
          :disabled="isToolbarDisabled"
          @change="handleMatrixDeterminantSelect"
        >
          <option value="" disabled>
            {{ katexSnippetsPlaceholder(matrixDeterminantSnippets[0], 'Select determinant |...|') }}
          </option>
          <option
            v-for="snippet in matrixDeterminantSnippets"
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
          <option value="" disabled>
            {{ katexSnippetsPlaceholder(probabilitySnippets[0], 'Select probability...') }}
          </option>
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
          v-model="fundamentalConstantSelectValue"
          class="top-toolbar__button--select"
          aria-label="Insert fundamental constant"
          :disabled="isToolbarDisabled"
          @change="handleFundamentalConstantSelect"
        >
          <option value="" disabled>
            {{ katexSnippetsPlaceholder(fundamentalConstantSnippets[0], 'Select constant...') }}
          </option>
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
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue'
import type { Ref } from 'vue'
import { useThemeStore } from '@renderer/stores/themes/colorThemeStore'
import { useBottomPanelStore } from '@renderer/stores/UI/bottompanelStore'
import { useTextEditorsStore } from '@renderer/stores/editors/textEditorsStore'
import { useCellSelectionStore } from '@renderer/stores/toolbar-cell-communication/cellSelectionStore'
import type { Editor } from '@tiptap/vue-3'
import type { KatexSnippetDefinition } from '@renderer/types/katex-snippet-definition'
import { ensureDisplayStyle } from '@renderer/code/tiptap/extensions/tiptap-mathematics-extension-config'
import {
  accentSnippets as accentSnippetDefinitions,
  alignedSnippets as alignedSnippetDefinitions,
  //areasAndVolumesSnippets as areasAndVolumesSnippetDefinitions,
  arrowsSnippets as arrowsSnippetDefinitions,
  //calculusSnippets as calculusSnippetDefinitions,
  //chemistryFormulaSnippets as chemistryFormulaSnippetDefinitions,
  //combinatoricsFormulaSnippets as combinatoricsFormulaSnippetDefinitions,
  comparisonSnippets as comparisonSnippetDefinitions,
  fundamentalConstantSnippets as fundamentalConstantSnippetDefinitions,
  //geometrySnippets as geometrySnippetDefinitions,
  geometrySymbolsSnippets as geometrySymbolsSnippetDefinitions,
  greekAllLettersSnippets as greekAllLettersSnippetDefinitions,
  //greekCapitalSnippets as greekCapitalSnippetDefinitions,
  //greekLowercaseSnippets as greekLowercaseSnippetDefinitions,
  matrixBracketSnippets as matrixBracketSnippetDefinitions,
  matrixDeterminantSnippets as matrixDeterminantSnippetDefinitions,
  matrixParenthesisSnippets as matrixParenthesisSnippetDefinitions,
  //nuclidesSnippets as nuclidesSnippetDefinitions,
  numberSetSnippets as numberSetSnippetDefinitions,
  operatorQuantorSnippets as operatorQuantorSnippetDefinitions,
  parenthesesSnippets as parenthesesSnippetDefinitions,
  //physicsFormulaSnippets as physicsFormulaSnippetDefinitions,
  piecewiseSnippets as piecewiseSnippetDefinitions,
  //probabilityDistributionsSnippets as probabilityDistributionsSnippetDefinitions,
  probabilitySnippets as probabilitySnippetDefinitions,
  quickActionMathSnippets as quickActionMathSnippetDefinitions,
  // seriesSnippets as seriesSnippetDefinitions,
  setSnippets as setSnippetDefinitions,
  //trigonometricIdentitiesSnippets as trigonometricIdentitiesSnippetDefinitions,
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

/**
 * Creates a placeholder text for select dropdowns using the first snippet's symbol/label
 * @param firstSnippet - The first snippet in the array
 * @param fallback - Fallback text if no snippet is available
 * @returns Placeholder text for the select dropdown
 */
function katexSnippetsPlaceholder(
  firstSnippet: KatexSnippetDefinition | undefined,
  fallback: string
): string {
  if (!firstSnippet) return fallback
  const symbol = firstSnippet.symbol ?? firstSnippet.label
  return `${symbol}..` /* use .. instead of ... to save space on toolbar */
}

/*------------------------------ */
/* const for snippet definitions */
/*------------------------------ */
const accentSnippets = accentSnippetDefinitions
const alignedSnippets = alignedSnippetDefinitions
//const areasAndVolumesSnippets = areasAndVolumesSnippetDefinitions
const arrowsSnippets = arrowsSnippetDefinitions
//const calculusSnippets = calculusSnippetDefinitions
//const chemistryFormulaSnippets = chemistryFormulaSnippetDefinitions
//const combinatoricsFormulaSnippets = combinatoricsFormulaSnippetDefinitions
const comparisonSnippets = comparisonSnippetDefinitions
const fundamentalConstantSnippets = fundamentalConstantSnippetDefinitions
//const geometrySnippets = geometrySnippetDefinitions
const geometrySymbolsSnippets = geometrySymbolsSnippetDefinitions
const greekAllLettersSnippets = greekAllLettersSnippetDefinitions
//const greekCapitalSnippets = greekCapitalSnippetDefinitions
//const greekLowercaseSnippets = greekLowercaseSnippetDefinitions
const matrixBracketSnippets = matrixBracketSnippetDefinitions
const matrixDeterminantSnippets = matrixDeterminantSnippetDefinitions
const matrixParenthesisSnippets = matrixParenthesisSnippetDefinitions
//const nuclidesSnippets = nuclidesSnippetDefinitions
const numberSetSnippets = numberSetSnippetDefinitions
const operatorQuantorSnippets = operatorQuantorSnippetDefinitions
const parenthesesSnippets = parenthesesSnippetDefinitions
//const physicsFormulaSnippets = physicsFormulaSnippetDefinitions
const piecewiseSnippets = piecewiseSnippetDefinitions
//const probabilityDistributionsSnippets = probabilityDistributionsSnippetDefinitions
const probabilitySnippets = probabilitySnippetDefinitions
const quickActionSnippets = quickActionMathSnippetDefinitions
// const seriesSnippets = seriesSnippetDefinitions
const setSnippets = setSnippetDefinitions
//const trigonometricIdentitiesSnippets = trigonometricIdentitiesSnippetDefinitions
const trigonometrySnippets = trigonometrySnippetDefinitions
/*----------------------- */
/* refs for select values */
/*----------------------- */
const accentSelectValue = ref('')
// const alignedSelectValue = ref(alignedSnippets[0]?.id ?? '') BUTTON not select
// const areasAndVolumesSelectValue = ref(areasAndVolumesSnippets[0]?.id ?? '')
const arrowsSelectValue = ref('')
//const calculusSelectValue = ref(calculusSnippets[0]?.id ?? '')
//const chemistryFormulaSelectValue = ref(chemistryFormulaSnippets[0]?.id ?? '')
// const combinatoricsFormulaSelectValue = ref(combinatoricsFormulaSnippets[0]?.id ?? '')
const comparisonSelectValue = ref('')
const fundamentalConstantSelectValue = ref('')
//const geometrySelectValue = ref(geometrySnippets[0]?.id ?? '')
const geometrySymbolsSelectValue = ref('')
const greekAllLettersSelectValue = ref('')
//const greekCapitalSelectValue = ref('')
//const greekLowercaseSelectValue = ref('')
const matrixBracketSelectValue = ref('')
const matrixDeterminantSelectValue = ref('')
const matrixParenthesisSelectValue = ref('')
//const nulidesSelectValue = ref(nuclidesSnippets[0]?.id ?? '')
const numberSetSelectValue = ref('')
const operatorQuantorSelectValue = ref('')
const parenthesesSelectValue = ref('')
//const physicsFormulaSelectValue = ref(physicsFormulaSnippets[0]?.id ?? '')
// const piecewiseSelectValue = ref(piecewiseSnippets[0]?.id ?? '') BUTTON not select
// const probabilityDistributionsSelectValue = ref(probabilityDistributionsSnippets[0]?.id ?? '')
const probabilitySelectValue = ref('')
//const quickActionSelectValue = ref(quickActionSnippets[0]?.id ?? '')
//const seriesSelectValue = ref(seriesSnippets[0]?.id ?? '')
const setSelectValue = ref('')
//const trigonometricIdentitiesSelectValue = ref(trigonometricIdentitiesSnippets[0]?.id ?? '')
const trigonometrySelectValue = ref('')

function createSnippetSelectHandler(
  selectValue: Ref<string>,
  snippetList: KatexSnippetDefinition[]
): () => void {
  return (): void => {
    const snippetId = selectValue.value
    if (!snippetId) return
    const snippet = snippetList.find((item) => item.id === snippetId)
    queueSnippet(snippet)
    // Reset to empty string so the same option can be selected again
    selectValue.value = ''
  }
}

const handleAccentSelect = createSnippetSelectHandler(accentSelectValue, accentSnippets)
const handleArrowsSelect = createSnippetSelectHandler(arrowsSelectValue, arrowsSnippets)
const handleInsertAlignedEquation = (): void => {
  const snippet = alignedSnippets[0]
  queueSnippet(snippet)
}

//const handleCalculusSelect = createSnippetSelectHandler(calculusSelectValue, calculusSnippets)
/*const handleChemistryFormulaSelect = createSnippetSelectHandler(
  chemistryFormulaSelectValue,
  chemistryFormulaSnippets
)*/
//const handleCombinatoricsFormulaSelect = createSnippetSelectHandler(
//  combinatoricsFormulaSelectValue,
//  combinatoricsFormulaSnippets
//)
const handleComparisonSelect = createSnippetSelectHandler(comparisonSelectValue, comparisonSnippets)
const handleFundamentalConstantSelect = createSnippetSelectHandler(
  fundamentalConstantSelectValue,
  fundamentalConstantSnippets
)
//const handleGeometrySelect = createSnippetSelectHandler(geometrySelectValue, geometrySnippets)
const handleGeometrySymbolsSelect = createSnippetSelectHandler(
  geometrySymbolsSelectValue,
  geometrySymbolsSnippets
)
const handleGreekAllLettersSelect = createSnippetSelectHandler(
  greekAllLettersSelectValue,
  greekAllLettersSnippets
)
//const handleGreekCapitalSelect = createSnippetSelectHandler(
//  greekCapitalSelectValue,
//  greekCapitalSnippets
//)
//const handleGreekLowercaseSelect = createSnippetSelectHandler(
//  greekLowercaseSelectValue,
//  greekLowercaseSnippets
//)
const handleMatrixBracketSelect = createSnippetSelectHandler(
  matrixBracketSelectValue,
  matrixBracketSnippets
)
const handleMatrixDeterminantSelect = createSnippetSelectHandler(
  matrixDeterminantSelectValue,
  matrixDeterminantSnippets
)
const handleMatrixParenthesisSelect = createSnippetSelectHandler(
  matrixParenthesisSelectValue,
  matrixParenthesisSnippets
)
//const handleNuclidesSelect = createSnippetSelectHandler(nulidesSelectValue, nuclidesSnippets)
const handleNumberSetSelect = createSnippetSelectHandler(numberSetSelectValue, numberSetSnippets)
const handleOperatorQuantorSelect = createSnippetSelectHandler(
  operatorQuantorSelectValue,
  operatorQuantorSnippets
)
const handleParenthesesSelect = createSnippetSelectHandler(
  parenthesesSelectValue,
  parenthesesSnippets
)
/*const handlePhysicsFormulaSelect = createSnippetSelectHandler(
  physicsFormulaSelectValue,
  physicsFormulaSnippets
)*/
const handleInsertPiecewiseFunction = (): void => {
  const snippet = piecewiseSnippets[0]
  queueSnippet(snippet)
}
//const handleProbabilityDistributionsSelect = createSnippetSelectHandler(
//  probabilityDistributionsSelectValue,
//  probabilityDistributionsSnippets
//)
const handleProbabilitySelect = createSnippetSelectHandler(
  probabilitySelectValue,
  probabilitySnippets
)
/*const handleQuickActionSelect = createSnippetSelectHandler(
  quickActionSelectValue,
  quickActionSnippets
)*/
// const handleSeriesSelect = createSnippetSelectHandler(seriesSelectValue, seriesSnippets)
/*const handleTrigonometricIdentitiesSelect = createSnippetSelectHandler(
  trigonometricIdentitiesSelectValue,
  trigonometricIdentitiesSnippets
)*/
const handleSetSelect = createSnippetSelectHandler(setSelectValue, setSnippets)
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

      // Process latex for display style if needed
      const processedLatex = mode === 'block' ? ensureDisplayStyle(latex, true) : latex

      const updateResult =
        mode === 'inline'
          ? chain.updateInlineMath?.({ latex: processedLatex })
          : chain.updateBlockMath?.({ latex: processedLatex })

      if (!updateResult) {
        bottomPanelStore.setKatexPanelError('Updating math is unavailable in this editor.')
        return
      }
    } else {
      if (selection) {
        chain.setTextSelection({ from: selection.from, to: selection.to })
      }

      // Process latex for display style if needed
      const processedLatex = mode === 'block' ? ensureDisplayStyle(latex, true) : latex

      if (mode === 'inline') {
        chain.insertInlineMath({ latex: processedLatex })
      } else {
        chain.insertBlockMath({ latex: processedLatex })
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

// Keyboard event handler for Ctrl+Enter and Esc shortcuts
function handleKeyDown(event: KeyboardEvent): void {
  if (event.ctrlKey && event.key === 'Enter') {
    event.preventDefault()
    if (!isInsertDisabled.value) {
      handleInsertClick()
    }
  } else if (event.key === 'Escape') {
    event.preventDefault()
    if (!isToolbarDisabled.value) {
      handleCancelClick()
    }
  }
}

// Setup keyboard event listeners
onMounted(() => {
  document.addEventListener('keydown', handleKeyDown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeyDown)
})

function handleCancelClick(): void {
  bottomPanelStore.hidePanel()
}
</script>

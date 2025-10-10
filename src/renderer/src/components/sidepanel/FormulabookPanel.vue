<template>
  <div class="sidepanel-container-inside-resize-border-padding">
    <FormulaBookSelectionRow
      :current-page="currentFormulabookPanel"
      :font-size="fontSizeStore.fontSizes.sidepanelMenubarFontSize"
      @update:current-page="handlePanelChange"
    />

    <div :class="['sidepanel-flex-column-overflow-y', 'sidepanel-color-font-styling']">
      <CalculusFormulasPanel v-if="currentFormulabookPanel === 'calculus-formulas-panel'" />
      <SeriesFormulasPanel v-else-if="currentFormulabookPanel === 'series-formulas-panel'" />
      <GeometryFormulasPanel v-else-if="currentFormulabookPanel === 'geometry-formulas-panel'" />
      <CombinatoricsFormulasPanel
        v-else-if="currentFormulabookPanel === 'combinatorics-formulas-panel'"
      />
      <ProbabilityFormulasPanel
        v-else-if="currentFormulabookPanel === 'probability-formulas-panel'"
      />
      <PhysicsFormulasPanel v-else-if="currentFormulabookPanel === 'physics-formulas-panel'" />
      <ChemistryFormulasPanel v-else-if="currentFormulabookPanel === 'chemistry-formulas-panel'" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, type Ref, watch } from 'vue'
import { useFontSizeStore } from '@renderer/stores/fonts/fontSizeStore'
import FormulaBookSelectionRow from './formulabook-components/FormulabookPanelSelectionRow.vue'
import CalculusFormulasPanel from './formulabook-components/CalculusFormulasPanel.vue'
import SeriesFormulasPanel from './formulabook-components/SeriesFormulasPanel.vue'
import GeometryFormulasPanel from './formulabook-components/GeometryFormulasPanel.vue'
import CombinatoricsFormulasPanel from './formulabook-components/CombinatoricsFormulasPanel.vue'
import ProbabilityFormulasPanel from './formulabook-components/ProbabilityFormulasPanel.vue'
import PhysicsFormulasPanel from './formulabook-components/PhysicsFormulasPanel.vue'
import ChemistryFormulasPanel from './formulabook-components/ChemistryFormulasPanel.vue'

import { useLastSelectedFormulabookPanelStore } from '@renderer/stores/formulabook/lastSelectedFormulabookPanelStore'
import {
  DEFAULT_FORMULABOOK_PANEL,
  type FormulabookPanelKey
} from '@renderer/types/formulabook-panel-types'

const lastSelectedFormulabookPanelStore = useLastSelectedFormulabookPanelStore()
const fontSizeStore = useFontSizeStore()

const currentFormulabookPanel: Ref<FormulabookPanelKey> = ref(
  lastSelectedFormulabookPanelStore.currentPanel ?? DEFAULT_FORMULABOOK_PANEL
)

// Keep the local selection aligned with persisted state and vice versa so the
// panel stays in sync across reloads and other components.
watch(
  () => lastSelectedFormulabookPanelStore.currentPanel,
  (selectedPanel) => {
    if (selectedPanel !== currentFormulabookPanel.value) {
      currentFormulabookPanel.value = selectedPanel
    }
  },
  { immediate: true }
)

watch(
  () => currentFormulabookPanel.value,
  (selectedPanel) => {
    if (selectedPanel !== lastSelectedFormulabookPanelStore.currentPanel) {
      lastSelectedFormulabookPanelStore.setLastSelectedPanel(selectedPanel)
    }
  }
)

function handlePanelChange(selectedPanel: FormulabookPanelKey): void {
  currentFormulabookPanel.value = selectedPanel
}
</script>

<style scoped>
/* Styles are in the css folder */
</style>

<template>
  <div class="sidepanel-container-inside-resize-border-padding">
    <HelpPanelSelectionRow
      :current-page="currentHelpPanel"
      :font-size="fontSizeStore.fontSizes.sidepanelMenubarFontSize"
      @update:current-page="handlePanelChange"
    />

    <div :class="['sidepanel-flex-column-overflow-y', 'sidepanel-color-font-styling']">
      <GeneralHelpPanel v-if="currentHelpPanel === 'general'" />
      <CodeHelpPanel v-else-if="currentHelpPanel === 'code'" />
      <CasHelpPanel v-else-if="currentHelpPanel === 'cas'" />
      <GeometryHelpPanel v-else-if="currentHelpPanel === 'geometry'" />
      <GraphicalCalculatorHelpPanel v-else-if="currentHelpPanel === 'graphical-calculator'" />
      <SpreadsheetsHelpPanel v-else-if="currentHelpPanel === 'spreadsheets'" />
      <ProbabilityHelpPanel v-else-if="currentHelpPanel === 'probability'" />
      <TextEditorHelpPanel v-else-if="currentHelpPanel === 'text-editor'" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, type Ref, watch } from 'vue'
import { useFontSizeStore } from '@renderer/stores/fonts/fontSizeStore'
import HelpPanelSelectionRow from './help-components/HelpPanelSelectionRow.vue'
import GeneralHelpPanel from './help-components/GeneralHelpPanel.vue'
import CodeHelpPanel from './help-components/CodeHelpPanel.vue'
import CasHelpPanel from './help-components/CasHelpPanel.vue'
import GeometryHelpPanel from './help-components/GeometryHelpPanel.vue'
import GraphicalCalculatorHelpPanel from './help-components/GraphicalCalculatorHelpPanel.vue'
import SpreadsheetsHelpPanel from './help-components/SpreadsheetsHelpPanel.vue'
import ProbabilityHelpPanel from './help-components/ProbabilityHelpPanel.vue'
import TextEditorHelpPanel from './help-components/TextEditorHelpPanel.vue'
import { useLastSelectedHelpPanelStore } from '@renderer/stores/help/lastSelectedHelpPanelStore'
import { DEFAULT_HELP_PANEL, type HelpPanelKey } from '@renderer/types/helppanel-types'

const lastSelectedHelpPanelStore = useLastSelectedHelpPanelStore()
const fontSizeStore = useFontSizeStore()

const currentHelpPanel: Ref<HelpPanelKey> = ref(
  lastSelectedHelpPanelStore.currentPanel ?? DEFAULT_HELP_PANEL
)

// Keep the local selection aligned with persisted state and vice versa so the
// panel stays in sync across reloads and other components.
watch(
  () => lastSelectedHelpPanelStore.currentPanel,
  (selectedPanel) => {
    if (selectedPanel !== currentHelpPanel.value) {
      currentHelpPanel.value = selectedPanel
    }
  },
  { immediate: true }
)

watch(
  () => currentHelpPanel.value,
  (selectedPanel) => {
    if (selectedPanel !== lastSelectedHelpPanelStore.currentPanel) {
      lastSelectedHelpPanelStore.setLastSelectedPanel(selectedPanel)
    }
  }
)

function handlePanelChange(selectedPanel: HelpPanelKey): void {
  currentHelpPanel.value = selectedPanel
}
</script>

<style scoped>
/* Styles are in the css folder */
</style>

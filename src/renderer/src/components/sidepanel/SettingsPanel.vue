<template>
  <div class="sidepanel-container-inside-resize-border-padding">
    <SettingsPanelSelectorRow :current-page="currentPage" @update:current-page="onUpdatePage" />
    <!-- Content area -->
    <div :class="['sidepanel-flex-column-overflow-y', 'sidepanel-color-font-styling']">
      <GeneralSettingsPanel v-if="currentPage === 'general'" />
      <CodeSettingsPanel v-else-if="currentPage === 'code'" />
      <CasSettingsPanel v-else-if="currentPage === 'cas'" />
      <GenometrySettingsPanel v-else-if="currentPage === 'geometry'" />
      <GraphicalCalculatorSettingsPanel v-else-if="currentPage === 'graphical-calculator'" />
      <SpreadsheetsSettingsPanel v-else-if="currentPage === 'spreadsheets'" />
      <ProbabilitySettingsPanel v-else-if="currentPage === 'probability'" />
      <TextEditorPanel v-else-if="currentPage === 'text-editor'" />
      <LlmAssistantSettingsPanel v-else-if="currentPage === 'llm-assistant'" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, type Ref, watch } from 'vue'
import SettingsPanelSelectorRow from './settings-components/SettingsPanelSelectorRow.vue'
import GeneralSettingsPanel from './settings-components/GeneralSettingsPanel.vue'
import CodeSettingsPanel from './settings-components/CodeSettingsPanel.vue'
import CasSettingsPanel from './settings-components/CasSettingsPanel.vue'
import GenometrySettingsPanel from './settings-components/GenometrySettingsPanel.vue'
import GraphicalCalculatorSettingsPanel from './settings-components/GraphicalCalculatorSettingsPanel.vue'
import SpreadsheetsSettingsPanel from './settings-components/SpreadsheetsSettingsPanel.vue'
import ProbabilitySettingsPanel from './settings-components/ProbabilitySettingsPanel.vue'
import TextEditorPanel from './settings-components/TextEditorPanel.vue'
import LlmAssistantSettingsPanel from './settings-components/LlmAssistantSettingsPanel.vue'
import { useLastSelectedSettingPanelStore } from '@renderer/stores/settings/lastSelectedSettingPanelStore'
import { DEFAULT_SETTINGS_PANEL, type SettingsPanelKey } from '@renderer/types/settingspanel-types'
//import { useFontSizeStore } from '@renderer/stores/fonts/fontSizeStore'

const lastSelectedPanelStore = useLastSelectedSettingPanelStore()

const currentPage: Ref<SettingsPanelKey> = ref(
  lastSelectedPanelStore.currentPanel ?? DEFAULT_SETTINGS_PANEL
)

watch(
  () => lastSelectedPanelStore.currentPanel,
  (panel) => {
    if (panel !== currentPage.value) {
      currentPage.value = panel
    }
  },
  { immediate: true }
)

watch(
  () => currentPage.value,
  (panel) => {
    if (panel !== lastSelectedPanelStore.currentPanel) {
      lastSelectedPanelStore.setLastSelectedPanel(panel)
    }
  }
)

function onUpdatePage(page: SettingsPanelKey): void {
  currentPage.value = page
}
</script>
<style scoped>
/* Styles are in the css folder */
</style>

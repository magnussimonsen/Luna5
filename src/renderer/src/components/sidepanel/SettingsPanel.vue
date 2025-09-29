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
      <LLMAssistantPanel v-else-if="currentPage === 'llm-assistant'" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, type Ref } from 'vue'
import SettingsPanelSelectorRow from './settings-components/SettingsPanelSelectorRow.vue'
import GeneralSettingsPanel from './settings-components/GeneralSettingsPanel.vue'
import CodeSettingsPanel from './settings-components/CodeSettingsPanel.vue'
import CasSettingsPanel from './settings-components/CasSettingsPanel.vue'
import GenometrySettingsPanel from './settings-components/GenometrySettingsPanel.vue'
import GraphicalCalculatorSettingsPanel from './settings-components/GraphicalCalculatorSettingsPanel.vue'
import SpreadsheetsSettingsPanel from './settings-components/SpreadsheetsSettingsPanel.vue'
import ProbabilitySettingsPanel from './settings-components/ProbabilitySettingsPanel.vue'
import TextEditorPanel from './settings-components/TextEditorPanel.vue'
import LLMAssistantPanel from './settings-components/LLMAssistantSettingsPanel.vue' 
//import { useFontSizeStore } from '@renderer/stores/fonts/fontSizeStore'

type SettingsPage =
  | 'general'
  | 'code'
  | 'cas'
  | 'geometry'
  | 'graphical-calculator'
  | 'spreadsheets'
  | 'probability'
  | 'text-editor'
  | 'code' // THIS IS PYTHON CODE EDITOR; DO NOT CVHANGE TO 'python'
  | 'llm-assistant'

const currentPage: Ref<SettingsPage> = ref('general')

function onUpdatePage(page: SettingsPage): void {
  currentPage.value = page
}
</script>
<style scoped>
/* Styles are in the css folder */
</style>

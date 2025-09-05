<template>
  <div class="settings-panel">
    <SettingsPanelSelectorRow
      :current-page="currentPage"
      :style="{ fontSize: fontSizeStore.fontSizes.sidePanelMenuBarFontSize }"
      @update:current-page="onUpdatePage"
    />
    <div
      class="settings-panel-content"
      :style="{ fontSize: fontSizeStore.fontSizes.sidePanelFontSize }"
    >
      <GeneralSettingsPanel v-if="currentPage === 'general'" />
      <CodeSettingsPanel v-else-if="currentPage === 'code'" />
      <CasSettingsPanel v-else-if="currentPage === 'cas'" />
      <GenometrySettingsPanel v-else-if="currentPage === 'geometry'" />
      <GraphicalCalculatorSettingsPanel v-else-if="currentPage === 'graphical-calculator'" />
      <SpreadsheetsSettingsPanel v-else-if="currentPage === 'spreadsheets'" />
      <ProbabilitySettingsPanel v-else-if="currentPage === 'probability'" />
      <TextEditorPanel v-else-if="currentPage === 'text-editor'" />
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
import { useFontSizeStore } from '@renderer/stores/fonts/fontSizeStore'

type SettingsPage =
  | 'general'
  | 'code'
  | 'cas'
  | 'geometry'
  | 'graphical-calculator'
  | 'spreadsheets'
  | 'probability'
  | 'text-editor'

const currentPage: Ref<SettingsPage> = ref('general')
const fontSizeStore = useFontSizeStore()

function onUpdatePage(page: SettingsPage): void {
  currentPage.value = page
}
</script>

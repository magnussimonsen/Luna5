<template>
  <div class="help-panel">
    <!-- Menu bar selection row (component) -->
    <HelpPanelSelectionRow
      :current-page="currentPage"
      :font-size="fontSizeStore.fontSizes.sidepanelMenubarFontSize"
      @update:current-page="onUpdatePage"
    />

    <!-- Content area -->
    <div
      class="help-panel-content sidepanel-padding-margin-base sidepanel-y-scrolling"
      :style="contentStyle"
    >
      <GeneralHelpPanel v-if="currentPage === 'general'" />
      <CodeHelpPanel v-else-if="currentPage === 'code'" />
      <CasHelpPanel v-else-if="currentPage === 'cas'" />
      <GeometryHelpPanel v-else-if="currentPage === 'geometry'" />
      <GraphicalCalculatorHelpPanel v-else-if="currentPage === 'graphical-calculator'" />
      <SpreadsheetsHelpPanel v-else-if="currentPage === 'spreadsheets'" />
      <ProbabilityHelpPanel v-else-if="currentPage === 'probability'" />
      <TextEditorHelpPanel v-else-if="currentPage === 'text-editor'" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, type Ref } from 'vue'
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

type HelpPage =
  | 'general'
  | 'code'
  | 'cas'
  | 'geometry'
  | 'graphical-calculator'
  | 'spreadsheets'
  | 'probability'
  | 'text-editor'

const currentPage: Ref<HelpPage> = ref('general')
const fontSizeStore = useFontSizeStore()

const contentStyle = computed(() => ({
  fontSize: fontSizeStore.fontSizes.sidepanelFontSize
}))

function onUpdatePage(page: HelpPage): void {
  currentPage.value = page
}
</script>

<style scoped>
.help-panel {
  display: flex;
  flex-direction: column;
}
.help-panel-content {
  flex: 1 1 auto;
  min-height: 0;
  overflow-y: auto;
}
</style>

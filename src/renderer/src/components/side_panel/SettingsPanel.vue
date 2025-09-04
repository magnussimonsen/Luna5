<template>
  <div class="settings-panel">
    <SettingsPanelSelectorRow :current-page="currentPage" @update:current-page="onUpdatePage" />
    <div class="settings-panel-content">
      <GeneralSettingsPanel v-if="currentPage === 'general'" />
      <CodeSettingsPanel v-else-if="currentPage === 'code'" />
      <CasSettingsPanel v-else-if="currentPage === 'cas'" />
      <GenometrySettingsPanel v-else-if="currentPage === 'geometry'" />
      <GraphicalCalculatorSettingsPanel v-else-if="currentPage === 'graphical-calculator'" />
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
import TextEditorPanel from './settings-components/TextEditorPanel.vue'

type SettingsPage = 'general' | 'code' | 'cas' | 'geometry' | 'graphical-calculator' | 'text-editor'

const currentPage: Ref<SettingsPage> = ref('general')

function onUpdatePage(page: SettingsPage): void {
  currentPage.value = page
}
</script>

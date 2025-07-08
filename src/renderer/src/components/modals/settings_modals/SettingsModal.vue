<script setup lang="ts">
import { ref } from 'vue'
import CloseModalButton from '../modalUI/CloseModalButton.vue'
import { useModalStore } from '@renderer/stores/UI/modalStore'
import { useThemeStore } from '@renderer/stores/themes/colorThemeStore'
import GeneralSettings from '@renderer/components/modals/settings_modals/settings_pages/GeneralSettings.vue'
import TextEditorSettings from '@renderer/components/modals/settings_modals/settings_pages/TextEditorSettings.vue'
import CasSettings from '@renderer/components/modals/settings_modals/settings_pages/CasSettings.vue'
import GeomentrySettings from '@renderer/components/modals/settings_modals/settings_pages/GeomentrySettings.vue'
import GraphicalCalculatorSettings from '@renderer/components/modals/settings_modals/settings_pages/GraphicalCalculatorSettings.vue'
import CodeSettings from '@renderer/components/modals/settings_modals/settings_pages/CodeSettings.vue'

const modalStore = useModalStore()
const themeStore = useThemeStore()
const selectedSettingsPage = ref('general')

const settingsPages = [
  { label: 'General Settings', value: 'general' },
  { label: 'Text Editor Settings', value: 'texteditor' },
  { label: 'Code Settings', value: 'codesettings' },
  { label: 'CAS Settings', value: 'cas' },
  { label: 'Geometry Settings', value: 'geometry' },
  { label: 'Graphical Calculator Settings', value: 'graphical' }
]
</script>

<template>
  <div class="settings-modal">
    <CloseModalButton :on-click="modalStore.closeSettingsModal" />
    <select
      v-model="selectedSettingsPage"
      class="settings-page-select"
      :class="{ 'dark-mode': themeStore.isDarkMode }"
    >
      <option v-for="page in settingsPages" :key="page.value" :value="page.value">
        {{ page.label }}
      </option>
    </select>
    <div class="settings-content">
      <GeneralSettings v-if="selectedSettingsPage === 'general'" />
      <TextEditorSettings v-else-if="selectedSettingsPage === 'texteditor'" />
      <CodeSettings v-else-if="selectedSettingsPage === 'codesettings'" />
      <CasSettings v-else-if="selectedSettingsPage === 'cas'" />
      <GeomentrySettings v-else-if="selectedSettingsPage === 'geometry'" />
      <GraphicalCalculatorSettings v-else-if="selectedSettingsPage === 'graphical'" />
    </div>
  </div>
</template>

<style scoped>
.settings-modal {
  max-width: 700px;
  max-height: 500px;
  width: 95%;
  background: var(--menu-background, #fff);
  color: var(--text-color, #222);
  border-radius: 4px;
  padding: 1em;
  margin: 1em;
  line-height: 1;
  font-size: 0.9em;
  overflow: auto;
}
.settings-page-select {
  margin-bottom: 1.5em;
  font-size: 1em;
  padding: 0.25em 0.5em;
}
.settings-content {
  min-height: 300px;
}
select.dark-mode {
  background-color: black;
  color: #cccccc;
}
</style>

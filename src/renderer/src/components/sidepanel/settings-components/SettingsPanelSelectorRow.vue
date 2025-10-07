<template>
  <div :class="['sidepanel-row-flex-wrap', 'sidepanel-color-font-styling']">
    <div>
      <button
        v-for="button in panelButtons"
        :key="button.key"
        :class="[
          'sidepanel__button sidepanel-bottom-row-margin sidepanel-color-font-styling',
          { 'sidepanel__button--active': currentPage === button.key }
        ]"
        @click="emitUpdate(button.key)"
      >
        {{ button.label }}
      </button>
    </div>
  </div>
  <Divider />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import Divider from '@renderer/components/UI/Divider.vue'
import type { SettingsPanelKey } from '@renderer/types/settingspanel-types'

// const props = defineProps<{ currentPage: SettingsPanelKey; fontSize?: string }>()
const props = defineProps<{ currentPage: SettingsPanelKey }>()
const panelButtons: Array<{ key: SettingsPanelKey; label: string }> = [
  { key: 'general', label: 'General' },
  { key: 'text-editor', label: 'Text' },
  { key: 'graphical-calculator', label: 'Graphical calculator' },
  { key: 'cas', label: 'CAS' },
  { key: 'geometry', label: 'Geometry' },
  { key: 'spreadsheets', label: 'Spreadsheets' },
  { key: 'probability', label: 'Probability' },
  { key: 'code', label: 'Python editor' },
  { key: 'llm-assistant', label: 'LLM assistant' }
]
/* TO DO: Store the current page in a ref and update the settings store
with the state of which page is currently active. State might have to be added to
the settings store */
const emit = defineEmits<{ (e: 'update:current-page', value: SettingsPanelKey): void }>()

// const fontSize = computed(() => props.fontSize ?? '12px')
const currentPage = computed(() => props.currentPage)

function emitUpdate(page: SettingsPanelKey): void {
  emit('update:current-page', page)
}
</script>

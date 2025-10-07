<template>
  <div :style="{ fontSize: helpPanelFontSize }">
    <div :class="['sidepanel-row-flex-wrap', 'sidepanel-color-font-styling']">
      <div>
        <button
          v-for="button in helpPanelButtons"
          :key="button.key"
          :class="[
            'sidepanel__button sidepanel-bottom-row-margin sidepanel-color-font-styling',
            { 'sidepanel__button--active': currentHelpPanel === button.key }
          ]"
          @click="emitPanelSelection(button.key)"
        >
          {{ button.label }}
        </button>
      </div>
    </div>
    <Divider />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import Divider from '@renderer/components/UI/Divider.vue'
import type { HelpPanelKey } from '@renderer/types/helppanel-types'

const props = defineProps<{
  currentPage: HelpPanelKey
  fontSize?: string
}>()
const emit = defineEmits<{ (e: 'update:current-page', value: HelpPanelKey): void }>()

type HelpPanelButtonConfig = { key: HelpPanelKey; label: string }

// The order of this configuration controls how buttons appear in the UI.
const helpPanelButtons: HelpPanelButtonConfig[] = [
  { key: 'general', label: 'General' },
  { key: 'text-editor', label: 'Text' },
  { key: 'graphical-calculator', label: 'Graphical calculator' },
  { key: 'cas', label: 'CAS' },
  { key: 'geometry', label: 'Geometry' },
  { key: 'spreadsheets', label: 'Spreadsheets' },
  { key: 'probability', label: 'Probability' },
  { key: 'code', label: 'Python' }
]

const currentHelpPanel = computed(() => props.currentPage)
const helpPanelFontSize = computed(() => props.fontSize ?? '12px')

function emitPanelSelection(selectedPanel: HelpPanelKey): void {
  if (selectedPanel === props.currentPage) return

  emit('update:current-page', selectedPanel)
}
</script>

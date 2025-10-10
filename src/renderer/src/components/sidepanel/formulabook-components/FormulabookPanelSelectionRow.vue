<template>
  <div :style="{ fontSize: formulabookPanelFontSize }">
    <div :class="['sidepanel-row-flex-wrap', 'sidepanel-color-font-styling']">
      <div>
        <button
          v-for="button in formulabookPanelButtons"
          :key="button.key"
          :class="[
            'sidepanel__button sidepanel-bottom-row-margin sidepanel-color-font-styling',
            { 'sidepanel__button--active': currentFormulabookPanel === button.key }
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
import type { FormulabookPanelKey } from '@renderer/types/formulabook-panel-types'

const props = defineProps<{
  currentPage: FormulabookPanelKey
  fontSize?: string
}>()
const emit = defineEmits<{ (e: 'update:current-page', value: FormulabookPanelKey): void }>()

type FormulabookPanelButtonConfig = { key: FormulabookPanelKey; label: string }

// The order of this configuration controls how buttons appear in the UI.
const formulabookPanelButtons: FormulabookPanelButtonConfig[] = [
  { key: 'calculus-formulas-panel', label: 'Calculus' },
  { key: 'series-formulas-panel', label: 'Series' },
  { key: 'geometry-formulas-panel', label: 'Geometry' },
  { key: 'combinatorics-formulas-panel', label: 'Combinatorics' },
  { key: 'probability-formulas-panel', label: 'Probability' },
  { key: 'physics-formulas-panel', label: 'Physics' },
  { key: 'chemistry-formulas-panel', label: 'Chemistry' }
]

const currentFormulabookPanel = computed(() => props.currentPage)
const formulabookPanelFontSize = computed(() => props.fontSize ?? '12px')

function emitPanelSelection(selectedPanel: FormulabookPanelKey): void {
  if (selectedPanel === props.currentPage) return

  emit('update:current-page', selectedPanel)
}
</script>

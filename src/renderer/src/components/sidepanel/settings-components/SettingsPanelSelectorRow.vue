<template>
  <div class="settings-selector-row side-panel menu-bar" :style="{ fontSize }">
    <div>
      <button :class="{ active: currentPage === 'general' }" @click="emitUpdate('general')">
        General
      </button>
      <button :class="{ active: currentPage === 'text-editor' }" @click="emitUpdate('text-editor')">
        Text
      </button>
      <button
        :class="{ active: currentPage === 'graphical-calculator' }"
        @click="emitUpdate('graphical-calculator')"
      >
        Graphical calculator
      </button>
      <button :class="{ active: currentPage === 'cas' }" @click="emitUpdate('cas')">CAS</button>
      <button :class="{ active: currentPage === 'geometry' }" @click="emitUpdate('geometry')">
        Geometry
      </button>

      <button
        :class="{ active: currentPage === 'spreadsheets' }"
        @click="emitUpdate('spreadsheets')"
      >
        Spreadsheets
      </button>
      <button :class="{ active: currentPage === 'probability' }" @click="emitUpdate('probability')">
        Probability
      </button>
      <button :class="{ active: currentPage === 'code' }" @click="emitUpdate('code')">
        Python
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
type SettingsPage =
  | 'general'
  | 'code'
  | 'cas'
  | 'geometry'
  | 'graphical-calculator'
  | 'spreadsheets'
  | 'probability'
  | 'text-editor'

const props = defineProps<{ currentPage: SettingsPage; fontSize?: string }>()
/* TO DO: Store the current page in a ref and update the settings store
with the state of which page is currently active. State might have to be added to
the settings store */
const emit = defineEmits<{ (e: 'update:current-page', value: SettingsPage): void }>()

const fontSize = computed(() => props.fontSize ?? '12px')

function emitUpdate(page: SettingsPage): void {
  emit('update:current-page', page)
}
</script>

<template>
  <div class="settings-selector-row">
    <div>
      <button :class="{ active: currentPage === 'general' }" @click="emitUpdate('general')">
        General
      </button>
      <button :class="{ active: currentPage === 'code' }" @click="emitUpdate('code')">
        Python editor
      </button>
      <button :class="{ active: currentPage === 'cas' }" @click="emitUpdate('cas')">CAS</button>
      <button :class="{ active: currentPage === 'geometry' }" @click="emitUpdate('geometry')">
        Geometry explorer
      </button>
      <button
        :class="{ active: currentPage === 'graphical-calculator' }"
        @click="emitUpdate('graphical-calculator')"
      >
        Graphical calculator
      </button>
      <button :class="{ active: currentPage === 'text-editor' }" @click="emitUpdate('text-editor')">
        Text editor
      </button>
      <button
        :class="{ active: currentPage === 'spreadsheets' }"
        @click="emitUpdate('spreadsheets')"
      >
        Spreadsheets
      </button>
      <button :class="{ active: currentPage === 'probability' }" @click="emitUpdate('probability')">
        Probability calculator
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
type SettingsPage =
  | 'general'
  | 'code'
  | 'cas'
  | 'geometry'
  | 'graphical-calculator'
  | 'spreadsheets'
  | 'probability'
  | 'text-editor'

defineProps<{ currentPage: SettingsPage }>()
const emit = defineEmits<{ (e: 'update:current-page', value: SettingsPage): void }>()

function emitUpdate(page: SettingsPage): void {
  emit('update:current-page', page)
}
</script>

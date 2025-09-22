<template>
  <div
    :class="[
      'sidepanel-row-flex-wrap',
      'sidepanel-color-font-styling',
      'util-sub-sidepanel-container-padding'
    ]"
  >
    <div>
      <button
        :class="[
          'sidepanel__button sidepanel-color-font-styling',
          { 'sidepanel__button--active': currentPage === 'general' }
        ]"
        @click="emitUpdate('general')"
      >
        General
      </button>
      <button
        :class="[
          'sidepanel__button sidepanel-color-font-styling',
          { 'sidepanel__button--active': currentPage === 'text-editor' }
        ]"
        @click="emitUpdate('text-editor')"
      >
        Text
      </button>
      <button
        :class="[
          'sidepanel__button sidepanel-color-font-styling',
          { 'sidepanel__button--active': currentPage === 'graphical-calculator' }
        ]"
        @click="emitUpdate('graphical-calculator')"
      >
        Graphical calculator
      </button>
      <button
        :class="[
          'sidepanel__button sidepanel-color-font-styling',
          { 'sidepanel__button--active': currentPage === 'cas' }
        ]"
        @click="emitUpdate('cas')"
      >
        CAS
      </button>
      <button
        :class="[
          'sidepanel__button sidepanel-color-font-styling',
          { 'sidepanel__button--active': currentPage === 'geometry' }
        ]"
        @click="emitUpdate('geometry')"
      >
        Geometry
      </button>

      <button
        :class="[
          'sidepanel__button sidepanel-color-font-styling',
          { 'sidepanel__button--active': currentPage === 'spreadsheets' }
        ]"
        @click="emitUpdate('spreadsheets')"
      >
        Spreadsheets
      </button>
      <button
        :class="[
          'sidepanel__button sidepanel-color-font-styling',
          { 'sidepanel__button--active': currentPage === 'probability' }
        ]"
        @click="emitUpdate('probability')"
      >
        Probability
      </button>
      <button
        :class="[
          'sidepanel__button sidepanel-color-font-styling',
          { 'sidepanel__button--active': currentPage === 'code' }
        ]"
        @click="emitUpdate('code')"
      >
        Code editor (Python)
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
  | 'code'

// const props = defineProps<{ currentPage: SettingsPage; fontSize?: string }>()
const props = defineProps<{ currentPage: SettingsPage }>()
/* TO DO: Store the current page in a ref and update the settings store
with the state of which page is currently active. State might have to be added to
the settings store */
const emit = defineEmits<{ (e: 'update:current-page', value: SettingsPage): void }>()

// const fontSize = computed(() => props.fontSize ?? '12px')
const currentPage = computed(() => props.currentPage)

function emitUpdate(page: SettingsPage): void {
  emit('update:current-page', page)
}
</script>

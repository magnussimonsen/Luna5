<template>
  <div :class="['sidepanel-row-flex-wrap', 'sidepanel-color-font-styling']">
    <div>
      <button
        :class="[
          'sidepanel__button sidepanel-bottom-row-margin sidepanel-color-font-styling',
          { 'sidepanel__button--active': currentPage === 'general' }
        ]"
        @click="emitUpdate('general')"
      >
        General
      </button>
      <button
        :class="[
          'sidepanel__button sidepanel-bottom-row-margin sidepanel-color-font-styling',
          { 'sidepanel__button--active': currentPage === 'text-editor' }
        ]"
        @click="emitUpdate('text-editor')"
      >
        Text
      </button>
      <button
        :class="[
          'sidepanel__button sidepanel-bottom-row-margin sidepanel-color-font-styling',
          { 'sidepanel__button--active': currentPage === 'graphical-calculator' }
        ]"
        @click="emitUpdate('graphical-calculator')"
      >
        Graphical calculator
      </button>
      <button
        :class="[
          'sidepanel__button sidepanel-bottom-row-margin sidepanel-color-font-styling',
          { 'sidepanel__button--active': currentPage === 'cas' }
        ]"
        @click="emitUpdate('cas')"
      >
        CAS
      </button>
      <button
        :class="[
          'sidepanel__button sidepanel-bottom-row-margin sidepanel-color-font-styling',
          { 'sidepanel__button--active': currentPage === 'geometry' }
        ]"
        @click="emitUpdate('geometry')"
      >
        Geometry
      </button>

      <button
        :class="[
          'sidepanel__button sidepanel-bottom-row-margin sidepanel-color-font-styling',
          { 'sidepanel__button--active': currentPage === 'spreadsheets' }
        ]"
        @click="emitUpdate('spreadsheets')"
      >
        Spreadsheets
      </button>
      <button
        :class="[
          'sidepanel__button sidepanel-bottom-row-margin sidepanel-color-font-styling',
          { 'sidepanel__button--active': currentPage === 'probability' }
        ]"
        @click="emitUpdate('probability')"
      >
        Probability
      </button>
      <button
        :class="[
          'sidepanel__button sidepanel-bottom-row-margin sidepanel-color-font-styling',
          { 'sidepanel__button--active': currentPage === 'code' }
        ]"
        @click="emitUpdate('code')"
      >
        Python
      </button>
    </div>
  </div>
  <Divider />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import Divider from '@renderer/components/UI/Divider.vue'


export type HelpPage =
  | 'general'
  | 'code'
  | 'cas'
  | 'geometry'
  | 'graphical-calculator'
  | 'spreadsheets'
  | 'probability'
  | 'text-editor'

const props = defineProps<{ currentPage: HelpPage }>()
const emit = defineEmits<{ (e: 'update:current-page', value: HelpPage): void }>()

const currentPage = computed(() => props.currentPage)

function emitUpdate(page: HelpPage): void {
  emit('update:current-page', page)
}
</script>

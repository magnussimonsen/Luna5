<template>
  <div
    :class="[
      'sidepanel-flex-column-overflow-y',
      'sidepanel-color-font-styling',
      'util-padding-zero',
      'util-margin-zero',
      'sidepanel-top-row-margin',
      'util-liststyle-none'
    ]"
  >
    <strong :class="['sidepanel__notebook-item-transparent-border', 'sidepanel-bottom-row-margin']"
      >Spreadsheets Settings</strong
    >

    <div :class="['sidepanel__selector-row-with-gap-and-x-padding', 'sidepanel-bottom-row-margin']">
      <span>Spreadsheet options will appear here.</span>
    </div>
  </div>
</template>

<script setup lang="ts">
// Side panel placeholder aligned with existing settings layout
</script>

<style scoped>
/* Styles are in the css folder */
</style>

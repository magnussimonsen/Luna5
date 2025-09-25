<template>
  <div :class="['sidepanel-container-inside-resize-border-padding']">
    <strong
      :class="['sidepanel__notebook-item-transparent-border', 'sidepanel-color-font-styling']"
    >
      Variables and Functions
    </strong>

    <!-- Divider -->
    <Divider />
    <div
      :class="[
        'sidepanel-flex-column-overflow-y',
        'sidepanel-row-x-y-padding',
        'sidepanel-color-font-styling'
      ]"
    >
      This is the Variables panel. List of variables and functions used in this notebook will be
      shown here.
    </div>
  </div>
</template>

<script setup lang="ts">
import Divider from '@renderer/components/UI/Divider.vue'
</script>

<style scoped></style>

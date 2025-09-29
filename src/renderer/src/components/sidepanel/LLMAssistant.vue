<template>
  <div :class="['sidepanel-container-inside-resize-border-padding']">
    <strong
      :class="['sidepanel__notebook-item-transparent-border', 'sidepanel-color-font-styling']"
    >
      Chat with local LLMs
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
      This is a UI client for running local LLMs using Ollama.
    </div>
  </div>
</template>

<script setup lang="ts">
import Divider from '@renderer/components/UI/Divider.vue'
</script>

<style scoped></style>

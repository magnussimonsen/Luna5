
<template>
  <div :class="['sidepanel-container-inside-resize-border-padding']">
    <strong
      :class="['sidepanel__notebook-item-transparent-border', 'sidepanel-color-font-styling']"
    >
      Flashcards
    </strong>

    <!-- Divider -->
    <Divider />

    <div :class="['sidepanel-flex-column-overflow-y', 'sidepanel-color-font-styling']">
      <h1>🚧 Work in progress 🚧</h1>
      <p>This panel will host the Flashcards feature.</p>

     List of planed features:
      <ul>
        <li>
          Instead of a list of notebooks, this side panel will display a list of flashcard decks.
        </li>
        <li>Create, view, and manage flashcards with custom text, images and audio.</li>
        
        <li>Support for spaced repetition algorithms to optimize learning.</li>
        <li>Options to customize flashcard appearance and behavior.</li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import Divider from '@renderer/components/UI/Divider.vue'
</script>

<style scoped></style>

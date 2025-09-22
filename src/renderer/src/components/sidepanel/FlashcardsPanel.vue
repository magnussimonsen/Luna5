<template>
  <div
    :class="[
      'sidepanel-row-flex-wrap',
      'sidepanel-color-font-styling',
      'util-sub-sidepanel-container-padding'
    ]"
  >
    <h3 class="util-margin-zero">Flashcards 🚧 Work in progress</h3>
  </div>
  <div
    :class="[
      'sidepanel-flex-column-overflow-y',
      'sidepanel-color-font-styling',
      'util-sub-sidepanel-container-padding'
    ]"
  >
    This panel will host the Flashcards feature. The functionality and interface will be designed to
    match the existing Notebooks structure. Instead of a list of notebooks, it will display a list
    of flashcard decks. Each deck will contain flashcards that users can review and manage.
    <br /><br />
    The flashcards will support spaced repetition, allowing users to optimize their learning
    process. Users will be able to create, edit, and organize flashcards within decks.
    <br /><br />
    Additional features may include tagging flashcards and tracking progress.
  </div>
</template>

<script setup lang="ts">
// Placeholder only; wired via sidepanelStore as 'flashcards'
</script>

<style scoped></style>

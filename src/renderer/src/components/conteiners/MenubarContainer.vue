<!--
MenubarContainer.vue

This component is the top menubar container for the application. It renders the
application-level `Menubar` component and provides a stable slot in the top
toolbar area for navigation and global actions. Menubar-specific styles live in
`src/renderer/src/css/main-imports-this-css/top-toolbar-container.css`.
-->

<template>
  <!--
    Main container for the top menubar area.
    Renders the global `Menubar` component (navigation and app actions).
  -->
  <div class="menubar-container">
    <Menubar />
  </div>
</template>

<script setup lang="ts">
import Menubar from '@renderer/components/navigation-bars/Menubar.vue'
</script>

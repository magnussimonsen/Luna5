<!-- 
DropdownMenu.vue

A reusable dropdown menu component for the menubar and other UI areas.
- Allows toggling visibility and supports closing on outside clicks.
- Uses slots for flexible content and trigger customization.
- Styles: src/renderer/src/css/main-imports-this-css/menubar-dropdown.css
-->

<template>
  <!--
    Root container for the dropdown menu.
    Uses a ref for outside click detection.
  -->
  <div ref="dropdownRef" class="menubar-dropdown-container">
    <!--
      Trigger button for opening/closing the dropdown.
      Slot 'trigger' allows custom button content; falls back to label prop.
    -->
    <button
      class="menubar-dropdown-trigger-button"
      :class="{ active: isOpen }"
      @click="toggleDropdown"
    >
      <slot name="trigger">{{ label }}</slot>
    </button>
    <!--
      Dropdown content area.
      Uses default slot for menu items/content.
      Closes dropdown on click (can be customized).
    -->
    <div v-show="isOpen" class="menubar-dropdown-content" @click="closeDropdown">
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

// Props:
// - label: Text label for the dropdown trigger button
// - closeOnOutsideClick: Whether to close dropdown when clicking outside
const props = defineProps({
  label: {
    type: String,
    default: 'Dropdown'
  },
  closeOnOutsideClick: {
    type: Boolean,
    default: true
  }
})

const isOpen = ref(false)
const dropdownRef = ref<HTMLElement | null>(null)

const toggleDropdown = (): void => {
  isOpen.value = !isOpen.value
}

const closeDropdown = (): void => {
  isOpen.value = false
}

const handleOutsideClick = (event: MouseEvent): void => {
  if (
    props.closeOnOutsideClick &&
    dropdownRef.value &&
    !dropdownRef.value.contains(event.target as Node)
  ) {
    closeDropdown()
  }
}

onMounted(() => {
  document.addEventListener('click', handleOutsideClick)
})

onUnmounted(() => {
  document.removeEventListener('click', handleOutsideClick)
})

defineExpose({
  isOpen,
  closeDropdown,
  toggleDropdown
})
</script>

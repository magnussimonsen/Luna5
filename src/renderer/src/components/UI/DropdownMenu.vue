<!-- 
 DropdownMenu.vue
 Allows toggling visibility and supports closing on outside clicks.
 -->

<template>
  <div ref="dropdownRef" class="dropdown">
    <button class="dropdown-trigger" :class="{ 'is-active': isOpen }" @click="toggleDropdown">
      <slot name="trigger">{{ label }}</slot>
    </button>
    <div v-show="isOpen" class="dropdown-content" @click="closeDropdown">
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

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

<style scoped>
/* Dropdown container */
.dropdown {
  position: relative;
  display: inline-block;
  z-index: 3000;
  /* Higher than toolbar's z-index */
}

/* Trigger button */
.dropdown-trigger {
  background: transparent;
  color: var(--text-color);
  border: none;
  padding: var(--dropdown-trigger-padding, 0.5em 1em);
  /* top, right, bottom, left */
  cursor: pointer;
  font: inherit;
  border-radius: var(--border-radius);
  transition: background 0.1s;
}

.dropdown-trigger.is-active,
.dropdown-trigger:hover {
  background: var(--button-hover-color, red);
  color: var(--text-color, red);
}

/* Dropdown content */
.dropdown-content {
  position: absolute;
  top: 100%;
  left: 0;
  margin-top: 0.5em;
  min-width: fit-content;
  background: var(--menu-background);
  color: var(--text-color);
  border: solid 1px var(--dropdown-border-color, red);
  padding: 0.5em 0.5em 0.5em 0.5em;
  /* top, right, bottom, left */
  border-radius: var(--border-radius);
  z-index: 3001;
  /* Higher than the .dropdown z-index */
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  /* Add shadow for better visibility */
}
</style>

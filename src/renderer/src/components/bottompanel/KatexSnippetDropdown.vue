<!-- eslint-disable -->
<template>
  <div ref="dropdownRef" class="katex-toolbar-dropdown">
    <button
      type="button"
      class="top-toolbar__button katex-toolbar-dropdown__trigger"
      :disabled="isTriggerDisabled"
      :aria-expanded="isOpen ? 'true' : 'false'"
      aria-haspopup="listbox"
      :aria-label="ariaLabel || label"
      @click="toggleDropdown"
    >
      <span
        v-if="triggerIconClass"
        class="katex-toolbar-dropdown__trigger-icon"
        :class="triggerIconClass"
        aria-hidden="true"
      ></span>
      <span class="katex-toolbar-dropdown__trigger-label">{{ label }}</span>
    </button>
    <transition name="katex-toolbar-dropdown__menu-fade">
      <ul
        v-if="isOpen"
        class="katex-toolbar-dropdown__menu"
        role="listbox"
        :aria-label="`${label} snippets`"
      >
        <li v-for="item in items" :key="item.id" class="katex-toolbar-dropdown__menu-item">
          <button
            type="button"
            class="katex-toolbar-dropdown__item"
            role="option"
            @click="onSelect(item)"
          >
            <span
              v-if="item.iconClass"
              class="katex-toolbar-dropdown__item-icon"
              :class="item.iconClass"
              aria-hidden="true"
            ></span>
            <span class="katex-toolbar-dropdown__item-label">{{ item.label }}</span>
          </button>
        </li>
      </ul>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import type { KatexSnippetDefinition } from '@renderer/constants/katex-snippets'

const props = defineProps<{
  label: string
  triggerIconClass?: string
  items: KatexSnippetDefinition[]
  disabled?: boolean
  ariaLabel?: string
}>()

const emit = defineEmits<{
  (event: 'select', snippet: KatexSnippetDefinition): void
}>()

const isOpen = ref(false)
const dropdownRef = ref<HTMLElement | null>(null)

const hasItems = computed(() => props.items.length > 0)
const isTriggerDisabled = computed(() => props.disabled || !hasItems.value)

function closeDropdown(): void {
  isOpen.value = false
}

function toggleDropdown(): void {
  if (isTriggerDisabled.value) return
  isOpen.value = !isOpen.value
}

function onSelect(item: KatexSnippetDefinition): void {
  emit('select', item)
  closeDropdown()
}

function onDocumentPointerDown(event: PointerEvent): void {
  const target = event.target as Node | null
  if (!dropdownRef.value || !target) return
  if (!dropdownRef.value.contains(target)) {
    closeDropdown()
  }
}

onMounted(() => {
  document.addEventListener('pointerdown', onDocumentPointerDown)
})

onBeforeUnmount(() => {
  document.removeEventListener('pointerdown', onDocumentPointerDown)
})

watch(
  () => props.disabled,
  (disabled) => {
    if (disabled) {
      closeDropdown()
    }
  }
)

watch(
  () => props.items,
  () => {
    if (!hasItems.value) {
      closeDropdown()
    }
  }
)

watch(isOpen, (open) => {
  if (open) {
    const trigger = dropdownRef.value?.querySelector<HTMLButtonElement>('button')
    trigger?.focus()
  }
})
</script>

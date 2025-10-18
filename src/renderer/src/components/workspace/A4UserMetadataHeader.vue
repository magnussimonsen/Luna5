<template>
  <div
    v-if="shouldRenderHeader"
    class="a4-user-metadata-header"
    :class="{
      'metadata-disabled': !isHeaderEnabled,
      'metadata-ui-hidden': !isA4PreviewMode
    }"
    data-component="a4-user-metadata-header"
  >
    <div class="metadata-content">
      <div class="user-name">{{ fullName }}</div>
      <div class="user-email">{{ email }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useWorkspaceStore } from '@renderer/stores/workspaces/workspaceStore'
import { useGeneralSettingsStore } from '@renderer/stores/settings/generalSettingsStore'
import { useMenubarStore } from '@renderer/stores/UI/menubarStore'
import { userMetadataPlaceholder } from '@renderer/constants/user-metadata-placeholder'

const workspaceStore = useWorkspaceStore()
const generalSettingsStore = useGeneralSettingsStore()
const menubarStore = useMenubarStore()

const isHeaderEnabled = computed(() => generalSettingsStore.showUserMetadataInA4PreviewGetter)
const isA4PreviewMode = computed(() => menubarStore.workspaceLayoutMode === 'a4Preview')
const shouldRenderHeader = computed(() => isHeaderEnabled.value)

// Get owner metadata from workspace (fallback to placeholder)
const ownerMetadata = computed(() => {
  const workspace = workspaceStore.getWorkspace()
  if (!workspace?.ownerMetadata) {
    return userMetadataPlaceholder
  }
  // Get the first owner metadata record (or placeholder)
  const firstKey = Object.keys(workspace.ownerMetadata)[0]
  return firstKey ? workspace.ownerMetadata[firstKey] : userMetadataPlaceholder
})

// Computed full name
const fullName = computed(() => {
  const meta = ownerMetadata.value
  const parts = [meta.firstName, meta.middleName, meta.lastName].filter(Boolean)
  return parts.length > 0 ? parts.join(' ') : 'Unknown User'
})

// Computed email
const email = computed(() => {
  return ownerMetadata.value.email || 'no-email@example.com'
})
</script>

<style scoped>
.a4-user-metadata-header {
  width: 170mm;
  padding: 2mm;
}

.a4-user-metadata-header.metadata-ui-hidden {
  display: none;
}

.a4-user-metadata-header.metadata-disabled {
  border-bottom-color: transparent;
}

.a4-user-metadata-header.metadata-disabled .user-name,
.a4-user-metadata-header.metadata-disabled .user-email {
  color: transparent !important;
}

/* Print-specific styles for metadata header */
@media print {
  .a4-user-metadata-header {
    /* Print once at the top of the first page (no running header) */
    position: absolute !important;
    top: 10mm !important;
    left: 20mm !important;
    width: 170mm !important;
    display: flex !important;
    flex-direction: column !important;
    justify-content: flex-start !important;
    padding: 2mm !important;
    margin: 0 !important;
    background: var(--cell-margin-background-color) !important;
    z-index: 999 !important;
    box-sizing: border-box !important;
    page-break-after: avoid !important;
  }

  .a4-user-metadata-header.metadata-ui-hidden {
    display: none !important;
  }
}

.metadata-content {
  display: flex;
  flex-direction: column;
  gap: 0rem;
}

.user-name {
  font-weight: 600;
  font-size: 12px;
  color: var(--text-color, #333);
}

.user-email {
  font-size: 11px;
  color: var(--text-color, #666);
  font-style: italic;
}

/* Ensure readable colors in print */
@media print {
  .user-name {
    color: #000 !important;
  }

  .user-email {
    color: #333 !important;
  }
}
</style>

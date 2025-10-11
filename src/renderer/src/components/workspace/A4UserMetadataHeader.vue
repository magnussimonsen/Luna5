<template>
  <div v-if="shouldShow" class="a4-user-metadata-header">
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

// Determine if metadata should be shown
const shouldShow = computed(() => {
  return (
    generalSettingsStore.showUserMetadataInA4PreviewGetter &&
    menubarStore.workspaceLayoutMode === 'a4Preview'
  )
})

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
  /* Using px instead of mm for DPI consistency: 170mm ≈ 641.7px @ 96 DPI */
  width: 642px; /* A4 width minus 2cm margins on each side */
  padding: 8px; /* 0.2cm ≈ 7.56px @ 96 DPI */
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
</style>

<!-- Shows a green checkmark if feature is implemented, otherwise shows a red cross -->

<script setup lang="ts">
const props = defineProps<{ implemented: boolean }>()
</script>

<template>
  <span v-if="props.implemented" class="implemented">&#10004;</span>
  <span v-else class="not-implemented">&#10060;</span>
</template>

<style scoped>
.implemented {
  color: #43a047;
  margin-left: 0.75em;
  font-size: 1.1em;
  vertical-align: middle;
}
.not-implemented {
  color: #e53935;
  margin-left: 0.75em;
  font-size: 1.1em;
  vertical-align: middle;
}
</style>

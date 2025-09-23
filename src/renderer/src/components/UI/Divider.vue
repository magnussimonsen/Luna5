<template>
  <div class="divider"></div>
</template>

<style scoped>
.divider {
  position: relative;
  height: 0.5em; /* choose vertical space for the divider */
  margin: 0;
}
.divider::before {
  content: "";
  position: absolute;
  left: 0;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  height: 2px; /* line thickness */
  background: var(--divider-color);
}
</style>

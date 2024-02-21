<script setup lang="ts">
import { RouterView } from "vue-router";
</script>

<template>
  <div class="layout">
    <RouterView />
  </div>
</template>

<style lang="scss">
* {
  padding: 0;
  margin: 0;
}
.layout {
  background-color: var(--y-color-theme);
  min-height: 100vh;
  color: var(--y-color-text);
  font-size: var(--y-font-size);
}
</style>

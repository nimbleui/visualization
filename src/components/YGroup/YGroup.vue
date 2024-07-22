<template>
  <div class="y-group">
    <component v-for="item in elements" :key="item.id" :is="item.componentName"></component>
  </div>
</template>

<script setup lang="ts">
import type { GroupPropsTypes } from "./types";

defineOptions({
  name: "YGroup"
});
const props = defineProps<GroupPropsTypes>();
</script>

<style lang="scss" scoped>
.y-group {
  position: absolute;
  border: 1px solid var(--y-color-primary);
}
</style>

<template>
  <div class="y-group">
    <div
      class="y-group__item"
      v-for="item in elements"
      :key="item.id"
      :style="{
        width: `${item.width}`,
        height: `${item.height}`,
        transform: `rotate(${item.angle ?? 0}deg)`,
        left: `${item.left}`,
        top: `${item.top}`
      }"
    >
      <component :is="item.componentName" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { GroupPropsTypes } from "./types";

defineOptions({
  name: "YGroup"
});
defineProps<GroupPropsTypes>();
</script>

<style lang="scss" scoped>
.y-group {
  width: 100%;
  height: 100%;
  position: absolute;
  &__item {
    position: absolute;
  }
}
</style>

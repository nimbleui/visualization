<template>
  <div class="y-group">
    <div
      class="y-group__item"
      v-for="item in elements"
      :key="item.id"
      :id="item.id ? `${item.id}` : undefined"
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
  top: -1px;
  bottom: -1px;
  left: -1px;
  right: -1px;
  position: absolute;
  &__item {
    position: absolute;
  }
}
</style>

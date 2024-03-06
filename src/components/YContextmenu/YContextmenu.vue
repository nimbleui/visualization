<template>
  <div :style="styles" class="y-contextmenu">
    <ul>
      <li>锁定</li>
      <li>隐藏</li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { computed, type CSSProperties } from "vue";
import type { ContextmenuPropsTypes } from "./types";

defineOptions({
  name: "YContextmenu"
});

const props = defineProps<ContextmenuPropsTypes>();

const styles = computed<CSSProperties>(() => {
  const { x, y } = props;
  return {
    top: `${y}px`,
    left: `${x}px`
  };
});
</script>

<style lang="scss" scoped>
.y-contextmenu {
  position: absolute;
  z-index: 99999999;
  padding: 5px;
  background-color: var(--y-color-bg-elevated);
  ul {
    li {
      list-style: none;
    }
  }
}
</style>

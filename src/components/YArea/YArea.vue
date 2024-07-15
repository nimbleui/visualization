<template>
  <div :style="style" class="y-area"></div>
</template>

<script setup lang="ts">
import { computed, reactive, type CSSProperties } from "vue";
import type { AreaPropsTypes } from "./types";
import { useMouseMove } from "@nimble-ui/vue";

defineOptions({ name: "YArea" });
const props = defineProps<AreaPropsTypes>();

const elComp = computed(() => props.el);
const scaleComp = computed(() => props.scale ?? 1);
const boundaryComp = computed(() => props.boundary);

const areaInfo = reactive({
  top: 0,
  left: 0,
  width: 0,
  height: 0
});

useMouseMove(elComp, {
  scale: scaleComp,
  boundary: boundaryComp,
  down(data) {
    areaInfo.top = data.elDisY;
    areaInfo.left = data.elDisX;
  },
  move(data) {
    const { disX, disY } = data;
    areaInfo.width = disX;
    areaInfo.height = disY;
  },
  up(data) {
    areaInfo;
  }
});

const style = computed<CSSProperties>(() => {
  return {
    top: `${areaInfo.top}px`,
    left: `${areaInfo.left}px`,
    width: `${areaInfo.width}px`,
    height: `${areaInfo.height}px`
  };
});
</script>

<style lang="scss" scoped>
.y-area {
  position: relative;
  width: 0;
  height: 0;
  border: 1px solid var(--y-color-primary);
  background-color: rgba($color: #1677ff, $alpha: 0.4);
}
</style>

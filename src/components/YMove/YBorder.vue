<template>
  <div ref="warpRef" class="y-border">
    <span class="tl"></span>
    <span class="tc"></span>
    <span class="tr"></span>
    <span class="bl"></span>
    <span class="bc"></span>
    <span class="br"></span>
    <span class="cl"></span>
    <span class="cr"></span>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useMouseMove, type MoveDataType } from "@nimble-ui/vue";
import type { MoveChangeOptions } from "./types";

interface EmitsTypes {
  (e: "down", data: MoveChangeOptions): void;
  (e: "move", data: MoveDataType): void;
  (e: "up", data: MoveChangeOptions): void;
  (e: "change", data: MoveChangeOptions): void;
}

interface BorderPropsTypes {
  container?: HTMLElement;
  scale?: number;
}

defineOptions({
  name: "YBorder"
});
const emits = defineEmits<EmitsTypes>();
const props = defineProps<BorderPropsTypes>();

const warpRef = ref<HTMLHRElement>();
let currentDirection = "";
const result = {} as MoveChangeOptions;
// 限制的边界元素
const containerRef = computed(() => props.container);
const scaleRef = computed(() => props.scale ?? 1);
useMouseMove(warpRef, {
  stop: true,
  prevent: true,
  moveLimit: true,
  scale: scaleRef,
  boundary: containerRef,
  down(data, e) {
    const el = e.target as HTMLElement;
    currentDirection = el.className;
    Object.assign(result, { left: 0, width: 0, top: 0, height: 0 });
    emits("down", result);
  },
  move(data) {
    let { disX, disY } = data;
    switch (currentDirection) {
      case "tl": {
        result.height = -disY;
        result.width = -disX;
        result.left = disX;
        result.top = disY;
        break;
      }
      case "tc": {
        result.top = disY;
        result.height = -disY;
        break;
      }
      case "tr": {
        result.height = -disY;
        result.width = disX;
        result.top = disY;
        break;
      }
      case "bl": {
        result.height = disY;
        result.width = -disX;
        result.left = disX;
        break;
      }
      case "bc": {
        result.height = disY;
        break;
      }
      case "br": {
        result.height = disY;
        result.width = disX;
        break;
      }
      case "cl": {
        result.width = -disX;
        result.left = disX;
        break;
      }
      case "cr": {
        result.width = disX;
        break;
      }
    }

    emits("move", data);
    emits("change", result);
  },
  up() {
    emits("change", { width: 0, height: 0, top: 0, left: 0 });
    emits("up", result);
  }
});
</script>

<style lang="scss" scoped>
.y-border {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;

  &::after {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    content: "";
    background-color: var(--y-color-primary);
    opacity: 0.2;
  }

  span {
    position: absolute;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    box-sizing: border-box;
    background-color: var(--y-base-color);
    border: 1px solid var(--y-color-primary);
    z-index: 4;
    pointer-events: all;

    &.tl {
      top: -5px;
      left: -5px;
      cursor: nw-resize;
    }
    &.tc {
      top: -5px;
      left: 50%;
      cursor: n-resize;
      transform: translateX(-50%);
    }
    &.tr {
      top: -5px;
      right: -5px;
      cursor: ne-resize;
    }
    &.bl {
      left: -5px;
      bottom: -5px;
      cursor: sw-resize;
    }
    &.bc {
      left: 50%;
      bottom: -5px;
      transform: translateX(-50%);
      cursor: s-resize;
    }
    &.br {
      right: -5px;
      bottom: -5px;
      cursor: se-resize;
    }
    &.cl {
      left: -5px;
      top: 50%;
      transform: translateY(-50%);
      cursor: w-resize;
    }
    &.cr {
      right: -5px;
      top: 50%;
      transform: translateY(-50%);
      cursor: e-resize;
    }
  }
}
</style>

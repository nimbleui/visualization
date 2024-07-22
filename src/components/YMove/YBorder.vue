<template>
  <div ref="warpRef" class="y-border">
    <span
      v-for="item in pointList"
      :key="item"
      :class="item"
      :style="{ cursor: cursors[item] }"
      :data-type="item"
    ></span>
  </div>
</template>

<script setup lang="ts">
import { computed, watch, ref } from "vue";
import { useMouseMove, type MoveDataType } from "@nimble-ui/vue";
import type { MoveChangeOptions } from "./types";
import { objectTransform } from "@/utils";
import type { CommonRectType } from "../types";

interface EmitsTypes {
  (e: "down", data: MoveChangeOptions): void;
  (e: "move", data: MoveDataType): void;
  (e: "up", data: MoveChangeOptions): void;
  (e: "change", data: MoveChangeOptions): void;
}

interface BorderPropsTypes extends CommonRectType {
  container?: HTMLElement;
  scale?: number;
}

defineOptions({
  name: "YBorder"
});

const emits = defineEmits<EmitsTypes>();
const props = defineProps<BorderPropsTypes>();
const pointList = ["t", "r", "b", "l", "lt", "rt", "lb", "rb"] as const;
const initialAngle = {
  // 每个点对应的初始角度
  lt: 0,
  t: 45,
  rt: 90,
  r: 135,
  rb: 180,
  b: 225,
  lb: 270,
  l: 315
};
const angleToCursor = [
  // 每个范围的角度对应的光标
  { start: 338, end: 23, cursor: "nw" },
  { start: 23, end: 68, cursor: "n" },
  { start: 68, end: 113, cursor: "ne" },
  { start: 113, end: 158, cursor: "e" },
  { start: 158, end: 203, cursor: "se" },
  { start: 203, end: 248, cursor: "s" },
  { start: 248, end: 293, cursor: "sw" },
  { start: 293, end: 338, cursor: "w" }
];
const cursors = ref<Record<string, string>>({});
const warpRef = ref<HTMLHRElement>();
const result = {} as MoveChangeOptions;

const warpRect = { width: 0, height: 0, left: 0, top: 0, rotate: 0, centerX: 0, centerY: 0 };
useMouseMove(warpRef, {
  stop: true,
  prevent: true,
  moveLimit: true,
  scale: computed(() => props.scale ?? 1),
  boundary: computed(() => props.container),
  agency: true,
  agencyTarget(target) {
    if (target.dataset.type) return target;
  },
  down() {
    const values = objectTransform(props, ["width", "height", "left", "top", "angle"], (val) =>
      val ? parseInt(String(val)) : 0
    );
    Object.assign(warpRect, values, {
      centerX: values.left + values.width / 2,
      centerY: values.top + values.height / 2
    });

    Object.assign(result, { left: 0, width: 0, top: 0, height: 0 });
    emits("down", result);
  },
  move(data, e, target) {
    let { disX, disY } = data;
    const type = target.dataset.type;
    if (!type) return;
    const value = handleRatio(disX, disY, type);

    emits("move", data);
    emits("change", value);
  },
  up() {
    emits("up", result);
  }
});

const setValue = (size: number, delta: number, minSize = 0) => {
  const value = size + delta;
  if (value > minSize) {
    size = value;
  } else {
    delta = minSize - size;
    size = minSize;
  }
  return [size, delta];
};
const degToRadian = (deg: number) => (deg * Math.PI) / 180;
const cos = (deg: number) => Math.cos(degToRadian(deg));
const sin = (deg: number) => Math.sin(degToRadian(deg));
const handleRatio = (deltaX: number, deltaY: number, type: string, ratio?: number) => {
  const alpha = Math.atan2(deltaY, deltaX);
  const deltaL = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
  const beta = alpha - degToRadian(Number(props.angle || 0));
  let deltaW = deltaL * Math.cos(beta);
  let deltaH = deltaL * Math.sin(beta);

  let { centerX, centerY, width, height, rotate } = warpRect;
  switch (type) {
    case "lt": {
      deltaW = -deltaW;
      deltaH = -deltaH;
      [width, deltaW] = setValue(width, deltaW);
      [height, deltaH] = setValue(height, deltaH);

      if (ratio) {
        width = height * ratio;
        deltaW = deltaH * ratio;
      }

      centerX -= (deltaW / 2) * cos(rotate) - (deltaH / 2) * sin(rotate);
      centerY -= (deltaW / 2) * sin(rotate) + (deltaH / 2) * cos(rotate);
      break;
    }
    case "t": {
      deltaH = -deltaH;
      [height, deltaH] = setValue(height, deltaH);

      if (ratio) {
        width = height * ratio;
        deltaW = deltaH * ratio;
        // 左下角固定
        centerX += (deltaW / 2) * cos(rotate) + (deltaH / 2) * sin(rotate);
        centerY += (deltaW / 2) * sin(rotate) - (deltaH / 2) * cos(rotate);
      } else {
        centerX += (deltaH / 2) * sin(rotate);
        centerY -= (deltaH / 2) * cos(rotate);
      }
      break;
    }
    case "rt": {
      deltaH = -deltaH;
      [width, deltaW] = setValue(width, deltaW);
      [height, deltaH] = setValue(height, deltaH);
      if (ratio) {
        deltaW = deltaH * ratio;
        width = height * ratio;
      }
      centerX += (deltaW / 2) * cos(rotate) + (deltaH / 2) * sin(rotate);
      centerY += (deltaW / 2) * sin(rotate) - (deltaH / 2) * cos(rotate);
      break;
    }
    case "r": {
      [width, deltaW] = setValue(width, deltaW);
      if (ratio) {
        deltaH = deltaW / ratio;
        height = width / ratio;
        // 左上角固定
        centerX += (deltaW / 2) * cos(rotate) - (deltaH / 2) * sin(rotate);
        centerY += (deltaW / 2) * sin(rotate) + (deltaH / 2) * cos(rotate);
      } else {
        // 左边固定
        centerX += (deltaW / 2) * cos(rotate);
        centerY += (deltaW / 2) * sin(rotate);
      }
      break;
    }
    case "rb": {
      [width, deltaW] = setValue(width, deltaW);
      [height, deltaH] = setValue(height, deltaH);
      if (ratio) {
        deltaW = deltaH * ratio;
        width = height * ratio;
      }
      centerX += (deltaW / 2) * cos(rotate) - (deltaH / 2) * sin(rotate);
      centerY += (deltaW / 2) * sin(rotate) + (deltaH / 2) * cos(rotate);
      break;
    }
    case "b": {
      [height, deltaH] = setValue(height, deltaH);
      if (ratio) {
        deltaW = deltaH * ratio;
        width = height * ratio;
        // 左上角固定
        centerX += (deltaW / 2) * cos(rotate) - (deltaH / 2) * sin(rotate);
        centerY += (deltaW / 2) * sin(rotate) + (deltaH / 2) * cos(rotate);
      } else {
        // 上边固定
        centerX -= (deltaH / 2) * sin(rotate);
        centerY += (deltaH / 2) * cos(rotate);
      }
      break;
    }
    case "lb": {
      deltaW = -deltaW;
      [width, deltaW] = setValue(width, deltaW);
      [height, deltaH] = setValue(height, deltaH);
      if (ratio) {
        height = width / ratio;
        deltaH = deltaW / ratio;
      }
      centerX -= (deltaW / 2) * cos(rotate) + (deltaH / 2) * sin(rotate);
      centerY -= (deltaW / 2) * sin(rotate) - (deltaH / 2) * cos(rotate);
      break;
    }
    case "l": {
      deltaW = -deltaW;
      [width, deltaW] = setValue(width, deltaW);
      if (ratio) {
        height = width / ratio;
        deltaH = deltaW / ratio;
        // 右上角固定
        centerX -= (deltaW / 2) * cos(rotate) + (deltaH / 2) * sin(rotate);
        centerY -= (deltaW / 2) * sin(rotate) - (deltaH / 2) * cos(rotate);
      } else {
        // 右边固定
        centerX -= (deltaW / 2) * cos(rotate);
        centerY -= (deltaW / 2) * sin(rotate);
      }
    }
  }

  return {
    width: Math.round(Math.abs(width)),
    height: Math.round(Math.abs(height)),
    top: Math.round(centerY - Math.abs(height) / 2),
    left: Math.round(centerX - Math.abs(width) / 2)
  };
};

const getCursor = () => {
  const rotate = (Number(props.angle || 0) + 360) % 360; // 取余 360
  const result: any = {};
  let lastMatchIndex = -1; // 从上一个命中的角度的索引开始匹配下一个，降低时间复杂度

  pointList.forEach((point) => {
    const angle = (initialAngle[point] + rotate) % 360;
    const len = angleToCursor.length;
    // eslint-disable-next-line no-constant-condition
    while (true) {
      lastMatchIndex = (lastMatchIndex + 1) % len;
      const angleLimit = angleToCursor[lastMatchIndex];

      if (angle < 23 || angle >= 338) {
        result[point] = "nw-resize";

        return;
      }

      if (angleLimit.start <= angle && angle < angleLimit.end) {
        result[point] = angleLimit.cursor + "-resize";

        return;
      }
    }
  });

  return result;
};

watch(
  props,
  () => {
    cursors.value = getCursor();
  },
  {
    immediate: true,
    deep: true
  }
);
</script>

<style lang="scss" scoped>
.y-border {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  margin: 0 !important;

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

    &.lt {
      top: -5px;
      left: -5px;
      cursor: nw-resize;
    }
    &.t {
      top: -5px;
      left: 50%;
      cursor: n-resize;
      transform: translateX(-50%);
    }
    &.rt {
      top: -5px;
      right: -5px;
      cursor: ne-resize;
    }
    &.lb {
      left: -5px;
      bottom: -5px;
      cursor: sw-resize;
    }
    &.b {
      left: 50%;
      bottom: -5px;
      transform: translateX(-50%);
      cursor: s-resize;
    }
    &.rb {
      right: -5px;
      bottom: -5px;
      cursor: se-resize;
    }
    &.l {
      left: -5px;
      top: 50%;
      transform: translateY(-50%);
      cursor: w-resize;
    }
    &.r {
      right: -5px;
      top: 50%;
      transform: translateY(-50%);
      cursor: e-resize;
    }
  }
}
</style>

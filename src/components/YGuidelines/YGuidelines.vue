<template>
  <div class="y-guidelines">
    <span
      v-for="(item, index) in showLine"
      :style="{
        left: item.direction == 'y' ? `${item.site}px` : 0,
        top: item.direction == 'x' ? `${item.site}px` : 0
      }"
      class="y-guidelines__line"
      :class="item.direction"
      :key="index"
    ></span>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { ConfigItem, GuidelinesPropsTypes } from "./types";
import { watch } from "vue";
import { reactive } from "vue";
import { objectTransform } from "@/utils";

defineOptions({
  name: "YGuidelines"
});

const props = defineProps<GuidelinesPropsTypes>();
const showLine = reactive<{ site: number; direction: "x" | "y" }[]>([]);

const activeItem = computed(() => {
  const { current, configList } = props;
  return configList.find((item) => item.id === current);
});

const keys = ["top", "left", "width", "height"] as Array<"top" | "left" | "width" | "height">;
const callback = (val: any) => (val ? parseInt(val) : 0);
const DIFF = 3;
const handleLineShow = (item: ConfigItem, currentLine: number, isVertical?: boolean) => {
  const { width = 0, height = 0, left = 0, top = 0 } = objectTransform(item.style, keys, callback);
  const right = left + width;
  const level = left + width / 2;
  const bottom = top + height;
  const vertical = top + height / 2;

  if (isVertical) {
    if (Math.abs(currentLine - top) < DIFF) {
      showLine.push({
        site: top,
        direction: "x"
      });
    } else if (Math.abs(currentLine - vertical) < DIFF) {
      showLine.push({
        site: vertical,
        direction: "x"
      });
    } else if (Math.abs(currentLine - bottom) < DIFF) {
      showLine.push({
        site: bottom,
        direction: "x"
      });
    }
  } else {
    if (Math.abs(currentLine - left) < DIFF) {
      showLine.push({
        site: left,
        direction: "y"
      });
    } else if (Math.abs(currentLine - level) < DIFF) {
      showLine.push({
        site: level,
        direction: "y"
      });
    } else if (Math.abs(currentLine - right) < DIFF) {
      showLine.push({
        site: right,
        direction: "y"
      });
    }
  }
};
const handleGuideline = (current: ConfigItem) => {
  const { configList, direction } = props;
  showLine.length = 0;
  const {
    top: t = 0,
    left: l = 0,
    width: w = 0,
    height: h = 0
  } = objectTransform(current.style, keys, callback);
  const r = l + w;
  const lc = l + w / 2;
  const b = t + h;
  const vc = t + h / 2;

  configList.forEach((item) => {
    if (item.id == activeItem.value?.id) return;

    // 横方向判断
    handleLineShow(item, l);
    handleLineShow(item, lc);
    handleLineShow(item, r);

    // 竖直方向判断
    handleLineShow(item, t, true);
    handleLineShow(item, vc, true);
    handleLineShow(item, b, true);
  });
};

watch(
  activeItem,
  (val) => {
    val && handleGuideline(val);
  },
  { deep: true }
);
</script>

<style lang="scss" scoped>
.y-guidelines {
  &__line {
    position: absolute;
    background-color: var(--y-color-primary);

    &.x {
      width: 100%;
      height: 1px;
    }
    &.y {
      width: 1px;
      height: 100%;
    }
  }
}
</style>

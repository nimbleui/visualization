<template>
  <div v-show="isMove" :style="style" class="y-area"></div>
</template>

<script setup lang="ts">
import { computed, reactive, ref, type CSSProperties } from "vue";
import type { AreaPropsTypes } from "./types";
import { useMouseMove } from "@nimble-ui/vue";
import { objectTransform, toInt } from "@/utils";
import type { GroupItemType, YMoveItemType } from "../types";

export interface AreaInfoType {
  top: number;
  left: number;
  width: number;
  height: number;
  startY: number;
  startX: number;
}

defineOptions({ name: "YArea" });
const props = defineProps<AreaPropsTypes>();
const emits = defineEmits<{
  (e: "up", data: AreaInfoType): void;
  (e: "move", data: AreaInfoType): void;
}>();

const elComp = computed(() => props.el);
const scaleComp = computed(() => props.scale ?? 1);
const boundaryComp = computed(() => props.boundary);
const isMove = ref(false);
const list = computed<GroupItemType[]>(() => props.configList.map((el) => ({ ...el })));
const areaInfo = reactive<AreaInfoType>({
  top: 0,
  left: 0,
  width: 0,
  height: 0,
  startY: 0,
  startX: 0
});

useMouseMove(elComp, {
  scale: scaleComp,
  boundary: boundaryComp,
  prevent: true,
  stop: true,
  down(data) {
    const rect = boundaryComp.value?.getBoundingClientRect();
    areaInfo.startY = data.startY - (rect?.top || 0) / scaleComp.value;
    areaInfo.startX = data.startX - (rect?.left || 0) / scaleComp.value;
    // 重置选择的状态
    list.value.forEach((item) => {
      item.selected = false;
    });
  },
  move(data) {
    const { disX, disY } = data;
    if (disX < 2 || disY < 2) return;
    isMove.value = true;

    const { startY, startX } = areaInfo;
    areaInfo.top = disY < 0 ? startY + disY : startY;
    areaInfo.left = disX < 0 ? startX + disX : startX;
    areaInfo.width = Math.abs(disX);
    areaInfo.height = Math.abs(disY);
    areaMove(areaInfo);
    emits("move", { ...areaInfo });
  },
  up() {
    isMove.value = false;
    Object.assign(areaInfo, { top: 0, left: 0, width: 0, height: 0 });
    emits("up", { ...areaInfo });
    makeGroup();
  }
});
const keys = ["top", "left", "width", "height"] as Array<"top" | "left" | "width" | "height">;
function areaMove(data: AreaInfoType) {
  list.value?.forEach((item) => {
    const { left, top, width, height } = objectTransform(item, keys, (val) =>
      parseInt(String(val ?? "0"))
    );
    const containLeft = data.left < left && data.left + data.width > width + left;
    const containTop = data.top < top && data.top + data.width > height + top;
    item.selected = containLeft && containTop;
  });
}

function makeGroup() {
  const selectItems = list.value.filter((el) => el.selected);
  if (!selectItems.length) return;

  let minX = Infinity,
    maxX = -Infinity,
    minY = Infinity,
    maxY = -Infinity;
  selectItems.forEach((item) => {
    const {
      left = 0,
      right = 0,
      top = 0,
      bottom = 0
    } = document.getElementById(String(item.id))?.getBoundingClientRect() || {};
    const { left: l = 0, top: t = 0 } = boundaryComp.value!.getBoundingClientRect() || {};

    minX = Math.min(minX, left - l);
    maxX = Math.max(maxX, right - l);
    minY = Math.min(minY, top - t);
    maxY = Math.max(maxY, bottom - t);
  });

  const groupRect = {
    top: minY,
    left: minX,
    width: maxX - minX,
    height: maxY - minY
  };

  selectItems.forEach((item) => {
    item.left = toInt(item.left) - minX;
    item.top = toInt(item.top) - minY;
    const { left, top, width, height } = objectTransform(
      item,
      ["width", "top", "left", "height"],
      toInt
    );
    item.groupStyle = {
      ...item,
      width: toPercent(width, groupRect.width),
      height: toPercent(height, groupRect.height),
      left: toPercent(left, groupRect.left),
      top: toPercent(top, groupRect.top)
    };
  });
}

function toPercent(numerator: number, denominator: number) {
  return `${numerator / denominator}%`;
}

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
  z-index: 10000;
  border: 1px solid var(--y-color-primary);
  background-color: rgba($color: #1677ff, $alpha: 0.3);
}
</style>

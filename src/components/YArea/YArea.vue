<template>
  <div v-show="isMove" :style="style" class="y-area"></div>
</template>

<script setup lang="ts">
import { computed, reactive, ref, type CSSProperties } from "vue";
import type { AreaPropsTypes } from "./types";
import { useMouseMove } from "@nimble-ui/vue";
import { getBoundingClientRectByScale, objectTransform, toInt, useId } from "@/utils";
import type { YMoveItemType } from "../types";

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
  (e: "update:data", data: YMoveItemType[]): void;
  (e: "update:active", id: string | number): void;
}>();

const elComp = computed(() => props.el);
const scaleComp = computed(() => props.scale ?? 1);
const boundaryComp = computed(() => props.boundary);
const isMove = ref(false);
const areaInfo = reactive<AreaInfoType>({
  top: 0,
  left: 0,
  width: 0,
  height: 0,
  startY: 0,
  startX: 0
});

const groupInfo = {
  id: "",
  list: [] as YMoveItemType[],
  isGroup: false
};
useMouseMove(elComp, {
  scale: scaleComp,
  boundary: boundaryComp,
  prevent: true,
  stop: true,
  down(data) {
    if (groupInfo.isGroup) {
      cancelGroup();
    }
    const rect = boundaryComp.value?.getBoundingClientRect();
    areaInfo.startY = data.startY - (rect?.top || 0) / scaleComp.value;
    areaInfo.startX = data.startX - (rect?.left || 0) / scaleComp.value;
    // 记录列表
    groupInfo.list = props.data.map((el) => ({ ...el }));
    // 重置选择的状态
    props.data.forEach((item) => (item.selected = false));
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
  props.data.forEach((item) => {
    const { left, top, width, height } = objectTransform(item, keys, toInt);
    const containLeft = data.left < left && data.left + data.width > width + left;
    const containTop = data.top < top && data.top + data.width > height + top;
    item.selected = containLeft && containTop;
  });
}
const boundaryRect = computed(() => {
  return getBoundingClientRectByScale(boundaryComp.value!, scaleComp.value);
});
/**
 * 组合元素
 */
function makeGroup() {
  const selectItems = props.data.filter((el) => el.selected);
  if (!selectItems.length) return;

  // 标记是否存在合并
  groupInfo.isGroup = true;

  let minX = Infinity,
    maxX = -Infinity,
    minY = Infinity,
    maxY = -Infinity;
  const { left: l = 0, top: t = 0 } = boundaryRect.value;
  selectItems.forEach((item) => {
    const { left, right, top, bottom } = getBoundingClientRectByScale(
      document.getElementById(String(item.id))!,
      scaleComp.value
    );
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
    const t = toInt(item.top) - minY;
    const l = toInt(item.left) - minX;
    const { width, height } = objectTransform(item, keys, toInt);
    Object.assign(item, {
      top: toPercent(t, groupRect.height),
      left: toPercent(l, groupRect.width),
      width: toPercent(width, groupRect.width),
      height: toPercent(height, groupRect.height)
    });
  });
  const { data } = props;
  const newList = props.data.filter((el) => !el.selected);
  data.length = 0;
  const id = useId();
  groupInfo.id = id;
  data.push(...newList, {
    id,
    ...groupRect,
    selected: true,
    componentName: "YGroup",
    props: {
      elements: selectItems
    }
  });
  emits("update:data", data);
  emits("update:active", id);
}

function toPercent(numerator: number, denominator: number) {
  return `${(numerator / denominator) * 100}%`;
}

/**
 * 取消组合
 */
function cancelGroup() {
  const current = props.data.find((el) => el.selected);
  if (!current || current.componentName !== "YGroup") return;
  groupInfo.isGroup = false;
  const items = current.props.elements as YMoveItemType[];

  items.forEach((item) => {
    const { left, width, top, height } = getBoundingClientRectByScale(
      document.getElementById(String(item.id))!,
      scaleComp.value
    );
    const center = {
      x: left - boundaryRect.value.left + width / 2,
      y: top - boundaryRect.value.top + height / 2
    };
    const w = toInt(current.width) * perToNum(item.width);
    const h = toInt(current.height) * perToNum(item.height);
    const find = groupInfo.list.find((el) => el.id == item.id);
    if (find) {
      find.width = Math.round(w);
      find.height = Math.round(h);
      find.top = Math.round(center.y - h / 2);
      find.left = Math.round(center.x - w / 2);
      find.angle = toInt(find.angle) + toInt(current.angle);
    }
  });

  const notSelect = props.data.filter((el) => !el.selected);
  groupInfo.list.forEach((el, index) => {
    const find = notSelect.find((item) => item.id === el.id);
    if (find) groupInfo.list[index] = find;
  });

  const { data } = props;
  data.length = 0;
  data.push(...groupInfo.list);
  emits("update:data", data);
}

function perToNum(perStr: any) {
  if (!perStr) return 0;
  return parseFloat(perStr as string) / 100;
}

const style = computed<CSSProperties>(() => {
  return {
    top: `${areaInfo.top}px`,
    left: `${areaInfo.left}px`,
    width: `${areaInfo.width}px`,
    height: `${areaInfo.height}px`
  };
});

defineExpose({ cancelGroup, groupInfo });
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

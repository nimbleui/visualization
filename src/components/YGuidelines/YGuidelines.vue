<template>
  <div class="y-guidelines">
    <span></span>
    <span></span>
    <span></span>
    <span></span>
    <span></span>
    <span></span>
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
const callback = (val: any) => parseInt(val);
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
  const b = t + h;
  configList.forEach((item) => {
    if (item.id == activeItem.value?.id) return;

    const {
      width = 0,
      height = 0,
      left = 0,
      top = 0
    } = objectTransform(item.style, keys, callback);
    const right = left + width;
    const bottom = top + height;

    // 横方向判断
    if (l == right) {
      showLine.push({
        site: right,
        direction: "y"
      });
    } else if (l == left) {
      showLine.push({
        site: left,
        direction: "y"
      });
    }

    if (r == right) {
      showLine.push({
        site: right,
        direction: "y"
      });
    } else if (r == left) {
      showLine.push({
        site: left,
        direction: "y"
      });
    }

    if (t == top) {
      console.log(111);
    }
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

<style lang="scss" scoped></style>

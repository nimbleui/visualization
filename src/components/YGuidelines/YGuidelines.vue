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
const showLine = reactive([]);

const activeItem = computed(() => {
  const { current, configList } = props;
  return configList.find((item) => item.id === current);
});

const keys = ["top", "left", "width", "height"] as Array<"top" | "left" | "width" | "height">;
const callback = (val: any) => parseInt(val);
const handleGuideline = (current: ConfigItem) => {
  const { configList, direction } = props;
  const currentSize = objectTransform(current.style, keys, callback);
  configList.forEach((item) => {
    const size = objectTransform(item.style, keys, callback);
    if (currentSize.top == size.top) {
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

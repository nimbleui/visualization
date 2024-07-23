<template>
  <component :is="tag" :style="style">{{ content }}3333</component>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { TextPropsTypes } from "./types";
import type { CSSProperties } from "vue";
import { objectTransform, toInt } from "@/utils";

defineOptions({ name: "YText" });
const props = withDefaults(defineProps<TextPropsTypes>(), { tag: "span" });
const style = computed<CSSProperties>(() => {
  const { width, height } = objectTransform(props, ["height", "width"], toInt);
  return {
    width: width ? `${width}px` : undefined,
    height: height ? `${height}px` : undefined
  };
});
</script>

<style lang="scss" scoped></style>

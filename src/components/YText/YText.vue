<template>
  <component :is="tag">{{ content }}</component>
</template>

<script setup lang="ts">
import type { TextPropsTypes } from "./types";

defineOptions({ name: "YText" });
withDefaults(defineProps<TextPropsTypes>(), { tag: "span" });
</script>

<style lang="scss" scoped></style>

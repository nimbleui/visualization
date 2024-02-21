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
import type { GuidelinesPropsTypes } from "./types";
import { watch } from "vue";

defineOptions({
  name: "YGuidelines"
});

const props = defineProps<GuidelinesPropsTypes>();

const activeItem = computed(() => {
  const { current, configList } = props;
  return configList.find((item) => item.id === current);
});

watch(
  activeItem,
  (val) => {
    console.log("activeItem", val);
  },
  { deep: true }
);
</script>

<style lang="scss" scoped></style>

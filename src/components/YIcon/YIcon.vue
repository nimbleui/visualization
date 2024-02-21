<template>
  <i class="y-icon" :class="{ [`y-${name}`]: name }" :style="sizeCop" />
</template>

<script setup lang="ts">
import type { PropType } from "vue";
import { computed } from "vue";

defineOptions({
  name: "YIcon"
});

type NameType =
  | "single"
  | "biserial"
  | "copy"
  | "unlock"
  | "lock"
  | "pic"
  | "message"
  | "edit"
  | "release"
  | "set"
  | "style"
  | "home"
  | "back"
  | "forward"
  | "share"
  | "layer"
  | "preview"
  | "night"
  | "ce"
  | "component"
  | "day";
const props = defineProps({
  name: {
    type: String as PropType<NameType>
  },
  size: {
    type: [String, Number]
  }
});

const sizeCop = computed(() => {
  const { size } = props;
  if (!size) return {};

  return {
    fontSize: typeof size === "string" ? size : `${size}px`
  };
});
</script>

<style lang="scss" scoped></style>

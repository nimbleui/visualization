<template>
  <div ref="moveRef" class="y-move" :class="{ active: index == active }">
    111
    <slot />
    <YBorder
      v-if="index == active"
      :container="containerRef"
      @move="onChangeSize"
      @change="onChange"
      @down="onDownSize"
      :top="top"
      :left="left"
      :width="width"
      :height="height"
      :angle="angle"
      :scale="scale"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref, reactive } from "vue";
import type { MovePropsTypes, MoveChangeOptions, MoveEmitsTypes, MoveDirectionType } from "./types";
import { useMouseMove, type MoveDataType } from "@nimble-ui/vue";
import YBorder from "./YBorder.vue";
import { onMounted } from "vue";
import { objectTransform } from "@/utils";
import { watch } from "vue";
import useGuidelines from "./useGuidelines";

defineOptions({
  name: "YMove"
});

const props = withDefaults(defineProps<MovePropsTypes>(), {
  direction: () => ({}) as MoveDirectionType
});
const emits = defineEmits<MoveEmitsTypes>();

// 获取移动的元素
const moveRef = ref<HTMLElement>();
// 放大或者缩小的比例
const scaleRef = computed(() => props.scale ?? 1);
// 限制的边界元素
const containerRef = computed(() => props.container);

const startSize = reactive({ w: 0, h: 0, l: 0, t: 0 });
const getMoveSize = () => {
  if (!moveRef.value) return;
  const { offsetHeight: h, offsetLeft: l, offsetTop: t, offsetWidth: w } = moveRef.value;
  Object.assign(startSize, { w, h, l, t });
};

const lineOptions = computed(() => ({
  selector: ".y-move",
  scaleRatio: props.scale
}));
const { markLineEmit } = useGuidelines(moveRef, lineOptions);

useMouseMove(moveRef, {
  stop: true,
  prevent: true,
  moveLimit: true,
  scale: scaleRef,
  boundary: containerRef,
  down() {
    getMoveSize();
    emits("select", props.index);
    emits("update:active", props.index);
    markLineEmit("start");
  },
  move(data) {
    const { vertical, level, disX, disY } = data;
    emits("direction", { vertical, level });
    emits("update:move", true);
    emits("update:direction", Object.assign(props.direction, { vertical, level }));
    const val = markLineEmit("move", { y: disY, x: disX })!;
    emits("change", {
      index: props.index,
      width: startSize.w,
      height: startSize.h,
      top: Math.round(startSize.t + disY + val.diffY),
      left: Math.round(startSize.l + disX + val.diffX)
    });
  },
  up() {
    markLineEmit("end");
    emits("update:move", false);
  }
});

const onDownSize = () => {
  getMoveSize();
};
const onChange = (options: MoveChangeOptions) => {
  emits("change", { index: props.index, ...options });
};

const keys = ["top", "left", "width", "height", "angle"] as Array<
  "top" | "left" | "width" | "height" | "angle"
>;
const handleStyle = () => {
  const value = objectTransform(props ?? {}, keys, (val) => (val ? parseInt(String(val)) : 0));
  if (!moveRef.value) return;
  moveRef.value.style.top = `${value.top}px`;
  moveRef.value.style.left = `${value.left}px`;
  moveRef.value.style.width = `${value.width}px`;
  moveRef.value.style.height = `${value.height}px`;
  moveRef.value.style.transform = `rotate(${value.angle || 0}deg)`;
};

onMounted(handleStyle);
watch(props, handleStyle, { deep: true });

const onChangeSize = (data: MoveDataType) => {
  const { vertical, level } = data;
  emits("direction", { vertical, level });
  emits("update:direction", Object.assign(props.direction, { vertical, level }));
};
</script>

<style lang="scss" scoped>
.y-move {
  position: absolute;
  box-sizing: border-box;
  border: 1px dashed transparent;

  &:hover {
    border-color: var(--y-color-primary);
    cursor: move;
  }

  &.active {
    user-select: none;
    border-color: var(--y-color-primary);
  }

  & > :deep(*) {
    margin-top: -1px;
    margin-left: -1px;
    box-sizing: border-box;
  }
}
</style>

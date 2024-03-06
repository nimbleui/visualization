<template>
  <div @contextmenu="onContextmenu" ref="moveRef" class="y-move">
    <slot />
    <YBorder
      v-if="id === active"
      :container="containerRef"
      @move="onChangeSize"
      @change="onChange"
      @down="onDownSize"
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
  const { offsetHeight: h, offsetLeft: l, offsetWidth: w, offsetTop: t } = moveRef.value;
  Object.assign(startSize, { w, h, l, t });
};

const setMoveStyle = (data: { width?: number; height?: number; left?: number; top?: number }) => {
  if (!moveRef.value) return;
  const { w, h, l, t } = startSize;
  const { width = 0, height = 0, left = 0, top = 0 } = data;
  const value = {
    id: props.id,
    top: t + top,
    left: l + left,
    width: w + width,
    height: h + height
  };
  moveRef.value.style.top = `${value.top}px`;
  moveRef.value.style.left = `${value.left}px`;
  moveRef.value.style.width = `${value.width}px`;
  moveRef.value.style.height = `${value.height}px`;
  emits("change", value);
};

useMouseMove(moveRef, {
  stop: true,
  prevent: true,
  moveLimit: true,
  scale: scaleRef,
  boundary: containerRef,
  down() {
    getMoveSize();
    emits("select", props.id);
    emits("update:active", props.id);
  },
  move(data) {
    const { vertical, level, disX, disY } = data;
    emits("direction", { vertical, level });
    emits("update:direction", Object.assign(props.direction, { vertical, level }));
    setMoveStyle({ left: disX, top: disY });
  }
});

const onDownSize = () => {
  getMoveSize();
};
const onChange = (options: MoveChangeOptions) => {
  setMoveStyle(options);
};

const keys = ["top", "left", "width", "height"] as Array<"top" | "left" | "width" | "height">;
const handleStyle = () => {
  const value = objectTransform(props.style ?? {}, keys, (val) => String(val));
  if (!moveRef.value) return;
  moveRef.value.style.top = value.top;
  moveRef.value.style.left = value.left;
  moveRef.value.style.width = value.width;
  moveRef.value.style.height = value.height;
};

onMounted(handleStyle);
watch(() => props.style, handleStyle, { deep: true });

const onChangeSize = (data: MoveDataType) => {
  const { vertical, level } = data;
  emits("direction", { vertical, level });
  emits("update:direction", Object.assign(props.direction, { vertical, level }));
};

const onContextmenu = (event: MouseEvent) => {
  event.preventDefault();
  const { clientX, clientY } = event;
  emits("contextmenu", { id: props.id, x: clientX, y: clientY });
};
</script>

<style lang="scss" scoped>
.y-move {
  position: absolute;
  box-sizing: border-box;
  border: 1px dashed var(--y-color-primary);

  &:hover {
    border: 1px dashed var(--y-color-primary);
  }
}
</style>

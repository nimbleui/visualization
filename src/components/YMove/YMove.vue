<template>
  <div ref="moveRef" :style="styles" class="y-move">
    <slot />
    <YBorder
      v-if="id === active"
      :container="containerRef"
      @move="onChangeSize"
      @change="onChange"
      @up="updateStyle"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref, reactive, type CSSProperties } from "vue";
import type { MovePropsTypes, MoveChangeOptions, MoveEmitsTypes, MoveDirectionType } from "./types";
import { useMouseMove, type MoveDataType } from "@nimble-ui/vue";
import YBorder from "./YBorder.vue";

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

const selfStyle = reactive<CSSProperties>({});
const styleRef = computed(() => props.style ?? selfStyle);

const toNumber = (v: string | number) => parseInt("" + v);
const updateStyle = (options: MoveChangeOptions) => {
  const { top: st = 0, left: sl = 0, width: sw = 0, height: sh = 0 } = styleRef.value;
  const { top: t, left: l, width: w, height: h } = options;
  const top = toNumber(st) + t;
  const left = toNumber(sl) + l;
  const width = toNumber(sw) + w;
  const height = toNumber(sh) + h;
  styleRef.value.top = `${top}px`;
  styleRef.value.left = `${left}px`;
  styleRef.value.width = `${width}px`;
  styleRef.value.height = `${height}px`;
  emits("update:style", styleRef.value);
  emits("change", { top, left, width, height, id: props.id });
};

const { data } = useMouseMove(moveRef, {
  stop: true,
  prevent: true,
  moveLimit: true,
  scale: scaleRef,
  boundary: containerRef,
  down() {
    emits("select", props.id);
    emits("update:active", props.id);
  },
  move(data) {
    const { vertical, level } = data;
    emits("direction", { vertical, level });
    emits("update:direction", Object.assign(props.direction, { vertical, level }));
  },
  up(data) {
    const { disX, disY } = data;
    updateStyle({ width: 0, height: 0, left: disX, top: disY });
  }
});

// 改变宽高
const dis = reactive({
  top: 0,
  left: 0,
  width: 0,
  height: 0
});

const onChange = (options: MoveChangeOptions) => {
  Object.assign(dis, options);
};
const onChangeSize = (data: MoveDataType) => {
  const { vertical, level } = data;
  emits("direction", { vertical, level });
  emits("update:direction", Object.assign(props.direction, { vertical, level }));
};

const styles = computed<CSSProperties>(() => {
  const { top: t = 0, left: l = 0, width: w = 0, height: h = 0 } = styleRef.value ?? {};

  return {
    top: `${toNumber(t) + data.disY + dis.top}px`,
    left: `${toNumber(l) + data.disX + dis.left}px`,
    width: `${toNumber(w) + dis.width}px`,
    height: `${toNumber(h) + dis.height}px`
  };
});
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

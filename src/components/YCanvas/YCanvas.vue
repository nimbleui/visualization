<template>
  <YFlex ref="warpRef" align="center" flex="1" vertical class="y-canvas">
    <YScrollbar class="y-canvas__scroll">
      <div :style="styles" @drag="handleDrag" ref="canvasRef" class="y-canvas__content">
        <YMove
          v-for="(item, index) in dataComp"
          :index="index"
          :key="item.id"
          :id="item.id"
          :scale="scaleRef"
          :container="canvasRef"
          v-bind="getPropsValue(item)"
          v-model:active="current"
          :componentName="item.componentName"
          @change="onChange($event, item)"
        >
        </YMove>

        <YArea
          :el="canvasRef"
          :scale="scaleRef"
          :boundary="canvasRef"
          v-model:data="dataComp"
          @up="onUpArea"
        />
      </div>
    </YScrollbar>
    <div class="y-canvas__bottom"></div>
  </YFlex>
</template>

<script setup lang="ts">
import { computed, ref, type CSSProperties, type ComponentPublicInstance } from "vue";
import { useResizeObserver } from "@nimble-ui/vue";
import type { CanvasPropsTypes, CanvasEmitsTypes } from "./types";
import type { MoveChangeOptions } from "../YMove";
import { objectTransform, toInt } from "@/utils";
import type { YMoveItemType } from "../types";

defineOptions({ name: "YCanvas" });
const props = withDefaults(defineProps<CanvasPropsTypes>(), { width: 1920, height: 1080 });
const emits = defineEmits<CanvasEmitsTypes>();

const canvasRef = ref<HTMLElement>();
const warpRef = ref<ComponentPublicInstance>();
const contentRef = computed(() => warpRef.value?.$el);
const scaleRef = ref(1);
useResizeObserver(contentRef, () => {
  const warpRect = contentRef.value?.getBoundingClientRect();
  const { height: h, width: w } = objectTransform(props, ["width", "height"], toInt);
  const wScale = warpRect.width / w;
  const hScale = warpRect.height / h;
  scaleRef.value = Math.min(wScale, hScale);
});

const current = computed({
  get: () => props.active,
  set: (val) => emits("update:active", val!)
});

const dataComp = computed({
  get: () => props.data,
  set: (val) => emits("update:data", val)
});

const styles = computed<CSSProperties>(() => {
  return {
    width: `${parseInt("" + props.width)}px`,
    height: `${parseInt("" + props.height)}px`,
    transform: `scale(${scaleRef.value})`
  };
});
const handleDrag = (e: DragEvent) => {
  const data = e.dataTransfer?.getData("item");
  console.log(data);
};

const onChange = (data: MoveChangeOptions, item: any) => {
  const { width, height, left, top } = data;
  Object.assign(item, {
    top: `${top}px`,
    left: `${left}px`,
    width: `${width}px`,
    height: `${height}px`
  });
};

const getPropsValue = (item: YMoveItemType) => {
  const value = objectTransform(item, ["angle", "height", "left", "top", "width", "zIndex"], toInt);
  return value;
};

const onUpArea = () => {
  console.log(11);
};
</script>

<style lang="scss" scoped>
.y-canvas {
  height: 100%;
  overflow: hidden;

  &__scroll {
    flex: 1;
  }

  &__content {
    position: relative;
    transform-origin: left top;
  }
}
</style>

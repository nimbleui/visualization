<template>
  <YFlex ref="warpRef" align="center" flex="1" vertical class="y-canvas">
    <YScrollbar class="y-canvas__scroll">
      <div :style="styles" @drag="handleDrag" ref="canvasRef" class="y-canvas__content">
        <YMove
          v-for="(item, index) in configList"
          :index="index"
          :key="item.id"
          :style="item.style"
          :container="canvasRef"
          :id="item.id"
          :scale="scaleRef"
          v-model:active="current"
          @change="onChange($event, item)"
        >
          <div class="move-item">1111</div>
        </YMove>

        <YArea :el="canvasRef" :boundary="canvasRef" :scale="scaleRef" />
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

defineOptions({ name: "YCanvas" });
const props = withDefaults(defineProps<CanvasPropsTypes>(), { width: 1920, height: 1080 });
const emits = defineEmits<CanvasEmitsTypes>();

const canvasRef = ref<HTMLElement>();
const warpRef = ref<ComponentPublicInstance>();
const contentRef = computed(() => warpRef.value?.$el);
const scaleRef = ref(1);
useResizeObserver(contentRef, () => {
  const warpRect = contentRef.value?.getBoundingClientRect();
  const canvasRect = canvasRef.value?.getBoundingClientRect();

  const w = canvasRect?.width || 0;
  const h = canvasRect?.height || 0;
  const wScale = warpRect.width / w;
  const hScale = warpRect.height / h;
  scaleRef.value = Math.min(wScale, hScale);
});

const current = computed({
  get: () => props.active,
  set: (val) => emits("update:active", val!)
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
  Object.assign(item.style, {
    top: `${top}px`,
    left: `${left}px`,
    width: `${width}px`,
    height: `${height}px`
  });
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

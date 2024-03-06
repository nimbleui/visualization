<template>
  <YFlex vertical class="chart">
    <YFlex class="header">
      <YFlex flex="1" align="center" :gap="10">
        <div class="header__home">
          <YIcon name="home" size="18px" />
        </div>
        <YButton plain :size="'small'">
          <YIcon name="component" />
        </YButton>
        <YButton plain :size="'small'">
          <YIcon :name="'layer'" />
        </YButton>
        <YButton plain :size="'small'">
          <YIcon :name="'style'" />
        </YButton>
      </YFlex>
      <YFlex flex="1">
        <YInput />
      </YFlex>
      <YFlex flex="1">1</YFlex>
    </YFlex>

    <YFlex flex="1" class="content">
      <YFlex vertical class="content__menu">
        <YFlex :justify="'space-between'" :align="'center'" class="content__menu--top">
          <span class="component"> 组件 <YIcon :name="'component'" /> </span>
          <YFlex flex="2" :align="'center'">
            <YInput placeholder="搜索组件" class="input" />
            <YButtonGroup :size="'small'">
              <YButton>
                <YIcon name="single" />
              </YButton>
              <YButton>
                <YIcon name="biserial" />
              </YButton>
            </YButtonGroup>
          </YFlex>
        </YFlex>

        <YFlex flex="1" class="content__menu--type"> </YFlex>
      </YFlex>
      <YFlex flex="1" class="content__warp">
        <YScrollbar>
          <div ref="canvasRef" class="content__warp--canvas">
            <YMove
              v-for="item in configList"
              :key="item.id"
              :style="item.style"
              :container="canvasRef"
              :id="item.id"
              @change="onChange($event, item)"
              v-model:active="active"
              v-model:direction="direction"
              @contextmenu="onContextmenu"
            >
              1111
            </YMove>
          </div>

          <YGuidelines :config-list="configList" :current="active" :direction="direction" />
        </YScrollbar>
      </YFlex>
    </YFlex>

    <YContextmenu v-show="showContextmenu" v-bind="contextmenuData" />
  </YFlex>
</template>

<script setup lang="ts">
import YGuidelines, { type ConfigItem } from "@/components/YGuidelines";
import YContextmenu from "@/components/YContextmenu";
import type { MoveChangeOptions, MoveDirectionType } from "@/components/YMove";
import { reactive, ref } from "vue";

defineOptions({
  name: "chartIndexPage"
});
const canvasRef = ref<HTMLDivElement>();

const configList = reactive<ConfigItem[]>([
  {
    id: 1,
    style: {
      width: "150px",
      height: "60px",
      top: "100px",
      left: "100px"
    }
  },
  {
    id: 2,
    style: {
      width: "150px",
      height: "60px"
    }
  }
]);

const active = ref<string | number>();
const direction = reactive({} as MoveDirectionType);

const onChange = (data: MoveChangeOptions, item: ConfigItem) => {
  const { width, height, left, top } = data;
  Object.assign(item.style, {
    top: `${top}px`,
    left: `${left}px`,
    width: `${width}px`,
    height: `${height}px`
  });
};

// 处理右击菜单
const showContextmenu = ref(false);
const contextmenuData = reactive({ id: -1, x: 0, y: 0 });
const onContextmenu = (value: { id: number | string; x: number; y: number }) => {
  Object.assign(contextmenuData, value);
  showContextmenu.value = true;
};
</script>

<style lang="scss">
.chart {
  height: 100vh;
  background-color: var(--y-color-bg-layout);
}
.header {
  padding: 0.6rem 1rem;
  border-bottom: 1px solid var(--y-color-border-secondary);
  background-color: var(--y-color-bg-container);

  &__home {
    margin-right: 1rem;
  }
}
.content {
  &__menu {
    width: 300px;
    height: 100%;
    background-color: var(--y-color-bg-container);

    &--top {
      padding: 0.5rem 1rem;
      background-color: var(--y-color-bg-elevated);
      border-bottom: 1px solid var(--y-color-border-secondary);
      .component {
        flex: 1;
      }
      .input {
        flex: 1;
        height: 28px;
        margin-right: 10px;
      }
    }

    &--type {
      width: 70px;
      margin-top: 1px;
      background-color: var(--y-color-bg-elevated);
    }
  }

  &__warp {
    &--canvas {
      position: relative;
      height: 900px;
    }
  }
}
</style>

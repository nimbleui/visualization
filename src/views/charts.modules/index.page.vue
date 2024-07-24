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
      <YCanvas width="1620" height="900" v-model:active="active" v-model:data="configList" />
    </YFlex>

    <YContextmenu v-show="showContextmenu" v-bind="contextmenuData" />
  </YFlex>
</template>

<script setup lang="ts">
import { type YMoveItemType } from "@/components/types";
import YCanvas from "@/components/YCanvas";
import YContextmenu from "@/components/YContextmenu";
import { reactive, ref } from "vue";

defineOptions({
  name: "chartIndexPage"
});

const configList = reactive<YMoveItemType[]>([
  {
    id: 1,
    componentName: "YText",
    width: "150px",
    height: "60px",
    top: "100px",
    left: "100px"
  },
  {
    id: 2,
    componentName: "YText",
    width: "150px",
    height: "60px"
  },
  {
    id: 3,
    componentName: "YText",
    width: "150px",
    height: "60px",
    top: "200px",
    left: "200px"
  }
]);

const active = ref<string | number>();
// 处理右击菜单
const showContextmenu = ref(false);
const contextmenuData = reactive({ id: -1, x: 0, y: 0 });
</script>

<style lang="scss">
.chart {
  height: 100vh;
  background-color: var(--y-color-bg-layout);
  overflow: hidden;
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
  overflow: hidden;
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
  .move-item {
    width: 100px;
    height: 100px;
  }
}
</style>

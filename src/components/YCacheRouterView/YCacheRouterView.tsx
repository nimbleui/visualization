import { KeepAlive, computed, defineComponent, reactive, watch } from "vue";
import { useRouter, RouterView, type RouteLocationNormalizedLoaded } from "vue-router";

interface CacheListType {
  fullPath: string;
  position: number;
  back: string;
}

export default defineComponent({
  name: "YCacheRouterView",
  setup() {
    const cacheList = reactive<CacheListType[]>([]);
    const include = computed(() => cacheList.map((el) => el.fullPath));
    const router = useRouter();

    watch(
      router.currentRoute,
      (val) => {
        const fullPath = val.fullPath;
        const { position, back, replaced } = history.state;

        const len = cacheList.length;
        const currentLen = Math.max(len - 1, 0);
        const currentItem = { fullPath, position, back };
        const item = cacheList[currentLen];

        // 如果是重定向覆盖最后一个
        if (replaced && position == item?.position) {
          cacheList[currentLen] = currentItem;
          return;
        }

        if (item?.back === val.fullPath) {
          cacheList.pop();
          wrapperMap.delete(item.fullPath);
        } else {
          cacheList.push(currentItem);
        }
      },
      { deep: true }
    );

    const wrapperMap = new Map();
    const createWarp = (name: string, Component: any) => {
      let wrap = wrapperMap.get(name);

      if (!wrap) {
        wrap = {
          name,
          render: () => Component
        };
        wrapperMap.set(name, wrap);
      }

      return wrap;
    };

    return () => {
      return (
        <RouterView>
          {({ Component, route }: { Component: any; route: RouteLocationNormalizedLoaded }) => {
            const fullPath = route.fullPath;
            const Warp = createWarp(fullPath, Component);
            return (
              <KeepAlive include={include.value}>
                <Warp key={fullPath} />
              </KeepAlive>
            );
          }}
        </RouterView>
      );
    };
  }
});

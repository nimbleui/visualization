import YCacheRouterView from "./YCacheRouterView";

export default YCacheRouterView;

declare module "vue" {
  export interface GlobalComponents {
    YCacheRouterView: typeof YCacheRouterView;
  }
}

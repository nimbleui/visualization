import YGroup from "./YGroup.vue";
export * from "./types";

export default YGroup;

declare module "vue" {
  export interface GlobalComponents {
    YGroup: typeof YGroup;
  }
}

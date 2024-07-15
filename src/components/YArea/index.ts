import YArea from "./YArea.vue";
export * from "./types";

export default YArea;

declare module "vue" {
  export interface GlobalComponents {
    YArea: typeof YArea;
  }
}

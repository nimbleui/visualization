import YCanvas from "./YCanvas.vue";
export * from "./types";

export default YCanvas;

declare module "vue" {
  export interface GlobalComponents {
    YCanvas: typeof YCanvas;
  }
}

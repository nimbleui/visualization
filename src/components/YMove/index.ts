import YMove from "./YMove.vue";
export * from "./types";

export default YMove;

declare module "vue" {
  export interface GlobalComponents {
    YMove: typeof YMove;
  }
}

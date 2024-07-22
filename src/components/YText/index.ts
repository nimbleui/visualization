import YText from "./YText.vue";
export * from "./types";

export default YText;

declare module "vue" {
  export interface GlobalComponents {
    YText: typeof YText;
  }
}

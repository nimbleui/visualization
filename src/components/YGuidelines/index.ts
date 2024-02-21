import YGuidelines from "./YGuidelines.vue";
export * from "./types";

export default YGuidelines;

declare module "vue" {
  export interface GlobalComponents {
    YGuidelines: typeof YGuidelines;
  }
}

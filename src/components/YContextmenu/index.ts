import YContextmenu from "./YContextmenu.vue";
export * from "./types";

export default YContextmenu;

declare module "vue" {
  export interface GlobalComponents {
    YContextmenu: typeof YContextmenu;
  }
}

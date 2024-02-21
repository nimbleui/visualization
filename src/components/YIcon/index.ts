import YIcon from "./YIcon.vue";

export default YIcon;

declare module "vue" {
  export interface GlobalComponents {
    YIcon: typeof YIcon;
  }
}

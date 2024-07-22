import type { YMoveItemType } from "../types";

export interface AreaPropsTypes {
  el?: HTMLElement;
  boundary?: HTMLElement;
  scale?: number;
  data: YMoveItemType[];
}

export interface AreaEmitsTypes {
  (e: "change"): void;
  (e: "update:active", value: number | string): void;
}

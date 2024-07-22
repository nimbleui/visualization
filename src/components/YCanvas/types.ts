import type { YMoveItemType } from "../types";

export interface CanvasPropsTypes {
  move?: boolean;
  height?: number | string;
  width?: number | string;
  configList: YMoveItemType[];
  active?: number | string;
}

export interface CanvasEmitsTypes {
  (e: "change"): void;
  (e: "update:active", value: number | string): void;
}

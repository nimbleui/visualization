import type { YMoveItemType } from "../types";

export interface CanvasPropsTypes {
  move?: boolean;
  height?: number | string;
  width?: number | string;
  data: YMoveItemType[];
  active?: number | string;
}

export interface CanvasEmitsTypes {
  (e: "change"): void;
  (e: "update:active", value: number | string): void;
  (e: "update:data", data: YMoveItemType[]): void;
}

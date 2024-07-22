import type { YMoveItemType } from "../types";

export interface GroupPropsTypes {
  elements: YMoveItemType[];
}

export interface GroupEmitsTypes {
  (e: "change"): void;
  (e: "update:active", value: number | string): void;
}

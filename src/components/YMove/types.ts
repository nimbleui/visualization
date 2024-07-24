import type { YMoveItemType } from "../types";

export interface MovePropsTypes extends YMoveItemType {
  index: number;
  scale?: number;
  container?: HTMLElement;
  active?: number | string | null;
  direction?: MoveDirectionType;
  move?: boolean;
}
export type MoveChangeOptions = { width: number; height: number; left: number; top: number };
export type MoveDirectionVertical = "top" | "bottom" | "none";
export type MoveDirectionLevel = "left" | "right" | "none";
export type MoveDirectionType = { vertical: MoveDirectionVertical; level: MoveDirectionLevel };

export interface MoveEmitsTypes {
  (e: "change", data: MoveChangeOptions & { index: number }): void;
  (e: "update:active", value: number | string): void;
  (e: "select", value: number | string): void;
  (e: "direction", value: MoveDirectionType): void;
  (e: "update:direction", value: MoveDirectionType): void;
  (e: "update:move", value: boolean): void;
  (e: "contextmenu", value: { id: number; x: number; y: number }): void;
}

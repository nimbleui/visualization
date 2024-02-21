import type { CSSProperties } from "vue";

export interface MovePropsTypes {
  id: number | string;
  scale?: number;
  style?: CSSProperties;
  container?: HTMLElement;
  active?: number | string;
  direction?: MoveDirectionType;
}
export type MoveChangeOptions = { width: number; height: number; left: number; top: number };
export type MoveDirectionVertical = "top" | "bottom" | "none";
export type MoveDirectionLevel = "left" | "right" | "none";
export type MoveDirectionType = { vertical: MoveDirectionVertical; level: MoveDirectionLevel };

export interface MoveEmitsTypes {
  (e: "change", data: MoveChangeOptions & { id: number | string }): void;
  (e: "update:style", value: CSSProperties): void;
  (e: "update:active", value: string | number): void;
  (e: "select", value: string | number): void;
  (e: "direction", value: MoveDirectionType): void;
  (e: "update:direction", value: MoveDirectionType): void;
}

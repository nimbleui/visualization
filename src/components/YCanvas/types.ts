export interface CanvasPropsTypes {
  move?: boolean;
  height?: number | string;
  width?: number | string;
  configList: any[];
  active?: number | string;
}

export interface CanvasEmitsTypes {
  (e: "change"): void;
  (e: "update:active", value: number | string): void;
}

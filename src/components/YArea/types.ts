export interface AreaPropsTypes {
  el?: HTMLElement;
  boundary?: HTMLElement;
  scale?: number;
}

export interface AreaEmitsTypes {
  (e: "change"): void;
  (e: "update:active", value: number | string): void;
}

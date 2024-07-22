export interface GroupPropsTypes {
  elements: any[];
}

export interface GroupEmitsTypes {
  (e: "change"): void;
  (e: "update:active", value: number | string): void;
}

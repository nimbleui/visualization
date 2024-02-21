import type { CSSProperties } from "vue";
import type { MoveDirectionType } from "../YMove";

export interface ConfigItem {
  id: string | number;
  style: CSSProperties;
  [key: string]: any;
}

export interface GuidelinesPropsTypes {
  current?: string | number;
  configList: ConfigItem[];
  direction: MoveDirectionType;
}

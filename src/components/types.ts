export interface CommonRectType {
  width?: string | number; // 宽度
  height?: string | number; // 高度
  left?: string | number; // 左边的距离
  top?: string | number; // 顶部的距离
  zIndex?: string | number; // 层级
  angle?: string | number; // 旋转角度
}

export interface YMoveItemType extends CommonRectType {
  id: string | number; // 唯一标识
  componentName: string; // 组件名称
  props?: any; // 组件的参数
  selected?: boolean; // 是否被选中，用于组
}

export interface GroupItemType extends YMoveItemType {
  groupStyle?: YMoveItemType;
}

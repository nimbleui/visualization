import { objectTransform } from "@/utils";
import { computed, type Ref } from "vue";

interface OptionsGuidelines {
  scaleRatio?: number;
  selector: string;
  threshold?: number;
  color?: string;
}

interface ItemType {
  value: number;
  showValue: number;
}
type LineType = ItemType[];
type MarkLineType = {
  top: number | null;
  left: number | null;
  diffX: number;
  diffY: number;
};
const defaultMarkLine = {
  top: null,
  left: null,
  diffX: 0,
  diffY: 0
};

export function getBoundingClientRectByScale(el: Element | HTMLElement, scale = 1) {
  const rect = el.getBoundingClientRect();
  const values = objectTransform(
    rect,
    ["top", "left", "right", "bottom", "width", "height"],
    (val) => val / scale
  );

  return {
    ...rect,
    ...values
  } as DOMRect;
}

export default function useGuidelines(
  targetRef: Ref<HTMLElement | undefined>,
  options: Ref<OptionsGuidelines>
) {
  // 获取父级
  const parent = computed(() => targetRef.value!.offsetParent || document.body);
  const parentRect = computed(() =>
    getBoundingClientRectByScale(parent.value, options.value.scaleRatio)
  );
  const markLine: MarkLineType = Object.assign({}, defaultMarkLine);
  const lines: { x: LineType; y: LineType } = { y: [], x: [] };

  const handleLineShowOrHide = () => {
    const { top, left } = markLine;
    let elY = parent.value.querySelector(".move-mark-line-y") as HTMLElement | null;
    if (!elY) {
      elY = document.createElement("div");
      elY.classList.add("move-mark-line-y");
      elY.setAttribute(
        "style",
        `position: absolute; background-color: var(--y-color-primary); display: none;width: 100%; height: 1px;`
      );
      parent.value.appendChild(elY);
    }
    if (top === null) {
      elY.style.display = "none";
    } else {
      elY.style.top = `${top}px`;
      elY.style.display = "block";
    }

    let elX = parent.value.querySelector(".move-mark-line-x") as HTMLElement | null;
    if (!elX) {
      elX = document.createElement("div");
      elX.classList.add("move-mark-line-x");
      elX.setAttribute(
        "style",
        `top: 0;position: absolute; background-color: var(--y-color-primary); display: none;width: 1px; height: 100%;`
      );
      parent.value.appendChild(elX);
    }
    if (left === null) {
      elX.style.display = "none";
    } else {
      elX.style.left = `${left}px`;
      elX.style.display = "block";
    }
  };

  // 鼠标按下
  let sourceRect: DOMRect;
  const handleStart = () => {
    const { selector, scaleRatio } = options.value;
    sourceRect = getBoundingClientRectByScale(targetRef.value!, scaleRatio);
    const els = document.querySelectorAll(selector);

    // 重置值
    lines.y.length = 0;
    lines.x.length = 0;
    Object.assign(markLine, defaultMarkLine);

    const { width, height } = sourceRect;
    for (let i = 0; i < els.length; i++) {
      if (targetRef.value == els[i]) continue;
      const rect = getBoundingClientRectByScale(els[i], scaleRatio);
      const { left: l, top: t, width: w, height: h, right: r, bottom: b } = rect;
      const halfW = w / 2;
      const halfH = h / 2;

      lines.y.push({ showValue: t, value: t }); // 顶对顶
      lines.y.push({ showValue: t, value: t - height / 2 }); // 顶对中
      lines.y.push({ showValue: t, value: t - height }); // 顶对底

      lines.y.push({ showValue: t + halfH, value: t + halfH }); // 中对顶
      lines.y.push({ showValue: t + halfH, value: t + halfH - height / 2 }); // 中对中
      lines.y.push({ showValue: t + halfH, value: t + halfH - height }); // 中对底

      lines.y.push({ showValue: b, value: b }); // 底对顶
      lines.y.push({ showValue: b, value: b - height / 2 }); //底对中
      lines.y.push({ showValue: b, value: b - height }); // 底对底

      lines.x.push({ showValue: l, value: l }); // 左对左
      lines.x.push({ showValue: l, value: l - width / 2 }); // 左对中
      lines.x.push({ showValue: l, value: l - width }); // 左对右

      lines.x.push({ showValue: l + halfW, value: l + halfW - width }); // 中对右
      lines.x.push({ showValue: l + halfW, value: l + halfW - width / 2 }); // 中对中
      lines.x.push({ showValue: l + halfW, value: l + halfW }); // 中对左

      lines.x.push({ showValue: r, value: r }); // 右对左
      lines.x.push({ showValue: r, value: r - width / 2 }); // 右对中
      lines.x.push({ showValue: r, value: r - width }); // 右对右
    }
  };

  // 鼠标移动
  const handleMode = (dis: { x: number; y: number }) => {
    const { threshold = 10 } = options.value;
    Object.assign(markLine, defaultMarkLine);

    const top = sourceRect.top + dis.y;
    for (let i = 0; i < lines.y.length; i++) {
      const { value, showValue } = lines.y[i];
      if (Math.abs(value - top) < threshold) {
        markLine.diffY = value - top;
        markLine.top = showValue - parentRect.value.top;
        break;
      }
    }

    const left = sourceRect.left + dis.x;
    for (let i = 0; i < lines.x.length; i++) {
      const { value, showValue } = lines.x[i];
      if (Math.abs(value - left) < threshold) {
        markLine.diffX = value - left;
        markLine.left = showValue - parentRect.value.left;
        break;
      }
    }
    handleLineShowOrHide();
    return { ...markLine };
  };

  const handleEnd = () => {
    Object.assign(markLine, defaultMarkLine);
    handleLineShowOrHide();
  };

  const markLineEmit = (type: "start" | "move" | "end", value?: { x: number; y: number }) => {
    switch (type) {
      case "start":
        handleStart();
        break;
      case "move":
        return handleMode(value!);
      case "end":
        handleEnd();
        break;
    }
  };

  return {
    markLineEmit,
    markLine
  };
}

let uid = 1;
export function useId(prefix = "yr") {
  return `${prefix}-${Date.now()}-${uid++}`;
}

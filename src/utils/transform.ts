export function objectTransform<T extends { [key: string]: any }, K extends keyof T>(
  obj: T,
  keys: Array<K>
): { [K in (typeof keys)[number]]: T[K] };
export function objectTransform<
  T extends { [key: string]: any },
  K extends keyof T,
  C extends (val: T[K], key: K) => any
>(obj: T, keys: Array<K>, callback: C): { [K in (typeof keys)[number]]: ReturnType<C> };

export function objectTransform<
  T extends { [key: string]: any },
  K extends keyof T,
  C extends (val: T[K], key: K) => any
>(obj: T, keys: Array<K>, callback?: C) {
  const result = {} as { [K in (typeof keys)[number]]: ReturnType<C> | T[K] };
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    result[key] = callback?.(obj[key], key) ?? obj[key];
  }
  return result;
}

// Restored from ref/webview/assets/app-shell-state-QDRlZ5bT.js
// App shell state — array and collection utilities.

export function wrapIndex(min: number, max: number, index: number): number {
  const range = max - min;
  return ((((index - min) % range) + range) % range) + min;
}
export function getAtIndex<T>(array: T[], index: number): T | undefined {
  return array[wrapIndex(0, array.length, index)];
}
export function clampIndex(index: number, length: number): number {
  return Math.min(Math.max(index, 0), length - 1);
}
export function isIndexInRange(
  index: number,
  start: number,
  end: number,
): boolean {
  return index >= start && index < end;
}
export function moveArrayItem<T>(
  array: T[],
  fromIndex: number,
  toIndex: number,
): T[] {
  const result = array.slice();
  result.splice(
    toIndex < 0 ? result.length + toIndex : toIndex,
    0,
    result.splice(fromIndex, 1)[0],
  );
  return result;
}
export function mapToArray<T, U>(keys: T[], map: Map<T, U>): (U | undefined)[] {
  return keys.reduce<(U | undefined)[]>((acc, key, index) => {
    const value = map.get(key);
    if (value !== undefined) acc[index] = value;
    return acc;
  }, Array(keys.length));
}
export function isNonNegative(value: number | null): boolean {
  return value !== null && value >= 0;
}
export function arraysEqual<T>(a: T[], b: T[]): boolean {
  if (a === b) return true;
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}
export function normalizeDraggableConfig(
  config:
    | boolean
    | {
        draggable?: boolean;
        droppable?: boolean;
      },
): {
  draggable: boolean;
  droppable: boolean;
} {
  if (typeof config === "boolean") {
    return {
      draggable: config,
      droppable: config,
    };
  }
  return {
    draggable: config.draggable ?? false,
    droppable: config.droppable ?? false,
  };
}

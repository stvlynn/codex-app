// Restored from ref/webview/assets/helpers-BDwSRLlu.js

export function isString(value: unknown): value is string {
  return typeof value === "string";
}

export function isNumber(value: unknown): value is number {
  return typeof value === "number";
}

export function isFunction(
  value: unknown,
): value is (...args: unknown[]) => unknown {
  return typeof value === "function";
}

export function isNonNull<T>(value: T): value is NonNullable<T> {
  return value != null;
}

export function isPlainObject(
  value: unknown,
): value is Record<string, unknown> {
  return (
    Object.prototype.toString.call(value).slice(8, -1).toLowerCase() ===
    "object"
  );
}

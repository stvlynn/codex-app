// Restored from ref/webview/assets/code-snippet-5cGi4tCG.js

function isSameValue(a: unknown, b: unknown): boolean {
  return a === b || (Number.isNaN(a) && Number.isNaN(b));
}
export function arraysEqual<T>(a: T[], b: T[]): boolean {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    if (!isSameValue(a[i], b[i])) return false;
  }
  return true;
}
export type Memoized<T> = (() => T) & {
  clear: () => void;
};
export function memoize<T>(
  fn: () => T,
  areEqual: (a: unknown[], b: unknown[]) => boolean = arraysEqual,
): Memoized<T> {
  let cache: {
    lastResult: T;
    lastArgs: unknown[];
    lastThis: unknown;
  } | null = null;
  function memoized(this: unknown, ...args: unknown[]): T {
    if (cache && cache.lastThis === this && areEqual(args, cache.lastArgs)) {
      return cache.lastResult;
    }
    const result = fn.apply(this, args);
    cache = {
      lastResult: result,
      lastArgs: args,
      lastThis: this,
    };
    return result;
  }
  memoized.clear = () => {
    cache = null;
  };
  return memoized as Memoized<T>;
}
export function isSvgLikeContent(content: string): boolean {
  return content.trim().startsWith("\u003csvg");
}

// Restored from ref/webview/assets/metric-helpers-BidZZeRm.js
// metric-helpers-BidZZeRm chunk restored from the Codex webview bundle.
export interface Deferred<T> {
  resolve: (value: T) => void;
  reject: (reason?: unknown) => void;
  promise: Promise<T>;
  isSettled: () => boolean;
}
export function createDeferred<T = void>(): Deferred<T> {
  let settled = false;
  let resolveRef: (value: T) => void;
  let rejectRef: (reason?: unknown) => void;
  const promise = new Promise<T>((resolve, reject) => {
    resolveRef = (value: T) => {
      settled = true;
      resolve(value);
    };
    rejectRef = (reason?: unknown) => {
      settled = true;
      reject(reason);
    };
  });
  return {
    resolve: resolveRef!,
    reject: rejectRef!,
    promise,
    isSettled: () => settled,
  };
}
export async function waitUntil<T>(
  predicate: (value: T | undefined) => boolean,
  action: () => Promise<T>,
): Promise<void> {
  const step = async (value: T | undefined): Promise<void> => {
    if (!predicate(value)) return;
    const next = await action();
    return step(next);
  };
  await step(undefined);
}

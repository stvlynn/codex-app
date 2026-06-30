// Restored from ref/webview/assets/use-stable-callback-BtVbB7Gq.js
import React, { useRef, useInsertionEffect, useCallback } from "react";
const REACT_INTERNALS =
  // @ts-expect-error React internals are not part of the public API
  React.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;
if (!REACT_INTERNALS) {
  throw new Error("Missing react shared internals. Check version.");
}
function isRenderingPhase(): boolean {
  const dispatcher = REACT_INTERNALS?.H;
  return dispatcher != null && dispatcher.useState !== dispatcher.useReducer;
}
function throwDuringRenderError(): never {
  throw new Error(
    "A function wrapped in useStableCallback can't be called during rendering.",
  );
}

/**
 * Returns a stable callback reference that always calls the latest
 * version of the provided function without triggering re-renders.
 *
 * Uses `useInsertionEffect` to keep the ref up-to-date, and throws
 * if invoked during the render phase (to prevent stale closures).
 */
export function useStableCallback<T extends (...args: any[]) => any>(fn: T): T {
  const ref = useRef<T>(fn);
  useInsertionEffect(() => {
    ref.current = fn;
  }, [fn]);
  return useCallback((...args: Parameters<T>): ReturnType<T> => {
    if (isRenderingPhase()) {
      throwDuringRenderError();
    }
    return ref.current(...args);
  }, []) as T;
}

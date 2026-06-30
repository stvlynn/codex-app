// Restored from ref/webview/assets/use-merged-ref-BRG4-SOQ.js
/**
 * @provenance
 *   Restored from: /Users/stvlynn/code/codex-reverse/ref/webview/assets/use-merged-ref-BRG4-SOQ.js
 *   Chunk: use-merged-ref-BRG4-SOQ
 *   Classification: single-util
 *   Domain: utils
 *   Semantic path: utils/use-merged-ref.ts
 */
import type { Ref, RefCallback } from "react";

export type MergedRef<T> = RefCallback<T>;

/**
 * Merges multiple React refs into a single ref callback.
 * Supports both callback refs and object refs (useRef/createRef).
 * Returns a cleanup function that clears all refs when the component unmounts.
 */
export function useMergedRef<T>(
  ...refs: Array<Ref<T> | undefined>
): MergedRef<T> {
  return (value: T | null) => {
    if (value == null) {
      refs.forEach((ref) => {
        if (typeof ref === "function") {
          ref(null);
        } else if (ref) {
          ref.current = null;
        }
      });
      return;
    }

    const cleanupFns: Array<() => void> = [];

    refs.forEach((ref) => {
      if (typeof ref === "function") {
        const cleanup = ref(value);
        if (typeof cleanup === "function") {
          cleanupFns.push(cleanup);
        } else {
          cleanupFns.push(() => ref(null));
        }
      } else if (ref) {
        ref.current = value;
        cleanupFns.push(() => {
          ref.current = null;
        });
      }
    });

    if (cleanupFns.length !== 0) {
      return () => {
        cleanupFns.forEach((fn) => fn());
      };
    }
  };
}

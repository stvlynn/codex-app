// Restored from ref/webview/assets/use-element-in-view-DpAyOq4x.js
// use-element-in-view-DpAyOq4x chunk restored from the Codex webview bundle.
import { useSyncExternalStore } from "react";
export interface UseElementInViewOptions {
  /** The scrollable container element to observe. */
  container: Element | null;
  /** The target element whose visibility within the container is tracked. */
  target: Element | null;
}
function getServerSnapshot() {
  return true;
}

/**
 * Returns whether `target` is vertically in view within `container`.
 * Uses `useSyncExternalStore` so the value is always consistent during SSR.
 */
export function useElementInView({
  container,
  target,
}: UseElementInViewOptions): boolean {
  const subscribe = (onStoreChange: () => void) => {
    if (!container || !target) return () => {};
    const handleChange = () => {
      onStoreChange();
    };
    container.addEventListener("scroll", handleChange, {
      passive: true,
    });
    const resizeObserver =
      typeof ResizeObserver === "undefined"
        ? null
        : new ResizeObserver(handleChange);
    if (resizeObserver) {
      resizeObserver.observe(container);
      resizeObserver.observe(target);
    }
    return () => {
      container.removeEventListener("scroll", handleChange);
      resizeObserver?.disconnect();
    };
  };
  const getSnapshot = () => {
    if (!container || !target) return true;
    const containerRect = container.getBoundingClientRect();
    const targetRect = target.getBoundingClientRect();
    return (
      targetRect.bottom > containerRect.top &&
      targetRect.top < containerRect.bottom
    );
  };
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

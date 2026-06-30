// Restored from ref/webview/assets/use-resize-observer-Dtew4DIP.js
// use-resize-observer-Dtew4DIP chunk restored from the Codex webview bundle.
import React from "react";
import { useStableCallback } from "./use-stable-callback";
import { getResizeObserverEntrySize } from "./get-resize-observer-entry-size";
const ResizeObserverContext = React.createContext<ResizeObserver | null>(null);
const resizeObserverCallbacksKey = Symbol("resizeObserverCallbacks");
const resizeObserverLastEntryKey = Symbol("resizeObserverLastEntry");
interface ElementWithCallbacks extends Element {
  [resizeObserverCallbacksKey]?: Set<ResizeObserverCallback>;
  [resizeObserverLastEntryKey]?: ResizeObserverEntry;
}
export function createResizeObserver(): ResizeObserver | null {
  if (typeof ResizeObserver === "undefined") {
    return null;
  }
  return new ResizeObserver((entries) => {
    for (const entry of entries) {
      const target = entry.target as ElementWithCallbacks;
      target[resizeObserverLastEntryKey] = entry;
      target[resizeObserverCallbacksKey]?.forEach((callback) =>
        callback(entry),
      );
    }
  });
}
function subscribeElement({
  callback,
  element,
  observer,
}: {
  callback: ResizeObserverCallback;
  element: ElementWithCallbacks;
  observer: ResizeObserver | null;
}): void {
  const callbacks = element[resizeObserverCallbacksKey];
  if (callbacks != null) {
    callbacks.add(callback);
    const lastEntry = element[resizeObserverLastEntryKey];
    if (lastEntry != null) {
      callback(lastEntry);
    }
    return;
  }
  element[resizeObserverCallbacksKey] = new Set([callback]);
  observer?.observe(element);
}
function unsubscribeElement({
  callback,
  element,
  observer,
}: {
  callback: ResizeObserverCallback;
  element: ElementWithCallbacks;
  observer: ResizeObserver | null;
}): void {
  const callbacks = element[resizeObserverCallbacksKey];
  if (callbacks == null) {
    return;
  }
  callbacks.delete(callback);
  if (callbacks.size === 0) {
    element[resizeObserverCallbacksKey] = undefined;
    element[resizeObserverLastEntryKey] = undefined;
    observer?.unobserve(element);
  }
}
export function useResizeObserver(callback: ResizeObserverCallback) {
  const observer = React.useContext(ResizeObserverContext);
  const elementRef = React.useRef<ElementWithCallbacks | null>(null);
  const handleEntry = React.useCallback(
    (entry: ResizeObserverEntry) => {
      const currentElement = elementRef.current;
      if (currentElement != null) {
        callback(entry, currentElement);
      }
    },
    [callback],
  );
  const stableCallback = useStableCallback(handleEntry);
  const setRef = React.useCallback(
    (element: ElementWithCallbacks | null) => {
      if (observer == null) {
        throw new Error(
          "useResizeObserver must be used within ResizeObserverProvider.",
        );
      }
      if (elementRef.current != null) {
        unsubscribeElement({
          callback: stableCallback,
          element: elementRef.current,
          observer,
        });
      }
      elementRef.current = element;
      if (element != null) {
        subscribeElement({
          callback: stableCallback,
          element,
          observer,
        });
      }
    },
    [observer, stableCallback],
  );
  return useStableCallback(setRef);
}
export function useElementSize(): [
  (element: ElementWithCallbacks | null) => void,
  {
    width: number | null;
    height: number | null;
  },
] {
  const [size, setSize] = React.useState<{
    width: number | null;
    height: number | null;
  }>({
    width: null,
    height: null,
  });
  const handleEntry = React.useCallback((entry: ResizeObserverEntry) => {
    const { width, height } = entry.contentRect;
    setSize({
      width,
      height,
    });
  }, []);
  const setRef = useResizeObserver(handleEntry);
  return [setRef, size];
}
export function useElementWidth(): [
  (element: ElementWithCallbacks | null) => void,
  number | null,
] {
  const [width, setWidth] = React.useState<number | null>(null);
  const handleEntry = React.useCallback((entry: ResizeObserverEntry) => {
    setWidth(getResizeObserverEntrySize(entry).width);
  }, []);
  const setRef = useResizeObserver(handleEntry);
  return [setRef, width];
}
export { ResizeObserverContext, useResizeObserver as useResizeObserverRef };

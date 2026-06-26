// Restored from ref/webview/assets/use-floating-window-pointer-interactivity-BkGtHiAv.js
import React, { useState, useEffectEvent, useEffect } from "react";
export interface UseFloatingWindowPointerInteractivityOptions {
  /** A nonce that triggers re-initialization when changed. */
  activationNonce?: unknown;
  /** CSS selectors for floating elements that should be considered interactive. */
  floatingElementSelectors?: string[];
  /** Whether the interactive region itself counts as interactive on hover. */
  includeInteractiveRegion?: boolean;
  /** Ref to the interactive region element. */
  interactiveRegionRef: React.RefObject<HTMLElement | null>;
  /** Optional callback to check if tracking is paused. */
  isPaused?: () => boolean;
  /** Callback fired when the pointer interactivity state changes. */
  onInteractiveChange: (isInteractive: boolean) => void;
  /** Whether to publish an initial "non-interactive" state. */
  publishInitialNonInteractive?: boolean;
  /** CSS selectors for elements within the interactive region. */
  regionElementSelectors?: string[];
}
interface Point {
  x: number;
  y: number;
}
function isPointInRect(point: Point, rect: DOMRect): boolean {
  return (
    point.x >= rect.left &&
    point.x <= rect.right &&
    point.y >= rect.top &&
    point.y <= rect.bottom
  );
}
function isElementVisible(element: Element): boolean {
  const style = window.getComputedStyle(element);
  if (
    style.display === "none" ||
    style.visibility === "hidden" ||
    style.pointerEvents === "none"
  ) {
    return false;
  }
  const rect = element.getBoundingClientRect();
  return rect.width > 0 && rect.height > 0;
}
function isPointOverElement(point: Point, element: Element): boolean {
  if (!isPointInRect(point, element.getBoundingClientRect())) {
    return false;
  }
  const elementsAtPoint = document.elementsFromPoint(point.x, point.y);
  return elementsAtPoint.some((el) => el === element || element.contains(el));
}
function checkInitialInteractivityState({
  floatingElementSelectors,
  includeInteractiveRegion,
  interactiveRegion,
  regionElementSelectors,
}: {
  floatingElementSelectors: string[];
  includeInteractiveRegion: boolean;
  interactiveRegion: Element | null;
  regionElementSelectors: string[];
}): boolean | null {
  if (interactiveRegion != null) {
    if (includeInteractiveRegion && interactiveRegion.matches(":hover")) {
      return true;
    }
    for (const selector of regionElementSelectors) {
      const elements = interactiveRegion.querySelectorAll(selector);
      for (const el of elements) {
        if (isElementVisible(el) && el.matches(":hover")) {
          return true;
        }
      }
    }
  }
  for (const selector of floatingElementSelectors) {
    const elements = document.querySelectorAll(selector);
    for (const el of elements) {
      if (isElementVisible(el) && el.matches(":hover")) {
        return true;
      }
    }
  }
  return document.documentElement.matches(":hover") ? false : null;
}

/**
 * Hook that tracks whether the pointer is over interactive floating elements.
 * Returns a boolean indicating whether any tracked element is currently under
 * the pointer. Used for floating window pointer interactivity detection.
 */
export function useFloatingWindowPointerInteractivity({
  activationNonce,
  floatingElementSelectors = [],
  includeInteractiveRegion = false,
  interactiveRegionRef,
  isPaused,
  onInteractiveChange,
  publishInitialNonInteractive = true,
  regionElementSelectors = [],
}: UseFloatingWindowPointerInteractivityOptions): boolean {
  const [isInteractive, setIsInteractive] = useState(false);
  const isPausedCallback = useEffectEvent(() => isPaused?.() ?? false);
  const handleInteractiveChange = useEffectEvent((interactive: boolean) => {
    setIsInteractive(!interactive);
    onInteractiveChange(interactive);
  });
  const handleOnInteractive = useEffectEvent(() => {
    onInteractiveChange(true);
  });
  useEffect(() => {
    let lastState: boolean | null = null;
    let lastMousePosition: Point | null = null;
    let rafId: number | null = null;
    const updateInteractivity = () => {
      rafId = null;
      if (lastMousePosition == null || isPausedCallback()) return;
      const isOver = checkPointerInteractivity(lastMousePosition);
      if (lastState !== isOver) {
        lastState = isOver;
        handleInteractiveChange(isOver);
      }
    };
    const scheduleUpdate = () => {
      rafId ??= requestAnimationFrame(updateInteractivity);
    };
    const checkPointerInteractivity = (point: Point): boolean => {
      const region = interactiveRegionRef.current;
      if (
        region == null ||
        (includeInteractiveRegion && isPointOverElement(point, region))
      ) {
        return true;
      }
      for (const selector of regionElementSelectors) {
        const elements = region.querySelectorAll(selector);
        for (const el of elements) {
          if (isElementVisible(el) && isPointOverElement(point, el)) {
            return true;
          }
        }
      }
      for (const selector of floatingElementSelectors) {
        const elements = document.querySelectorAll(selector);
        for (const el of elements) {
          if (isElementVisible(el) && isPointOverElement(point, el)) {
            return true;
          }
        }
      }
      return false;
    };
    const handleMouseMove = (event: MouseEvent) => {
      lastMousePosition = {
        x: event.clientX,
        y: event.clientY,
      };
      scheduleUpdate();
    };
    const handleResizeOrScroll = () => {
      if (lastMousePosition != null) {
        scheduleUpdate();
      }
    };
    const handleMouseLeave = () => {
      if (!isPausedCallback()) {
        handleInteractiveChange(false);
      }
    };
    const handleMutation = () => {
      if (lastMousePosition != null) {
        scheduleUpdate();
      }
    };
    const checkInitialState = () => {
      if (isPausedCallback()) return;
      const initialState = checkInitialInteractivityState({
        floatingElementSelectors,
        includeInteractiveRegion,
        interactiveRegion: interactiveRegionRef.current,
        regionElementSelectors,
      });
      if (initialState != null) {
        if (initialState || publishInitialNonInteractive) {
          handleInteractiveChange(initialState);
        }
      }
    };
    const mutationObserver = new MutationObserver(handleMutation);
    mutationObserver.observe(document.body, {
      attributeFilter: ["aria-hidden", "class", "hidden", "style"],
      attributes: true,
      childList: true,
      subtree: true,
    });
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("resize", handleResizeOrScroll);
    window.addEventListener("scroll", handleResizeOrScroll, true);
    window.addEventListener("mouseleave", handleMouseLeave);
    checkInitialState();
    const initialRafId = requestAnimationFrame(checkInitialState);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResizeOrScroll);
      window.removeEventListener("scroll", handleResizeOrScroll, true);
      window.removeEventListener("mouseleave", handleMouseLeave);
      mutationObserver.disconnect();
      cancelAnimationFrame(initialRafId);
      if (rafId != null) cancelAnimationFrame(rafId);
      lastState = null;
      handleOnInteractive();
    };
  }, [
    activationNonce,
    floatingElementSelectors,
    includeInteractiveRegion,
    interactiveRegionRef,
    publishInitialNonInteractive,
    regionElementSelectors,
  ]);
  return isInteractive;
}

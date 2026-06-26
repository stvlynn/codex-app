// Restored from ref/webview/assets/right-panel-composer-overlay-scroll-reserve-Bv3fhxvQ.js
// right-panel-composer-overlay-scroll-reserve-Bv3fhxvQ chunk restored from the Codex webview bundle.
import { G as atom } from "../boundaries/tanstack-query.ts";
import { F as routeScopeAtom } from "./persisted-signal.tsx";
export const RESERVE_CSS_VAR = `--right-panel-composer-overlay-reserve`;
export const HEIGHT_CSS_VAR = `--right-panel-composer-overlay-height`;
export const RESERVE_VALUE = `var(${RESERVE_CSS_VAR}, 1.5rem)`;
function computeReserveHeight(baseHeight = 102): number {
  return baseHeight + 16;
}
const DEFAULT_RESERVE_HEIGHT = 120;
const animationTimeouts = new WeakMap<object, number>();
const scrollReserveHeightAtom = atom(routeScopeAtom, 0);
const overlayVisibilityAtom = atom(
  routeScopeAtom,
  computeReserveHeightVisibilityState(true),
);
const overlayEnabledAtom = atom(routeScopeAtom, true);
export const overlayHeightAtom = atom(routeScopeAtom, 0);
function computeReserveHeightVisibilityState(visible: boolean): string {
  return visible ? "visible" : "hidden";
}
interface ToggleOverlayOptions {
  prefersReducedMotion?: boolean;
}
export function toggleOverlay(
  store: {
    get: (typeof overlayEnabledAtom)["read"];
    set: (typeof overlayEnabledAtom)["write"];
  },
  { prefersReducedMotion = false }: ToggleOverlayOptions = {},
): void {
  const nextEnabled = !store.get(overlayEnabledAtom);
  store.set(overlayEnabledAtom, nextEnabled);
  store.set(
    overlayVisibilityAtom,
    prefersReducedMotion
      ? computeReserveHeightVisibilityState(nextEnabled)
      : nextEnabled
        ? "entering"
        : "exiting",
  );
  animateScrollReserve(store, nextEnabled ? computeReserveHeight() : 0, {
    direction: nextEnabled ? "enter" : "exit",
    shouldAnimate: !prefersReducedMotion,
  });
}
export function onTransitionComplete(
  store: {
    get: (typeof overlayVisibilityAtom)["read"];
    set: (typeof overlayVisibilityAtom)["write"];
  },
  state: string,
): void {
  if (store.get(overlayVisibilityAtom) !== state) return;
  if (state === "entering") {
    store.set(overlayVisibilityAtom, "visible");
    return;
  }
  store.set(overlayVisibilityAtom, "hidden");
}
interface AnimationOptions {
  direction?: "enter" | "exit";
  shouldAnimate?: boolean;
}
function animateScrollReserve(
  store: {
    get: (typeof scrollReserveHeightAtom)["read"];
    set: (typeof scrollReserveHeightAtom)["write"];
    node?: object;
  },
  targetHeight: number,
  { direction = "enter", shouldAnimate = false }: AnimationOptions = {},
): void {
  cancelAnimation(store);
  const currentHeight = store.get(scrollReserveHeightAtom);
  if (!shouldAnimate || currentHeight === targetHeight) {
    setScrollReserveHeight(store, targetHeight);
    return;
  }
  const startTime = performance.now();
  const tick = (now: number) => {
    const elapsed = Math.max(
      0,
      Math.min((now - startTime) / DEFAULT_RESERVE_HEIGHT, 1),
    );
    const eased =
      direction === "enter" ? elapsed * elapsed : 1 - (1 - elapsed) ** 2;
    const nextHeight = Math.round(
      currentHeight + (targetHeight - currentHeight) * eased,
    );
    setScrollReserveHeight(store, nextHeight);
    if (elapsed < 1) {
      const timeoutId = window.setTimeout(() => tick(performance.now()), 16);
      if (store.node) {
        animationTimeouts.set(store.node, timeoutId);
      }
      return;
    }
    if (store.node) {
      animationTimeouts.delete(store.node);
    }
  };
  const timeoutId = window.setTimeout(() => tick(performance.now()), 16);
  if (store.node) {
    animationTimeouts.set(store.node, timeoutId);
  }
}
function cancelAnimation(store: { node?: object }): void {
  const timeoutId = store.node ? animationTimeouts.get(store.node) : undefined;
  if (timeoutId != null) {
    window.clearTimeout(timeoutId);
    if (store.node) {
      animationTimeouts.delete(store.node);
    }
  }
}
function setScrollReserveHeight(
  store: {
    get: (typeof scrollReserveHeightAtom)["read"];
    set: (typeof scrollReserveHeightAtom)["write"];
  },
  height: number,
): void {
  if (store.get(scrollReserveHeightAtom) !== height) {
    store.set(scrollReserveHeightAtom, height);
  }
}
export {
  animateScrollReserve,
  cancelAnimation as cancelScrollReserveAnimation,
  overlayVisibilityAtom,
  RESERVE_CSS_VAR as scrollReserveVar,
  computeReserveHeight as getDefaultReserveHeight,
  scrollReserveHeightAtom,
  overlayEnabledAtom,
};

// Restored from ref/webview/assets/right-panel-composer-overlay-DMF22kzH.js

import {
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import clsx from "clsx";
import { useAtomValue, useStore } from "jotai";
import { rightPanelComposerOverlayVisible$ } from "../widgets/app-shell/app-shell-state/atoms.ts";
import { appShellRefN } from "../widgets/app-shell/app-shell-ref.tsx";
import { r as appShellTabControllerR } from "../widgets/app-shell/app-shell-tab-controller-cvk-uvg-ym.tsx";
import { persistedSignalF, persistedSignalU } from "../shared/utils/persisted-signal.tsx";
import {
  animateScrollReserve,
  cancelScrollReserveAnimation,
  getDefaultReserveHeight,
  onTransitionComplete,
  overlayEnabledAtom,
  overlayHeightAtom,
  overlayVisibilityAtom,
  scrollReserveHeightAtom,
  scrollReserveVar,
  HEIGHT_CSS_VAR,
} from "../shared/utils/right-panel-composer-overlay-scroll-reserve.ts";
import { contentWrapperClass } from "../widgets/threads/thread-layout.tsx";
export interface RightPanelComposerOverlayProps {
  children?: ReactNode;
  onPointerDownOutside?: () => void;
}
type OverlayVisibility = "hidden" | "entering" | "visible" | "exiting";
function resolveVisibility(
  enabled: boolean,
  transitionState: OverlayVisibility,
): OverlayVisibility {
  if (enabled) {
    return transitionState === "entering" ? "entering" : "visible";
  }
  return transitionState === "exiting" ? "exiting" : "hidden";
}
export function RightPanelComposerOverlay({
  children,
  onPointerDownOutside,
}: RightPanelComposerOverlayProps): JSX.Element | null {
  const routeScope = useStore(persistedSignalF as never);
  const appShellRef = useContext(appShellRefN) as HTMLDivElement | null;
  const activeTab = useAtomValue(
    (
      appShellTabControllerR as {
        activeTab$?: never;
      }
    ).activeTab$ as never,
  );
  const isOverlayVisible = useAtomValue(
    rightPanelComposerOverlayVisible$ as never,
  );
  const isOverlayEnabled = useAtomValue(overlayEnabledAtom as never);
  const transitionState = useAtomValue(overlayVisibilityAtom as never);
  const overlayHeight = useAtomValue(overlayHeightAtom as never);
  const contentRef = useRef<HTMLDivElement>(null);
  const pointerTargetRef = useRef<HTMLDivElement>(null);
  const currentReserveRef = useRef(0);
  const [measuredHeight, setMeasuredHeight] = useState(102);
  const hasOutsidePointerHandler = onPointerDownOutside != null;
  const isOverlayDisabled =
    !persistedSignalU(activeTab) || !isOverlayVisible || isOverlayEnabled;
  const visibility = resolveVisibility(isOverlayDisabled, transitionState);
  const reserveHeight = getDefaultReserveHeight(measuredHeight);
  const appliedReserve = isOverlayDisabled ? 0 : reserveHeight;
  const isRendered = visibility !== "hidden";
  const isVisible = visibility === "visible";
  const isTransitioning = visibility === "entering" || visibility === "exiting";
  const targetReserve = isTransitioning ? overlayHeight : appliedReserve;
  currentReserveRef.current = targetReserve;
  const notifyPointerDownOutside = useCallback(() => {
    onPointerDownOutside?.();
  }, [onPointerDownOutside]);
  const measureAndUpdateReserve = useCallback(() => {
    const content = contentRef.current;
    const nextHeight = Math.max(102, content?.offsetHeight ?? 0);
    setMeasuredHeight((previous) =>
      previous === nextHeight ? previous : nextHeight,
    );
    const rightEdgeOffset =
      appShellRef == null || content == null
        ? 0
        : Math.max(
            0,
            appShellRef.offsetWidth - content.offsetLeft - content.offsetWidth,
          );
    if (routeScope.get(overlayHeightAtom) !== rightEdgeOffset) {
      routeScope.set(overlayHeightAtom, rightEdgeOffset);
    }
  }, [appShellRef, routeScope]);
  useLayoutEffect(() => {
    return () => {
      cancelScrollReserveAnimation(routeScope);
      if (routeScope.get(scrollReserveHeightAtom) !== 0) {
        routeScope.set(scrollReserveHeightAtom, 0);
      }
      if (routeScope.get(overlayHeightAtom) !== 0) {
        routeScope.set(overlayHeightAtom, 0);
      }
    };
  }, [routeScope]);
  useLayoutEffect(() => {
    if (!isRendered) {
      if (routeScope.get(overlayHeightAtom) !== 0) {
        routeScope.set(overlayHeightAtom, 0);
      }
      return;
    }
    measureAndUpdateReserve();
    const content = contentRef.current;
    if (content == null || typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(measureAndUpdateReserve);
    observer.observe(content);
    if (appShellRef != null) observer.observe(appShellRef.current);
    return () => {
      observer.disconnect();
    };
  }, [appShellRef, measureAndUpdateReserve, routeScope, isRendered]);
  useLayoutEffect(() => {
    if (!isRendered || appShellRef == null) return;
    appShellRef.style.setProperty(HEIGHT_CSS_VAR, `${measuredHeight}px`);
    appShellRef.style.setProperty(
      scrollReserveVar,
      `${currentReserveRef.current}px`,
    );
    return () => {
      appShellRef?.style.removeProperty(HEIGHT_CSS_VAR);
      appShellRef?.style.removeProperty(scrollReserveVar);
    };
  }, [appShellRef, measuredHeight, isRendered]);
  useLayoutEffect(() => {
    if (visibility === "entering") {
      animateScrollReserve(routeScope, appliedReserve, {
        direction: "enter",
        shouldAnimate: true,
      });
    } else if (!isTransitioning) {
      animateScrollReserve(routeScope, appliedReserve);
    }
  }, [visibility, isTransitioning, routeScope, appliedReserve]);
  useLayoutEffect(() => {
    if (!isRendered || appShellRef == null) return;
    appShellRef.style.setProperty(scrollReserveVar, `${targetReserve}px`);
  }, [appShellRef, isRendered, targetReserve]);
  useEffect(() => {
    if (!hasOutsidePointerHandler || !isVisible) return;
    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target;
      if (
        target instanceof Node &&
        !pointerTargetRef.current?.contains(target)
      ) {
        notifyPointerDownOutside();
      }
    };
    document.addEventListener("pointerdown", handlePointerDown, true);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown, true);
    };
  }, [hasOutsidePointerHandler, isVisible, notifyPointerDownOutside]);
  if (!isRendered) return null;
  const overlay = (
    <div
      aria-hidden={!isVisible}
      data-testid="right-panel-composer-overlay"
      onAnimationEnd={(event) => {
        if (event.currentTarget === event.target && visibility === "entering") {
          onTransitionComplete(routeScope, "entering");
        }
      }}
      onTransitionEnd={(event) => {
        if (event.currentTarget === event.target && visibility === "exiting") {
          onTransitionComplete(routeScope, "exiting");
        }
      }}
      className={clsx(
        "pointer-events-none absolute inset-x-0 z-[42] transition-opacity duration-[120ms] motion-reduce:transition-none",
        visibility === "entering" &&
          "right-panel-composer-overlay-enter opacity-100",
        visibility === "visible" && "opacity-100 ease-in",
        visibility === "exiting" && "opacity-0 ease-out",
      )}
      style={{
        bottom: "var(--app-shell-bottom-panel-height, 0px)",
        transform: `translateY(calc(${reserveHeight}px - var(${scrollReserveVar}, 0px)))`,
      }}
    >
      <div
        ref={contentRef}
        data-right-panel-composer-overlay-content="true"
        className={clsx(contentWrapperClass, "pb-6")}
      >
        <div
          ref={pointerTargetRef}
          className={isVisible ? "pointer-events-auto" : "pointer-events-none"}
        >
          {children}
        </div>
      </div>
    </div>
  );
  return appShellRef == null ? overlay : createPortal(overlay, appShellRef);
}

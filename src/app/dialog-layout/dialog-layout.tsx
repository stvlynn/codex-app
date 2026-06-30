// Restored from ref/webview/assets/dialog-layout-BUsOXjxz.js
// High-level DialogLayout component that composes the Radix primitives.

import * as React from "react";
import clsx from "clsx";
import { windowZoomContextN as useWindowZoom } from "../../widgets/app-shell/window-zoom-context.tsx";
import { tooltipDismissN as dismissTooltips } from "../../shared/ui/ui/tooltip-dismiss.tsx";
import { XIcon } from "../../shared/icons/x-icon.tsx";
import { DialogClose, DialogContent, DialogOverlay, DialogPortal, DialogRoot, DialogTrigger } from "./radix-dialog.tsx";
import { dialogOverlayClassName, getDialogWidthClass, overlayClasses } from "../../shared/utils/constants-bkih-qwv-w.ts";
import type { DialogContentWrapperProps, DialogLayoutProps, DialogTriggerWrapperProps, PointerDownOutsideEvent } from "../../shared/icons/speaker/types.ts";
function stopPropagation(event: React.MouseEvent) {
  event.stopPropagation();
}
function DialogTriggerWrapper({
  asChild,
  triggerRef,
  ...props
}: DialogTriggerWrapperProps) {
  const effectiveAsChild = asChild ?? true;
  return <DialogTrigger ref={triggerRef} asChild={effectiveAsChild} {...props} />;
}
function DialogContentWrapper({
  children,
  contentClassName: contentClassNameProp,
  dialogCloseClassName,
  dialogCloseLabel,
  overlayClassName,
  portalContainer,
  showDialogClose = true,
  shouldIgnoreClickOutside = false,
  unstyledContent = false,
  viewportSized = false,
  size = "default",
  ...rest
}: DialogContentWrapperProps) {
  const {
    className: contentPropsClassName,
    onPointerDown,
    onPointerDownOutside,
    style: contentPropsStyle,
    ...contentRest
  } = rest;
  const zoom = useWindowZoom();
  const baseContentClassName = clsx("codex-dialog left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2 outline-none", overlayClasses.content, portalContainer == null ? "fixed" : "absolute");
  const widthClass = getDialogWidthClass(size);
  const contentRef = React.useRef<HTMLDivElement>(null);
  const innerRef = React.useRef<HTMLDivElement>(null);
  const hasExplicitHeight = contentPropsStyle?.height != null || /\bh-(?!auto\b)[^\s]+/.test(contentClassNameProp ?? "") || /\bh-(?!auto\b)[^\s]+/.test(contentPropsClassName ?? "");
  const shouldAnimateHeight = !unstyledContent && size !== "editor" && !hasExplicitHeight;
  React.useLayoutEffect(() => {
    if (!shouldAnimateHeight) return;
    const contentNode = contentRef.current;
    const innerNode = innerRef.current;
    if (contentNode == null || innerNode == null || typeof ResizeObserver === "undefined") return;
    let rafId: number | null = null;
    let heightReadyRafId: number | null = null;
    let lastHeight = -1;
    let heightReady = false;
    const setHeight = (height: number) => {
      if (!Number.isFinite(height)) return;
      if (Math.abs(height - lastHeight) < 0.5) return;
      lastHeight = height;
      contentNode.style.setProperty("--dialog-content-height", `${height}px`);
      contentNode.style.height = "var(--dialog-content-height)";
      if (!heightReady) {
        if (heightReadyRafId != null) {
          cancelAnimationFrame(heightReadyRafId);
        }
        heightReadyRafId = requestAnimationFrame(() => {
          heightReady = true;
          contentNode.dataset.dialogHeightReady = "true";
        });
      }
    };
    const measure = () => {
      setHeight(innerNode.offsetHeight || innerNode.scrollHeight);
    };
    const scheduleMeasure = () => {
      if (rafId == null) {
        rafId = requestAnimationFrame(() => {
          rafId = null;
          measure();
        });
      }
    };
    scheduleMeasure();
    const observer = new ResizeObserver(scheduleMeasure);
    observer.observe(innerNode);
    return () => {
      observer.disconnect();
      if (rafId != null) cancelAnimationFrame(rafId);
      if (heightReadyRafId != null) cancelAnimationFrame(heightReadyRafId);
      contentNode.style.removeProperty("--dialog-content-height");
      contentNode.style.height = "";
      delete contentNode.dataset.dialogHeightReady;
    };
  }, [shouldAnimateHeight]);
  const container = portalContainer ?? undefined;
  const overlayCls = clsx(dialogOverlayClassName, overlayClassName);
  const contentClassName = clsx(baseContentClassName, !unstyledContent && "bg-token-dropdown-background/90 text-token-foreground ring-token-border max-w-[92vw] overflow-hidden rounded-3xl ring-[0.5px] ring-token-border shadow-lg backdrop-blur-xl", !unstyledContent && widthClass, shouldAnimateHeight && "data-[dialog-height-ready=true]:transition-[height] data-[dialog-height-ready=true]:duration-200 data-[dialog-height-ready=true]:ease-out", contentClassNameProp, contentPropsClassName);
  const zoomValue = portalContainer == null && zoom !== 1 ? zoom : undefined;
  const viewportSizeStyles = viewportSized && portalContainer == null ? {
    height: `calc(100dvh / ${zoom})`,
    width: `calc(100vw / ${zoom})`
  } : null;
  const style = {
    zoom: zoomValue,
    ...viewportSizeStyles,
    ...contentPropsStyle
  };
  const handlePointerDownOutside = (event: PointerDownOutsideEvent) => {
    if (shouldIgnoreClickOutside) event.preventDefault();
    onPointerDownOutside?.(event);
  };
  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    event.stopPropagation();
    onPointerDown?.(event);
  };
  const wrappedChildren = shouldAnimateHeight ? <div ref={innerRef}>{children}</div> : children;
  const closeButton = showDialogClose ? <DialogClose className={clsx("no-drag absolute top-4 right-4 cursor-interaction rounded p-1 leading-none text-token-foreground/80 hover:bg-token-toolbar-hover-background focus:ring-1 focus:ring-token-focus-border focus:outline-none", dialogCloseClassName)} onClick={stopPropagation}>
      <XIcon aria-hidden className="icon-xs" />
      {dialogCloseLabel ? <span className="sr-only">{dialogCloseLabel}</span> : null}
    </DialogClose> : null;
  return <DialogPortal container={container}>
      <DialogOverlay className={overlayCls} />
      <DialogContent ref={contentRef} className={contentClassName} style={style} onPointerDownOutside={handlePointerDownOutside} onPointerDown={handlePointerDown} {...contentRest}>
        {wrappedChildren}
        {closeButton}
      </DialogContent>
    </DialogPortal>;
}
export function DialogLayout({
  children,
  triggerContent,
  triggerAsChild,
  triggerRef,
  contentClassName,
  contentProps,
  dialogCloseClassName,
  dialogCloseLabel,
  overlayClassName,
  portalContainer,
  showDialogClose,
  shouldIgnoreClickOutside,
  unstyledContent,
  viewportSized,
  size = "default",
  ...rootProps
}: DialogLayoutProps) {
  const effectiveTriggerAsChild = triggerAsChild ?? true;
  const effectiveShowClose = showDialogClose ?? true;
  const effectiveIgnoreClickOutside = shouldIgnoreClickOutside ?? false;
  const effectiveUnstyled = unstyledContent ?? false;
  const effectiveViewportSized = viewportSized ?? false;
  const handleOpenChange = (open: boolean) => {
    if (open) dismissTooltips();
    rootProps.onOpenChange?.(open);
  };
  const trigger = triggerContent ? <DialogTriggerWrapper asChild={effectiveTriggerAsChild} triggerRef={triggerRef}>
      {triggerContent}
    </DialogTriggerWrapper> : null;
  return <DialogRoot {...rootProps} onOpenChange={handleOpenChange}>
      {trigger}
      <DialogContentWrapper contentClassName={contentClassName} dialogCloseClassName={dialogCloseClassName} dialogCloseLabel={dialogCloseLabel} overlayClassName={overlayClassName} portalContainer={portalContainer} showDialogClose={effectiveShowClose} shouldIgnoreClickOutside={effectiveIgnoreClickOutside} unstyledContent={effectiveUnstyled} viewportSized={effectiveViewportSized} size={size} {...contentProps}>
        {children}
      </DialogContentWrapper>
    </DialogRoot>;
}
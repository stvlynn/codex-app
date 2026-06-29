// Restored from ref/webview/assets/browser-sidebar-webview-B-SVcDNr.js

import {
  useId,
  useLayoutEffect,
  useRef,
  useSyncExternalStore,
  type ReactNode,
  type Ref,
} from "react";
import { createPortal } from "react-dom";
import { t as browserSidebarManager } from "./browser-sidebar-manager";
export interface BrowserSidebarWebviewBounds {
  height: number;
  width: number;
  x: number;
  y: number;
}
export interface BrowserSidebarWebviewProps {
  adoptionLease?: string | null;
  adoptedWebContentsId?: number | string | null;
  bounds?: BrowserSidebarWebviewBounds | null;
  browserTabId: string;
  children?: ReactNode;
  conversationId: string;
  hostKind?: string;
  initialUrl?: string;
  isVisible: boolean;
  scale?: number;
  shouldBootstrapWhenHidden?: boolean;
  shouldPaint?: boolean;
  webviewRef?: Ref<unknown>;
  windowZoom?: number;
}
type SyncAction = "sync" | "bootstrap" | "skip";
function getSyncAction({
  hasManagedWebview,
  isPresented,
  shouldBootstrapWhenHidden,
}: {
  hasManagedWebview: boolean;
  isPresented: boolean;
  shouldBootstrapWhenHidden?: boolean;
}): SyncAction {
  if (isPresented) return "sync";
  if (shouldBootstrapWhenHidden)
    return hasManagedWebview ? "sync" : "bootstrap";
  return "skip";
}
function makeInstanceKey(conversationId: string, browserTabId: string): string {
  return `${conversationId}\0${browserTabId}`;
}
export function BrowserSidebarWebview({
  adoptionLease,
  adoptedWebContentsId,
  bounds,
  browserTabId,
  children,
  conversationId,
  hostKind = "right-panel",
  initialUrl,
  isVisible,
  scale,
  shouldBootstrapWhenHidden,
  shouldPaint,
  webviewRef,
  windowZoom,
}: BrowserSidebarWebviewProps): JSX.Element | null {
  const webviewElementRef = useRef<unknown | null>(null);
  const instanceId = useId();
  const isMountedRef = useRef(false);
  const isClaimedRef = useRef(false);
  const mountGenerationRef = useRef(
    browserSidebarManager.getMountGeneration(conversationId, browserTabId),
  );
  const instanceKeyRef = useRef(makeInstanceKey(conversationId, browserTabId));
  const cursorOverlayHost = useSyncExternalStore(
    (callback) => browserSidebarManager.subscribe(callback),
    () =>
      browserSidebarManager.getCursorOverlayHost(conversationId, browserTabId),
    () => null,
  );
  instanceKeyRef.current = makeInstanceKey(conversationId, browserTabId);
  useLayoutEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);
  const isPresented = isVisible && bounds != null;
  useLayoutEffect(() => {
    const currentKey = makeInstanceKey(conversationId, browserTabId);
    const action = getSyncAction({
      hasManagedWebview: webviewElementRef.current != null,
      isPresented,
      shouldBootstrapWhenHidden,
    });
    if (action === "skip") {
      isClaimedRef.current = false;
      mountGenerationRef.current = browserSidebarManager.getMountGeneration(
        conversationId,
        browserTabId,
      );
      return;
    }
    const claimedGeneration = browserSidebarManager.claimMountGeneration(
      conversationId,
      browserTabId,
      instanceId,
    );
    mountGenerationRef.current = claimedGeneration;
    isClaimedRef.current = true;
    return () => {
      isClaimedRef.current = false;
      queueMicrotask(() => {
        if (
          isMountedRef.current &&
          instanceKeyRef.current === currentKey &&
          isClaimedRef.current
        )
          return;
        const nextGeneration = browserSidebarManager.releaseMountGeneration(
          conversationId,
          browserTabId,
          instanceId,
          claimedGeneration,
        );
        if (mountGenerationRef.current === claimedGeneration) {
          mountGenerationRef.current = nextGeneration;
        }
      });
    };
  }, [
    browserTabId,
    conversationId,
    isPresented,
    instanceId,
    shouldBootstrapWhenHidden,
  ]);
  useLayoutEffect(() => {
    const currentKey = makeInstanceKey(conversationId, browserTabId);
    return () => {
      const webview = webviewElementRef.current;
      const generation = mountGenerationRef.current;
      queueMicrotask(() => {
        if (isMountedRef.current && instanceKeyRef.current === currentKey)
          return;
        if (
          !browserSidebarManager.hasOtherMountGenerationClaim(
            conversationId,
            browserTabId,
            instanceId,
            generation,
          ) &&
          webview != null
        ) {
          browserSidebarManager.detachElectronWebview(
            webview,
            webviewRef,
            hostKind,
            generation,
          );
          if (webviewElementRef.current === webview) {
            webviewElementRef.current = null;
          }
        }
      });
    };
  }, [browserTabId, conversationId, hostKind, instanceId, webviewRef]);
  useLayoutEffect(() => {
    if (
      (
        webviewElementRef.current as {
          disposed?: boolean;
        } | null
      )?.disposed
    ) {
      webviewElementRef.current = null;
    }
    const existingWebview = webviewElementRef.current;
    const action = getSyncAction({
      hasManagedWebview: existingWebview != null,
      isPresented,
      shouldBootstrapWhenHidden,
    });
    if (action === "skip") {
      if (existingWebview != null) {
        const generation = mountGenerationRef.current;
        if (
          !browserSidebarManager.hasOtherMountGenerationClaim(
            conversationId,
            browserTabId,
            instanceId,
            generation,
          )
        ) {
          browserSidebarManager.detachElectronWebview(
            existingWebview,
            webviewRef,
            hostKind,
            generation,
          );
        }
      }
      if (webviewElementRef.current === existingWebview) {
        webviewElementRef.current = null;
      }
      return;
    }
    const webview = browserSidebarManager.getWebview(
      conversationId,
      browserTabId,
      initialUrl,
      {
        adoptionLease,
        adoptedWebContentsId,
        hostKind,
      },
    );
    webviewElementRef.current = webview;
    browserSidebarManager.syncElectronWebview(
      webview,
      {
        bounds,
        isVisible: isPresented,
        mountGeneration: mountGenerationRef.current,
        scale,
        shouldBootstrap: action === "bootstrap",
        shouldPaint,
        windowZoom,
      },
      webviewRef,
      hostKind,
    );
  }, [
    browserTabId,
    conversationId,
    hostKind,
    initialUrl,
    adoptionLease,
    adoptedWebContentsId,
    bounds,
    isPresented,
    instanceId,
    scale,
    shouldPaint,
    shouldBootstrapWhenHidden,
    webviewRef,
    windowZoom,
  ]);
  if (cursorOverlayHost == null || children == null) return null;
  return createPortal(children, cursorOverlayHost as Element);
}

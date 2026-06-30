// Restored from ref/webview/assets/dialog-layout-BUsOXjxz.js
// Styling constants and debug helpers for dialog layout components.

import clsx from "clsx";
import type { DialogSize, DialogBodySize } from "../../shared/icons/speaker/types.ts";
export function getOpenState(open: boolean): "open" | "closed" {
  return open ? "open" : "closed";
}
export const contentClassNameToken = "_content_pk7td_1";
export const overlayClassNameToken = "_overlay_pk7td_26";
export const overlayClasses = {
  content: contentClassNameToken,
  "codex-dialog-enter": "_codex-dialog-enter_pk7td_1",
  overlay: overlayClassNameToken,
  "codex-dialog-overlay": "_codex-dialog-overlay_pk7td_1"
};
export const dialogOverlayClassName = clsx("extension:bg-token-editor-background/80 electron:bg-[#00000022] codex-dialog-overlay fixed inset-0 z-50", overlayClasses.overlay);
export function getDialogWidthClass(size: DialogSize): string {
  switch (size) {
    case "narrow":
      return "w-[380px]";
    case "feature":
      return "w-[400px]";
    case "compact":
      return "w-[420px]";
    case "wide":
      return "w-[600px]";
    case "xwide":
      return "w-[680px]";
    case "xxwide":
      return "w-[800px]";
    case "editor":
      return "w-[600px] h-[720px] max-w-full max-h-full";
    default:
      return "w-[520px]";
  }
}
export function getBodySizeClass(size?: DialogBodySize): string | undefined {
  if (size === "full") return "h-full min-h-0";
  if (size === "tall") return "min-h-[520px] max-h-[560px]";
  return undefined;
}
const DEBUG_FLAG_KEY = "codex.debug.dialogLayout";
export const debugOutlineClassName = "relative rounded-lg border border-token-charts-blue/40";
export const debugLabelClassName = "absolute -top-2 left-2 rounded bg-token-charts-blue/15 px-1.5 py-0.5 text-xs font-semibold uppercase tracking-wide text-token-charts-blue";
export function isDialogLayoutDebugEnabled(): boolean {
  if (typeof window === "undefined" || window.localStorage == null || typeof window.localStorage.getItem !== "function") {
    return false;
  }
  return window.localStorage.getItem(DEBUG_FLAG_KEY) === "1";
}
export function DebugLabel({
  name
}: {
  name: string;
}) {
  return <span className={debugLabelClassName}>{name}</span>;
}
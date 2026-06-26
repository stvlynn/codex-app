// Restored from ref/webview/assets/use-reduced-motion-Dx8ukPZm.js
// use-reduced-motion-Dx8ukPZm chunk restored from the Codex webview bundle.
import { useStore } from "jotai";
import { prefersReducedMotionAtom } from "../settings/reduced-motion-preference";
export function useReducedMotion(): boolean {
  return useStore(prefersReducedMotionAtom);
}

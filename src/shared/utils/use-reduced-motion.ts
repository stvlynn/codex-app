// Restored from ref/webview/assets/use-reduced-motion-Dx8ukPZm.js
// use-reduced-motion-Dx8ukPZm chunk restored from the Codex webview bundle.
import { useStore } from "jotai";
import { prefersReducedMotionAtom } from "../../widgets/settings/reduced-motion-preference.ts";
export function useReducedMotion(): boolean {
  return useStore(prefersReducedMotionAtom);
}

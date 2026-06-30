// Restored from ref/webview/assets/use-reduced-motion-DZ8C9oC7.js
import { useState, useEffectEvent } from "react";
import { n, r, t } from "../boundaries/framer-motion/reduced-motion";

/**
 * Hook that returns whether the user prefers reduced motion.
 * Reads from a shared global singleton to avoid creating multiple
 * media-query listeners across the app.
 */
export function useReducedMotion(): boolean {
  if (!n.current) {
    t();
  }
  const [prefersReducedMotion] = useState<boolean>(r.current);
  return prefersReducedMotion;
}

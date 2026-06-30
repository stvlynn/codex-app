// Restored from ref/webview/assets/reduced-motion-preference-BFM-v_UB.js
// Jotai atoms for reduced-motion preference (user setting + system preference).
//
import { atom } from "jotai";

// ------------------------------------------------------------------
// Types
// ------------------------------------------------------------------

export type ReducedMotionPreference = "off" | "on" | "system";

// ------------------------------------------------------------------
// System-level media-query helpers
// ------------------------------------------------------------------

/**
 * Returns `true` when the OS signals "prefers-reduced-motion: reduce".
 * Falls back to `false` in SSR or when `matchMedia` is unavailable.
 */
function getSystemPrefersReducedMotion(): boolean {
  if (
    typeof window === "undefined" ||
    typeof window.matchMedia !== "function"
  ) {
    return false;
  }
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Returns a live `MediaQueryList` for the reduced-motion preference,
 * or `null` in environments without `matchMedia`.
 */
export function getReducedMotionMediaQuery(): MediaQueryList | null {
  if (
    typeof window === "undefined" ||
    typeof window.matchMedia !== "function"
  ) {
    return null;
  }
  return window.matchMedia("(prefers-reduced-motion: reduce)");
}

// ------------------------------------------------------------------
// Atoms
// ------------------------------------------------------------------

/**
 * Primitive atom that holds the system reduced-motion preference.
 */
export const systemPrefersReducedMotionAtom = atom(
  getSystemPrefersReducedMotion(),
);

/**
 * Primitive atom that holds the user's reduced-motion setting.
 * Defaults to "system" so the OS preference is respected initially.
 */
export const reducedMotionUserSettingAtom =
  atom<ReducedMotionPreference>("system");

/**
 * Resolves the effective reduced-motion state from the user's preference
 * and the current system preference.
 */
function resolveReducedMotion(
  preference: ReducedMotionPreference,
  systemPrefersReducedMotion: boolean,
): boolean {
  switch (preference) {
    case "off":
      return false;
    case "on":
      return true;
    case "system":
    default:
      return systemPrefersReducedMotion;
  }
}

/**
 * Derived atom that returns the effective reduced-motion state.
 * Respects the user setting; falls back to the OS preference when set to "system".
 */
export const prefersReducedMotionAtom = atom<boolean>((get) => {
  const preference = get(reducedMotionUserSettingAtom);
  const systemPrefers = get(systemPrefersReducedMotionAtom);
  return resolveReducedMotion(preference, systemPrefers);
});

// Aliases used by consumer checkpoints
export declare const reducedMotionPreferenceI: any;
export declare const reducedMotionPreferenceN: any;
export declare const reducedMotionPreferenceR: any;
export declare const reducedMotionPreferenceT: any;

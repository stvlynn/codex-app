// Restored from ref/webview/assets/codex-avatar-BvRO-FvR.js
// codex-avatar-BvRO-FvR chunk restored from the Codex webview bundle.
import { useRef, useEffect, type ReactNode } from "react";
import clsx from "clsx";
import { useReducedMotion } from "../hooks/use-reduced-motion.tsx";
const SPRITESHEETS: Record<string, string> = {
  bsod: new URL("bsod-spritesheet-v4-BRrRVy1T.webp", import.meta.url).href,
  codex: new URL("codex-spritesheet-v4-Bl6P89d_.webp", import.meta.url).href,
  dewey: new URL("dewey-spritesheet-v4-gAYk_M9g.webp", import.meta.url).href,
  fireball: new URL("fireball-spritesheet-v4-BtU8R9Qp.webp", import.meta.url)
    .href,
  hoots: new URL("hoots-spritesheet-v4-BYSNdvho.webp", import.meta.url).href,
  "null-signal": new URL(
    "null-signal-spritesheet-v4-CCoTR-8t.webp",
    import.meta.url,
  ).href,
  rocky: new URL("rocky-spritesheet-v4-3RlTi26B.webp", import.meta.url).href,
  seedy: new URL("seedy-spritesheet-v4-CdlE_fn9.webp", import.meta.url).href,
  stacky: new URL("stacky-spritesheet-v4-CaUJd4fY.webp", import.meta.url).href,
};
interface SpriteFrame {
  rowIndex: number;
  columnIndex: number;
  frameDurationMs: number;
}
type AvatarState =
  | "idle"
  | "jumping"
  | "review"
  | "running"
  | "running-left"
  | "running-right"
  | "waving"
  | "waiting"
  | "failed";
const IDLE_FRAMES: SpriteFrame[] = [
  {
    rowIndex: 0,
    columnIndex: 0,
    frameDurationMs: 280,
  },
  {
    rowIndex: 0,
    columnIndex: 1,
    frameDurationMs: 110,
  },
  {
    rowIndex: 0,
    columnIndex: 2,
    frameDurationMs: 110,
  },
  {
    rowIndex: 0,
    columnIndex: 3,
    frameDurationMs: 140,
  },
  {
    rowIndex: 0,
    columnIndex: 4,
    frameDurationMs: 140,
  },
  {
    rowIndex: 0,
    columnIndex: 5,
    frameDurationMs: 320,
  },
];
const SLOWED_IDLE_FRAMES = IDLE_FRAMES.map((frame) => ({
  ...frame,
  frameDurationMs: frame.frameDurationMs * 6,
}));
function generateFrames(
  row: number,
  count: number,
  duration: number,
  lastDuration: number,
): SpriteFrame[] {
  return Array.from(
    {
      length: count,
    },
    (_, i) => ({
      columnIndex: i,
      frameDurationMs: i === count - 1 ? lastDuration : duration,
      rowIndex: row,
    }),
  );
}
const STATE_FRAMES: Record<AvatarState, SpriteFrame[]> = {
  failed: generateFrames(5, 8, 140, 240),
  idle: IDLE_FRAMES,
  jumping: generateFrames(4, 5, 140, 280),
  review: generateFrames(8, 6, 150, 280),
  running: generateFrames(7, 6, 120, 220),
  "running-left": generateFrames(2, 8, 120, 220),
  "running-right": generateFrames(1, 8, 120, 220),
  waving: generateFrames(3, 4, 140, 280),
  waiting: generateFrames(6, 6, 150, 260),
};
interface AnimationConfig {
  frames: SpriteFrame[];
  loopStartIndex: number | null;
}
function getAnimationConfig(
  state: AvatarState,
  reducedMotion: boolean,
): AnimationConfig {
  const frames = STATE_FRAMES[state];
  if (reducedMotion) {
    return {
      frames: [frames[0]],
      loopStartIndex: null,
    };
  }
  if (state === "idle") {
    return {
      frames: SLOWED_IDLE_FRAMES,
      loopStartIndex: 0,
    };
  }
  const repeated = [...frames, ...frames, ...frames];
  return {
    frames: [...repeated, ...SLOWED_IDLE_FRAMES],
    loopStartIndex: repeated.length,
  };
}
function frameToBackgroundPosition(frame: SpriteFrame): string {
  return `${(frame.columnIndex / 7) * 100}% ${(frame.rowIndex / 8) * 100}%`;
}
interface UseAvatarAnimationOptions {
  avatarRef: React.RefObject<HTMLDivElement | null>;
  isAnimationEnabled?: boolean;
  prefersReducedMotion: boolean;
  state?: AvatarState;
}
function useAvatarAnimation({
  avatarRef,
  isAnimationEnabled = true,
  prefersReducedMotion,
  state = "idle",
}: UseAvatarAnimationOptions): void {
  useEffect(() => {
    const element = avatarRef.current;
    if (element == null) return;
    const config = getAnimationConfig(
      state,
      prefersReducedMotion || !isAnimationEnabled,
    );
    const { frames } = config;
    let frameIndex = 0;
    let timeoutId: number | null = null;
    element.style.backgroundPosition = frameToBackgroundPosition(frames[0]);
    if (frames.length === 1) return;
    const tick = () => {
      timeoutId = window.setTimeout(() => {
        const nextIndex = frameIndex + 1;
        if (nextIndex >= frames.length) {
          if (config.loopStartIndex != null) {
            frameIndex = config.loopStartIndex;
            element.style.backgroundPosition = frameToBackgroundPosition(
              frames[frameIndex],
            );
            tick();
            return;
          }
          timeoutId = null;
          return;
        }
        frameIndex = nextIndex;
        element.style.backgroundPosition = frameToBackgroundPosition(
          frames[frameIndex],
        );
        tick();
      }, frames[frameIndex].frameDurationMs);
    };
    tick();
    return () => {
      if (timeoutId != null) {
        window.clearTimeout(timeoutId);
      }
    };
  }, [avatarRef, isAnimationEnabled, prefersReducedMotion, state]);
}
function normalizeAssetRef(assetRef: string | null | undefined): string {
  return isValidAssetRef(assetRef) ? assetRef : "codex";
}
function isValidAssetRef(assetRef: string | null | undefined): boolean {
  return assetRef != null && Object.hasOwn(SPRITESHEETS, assetRef);
}
export interface CodexAvatarProps {
  assetRef?: string | null;
  className?: string;
  spritesheetUrl?: string;
  state?: AvatarState;
}
export function CodexAvatar({
  assetRef,
  className,
  spritesheetUrl,
  state = "idle",
}: CodexAvatarProps): ReactNode {
  const avatarRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const normalizedRef = normalizeAssetRef(assetRef);
  useAvatarAnimation({
    avatarRef,
    prefersReducedMotion,
    state,
  });
  const backgroundImage = `url(${spritesheetUrl ?? SPRITESHEETS[normalizedRef]})`;
  return (
    <div
      ref={avatarRef}
      className={clsx("codex-avatar-root", className)}
      data-avatar-asset-ref={normalizedRef}
      data-avatar-state={state}
      style={{
        backgroundImage,
      }}
      aria-hidden="true"
      data-testid="codex-avatar"
    />
  );
}

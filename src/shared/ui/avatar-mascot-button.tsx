// Restored from ref/webview/assets/avatar-mascot-button-D4p_kbfc.js
// AvatarMascotButton component restored from the Codex webview bundle.
import React, { useRef, useState } from "react";
import clsx from "clsx";
import { motion } from "framer-motion";
import { useReducedMotion } from "../hooks/use-reduced-motion";
import { CodexAvatar } from "../utils/codex-avatar-bv-ro-fv-r";
const CORNER_POSITION_CLASSES: Record<string, string> = {
  "top-start": "top-0 left-0",
  "top-end": "top-0 right-0",
  "bottom-start": "bottom-0 left-0",
  "bottom-end": "right-7 bottom-0",
};
export interface NotificationBadge {
  ariaLabel: string;
  backgroundColor: string;
  content: React.ReactNode;
  foregroundColor: string;
  isGlassy: boolean;
  isIconOnly: boolean;
  onClick: () => void;
}
export interface ResizeHandle {
  ariaLabel: string;
  onLostPointerCapture?: (event: React.PointerEvent) => void;
  onPointerCancel?: (event: React.PointerEvent) => void;
  onPointerDown?: (event: React.PointerEvent) => void;
  onPointerEnter?: (event: React.PointerEvent) => void;
  onPointerLeave?: (event: React.PointerEvent) => void;
  onPointerMove?: (event: React.PointerEvent) => void;
  onPointerUp?: (event: React.PointerEvent) => void;
}
export interface AvatarMascotButtonIconProps {
  ariaLabel?: string;
  assetRef?: string;
  className?: string;
  notificationBadge?: NotificationBadge;
  onContextMenu?: (event: React.MouseEvent) => void;
  resizeHandle?: ResizeHandle;
  spritesheetUrl?: string;
  state?: string;
  style?: React.CSSProperties;
  transientState?: string;
}
export function AvatarMascotButtonIcon({
  ariaLabel,
  assetRef,
  className,
  notificationBadge,
  onContextMenu,
  resizeHandle,
  spritesheetUrl,
  state = "idle",
  style,
  transientState,
}: AvatarMascotButtonIconProps) {
  const [isHovered, setIsHovered] = useState(false);
  const effectiveState = transientState ?? (isHovered ? "jumping" : state);
  const hasNotification = notificationBadge != null;
  const hasResizeHandle = resizeHandle != null;
  const hasInteractiveElement = hasNotification || hasResizeHandle;
  const role =
    ariaLabel != null ? (hasInteractiveElement ? "group" : "img") : undefined;
  const ariaHidden =
    ariaLabel == null && !hasInteractiveElement ? true : undefined;
  const containerClassName = clsx(
    "codex-avatar-button relative flex cursor-interaction items-center justify-center active:cursor-grabbing",
    className,
  );
  const avatar = (
    <CodexAvatar
      assetRef={assetRef}
      className="relative z-10"
      spritesheetUrl={spritesheetUrl}
      state={effectiveState}
    />
  );
  const badge = hasNotification ? (
    <NotificationBadgeButton badge={notificationBadge} />
  ) : null;
  const resize = hasResizeHandle ? (
    <ResizeHandleButton handle={resizeHandle} />
  ) : null;
  return (
    <div
      className={containerClassName}
      data-avatar-mascot="true"
      data-testid="avatar-mascot-button"
      aria-hidden={ariaHidden}
      aria-label={ariaLabel}
      role={role}
      onContextMenu={onContextMenu}
      onPointerEnter={() => setIsHovered(true)}
      onPointerLeave={() => setIsHovered(false)}
      style={style}
    >
      {avatar}
      {badge}
      {resize}
    </div>
  );
}
function NotificationBadgeButton({ badge }: { badge: NotificationBadge }) {
  const [corner, setCorner] = useState<string>("top-end");
  const [dragOffset, setDragOffset] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const dragStartRef = useRef<{
    hasMoved: boolean;
    pointerId: number;
    startClientX: number;
    startClientY: number;
  } | null>(null);
  const reducedMotion = useReducedMotion();
  const justDroppedRef = useRef(false);
  const handlePointerDown = (event: React.PointerEvent) => {
    if (event.button !== 0) return;
    event.stopPropagation();
    event.currentTarget.setPointerCapture?.(event.pointerId);
    dragStartRef.current = {
      hasMoved: false,
      pointerId: event.pointerId,
      startClientX: event.clientX,
      startClientY: event.clientY,
    };
  };
  const handlePointerMove = (event: React.PointerEvent) => {
    const dragStart = dragStartRef.current;
    if (dragStart == null || dragStart.pointerId !== event.pointerId) return;
    event.stopPropagation();
    const deltaX = event.clientX - dragStart.startClientX;
    const deltaY = event.clientY - dragStart.startClientY;
    if (!dragStart.hasMoved && Math.abs(deltaX) < 4 && Math.abs(deltaY) < 4) {
      return;
    }
    event.preventDefault();
    dragStart.hasMoved = true;
    setDragOffset({
      x: deltaX,
      y: deltaY,
    });
  };
  const handlePointerUp = (event: React.PointerEvent) => {
    const dragStart = dragStartRef.current;
    if (dragStart == null || dragStart.pointerId !== event.pointerId) {
      return;
    }
    event.stopPropagation();
    dragStartRef.current = null;
    if (dragStart.hasMoved) {
      const parentBounds =
        event.currentTarget.parentElement?.getBoundingClientRect();
      if (parentBounds != null) {
        setCorner(
          computeCornerFromPosition(parentBounds, event.clientX, event.clientY),
        );
      }
      setDragOffset(null);
      event.preventDefault();
      justDroppedRef.current = true;
      window.setTimeout(() => {
        justDroppedRef.current = false;
      }, 0);
    }
  };
  const handlePointerCancel = (event: React.PointerEvent) => {
    const dragStart = dragStartRef.current;
    if (dragStart == null || dragStart.pointerId !== event.pointerId) return;
    event.stopPropagation();
    dragStartRef.current = null;
    setDragOffset(null);
    event.currentTarget.hasPointerCapture?.(event.pointerId) &&
      event.currentTarget.releasePointerCapture?.(event.pointerId);
  };
  const handleLostPointerCapture = (event: React.PointerEvent) => {
    const dragStart = dragStartRef.current;
    if (dragStart == null || dragStart.pointerId !== event.pointerId) return;
    dragStartRef.current = null;
    setDragOffset(null);
  };
  const handleClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    if (justDroppedRef.current) {
      justDroppedRef.current = false;
      event.preventDefault();
      return;
    }
    badge.onClick();
  };
  const cornerClass = CORNER_POSITION_CLASSES[corner];
  const glassyStyles = badge.isGlassy
    ? "!border-white/85 !bg-white/65 !text-[#4D4D4D] shadow-[0_2px_6px_rgba(0,0,0,0.2)] backdrop-blur-xl hover:!bg-white/80 hover:!text-[#333333] forced-colors:!border-[ButtonBorder] forced-colors:!bg-[ButtonFace] forced-colors:!text-[ButtonText] forced-colors:backdrop-blur-none [@media(prefers-reduced-transparency:reduce)]:!bg-white/95 [@media(prefers-reduced-transparency:reduce)]:backdrop-blur-none"
    : "";
  const sizeStyles = badge.isIconOnly
    ? "size-7 p-0"
    : "min-h-7 min-w-7 px-2 py-1";
  const buttonClassName = clsx(
    "no-drag absolute z-40 flex cursor-grab touch-none select-none items-center justify-center rounded-full border border-token-border/60 text-xs leading-none font-medium shadow-sm active:cursor-grabbing focus-visible:ring-2 focus-visible:ring-token-focus-border focus-visible:outline-none",
    cornerClass,
    glassyStyles,
    sizeStyles,
  );
  const initialScale = reducedMotion ? 1 : 0.7;
  const initialY = reducedMotion ? 0 : 3;
  const translate = dragOffset
    ? `${dragOffset.x}px ${dragOffset.y}px`
    : undefined;
  const transition = reducedMotion
    ? {
        duration: 0,
      }
    : {
        damping: 20,
        mass: 0.7,
        stiffness: 420,
        type: "spring" as const,
      };
  return (
    <motion.button
      type="button"
      animate={{
        opacity: 1,
        scale: 1,
        y: 0,
      }}
      aria-label={badge.ariaLabel}
      className={buttonClassName}
      data-testid="avatar-overlay-notification-badge"
      initial={{
        opacity: 0,
        scale: initialScale,
        y: initialY,
      }}
      onClick={handleClick}
      onLostPointerCapture={handleLostPointerCapture}
      onPointerCancel={handlePointerCancel}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      style={{
        backgroundColor: badge.backgroundColor,
        color: badge.foregroundColor,
        translate,
      }}
      transition={transition}
      whileHover={
        reducedMotion
          ? undefined
          : {
              scale: 1.06,
            }
      }
      whileTap={
        reducedMotion
          ? undefined
          : {
              scale: 0.94,
            }
      }
    >
      {badge.content}
    </motion.button>
  );
}
function ResizeHandleButton({ handle }: { handle: ResizeHandle }) {
  return (
    <div
      className="group absolute right-0 bottom-0 z-30 flex size-12 cursor-default items-end justify-end rounded-[8px] text-token-text-secondary hover:text-token-foreground"
      data-testid="avatar-overlay-resize-hover-target"
    >
      <button
        type="button"
        aria-label={handle.ariaLabel}
        className="no-drag codex-avatar-resize-handle flex size-5 cursor-nwse-resize touch-none items-center justify-center rounded-[6px] border border-token-border-default/80 bg-token-bg-primary p-1 opacity-0 shadow-lg shadow-black/20 backdrop-blur-sm group-hover:opacity-100 focus-visible:opacity-100 focus-visible:ring-2 focus-visible:ring-token-focus-border focus-visible:outline-none forced-colors:bg-[Canvas] forced-colors:backdrop-blur-none [@media(prefers-reduced-transparency:reduce)]:backdrop-blur-none"
        data-testid="avatar-overlay-resize-handle"
        onLostPointerCapture={handle.onLostPointerCapture}
        onPointerCancel={handle.onPointerCancel}
        onPointerDown={handle.onPointerDown}
        onPointerEnter={handle.onPointerEnter}
        onPointerLeave={handle.onPointerLeave}
        onPointerMove={handle.onPointerMove}
        onPointerUp={handle.onPointerUp}
      >
        <svg
          viewBox="0 0 12 12"
          className="size-3"
          data-testid="avatar-overlay-resize-icon"
        >
          <path
            d="M1.75 5V1.75H5M7 10.25h3.25V7M2 2l8 8"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
          />
        </svg>
      </button>
    </div>
  );
}
function computeCornerFromPosition(
  bounds: DOMRect,
  clientX: number,
  clientY: number,
): string {
  const vertical = clientY < bounds.top + bounds.height / 2 ? "top" : "bottom";
  const horizontal = clientX < bounds.left + bounds.width / 2 ? "start" : "end";
  return `${vertical}-${horizontal}`;
}

// Restored from ref/webview/assets/popover-tkrnK9dz.js
import { useContext } from "react";
import clsx from "clsx";
import { windowZoomContextN } from "../../../../widgets/app-shell/window-zoom-context.tsx";
import { a as PopoverTriggerPrimitive, i as PopoverPrimitive, n as PopoverContentPrimitive, r as PopoverPortal } from "../../boundaries/dist-hw5cq-f55";

// ------------------------------------------------------------------
// Root
// ------------------------------------------------------------------

export function Popover(props: React.ComponentProps<typeof PopoverPrimitive>) {
  return <PopoverPrimitive data-slot="popover" {...props} />;
}

// ------------------------------------------------------------------
// Trigger
// ------------------------------------------------------------------

export function PopoverTrigger(props: React.ComponentProps<typeof PopoverTriggerPrimitive>) {
  return <PopoverTriggerPrimitive data-slot="popover-trigger" {...props} />;
}

// ------------------------------------------------------------------
// Content
// ------------------------------------------------------------------

export interface PopoverContentProps extends React.ComponentProps<typeof PopoverContentPrimitive> {
  align?: "start" | "center" | "end";
  sideOffset?: number;
  disablePortal?: boolean;
}
export function PopoverContent({
  className,
  align = "start",
  sideOffset = 4,
  style,
  disablePortal = false,
  ...rest
}: PopoverContentProps) {
  const zoom = windowZoomContextN();
  const computedClassName = clsx("bg-token-dropdown-background/90 text-token-foreground ring-token-border z-50 flex w-72 origin-[var(--radix-popover-content-transform-origin)] flex-col overflow-y-auto rounded-xl px-1 py-1 shadow-lg ring-[0.5px] backdrop-blur-sm outline-hidden", className);
  const computedStyle: React.CSSProperties = {
    zoom: zoom === 1 ? undefined : zoom,
    maxWidth: "min(var(--radix-popover-content-available-width), calc(100vw - 16px))",
    maxHeight: "min(var(--radix-popover-content-available-height), calc(100vh - 16px))",
    ...style
  };
  const content = <PopoverContentPrimitive data-slot="popover-content" align={align} collisionPadding={6} sideOffset={sideOffset} className={computedClassName} style={computedStyle} {...rest} />;
  return disablePortal ? content : <PopoverPortal>{content}</PopoverPortal>;
}

// ------------------------------------------------------------------
// Title
// ------------------------------------------------------------------

export interface PopoverTitleProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}
export function PopoverTitle({
  className,
  ...rest
}: PopoverTitleProps) {
  return <div data-slot="popover-title" className={clsx("font-medium", className)} {...rest} />;
}
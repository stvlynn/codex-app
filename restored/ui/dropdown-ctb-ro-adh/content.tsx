// Restored from ref/webview/assets/dropdown-CTBRoADH.js
import React from "react";
import type { ReactNode, Ref } from "react";
import clsx from "clsx";
import { d as DropdownMenuContent } from "../../boundaries/react-modal-dist";
import { getSurfaceClass } from "./shared";
interface DropdownContentProps {
  children: ReactNode;
  className?: string;
  align?: "start" | "center" | "end";
  sideOffset?: number;
  surface?: string;
  ref?: Ref<HTMLDivElement>;
  style?: React.CSSProperties;
}
export function DropdownContent({
  children,
  className,
  align = "start",
  sideOffset = 1,
  surface = "menu",
  ref,
  style,
  ...rest
}: DropdownContentProps) {
  const surfaceClass = getSurfaceClass(surface);
  const finalClass = clsx(
    "no-drag bg-token-dropdown-background/90 text-token-foreground ring-token-border z-50 m-px flex select-none flex-col overflow-y-auto rounded-xl ring-[0.5px] px-1 py-1 shadow-xl-spread backdrop-blur-sm",
    surfaceClass,
    className,
  );
  const finalStyle = {
    maxWidth:
      "min(var(--radix-dropdown-menu-content-available-width), calc(100vw - 16px))",
    maxHeight:
      "min(var(--radix-dropdown-menu-content-available-height), calc(100vh - 16px))",
    ...style,
  };
  return (
    <DropdownMenuContent
      ref={ref}
      className={finalClass}
      align={align}
      collisionPadding={6}
      sideOffset={sideOffset}
      style={finalStyle}
      {...rest}
    >
      {children}
    </DropdownMenuContent>
  );
}

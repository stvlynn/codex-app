// Restored from ref/webview/assets/annotation-mode-button-BOJdaPpg.js
// annotation-mode-button-BOJdaPpg chunk restored from the Codex webview bundle.
import React from "react";
import clsx from "clsx";
import { Button } from "ui/button";
import { AnnotateIcon } from "icons/annotate-icon";
interface AnnotationModeButtonProps {
  active: boolean;
  activeHoverSuppressed?: boolean;
  activeLabel: string;
  className?: string;
  direction?: "ltr" | "rtl";
  disabled?: boolean;
  label: string;
  onActiveHoverSuppressedChange?: (suppressed: boolean) => void;
  onClick: (event: React.MouseEvent) => void;
  onPointerLeave?: (event: React.PointerEvent) => void;
  style?: React.CSSProperties;
}
function getColorMix(color: string, percent: number): string {
  return `color-mix(in srgb, var(--color-token-main-surface-primary) ${100 - percent}%, var(--color-token-${color}) ${percent}%)`;
}
function getDocumentDirection(): "ltr" | "rtl" {
  if (typeof document === "undefined") return "ltr";
  return window.getComputedStyle(document.documentElement).direction === "rtl"
    ? "rtl"
    : "ltr";
}
export function AnnotationModeButton({
  active,
  activeHoverSuppressed,
  activeLabel,
  className,
  direction,
  disabled,
  label,
  onActiveHoverSuppressedChange,
  onClick,
  onPointerLeave,
  style,
  ...rest
}: AnnotationModeButtonProps) {
  const [hoverSuppressed, setHoverSuppressed] = React.useState(false);
  const isRTL = (direction ?? getDocumentDirection()) === "rtl";
  const isSuppressed = activeHoverSuppressed ?? hoverSuppressed;
  const setSuppressed = onActiveHoverSuppressedChange ?? setHoverSuppressed;
  const hoverPercent = isSuppressed ? 10 : 15;
  const translateClass = active
    ? isRTL
      ? "translate-x-0.5"
      : "-translate-x-0.5"
    : "translate-x-0";
  const ariaLabel = active ? activeLabel : label;
  const activeStyle = active
    ? {
        "--annotation-mode-button-annotation-background": getColorMix(
          "charts-blue",
          10,
        ),
        "--annotation-mode-button-annotation-hover-background": getColorMix(
          "charts-blue",
          hoverPercent,
        ),
      }
    : {};
  const mergedStyle: React.CSSProperties = {
    ...style,
    ...activeStyle,
  };
  const widthClass = active
    ? "max-w-40 justify-start px-2.5"
    : "max-w-8 justify-center px-0";
  const activeClass =
    active &&
    "border-token-charts-blue/40 bg-[var(--annotation-mode-button-annotation-background)] !text-token-text-link-foreground enabled:hover:bg-[var(--annotation-mode-button-annotation-hover-background)]";
  const buttonClass = clsx(
    "ease-basic relative isolate min-w-8 overflow-hidden transition-[max-width,padding-inline,background-color,background-size,border-color,color] duration-relaxed [will-change:max-width,background-size] motion-reduce:transition-none disabled:opacity-100",
    widthClass,
    activeClass,
    className,
  );
  const handleClick = (event: React.MouseEvent) => {
    setSuppressed(!active);
    onClick(event);
  };
  const handlePointerLeave = (event: React.PointerEvent) => {
    setSuppressed(false);
    onPointerLeave?.(event);
  };
  const innerClass = clsx(
    "flex min-w-0 items-center",
    active ? "justify-start" : "w-full justify-center",
  );
  const iconClass = clsx(
    "icon-sm relative shrink-0 transition-transform duration-relaxed ease-basic motion-reduce:transition-none",
    translateClass,
  );
  const icon = (
    <AnnotateIcon
      className={clsx(
        "absolute inset-0 size-full rotate-0 scale-100 opacity-100",
      )}
    />
  );
  const labelClass = clsx(
    "ease-basic min-w-0 overflow-hidden whitespace-nowrap text-sm transition-[max-width,opacity,margin-inline-start] duration-relaxed motion-reduce:transition-none",
    active ? "ms-1 max-w-32 opacity-100" : "ms-0 max-w-0 opacity-0",
  );
  return (
    <Button
      {...rest}
      color="ghost"
      size="toolbar"
      disabled={disabled}
      aria-label={ariaLabel}
      aria-pressed={active}
      style={mergedStyle}
      className={buttonClass}
      onClick={handleClick}
      onPointerLeave={handlePointerLeave}
    >
      <span className={innerClass}>
        <span className={iconClass}>{icon}</span>
        <span className={labelClass}>{activeLabel}</span>
      </span>
    </Button>
  );
}

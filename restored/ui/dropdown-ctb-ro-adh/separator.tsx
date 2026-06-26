// Restored from ref/webview/assets/dropdown-CTBRoADH.js
import React from "react";
import type { ReactNode } from "react";
import clsx from "clsx";
interface SeparatorProps {
  className?: string;
  paddingClassName?: string;
}
export function Separator({
  className,
  paddingClassName = "py-1",
}: SeparatorProps) {
  const finalClass = clsx(
    "w-full px-[var(--padding-row-x)]",
    paddingClassName,
    className,
  );
  return (
    <div className={finalClass}>
      <div className="h-[1px] w-full bg-token-menu-border" />
    </div>
  );
}
interface SectionLabelProps {
  children: ReactNode;
  className?: string;
}
export function SectionLabel({ children, className }: SectionLabelProps) {
  const finalClass = clsx(
    "px-[var(--padding-row-x)] py-1 text-sm text-token-description-foreground",
    className,
  );
  return <div className={finalClass}>{children}</div>;
}
interface MessageProps {
  children: ReactNode;
  className?: string;
  tone?: "muted" | "error";
  compact?: boolean;
  centered?: boolean;
}
export function Message({
  children,
  className,
  tone = "muted",
  compact = false,
  centered = false,
}: MessageProps) {
  const padding = compact ? "py-2" : "py-3";
  const colorClass =
    tone === "error"
      ? "text-token-error-foreground"
      : "text-token-description-foreground";
  const centerClass = centered && "self-center text-center";
  const finalClass = clsx(
    "px-[var(--padding-row-x)] text-sm",
    padding,
    colorClass,
    centerClass,
    className,
  );
  return <div className={finalClass}>{children}</div>;
}
interface TitleProps {
  children: ReactNode;
  className?: string;
}
export function Title({ children, className }: TitleProps) {
  const finalClass = clsx(
    "text-token-description-foreground flex min-h-6 items-center truncate px-[var(--padding-row-x)] py-[var(--padding-row-y)] text-sm leading-4",
    className,
  );
  return <div className={finalClass}>{children}</div>;
}
interface SectionProps {
  children: ReactNode;
  className?: string;
}
export function Section({ children, className }: SectionProps) {
  return <div className={className}>{children}</div>;
}

// Restored from ref/webview/assets/badge-DN8gIpAW.js

import React from "react";
import clsx from "clsx";
export interface BadgeProps {
  children: React.ReactNode;
  className?: string;
}
export function Badge({ children, className }: BadgeProps): JSX.Element {
  const badgeClassName = clsx(
    "bg-token-badge-background text-token-badge-foreground inline-flex items-center rounded-sm px-2 py-1 text-sm leading-none",
    className,
  );
  return <span className={badgeClassName}>{children}</span>;
}

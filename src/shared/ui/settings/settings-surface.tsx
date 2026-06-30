// Restored from ref/webview/assets/settings-surface-BUMhVkdc.js
import React from "react";
import clsx from "clsx";

interface SettingsSurfaceProps {
  children?: React.ReactNode;
  className?: string;
  variant?: "default" | "secondary";
}

export function SettingsSurface({
  children,
  className,
  variant = "default",
}: SettingsSurfaceProps): JSX.Element {
  const variantClass =
    variant === "default"
      ? "border border-token-border"
      : "bg-token-bg-secondary";

  const classes = clsx(
    "flex flex-col divide-y-[0.5px] divide-token-border overflow-hidden rounded-lg",
    variantClass,
    className,
  );

  const style =
    variant === "default"
      ? {
          backgroundColor:
            "var(--color-background-panel, var(--color-token-bg-fog))",
        }
      : undefined;

  return (
    <div className={classes} style={style}>
      {children}
    </div>
  );
}

export default SettingsSurface;

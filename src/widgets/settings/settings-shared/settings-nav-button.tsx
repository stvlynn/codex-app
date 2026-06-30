// Restored from ref/webview/assets/settings-shared-B8obOSL1.js
import type { ReactNode } from "react";
import clsx from "clsx";
import { Button } from "../../../shared/ui/ui/button.tsx";
import { ChevronIcon } from "../../../shared/icons/chevron-icon.tsx";
export interface SettingsNavButtonProps {
  children: ReactNode;
  className?: string;
  contentClassName?: string;
  chevronClassName?: string;
  color?: "secondary" | "ghost" | "primary" | "danger";
  onClick?: () => void;
}
export function SettingsNavButton({
  children,
  className,
  contentClassName,
  chevronClassName,
  color = "secondary",
  onClick,
}: SettingsNavButtonProps): JSX.Element {
  const buttonClassName = clsx("w-[240px] justify-between", className);
  const contentClass = clsx(
    "flex min-w-0 flex-1 items-center gap-1.5",
    contentClassName,
  );
  const chevronClass = clsx(
    "icon-2xs shrink-0 text-token-input-placeholder-foreground",
    chevronClassName,
  );
  return (
    <Button
      color={color}
      size="toolbar"
      className={buttonClassName}
      onClick={onClick}
    >
      <span className={contentClass}>{children}</span>
      <ChevronIcon className={chevronClass} />
    </Button>
  );
}

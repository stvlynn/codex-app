// Restored from ref/webview/assets/button-oF-qgtAS.js
// Button chunk restored from the Codex webview bundle.

import type { ButtonHTMLAttributes, ReactNode } from "react";
import clsx from "clsx";
import { Spinner } from "./spinner-dh-bmwxtt";
export type ButtonSize =
  | "default"
  | "icon"
  | "iconSm"
  | "large"
  | "medium"
  | "composer"
  | "composerSm"
  | "toolbar";
export type ButtonColor =
  | "danger"
  | "ghost"
  | "outlineActive"
  | "ghostActive"
  | "ghostMuted"
  | "ghostTertiary"
  | "outline"
  | "primary"
  | "secondary";
export interface ButtonProps extends Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "color" | "size"
> {
  uniform?: boolean;
  allowShrink?: boolean;
  color?: ButtonColor;
  size?: ButtonSize;
  loading?: boolean;
  children?: ReactNode;
}
export const buttonRadiusMap: Record<ButtonSize, string> = {
  default: "rounded-full",
  icon: "rounded-full electron:rounded-md",
  iconSm: "rounded-md",
  large: "rounded-full",
  medium: "rounded-lg",
  composer: "rounded-full",
  composerSm: "rounded-full",
  toolbar: "rounded-lg",
};
export const buttonColorMap: Record<ButtonColor, string> = {
  danger:
    "bg-token-charts-red/10 enabled:hover:bg-token-charts-red/20 text-token-charts-red border-transparent",
  ghost:
    "text-token-text-tertiary enabled:hover:bg-token-list-hover-background data-[state=open]:bg-token-list-hover-background border-transparent",
  outlineActive:
    "border-token-border text-token-button-tertiary-foreground bg-token-foreground/10 enabled:hover:bg-token-foreground/15 data-[state=open]:bg-token-foreground/15 border",
  ghostActive:
    "text-token-foreground enabled:hover:bg-token-list-hover-background data-[state=open]:bg-token-list-hover-background border-transparent",
  ghostMuted:
    "text-token-muted-foreground enabled:hover:bg-transparent data-[state=open]:bg-transparent hover:text-token-foreground border-transparent",
  ghostTertiary:
    "text-token-text-tertiary enabled:hover:bg-transparent data-[state=open]:bg-transparent enabled:hover:text-token-foreground border-transparent",
  outline:
    "border-token-border text-token-button-tertiary-foreground bg-token-bg-fog enabled:hover:bg-token-list-hover-background data-[state=open]:bg-token-list-hover-background border",
  primary:
    "bg-token-foreground enabled:hover:bg-token-foreground/80 data-[state=open]:bg-token-foreground/80 text-token-dropdown-background",
  secondary:
    "text-token-foreground bg-token-foreground/5 enabled:hover:bg-token-foreground/10 data-[state=open]:bg-token-foreground/10 border-transparent",
};
export const buttonSizeMap: Record<ButtonSize, string> = {
  composer: "h-token-button-composer px-2 py-0 text-sm leading-[18px]",
  composerSm: "h-token-button-composer-sm px-1.5 py-0 text-sm leading-[18px]",
  default: "px-2 py-0.5 text-sm leading-[18px]",
  icon: "electron:p-1 electron:[&>svg]:icon-sm flex items-center justify-center p-0.5",
  iconSm: "flex h-4 w-4 items-center justify-center p-0.5 [&>svg]:icon-2xs",
  large: "px-5 py-2 text-base leading-[18px]",
  medium: "px-4 py-1.5 text-base leading-[18px]",
  toolbar: "h-token-button-composer px-2 py-0 text-base leading-[18px]",
};
export function Button({
  uniform = false,
  allowShrink = false,
  color = "primary",
  size = "default",
  disabled = false,
  className,
  children,
  type = "button",
  loading = false,
  ...rest
}: ButtonProps): JSX.Element {
  const radius = buttonRadiusMap[size];
  const colorClass = buttonColorMap[color];
  const sizeClass = buttonSizeMap[size];
  const shrinkClass = allowShrink && "min-w-0";
  const classNames = clsx(
    "border-token-border no-drag cursor-interaction flex items-center gap-1 border whitespace-nowrap select-none focus:outline-none disabled:cursor-not-allowed disabled:opacity-40",
    radius,
    colorClass,
    sizeClass,
    shrinkClass,
    uniform && "aspect-square items-center justify-center !px-0",
    className,
  );
  const isDisabled = disabled || loading;
  const spinner = loading && <Spinner className="icon-xxs" />;
  return (
    <button type={type} className={classNames} disabled={isDisabled} {...rest}>
      {spinner}
      {children}
    </button>
  );
}

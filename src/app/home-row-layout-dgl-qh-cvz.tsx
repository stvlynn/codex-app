// Restored from ref/webview/assets/home-row-layout-DglQhCVZ.js
// home-row-layout-DglQhCVZ chunk restored from the Codex webview bundle.
import type { ComponentProps, ReactNode } from "react";
import clsx from "clsx";
import { ComposerLabel } from "../widgets/composer/composer-footer-dy-rb-fs-kv.tsx";
export interface HomeRowLayoutProps extends ComponentProps<"span"> {
  className?: string;
}
export function HomeRowLayout({
  className,
  ...rest
}: HomeRowLayoutProps): ReactNode {
  return (
    <span
      className={clsx("flex min-w-0 flex-1 items-center gap-1.5", className)}
      {...rest}
    />
  );
}
export interface HomeRowIconProps extends ComponentProps<"span"> {
  className?: string;
}
export function HomeRowIcon({
  className,
  ...rest
}: HomeRowIconProps): ReactNode {
  return (
    <span
      className={clsx(
        "flex size-4 shrink-0 items-center justify-center",
        className,
      )}
      {...rest}
    />
  );
}
export interface HomeRowLabelProps extends ComponentProps<
  typeof ComposerLabel
> {
  className?: string;
}
export function HomeRowLabel({
  className,
  ...rest
}: HomeRowLabelProps): ReactNode {
  return (
    <ComposerLabel
      collapse="xs"
      className={clsx(
        "min-w-0 flex-1 truncate text-sm leading-[18px]",
        className,
      )}
      {...rest}
    />
  );
}

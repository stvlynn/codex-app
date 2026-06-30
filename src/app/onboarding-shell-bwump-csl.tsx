// Restored from ref/webview/assets/onboarding-shell-BwumpCSL.js
// OnboardingShell chunk restored from the Codex webview bundle.

import React from "react";
import clsx from "clsx";
import { usePlatform } from "../shared/utils/use-platform.ts";
import { WithWindow } from "../shared/utils/with-window.tsx";
import { StyledCheckbox } from "../shared/ui/ui/checkbox";
export const defaultCheckboxClassName = `h-[18px] w-[18px] rounded-[3px] border-[1px]`;
export interface OnboardingListProps {
  children: React.ReactNode;
  ariaLabel?: string;
  className?: string;
}
export function OnboardingList({
  children,
  ariaLabel,
  className,
}: OnboardingListProps): JSX.Element {
  return (
    <div
      className={clsx(
        `flex h-[240px] w-full flex-col overflow-y-auto rounded-2xl border border-token-border bg-token-surface-primary px-5 py-4`,
        className,
      )}
      role="list"
      aria-label={ariaLabel}
    >
      {children}
    </div>
  );
}
export interface OnboardingListItemProps {
  checkboxId?: string;
  checked?: boolean;
  disabled?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  control?: React.ReactNode;
  label: React.ReactNode;
  description?: React.ReactNode;
  leadingContent?: React.ReactNode;
  trailingContent?: React.ReactNode;
  trailingControl?: React.ReactNode;
  controlPlacement?: "left" | "right";
  className?: string;
  checkboxClassName?: string;
  labelClassName?: string;
  descriptionClassName?: string;
  trailingClassName?: string;
}
export function OnboardingListItem({
  checkboxId,
  checked,
  disabled = false,
  onCheckedChange,
  control,
  label,
  description,
  leadingContent,
  trailingContent,
  trailingControl,
  controlPlacement = "left",
  className,
  checkboxClassName,
  labelClassName,
  descriptionClassName,
  trailingClassName,
}: OnboardingListItemProps): JSX.Element {
  const effectiveCheckboxClassName =
    checkboxClassName ?? defaultCheckboxClassName;
  const hasCheckbox =
    control == null &&
    checkboxId != null &&
    checked != null &&
    onCheckedChange != null;
  const checkboxElement = hasCheckbox ? (
    <StyledCheckbox
      id={checkboxId}
      className={effectiveCheckboxClassName}
      checked={checked}
      disabled={disabled}
      onCheckedChange={(value: boolean) => onCheckedChange(value)}
    />
  ) : (
    control
  );
  const leftControl =
    controlPlacement === "left" ? <div>{checkboxElement}</div> : null;
  const rightControl =
    controlPlacement === "right" ? <div>{checkboxElement}</div> : null;
  return (
    <div
      className={clsx(
        `relative flex items-start gap-2 last:border-b-0`,
        className,
      )}
      role="listitem"
    >
      {leftControl}
      {leadingContent != null && <div>{leadingContent}</div>}
      <label
        className="flex min-w-0 flex-1 items-start gap-2 text-left"
        htmlFor={hasCheckbox ? checkboxId : undefined}
      >
        <div className="min-w-0 flex-1">
          <div
            className={clsx(
              `truncate text-base leading-5 text-token-foreground`,
              labelClassName,
            )}
          >
            {label}
          </div>
          {description != null && (
            <div
              className={clsx(
                `truncate text-xs leading-4 text-token-text-secondary`,
                descriptionClassName,
              )}
            >
              {description}
            </div>
          )}
        </div>
        {trailingContent != null && (
          <span
            className={clsx(
              `max-w-[45%] shrink truncate text-right text-sm leading-5 text-token-description-foreground`,
              trailingClassName,
            )}
          >
            {trailingContent}
          </span>
        )}
      </label>
      {trailingControl != null && <div>{trailingControl}</div>}
      {rightControl}
    </div>
  );
}
export interface OnboardingHeroProps {
  children?: React.ReactNode;
  icon?: React.ReactNode;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  className?: string;
  textClassName?: string;
  titleClassName?: string;
  subtitleClassName?: string;
}
export function OnboardingHero({
  children,
  icon = null,
  title,
  subtitle,
  className,
  textClassName,
  titleClassName,
  subtitleClassName,
}: OnboardingHeroProps): JSX.Element {
  return (
    <div className={clsx(`flex w-full flex-col items-center gap-6`, className)}>
      {icon}
      <div
        className={clsx(
          `flex w-full flex-col items-center text-center`,
          textClassName,
        )}
      >
        <span
          className={clsx(
            `text-heading-lg font-semibold text-token-foreground`,
            titleClassName,
          )}
        >
          {title}
        </span>
        {subtitle != null && (
          <span
            className={clsx(
              `text-lg leading-6 text-token-description-foreground`,
              subtitleClassName,
            )}
          >
            {subtitle}
          </span>
        )}
      </div>
      {children}
    </div>
  );
}
export interface OnboardingShellProps {
  children: React.ReactNode;
  fullBleed?: boolean;
  hideHeader?: boolean;
}
export function OnboardingShell({
  children,
  fullBleed = false,
  hideHeader = false,
}: OnboardingShellProps): JSX.Element {
  const { platform } = usePlatform();
  const showHeader = !hideHeader && platform !== "windows";
  return (
    <div className="fixed inset-0 overflow-hidden select-none">
      <div className="absolute inset-0 bg-token-bg-primary electron:bg-transparent" />
      <WithWindow browser={true} electron={true}>
        {showHeader && (
          <div className="draggable fixed inset-x-0 top-0 z-10 h-toolbar-sm select-none" />
        )}
        <div
          className={
            fullBleed
              ? "fixed inset-0"
              : clsx(
                  `fixed inset-x-0 bottom-0 flex items-center justify-center px-6 pb-8`,
                  showHeader ? `top-toolbar-sm pt-2` : `top-0 pt-8`,
                )
          }
        >
          {children}
        </div>
      </WithWindow>
    </div>
  );
}

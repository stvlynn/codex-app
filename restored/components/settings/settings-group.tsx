// Restored from ref/webview/assets/settings-group-BsLwxK1k.js
import React from "react";
import clsx from "clsx";

interface SettingsGroupProps {
  children?: React.ReactNode;
  id?: string;
  className?: string;
}

interface SettingsGroupHeaderProps {
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
  titleGap?: "default" | "none";
}

interface SettingsGroupContentProps {
  children?: React.ReactNode;
  className?: string;
}

export function SettingsGroup({ children, id, className }: SettingsGroupProps): JSX.Element {
  const classes = clsx("flex flex-col", className);
  return (
    <section id={id} className={classes}>
      {children}
    </section>
  );
}

export function SettingsGroupHeader({
  title,
  subtitle,
  actions,
  className,
  titleGap = "default",
}: SettingsGroupHeaderProps): JSX.Element | null {
  const hasTitle = title != null;
  const hasSubtitle = subtitle != null;

  if (!hasTitle && !hasSubtitle && actions == null) {
    return null;
  }

  const headerClasses = clsx(
    hasSubtitle
      ? "flex items-start justify-between gap-2 px-0 pt-[calc((var(--height-toolbar)-1.5rem)/2)]"
      : "flex h-toolbar items-center justify-between gap-2 px-0 py-0",
    className,
  );

  const contentGap = titleGap === "none" ? "gap-0" : "gap-1";
  const contentClasses = clsx("flex min-w-0 flex-1 flex-col", contentGap);

  return (
    <div className={headerClasses}>
      <div className={contentClasses}>
        {hasTitle && (
          <div className="text-base font-medium text-token-text-primary">{title}</div>
        )}
        {hasSubtitle && (
          <div className="text-base font-normal text-token-text-tertiary">{subtitle}</div>
        )}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}

export function SettingsGroupContent({
  children,
  className,
}: SettingsGroupContentProps): JSX.Element {
  const classes = clsx("flex flex-col gap-1.5", className);
  return <div className={classes}>{children}</div>;
}

export default Object.assign(SettingsGroup, {
  Header: SettingsGroupHeader,
  Content: SettingsGroupContent,
});

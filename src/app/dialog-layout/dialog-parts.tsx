// Restored from ref/webview/assets/dialog-layout-BUsOXjxz.js
// Layout components for dialog content: header, body, footer, section, row, stack.

import * as React from "react";
import clsx from "clsx";
import { Button } from "../../shared/ui/ui/button.tsx";
import { WithWindow } from "../../shared/utils/with-window.tsx";
import { DebugLabel, debugOutlineClassName, getBodySizeClass, isDialogLayoutDebugEnabled } from "../../shared/utils/constants-bkih-qwv-w.ts";
import type { DialogBodyProps, DialogFooterProps, DialogHeaderProps, DialogSectionProps, FieldStackProps, FormRowProps } from "../../shared/icons/speaker/types.ts";
export function DialogHeader({
  icon,
  title,
  subtitle,
  className,
  iconClassName,
  iconBackgroundClassName,
  titleSize = "dialog",
  titleClassName,
  subtitleSize = "base",
  subtitleClassName
}: DialogHeaderProps) {
  const debug = isDialogLayoutDebugEnabled();
  const titleClass = titleSize === "lg" ? "heading-lg" : titleSize === "base" ? "heading-base" : titleSize === "sm" ? "heading-sm" : "heading-dialog";
  const subtitleClass = subtitleSize === "base" ? "text-base leading-normal tracking-normal" : "text-sm leading-normal tracking-normal";
  const rootClassName = clsx("flex flex-col items-start gap-3", debug && debugOutlineClassName, className);
  return <div className={rootClassName}>
      {debug ? <DebugLabel name="DialogHeader" /> : null}
      {icon ? <span className={clsx("flex h-9 w-9 shrink-0 items-center justify-center rounded-xl p-2", iconBackgroundClassName ?? "bg-token-foreground/5", iconClassName)}>
          {icon}
        </span> : null}
      <div className="flex min-w-0 flex-1 flex-col gap-1 self-stretch">
        {title ? <div className={clsx(titleClass, "min-w-0 font-semibold", titleClassName)}>
            {title}
          </div> : null}
        {subtitle ? <div className={clsx("text-token-description-foreground", subtitleClass, subtitleClassName)}>
            {subtitle}
          </div> : null}
      </div>
    </div>;
}
export function DialogBody({
  children,
  className,
  size,
  as: Component = "div",
  ...props
}: DialogBodyProps) {
  const debug = isDialogLayoutDebugEnabled();
  const sizeClass = getBodySizeClass(size);
  const bodyClassName = clsx("flex flex-col gap-0 px-5 py-5 text-base leading-normal tracking-normal", debug && debugOutlineClassName, sizeClass, className);
  const debugLabel = debug ? <DebugLabel name="DialogBody" /> : null;
  if (Component === "form") {
    return <form {...props} className={bodyClassName}>
        {debugLabel}
        {children}
      </form>;
  }
  return <div {...props} className={bodyClassName}>
      {debugLabel}
      {children}
    </div>;
}
function countButtons(children: React.ReactNode): number {
  return React.Children.toArray(children).reduce((count, child) => {
    if (!React.isValidElement(child) || child.type !== buttonT) return count;
    return count + 1;
  }, 0);
}
function cloneButtonsWithSize(children: React.ReactNode, size: React.ComponentProps<typeof buttonT>["size"], expandSingleButton: boolean): React.ReactNode {
  const buttons = countButtons(children);
  return React.Children.map(children, child => {
    if (!React.isValidElement(child) || child.type !== buttonT) return child;
    const singleExpandClass = expandSingleButton && buttons === 1 ? "w-full justify-center" : undefined;
    return React.cloneElement(child, {
      size: child.props.size ?? size,
      className: clsx(child.props.className, singleExpandClass)
    });
  });
}
export function DialogFooter({
  children,
  className,
  expandSingleButton
}: DialogFooterProps) {
  const debug = isDialogLayoutDebugEnabled();
  const effectiveExpandSingleButton = expandSingleButton ?? true;
  const footerClassName = clsx("flex w-full items-center justify-end gap-3", debug && debugOutlineClassName, className);
  const renderButtons = (size: React.ComponentProps<typeof buttonT>["size"]) => cloneButtonsWithSize(children, size, effectiveExpandSingleButton);
  return <div className={footerClassName}>
      {debug ? <DebugLabel name="DialogFooter" /> : null}
      <WithWindow browser>{renderButtons("medium")}</WithWindow>
      <WithWindow electron>{renderButtons("medium")}</WithWindow>
      <WithWindow extension>{renderButtons("toolbar")}</WithWindow>
    </div>;
}
export function DialogSection({
  children,
  className
}: DialogSectionProps) {
  const debug = isDialogLayoutDebugEnabled();
  const sectionClassName = clsx("flex w-full flex-col pt-3 first:pt-0", debug && debugOutlineClassName, className);
  return <div className={sectionClassName}>
      {debug ? <DebugLabel name="DialogSection" /> : null}
      {children}
    </div>;
}
export function FormRow({
  children,
  className
}: FormRowProps) {
  const debug = isDialogLayoutDebugEnabled();
  const rowClassName = clsx("relative flex items-center gap-2", debug && debugOutlineClassName, className);
  return <div className={rowClassName}>
      {debug ? <DebugLabel name="FormRow" /> : null}
      {children}
    </div>;
}
export function FieldStack({
  children,
  className
}: FieldStackProps) {
  const debug = isDialogLayoutDebugEnabled();
  const stackClassName = clsx("flex flex-col gap-2", debug && debugOutlineClassName, className);
  return <div className={stackClassName}>
      {debug ? <DebugLabel name="FieldStack" /> : null}
      {children}
    </div>;
}
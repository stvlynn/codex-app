// Restored from ref/webview/assets/inline-mention-content-CTO-ayBF.js

import React from "react";
import { clsx } from "clsx";
import {
  inlineMentionIconContainerClass,
  inlineMentionIconClass,
  inlineMentionBrandAwareClass,
  inlineMentionGroupClass,
  inlineMentionHoverClass,
  inlineMentionPaddingClass,
  getInlineMentionStyle,
} from "./inline-mention-style";
export interface InlineMentionContentProps {
  brandColor?: string;
  className?: string;
  dataAttributes?: Record<string, string>;
  underlineOnHover?: boolean;
  icon?:
    | React.ReactNode
    | React.ComponentType<{
        className?: string;
      }>;
  interactive?: boolean;
  style?: React.CSSProperties;
  text: React.ReactNode;
  textClassName?: string;
  title?: string;
}
export function InlineMentionContent({
  brandColor,
  className,
  dataAttributes,
  underlineOnHover = false,
  icon,
  interactive = false,
  style,
  text,
  textClassName,
  title,
}: InlineMentionContentProps): JSX.Element {
  const iconElement =
    icon == null
      ? null
      : React.isValidElement(icon)
        ? React.cloneElement(icon as React.ReactElement, {
            className: clsx(
              inlineMentionIconClass,
              (icon as React.ReactElement).props.className,
            ),
          })
        : React.createElement(
            icon as React.ComponentType<{
              className?: string;
            }>,
            {
              className: inlineMentionIconClass,
            },
          );
  const hoverClass = underlineOnHover && inlineMentionHoverClass;
  const interactiveClass = interactive && "cursor-interaction";
  const wrapperClass = clsx(
    inlineMentionBrandAwareClass,
    inlineMentionGroupClass,
    inlineMentionPaddingClass,
    hoverClass,
    interactiveClass,
    className,
  );
  const computedStyle = getInlineMentionStyle({
    brandColor,
    style: style ?? {},
  });
  const iconWrapper =
    iconElement == null ? null : (
      <span className={inlineMentionIconContainerClass}>{iconElement}</span>
    );
  const textClass = clsx("min-w-0 break-words", textClassName);
  const textElement = <span className={textClass}>{text}</span>;
  return (
    <span
      className={wrapperClass}
      style={computedStyle}
      title={title}
      {...dataAttributes}
    >
      {iconWrapper}
      {textElement}
    </span>
  );
}

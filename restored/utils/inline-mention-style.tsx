// Restored from ref/webview/assets/inline-mention-style-FOcqwjXd.js
// InlineMentionStyle chunk restored from the Codex webview bundle.

import type { CSSProperties } from "react";

export const inlineMentionBrandAwareClass =
  "inline-mention-brand-aware font-medium text-[color:var(--inline-mention-color)] [--inline-mention-color:var(--inline-mention-resolved-base-color,var(--inline-mention-base-color))] [--inline-mention-base-color:color-mix(in_srgb,var(--color-token-text-link-foreground)_80%,var(--color-token-foreground)_20%)]";

export const inlineMentionHoverClass =
  "group-hover/inline-mention:underline group-hover/inline-mention:decoration-current group-hover/inline-mention:decoration-dashed group-hover/inline-mention:decoration-[0.5px] group-hover/inline-mention:underline-offset-2";

export const inlineMentionGroupClass = "group/inline-mention cursor-pointer";

export const inlineMentionPaddingClass = "px-0.5";

export const inlineMentionIconClass =
  "icon-xs absolute top-1/2 -translate-y-1/2";

export const inlineMentionIconContainerClass =
  "relative mr-[3px] inline-block h-[1lh] w-4 align-bottom";

export interface InlineMentionStyleInput {
  brandColor?: string;
  style: CSSProperties;
}

export function getInlineMentionStyle({
  brandColor,
  style,
}: InlineMentionStyleInput): CSSProperties {
  if (brandColor == null) return style;
  return {
    ...style,
    "--inline-mention-base-color": brandColor,
    "--inline-mention-dark-base-color": `color-mix(in oklch, ${brandColor} 50%, var(--color-token-foreground) 50%)`,
  };
}

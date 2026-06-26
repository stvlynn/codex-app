// Restored from ref/webview/assets/prompt-text-BpPEyD-S.js
// PromptText chunk restored from the Codex webview bundle.
import { useCallback, useRef, useState } from "react";
import type { JSX } from "react";
import {
  getMentionDisplayName,
  getMentionName,
} from "../../composer/mention-item/mention-name-getters";
import { getMentionPath } from "../../composer/mention-item/mention-path-desc-getters";
import { isMentionOfKind } from "../../composer/mention-item/mention-kind-getters";
import { getMentionUrlPrefix } from "../../composer/mention-item/get-mention-url-prefix";
import { createRichLink } from "../../utils/rich-link";
import { getActiveThreadId } from "../../utils/persisted-signal";
import { A as useAppScopeA } from "../../boundaries/tanstack-query";

// ------------------------------------------------------------------
// Types
// ------------------------------------------------------------------

export interface PromptTextMention {
  id: string;
  name: string;
  displayName: string;
  path: string;
  mentionType: string;
  mentionKind: string;
}
export interface PromptTextRichLink {
  displayText: string;
  href: string;
  sourceAppId: string;
}
export interface PromptTextSegment {
  type: "text" | "mention" | "rich-link";
  content: string;
  mention?: PromptTextMention;
  richLink?: PromptTextRichLink;
}
export interface PromptTextOptions {
  text: string;
  mentions?: PromptTextMention[];
  richLinks?: PromptTextRichLink[];
}
export interface UsePromptTextResult {
  segments: PromptTextSegment[];
  hasMentions: boolean;
  hasRichLinks: boolean;
  mentionCount: number;
  richLinkCount: number;
}

// ------------------------------------------------------------------
// Helpers
// ------------------------------------------------------------------

function escapeRegExp(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function buildMentionPattern(mentions: PromptTextMention[]): RegExp | null {
  if (mentions.length === 0) return null;
  const patterns = mentions.map((m) => {
    const name = escapeRegExp(m.name);
    const displayName = escapeRegExp(m.displayName);
    return `@(?:${name}|${displayName})`;
  });
  return new RegExp(`(${patterns.join("|")})`, "g");
}
function buildRichLinkPattern(richLinks: PromptTextRichLink[]): RegExp | null {
  if (richLinks.length === 0) return null;
  const patterns = richLinks.map((rl) => escapeRegExp(rl.href));
  return new RegExp(`(${patterns.join("|")})`, "g");
}
function findMentionByText(
  text: string,
  mentions: PromptTextMention[],
): PromptTextMention | undefined {
  return mentions.find(
    (m) =>
      text === `@${m.name}` ||
      text === `@${m.displayName}` ||
      text === m.name ||
      text === m.displayName,
  );
}
function findRichLinkByHref(
  href: string,
  richLinks: PromptTextRichLink[],
): PromptTextRichLink | undefined {
  return richLinks.find((rl) => rl.href === href);
}
function parsePromptText(options: PromptTextOptions): PromptTextSegment[] {
  const { text, mentions = [], richLinks = [] } = options;
  if (!text || text.length === 0) return [];
  const segments: PromptTextSegment[] = [];
  const mentionPattern = buildMentionPattern(mentions);
  const richLinkPattern = buildRichLinkPattern(richLinks);

  // Combine patterns to split text by both mentions and rich links
  const combinedPattern = [mentionPattern, richLinkPattern]
    .filter(Boolean)
    .map((p) => p!.source)
    .join("|");
  if (!combinedPattern) {
    return [
      {
        type: "text",
        content: text,
      },
    ];
  }
  const splitPattern = new RegExp(`(${combinedPattern})`, "g");
  const parts = text.split(splitPattern);
  for (const part of parts) {
    if (!part) continue;
    const mention = mentionPattern
      ? findMentionByText(part, mentions)
      : undefined;
    if (mention) {
      segments.push({
        type: "mention",
        content: part,
        mention,
      });
      continue;
    }
    const richLink = richLinkPattern
      ? findRichLinkByHref(part, richLinks)
      : undefined;
    if (richLink) {
      segments.push({
        type: "rich-link",
        content: part,
        richLink,
      });
      continue;
    }
    segments.push({
      type: "text",
      content: part,
    });
  }
  return segments;
}

// ------------------------------------------------------------------
// Hook
// ------------------------------------------------------------------

/**
 * Parse prompt text into segments (text, mentions, rich links).
 */
export function usePromptText(options: PromptTextOptions): UsePromptTextResult {
  const { text, mentions = [], richLinks = [] } = options;
  const segments = useRef<PromptTextSegment[]>([]);
  const [cachedResult, setCachedResult] = useState<UsePromptTextResult>({
    segments: [],
    hasMentions: false,
    hasRichLinks: false,
    mentionCount: 0,
    richLinkCount: 0,
  });
  const computeSegments = useCallback(() => {
    const newSegments = parsePromptText({
      text,
      mentions,
      richLinks,
    });
    const mentionCount = newSegments.filter((s) => s.type === "mention").length;
    const richLinkCount = newSegments.filter(
      (s) => s.type === "rich-link",
    ).length;
    return {
      segments: newSegments,
      hasMentions: mentionCount > 0,
      hasRichLinks: richLinkCount > 0,
      mentionCount,
      richLinkCount,
    };
  }, [text, mentions, richLinks]);

  // Recompute when inputs change
  const result = computeSegments();
  if (result.segments.length !== segments.current.length) {
    segments.current = result.segments;
    setCachedResult(result);
  }
  return result;
}

// ------------------------------------------------------------------
// Component
// ------------------------------------------------------------------

export interface PromptTextProps {
  text: string;
  mentions?: PromptTextMention[];
  richLinks?: PromptTextRichLink[];
  className?: string;
  onMentionClick?: (mention: PromptTextMention) => void;
  onRichLinkClick?: (richLink: PromptTextRichLink) => void;
}

/**
 * Render prompt text with highlighted mentions and rich links.
 */
export function PromptText({
  text,
  mentions = [],
  richLinks = [],
  className,
  onMentionClick,
  onRichLinkClick,
}: PromptTextProps): JSX.Element {
  const { segments } = usePromptText({
    text,
    mentions,
    richLinks,
  });
  return (
    <span className={className}>
      {segments.map((segment, index) => {
        if (segment.type === "mention" && segment.mention) {
          return (
            <span
              key={`mention-${index}`}
              className="prompt-text-mention"
              onClick={() => onMentionClick?.(segment.mention!)}
              role="button"
              tabIndex={0}
            >
              {segment.content}
            </span>
          );
        }
        if (segment.type === "rich-link" && segment.richLink) {
          return (
            <a
              key={`link-${index}`}
              href={segment.richLink.href}
              className="prompt-text-rich-link"
              onClick={(e) => {
                e.preventDefault();
                onRichLinkClick?.(segment.richLink!);
              }}
            >
              {segment.richLink.displayText}
            </a>
          );
        }
        return <span key={`text-${index}`}>{segment.content}</span>;
      })}
    </span>
  );
}

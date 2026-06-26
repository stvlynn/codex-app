// Restored from ref/webview/assets/comment-attachment-labels-BEv69mU6.js
// Internationalized labels for comment attachment annotations and comments.

import { defineMessages } from "react-intl";

export interface AttachmentCounts {
  annotationCount: number;
  commentCount: number;
  designTweakCount?: number;
}

export type AttachmentKind = "annotation" | "comment";

const messages = defineMessages({
  annotationCount: {
    id: "commentAttachments.numAnnotations",
    defaultMessage: "{count, plural, one {# annotation} other {# annotations}}",
    description: "Number of in-app browser annotations in the attachment",
  },
  commentCount: {
    id: "commentAttachments.numComments",
    defaultMessage: "{count, plural, one {# comment} other {# comments}}",
    description: "Number of comments in the comment attachment",
  },
  removeAnnotations: {
    id: "commentAttachments.removeAnnotationsAriaLabel",
    defaultMessage: "Remove annotations attachment",
    description: "Aria label for removing the annotations attachment",
  },
  removeComments: {
    id: "commentAttachments.removeAriaLabel",
    defaultMessage: "Remove comments attachment",
    description: "Aria label for removing the comment attachment",
  },
  mixedSummary: {
    id: "commentAttachments.mixedSummary",
    defaultMessage: "{annotations}, {comments}",
    description:
      "Summary text for a queued message with both browser annotations and diff comments",
  },
});

export function formatAttachmentCount(
  intl: {
    formatMessage: (
      msg: typeof messages.annotationCount,
      values: Record<string, unknown>,
    ) => string;
  },
  options: { count: number; kind: AttachmentKind },
): string {
  const { count, kind } = options;
  switch (kind) {
    case "annotation":
      return intl.formatMessage(messages.annotationCount, { count });
    case "comment":
      return intl.formatMessage(messages.commentCount, { count });
  }
}

export function formatAttachmentCountShort(
  intl: {
    formatMessage: (
      msg: typeof messages.annotationCount,
      values: Record<string, unknown>,
    ) => string;
  },
  kind: AttachmentKind,
  count: number,
): string {
  return formatAttachmentCount(intl, { count, kind });
}

export function getRemoveAttachmentLabel(
  intl: { formatMessage: (msg: typeof messages.removeAnnotations) => string },
  kind: AttachmentKind,
): string {
  switch (kind) {
    case "annotation":
      return intl.formatMessage(messages.removeAnnotations);
    case "comment":
      return intl.formatMessage(messages.removeComments);
  }
}

export function formatAttachmentSummary(
  intl: {
    formatMessage: (
      msg: typeof messages.mixedSummary,
      values: Record<string, unknown>,
    ) => string;
  },
  counts: AttachmentCounts,
): string {
  const { annotationCount, commentCount, designTweakCount = 0 } = counts;
  const totalAnnotations = annotationCount + designTweakCount;

  if (totalAnnotations > 0 && commentCount > 0) {
    return intl.formatMessage(messages.mixedSummary, {
      annotations: formatAttachmentCount(intl, {
        count: totalAnnotations,
        kind: "annotation",
      }),
      comments: formatAttachmentCount(intl, {
        count: commentCount,
        kind: "comment",
      }),
    });
  }
  if (totalAnnotations > 0) {
    return formatAttachmentCount(intl, {
      count: totalAnnotations,
      kind: "annotation",
    });
  }
  if (commentCount > 0) {
    return formatAttachmentCount(intl, {
      count: commentCount,
      kind: "comment",
    });
  }
  return "";
}

// Restored from ref/webview/assets/automatic-approval-review-Cv04Ul6t.js

import React from "react";
import { useEffectEvent } from "react";
import { useIntl, IntlShape, MessageDescriptor } from "react-intl";

/* ─── Messages ─── */

const messages = {
  actionSummaryEditingFile: {
    id: "localConversation.automaticApprovalReview.actionSummary.editingFile",
    defaultMessage: "Editing {file}",
    description:
      "Action summary shown when auto-review is evaluating an edit to one file.",
  },
  actionSummaryEditingFiles: {
    id: "localConversation.automaticApprovalReview.actionSummary.editingFiles",
    defaultMessage: "Editing {fileCount, plural, one {a file} other {# files}}",
    description:
      "Action summary shown when auto-review is evaluating edits to multiple files.",
  },
  actionSummaryMcpToolCall: {
    id: "localConversation.automaticApprovalReview.actionSummary.mcpToolCall",
    defaultMessage: "MCP {toolName} on {connector}",
    description:
      "Action summary shown when auto-review is evaluating an MCP tool call.",
  },
  actionSummaryNetworkAccess: {
    id: "localConversation.automaticApprovalReview.actionSummary.networkAccess",
    defaultMessage: "Network access to {target}",
    description:
      "Action summary shown when auto-review is evaluating a network access request.",
  },
  actionSummaryPermissionRequest: {
    id: "localConversation.automaticApprovalReview.actionSummary.permissionRequest",
    defaultMessage: "Permission request",
    description:
      "Action summary shown when auto-review is evaluating a permission request without a reason.",
  },
  actionSummaryPermissionRequestWithReason: {
    id: "localConversation.automaticApprovalReview.actionSummary.permissionRequestWithReason",
    defaultMessage: "Permission request: {reason}",
    description:
      "Action summary shown when auto-review is evaluating a permission request with a reason.",
  },
  summaryInProgress: {
    id: "localConversation.automaticApprovalReview.summary.inProgress",
    defaultMessage:
      "A carefully prompted reviewer agent is reviewing this request before Codex runs it.",
    description:
      "Fallback summary shown while an automatic approval review is in progress.",
  },
  summaryAborted: {
    id: "localConversation.automaticApprovalReview.summary.aborted",
    defaultMessage:
      "A carefully prompted reviewer agent stopped reviewing this request before Codex ran it.",
    description:
      "Fallback summary shown when an automatic approval review is aborted before the action runs.",
  },
  summaryTimedOut: {
    id: "localConversation.automaticApprovalReview.summary.timedOut",
    defaultMessage:
      "A carefully prompted reviewer agent timed out before Codex ran this request.",
    description:
      "Fallback summary shown when an automatic approval review times out before the action runs.",
  },
  summaryCompleted: {
    id: "localConversation.automaticApprovalReview.summary.completed",
    defaultMessage:
      "A carefully prompted reviewer agent reviewed this request.",
    description:
      "Fallback summary shown when an automatic approval review completes without a rationale.",
  },
  titleInProgress: {
    id: "localConversation.automaticApprovalReview.title.inProgress",
    defaultMessage: "Auto-reviewing",
    description:
      "Primary title shown while an automatic approval review is in progress.",
  },
  titleApproved: {
    id: "localConversation.automaticApprovalReview.title.approved",
    defaultMessage: "Auto-review approved",
    description:
      "Primary title shown when an automatic approval review approves an action.",
  },
  titleDenied: {
    id: "localConversation.automaticApprovalReview.title.denied",
    defaultMessage: "Auto-review denied",
    description:
      "Primary title shown when an automatic approval review denies an action.",
  },
  titleDeniedHighRisk: {
    id: "localConversation.automaticApprovalReview.title.deniedHighRisk",
    defaultMessage: "Auto-review denied high risk",
    description:
      "Primary title shown when an automatic approval review denies a high-risk action.",
  },
  titleTimedOut: {
    id: "localConversation.automaticApprovalReview.title.timedOut",
    defaultMessage: "Auto-review timed out",
    description:
      "Primary title shown when an automatic approval review times out.",
  },
  titleAborted: {
    id: "localConversation.automaticApprovalReview.title.aborted",
    defaultMessage: "Auto-review stopped",
    description:
      "Primary title shown when an automatic approval review is aborted.",
  },
  actionSummaryRequest: {
    id: "localConversation.automaticApprovalReview.actionSummary.request",
    defaultMessage: "Request",
    description:
      "Fallback action summary shown when an automatic approval review has no action payload.",
  },
};

/* ─── Types ─── */

export type ReviewStatus =
  | "inProgress"
  | "approved"
  | "denied"
  | "timedOut"
  | "aborted";
export type RiskLevel = "low" | "medium" | "high";
export interface ActionPayload {
  type: string;
  command?: string;
  program?: string;
  argv?: string[];
  files?: string[];
  target?: string;
  toolName?: string;
  connectorName?: string;
  server?: string;
  reason?: string;
}
export interface ReviewState {
  status: ReviewStatus;
  riskLevel?: RiskLevel;
  rationale?: string;
  actionPayload?: ActionPayload | null;
}

/* ─── Hooks ─── */

export function useInterval(callback: () => void, delay: number | null): void {
  const savedCallback = useEffectEvent(callback);
  React.useEffect(() => {
    if (delay == null) return;
    const id = window.setInterval(() => savedCallback(), delay);
    return () => window.clearInterval(id);
  }, [delay, savedCallback]);
}

/* ─── Helpers ─── */

export function getReviewTitle(intl: IntlShape, state: ReviewState): string {
  switch (state.status) {
    case "inProgress":
      return intl.formatMessage(messages.titleInProgress);
    case "approved":
      return intl.formatMessage(messages.titleApproved);
    case "denied":
      return state.riskLevel === "high"
        ? intl.formatMessage(messages.titleDeniedHighRisk)
        : intl.formatMessage(messages.titleDenied);
    case "timedOut":
      return intl.formatMessage(messages.titleTimedOut);
    case "aborted":
      return intl.formatMessage(messages.titleAborted);
  }
}
export function getReviewSummary(intl: IntlShape, state: ReviewState): string {
  if (state.rationale != null && state.rationale.trim().length > 0) {
    return state.rationale.trim();
  }
  switch (state.status) {
    case "inProgress":
      return intl.formatMessage(messages.summaryInProgress);
    case "aborted":
      return intl.formatMessage(messages.summaryAborted);
    case "timedOut":
      return intl.formatMessage(messages.summaryTimedOut);
    default:
      return intl.formatMessage(messages.summaryCompleted);
  }
}
export function getActionSummary(
  intl: IntlShape,
  payload: ActionPayload | null | undefined,
): string {
  if (payload == null) {
    return intl.formatMessage(messages.actionSummaryRequest);
  }
  switch (payload.type) {
    case "command":
      return payload.command ?? "";
    case "execve":
      return [payload.program, ...(payload.argv ?? [])].join(" ");
    case "applyPatch":
      return payload.files && payload.files.length === 1
        ? intl.formatMessage(messages.actionSummaryEditingFile, {
            file: payload.files[0],
          })
        : intl.formatMessage(messages.actionSummaryEditingFiles, {
            fileCount: payload.files?.length ?? 0,
          });
    case "networkAccess":
      return intl.formatMessage(messages.actionSummaryNetworkAccess, {
        target: payload.target ?? "",
      });
    case "mcpToolCall":
      return intl.formatMessage(messages.actionSummaryMcpToolCall, {
        toolName: payload.toolName ?? "",
        connector: payload.connectorName ?? payload.server ?? "",
      });
    case "requestPermissions":
      return payload.reason == null
        ? intl.formatMessage(messages.actionSummaryPermissionRequest)
        : intl.formatMessage(
            messages.actionSummaryPermissionRequestWithReason,
            {
              reason: payload.reason,
            },
          );
    default:
      return intl.formatMessage(messages.actionSummaryRequest);
  }
}

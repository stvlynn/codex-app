// Restored from ref/webview/assets/pull-request-checks-summary-D7bXjzVs.js
// PullRequestChecksSummary chunk restored from the Codex webview bundle.
import { useIntl } from "react-intl";
import { ClockIcon } from "../../shared/icons/clock-icon.tsx";
import { CheckCircleFilledIcon } from "../../shared/icons/check-circle-filled-icon.tsx";
import { XCircleFilledIcon } from "../../shared/icons/x-circle-filled-icon.tsx";
import {
  AutomationStatusRing,
  findAttachedHeartbeatAutomation as FindAttachedHeartbeatAutomation,
} from "../../shared/icons/get-attached-heartbeat-automation-for-thread";

export interface Check {
  name: string;
  status: string;
}

export type CiStatus = "failing" | "none" | "passing" | "pending";

export interface PullRequestChecksSummaryProps {
  checks: Check[];
  ciStatus: CiStatus;
}

// Export order must match the manifest: n, t
export function PullRequestChecksStatusLabel({
  ciStatus,
}: {
  ciStatus: CiStatus;
}): JSX.Element {
  const intl = useIntl();

  switch (ciStatus) {
    case "failing":
      return intl.formatMessage({
        id: "localConversation.pullRequest.actions.checksFailing",
        defaultMessage: "Checks failing",
        description: "Status row shown when pull request checks are failing",
      });
    case "none":
      return intl.formatMessage({
        id: "localConversation.pullRequest.actions.noCiChecks",
        defaultMessage: "No CI checks",
        description:
          "Status row shown when the pull request currently has no CI checks",
      });
    case "passing":
      return intl.formatMessage({
        id: "localConversation.pullRequest.actions.checksSuccessful",
        defaultMessage: "Checks successful",
        description: "Status row shown when pull request checks are passing",
      });
    case "pending":
      return intl.formatMessage({
        id: "localConversation.pullRequest.actions.checksPending",
        defaultMessage: "Checks pending",
        description:
          "Status row shown when pull request checks are still pending",
      });
  }
}

export function PullRequestChecksStatusIcon({
  checks,
  ciStatus,
}: PullRequestChecksSummaryProps): JSX.Element | null {
  if (checks.length === 0) {
    switch (ciStatus) {
      case "failing":
        return (
          <XCircleFilledIcon className="icon-sm shrink-0 text-token-charts-red" />
        );
      case "none":
        return <ClockIcon className="icon-sm shrink-0" />;
      case "passing":
        return (
          <CheckCircleFilledIcon className="icon-sm shrink-0 text-token-charts-green" />
        );
      case "pending":
        return (
          <AutomationStatusRing className="icon-sm shrink-0 text-token-charts-yellow" />
        );
    }
  }

  return ciStatus === "none" ? (
    <ClockIcon className="icon-sm shrink-0" />
  ) : (
    <FindAttachedHeartbeatAutomation checks={checks} />
  );
}

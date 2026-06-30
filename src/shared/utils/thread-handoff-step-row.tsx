// Restored from ref/webview/assets/thread-handoff-step-row-DiTyoHg3.js
// thread-handoff-step-row-DiTyoHg3 chunk restored from the Codex webview bundle.
import { useIntl, type IntlShape } from "boundaries/intl-messageformat";
import { ProgressStepRow } from "ui/progress-step-row";
interface ThreadHandoffStep {
  id: string;
  status: "pending" | "in-progress" | "completed" | "failed";
}
interface ThreadHandoffStepRowProps {
  compact?: boolean;
  direction?: "to-worktree" | "to-host-worktree" | "to-local";
  localBranch?: string;
  sourceBranch?: string;
  step: ThreadHandoffStep;
  worktreeBranch?: string;
}
export function ThreadHandoffStepRow({
  compact = false,
  direction,
  localBranch,
  sourceBranch,
  step,
  worktreeBranch,
}: ThreadHandoffStepRowProps) {
  const status = step.status;
  const label = getStepLabel(
    step.id,
    direction,
    localBranch,
    sourceBranch,
    worktreeBranch,
  );
  return (
    <ProgressStepRow compact={compact} status={status}>
      {label}
    </ProgressStepRow>
  );
}
function getStepLabel(
  stepId: string,
  direction: string | undefined,
  localBranch: string | undefined,
  sourceBranch: string | undefined,
  worktreeBranch: string | undefined,
): React.ReactNode {
  const intl = useIntl();
  if (stepId === "rolling-back-changes") {
    return (
      <>
        {intl.formatMessage({
          id: "localConversation.threadHandoff.step.rollingBackChanges",
          defaultMessage: "Rolling back changes",
          description:
            "Progress step shown after a thread handoff step fails while cleanup is still in progress",
        })}
      </>
    );
  }
  switch (stepId) {
    case "prepare-host-transfer":
      return (
        <>
          {intl.formatMessage({
            id: "localConversation.threadHandoff.step.prepareHostTransfer",
            defaultMessage: "Preparing files for transfer",
            description:
              "Progress step shown while preparing cross-host git and rollout artifacts",
          })}
        </>
      );
    case "transfer-host-artifacts":
      return (
        <>
          {intl.formatMessage({
            id: "localConversation.threadHandoff.step.transferHostArtifacts",
            defaultMessage: "Copying files to the destination host",
            description:
              "Progress step shown while copying cross-host git and rollout artifacts",
          })}
        </>
      );
    case "create-new-worktree":
      return (
        <>
          {intl.formatMessage({
            id: "localConversation.threadHandoff.step.createNewWorktree",
            defaultMessage: "Creating a new worktree",
            description:
              "Progress step shown while creating a new worktree during thread handoff",
          })}
        </>
      );
    case "reuse-existing-worktree":
      return (
        <>
          {intl.formatMessage({
            id: "localConversation.threadHandoff.step.reuseExistingWorktree",
            defaultMessage: "Reusing the existing worktree",
            description:
              "Progress step shown while reusing an existing worktree during thread handoff",
          })}
        </>
      );
    case "stash-source-changes":
      return (
        <>
          {intl.formatMessage({
            id: "localConversation.threadHandoff.step.stashSourceChanges",
            defaultMessage: "Stashing uncommitted changes",
            description:
              "Progress step shown while stashing source changes during thread handoff",
          })}
        </>
      );
    case "checkout-local-branch":
      return (
        <>
          {intl.formatMessage(
            {
              id: "localConversation.threadHandoff.step.checkoutLocalBranch",
              defaultMessage: "Checking out {branch} locally",
              description:
                "Progress step shown while checking out a branch locally during thread handoff",
            },
            {
              branch: localBranch ?? sourceBranch,
            },
          )}
        </>
      );
    case "stash-target-worktree-changes":
      return (
        <>
          {intl.formatMessage({
            id: "localConversation.threadHandoff.step.stashTargetWorktreeChanges",
            defaultMessage: "Stashing worktree changes",
            description:
              "Progress step shown while stashing pre-existing worktree changes during thread handoff",
          })}
        </>
      );
    case "checkout-worktree-branch":
      return (
        <>
          {intl.formatMessage(
            {
              id: "localConversation.threadHandoff.step.checkoutWorktreeBranch",
              defaultMessage: "Checking out {branch} in worktree",
              description:
                "Progress step shown while checking out a branch in the worktree during thread handoff",
            },
            {
              branch: worktreeBranch ?? sourceBranch,
            },
          )}
        </>
      );
    case "detach-worktree-branch":
      return (
        <>
          {intl.formatMessage({
            id: "localConversation.threadHandoff.step.detachWorktreeBranch",
            defaultMessage: "Detaching branch from worktree",
            description:
              "Progress step shown while detaching the worktree branch during handoff back to local",
          })}
        </>
      );
    case "apply-changes-to-worktree":
      return (
        <>
          {intl.formatMessage({
            id: "localConversation.threadHandoff.step.applyChangesToWorktree",
            defaultMessage: "Applying uncommitted changes to worktree",
            description:
              "Progress step shown while applying changes to the worktree during thread handoff",
          })}
        </>
      );
    case "apply-changes-to-local":
      return (
        <>
          {intl.formatMessage({
            id: "localConversation.threadHandoff.step.applyChangesToLocal",
            defaultMessage: "Applying uncommitted changes locally",
            description:
              "Progress step shown while applying changes locally during thread handoff",
          })}
        </>
      );
    case "switching-thread":
      if (direction === "to-worktree") {
        return (
          <>
            {intl.formatMessage({
              id: "localConversation.threadHandoff.step.moveThreadToWorktree",
              defaultMessage: "Moving chat to worktree",
              description:
                "Progress step shown while moving the thread to a worktree after the git handoff",
            })}
          </>
        );
      }
      if (direction === "to-host-worktree") {
        return (
          <>
            {intl.formatMessage({
              id: "localConversation.threadHandoff.step.moveThreadToHostWorktree",
              defaultMessage: "Moving chat to the destination worktree",
              description:
                "Progress step shown while moving the thread to a destination-host worktree after transfer",
            })}
          </>
        );
      }
      return (
        <>
          {intl.formatMessage({
            id: "localConversation.threadHandoff.step.moveThreadToLocal",
            defaultMessage: "Moving chat to local",
            description:
              "Progress step shown while moving the thread to local after the git handoff",
          })}
        </>
      );
    default:
      return null;
  }
}

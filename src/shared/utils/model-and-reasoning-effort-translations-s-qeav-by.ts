// Restored from ref/webview/assets/model-and-reasoning-effort-translations-sQEAV-BY.js
// Reasoning effort label translations component for model selection UI.

import { FormattedMessage } from "react-intl";
export type ReasoningEffort = "none" | "minimal" | "low" | "medium" | "high" | "xhigh" | "max";
export interface ReasoningEffortLabelProps {
  effort: ReasoningEffort;
}
export function ReasoningEffortLabel(props: ReasoningEffortLabelProps): JSX.Element {
  const {
    effort
  } = props;
  switch (effort) {
    case "none":
      return <FormattedMessage id="composer.mode.local.reasoning.none.label" defaultMessage="None" description="Reasoning effort label for a given model: none" />;
    case "minimal":
      return <FormattedMessage id="composer.mode.local.reasoning.minimal.label" defaultMessage="Minimal" description="Reasoning effort label for a given model: minimal" />;
    case "low":
      return <FormattedMessage id="composer.mode.local.reasoning.low.label" defaultMessage="Low" description="Reasoning effort label for a given model: low" />;
    case "medium":
      return <FormattedMessage id="composer.mode.local.reasoning.medium.label" defaultMessage="Medium" description="Reasoning effort label for a given model: medium" />;
    case "high":
      return <FormattedMessage id="composer.mode.local.reasoning.high.label" defaultMessage="High" description="Reasoning effort label for a given model: high" />;
    case "xhigh":
      return <FormattedMessage id="composer.mode.local.reasoning.xhigh.label" defaultMessage="Extra High" description="Reasoning effort label for a given model: extra high" />;
    case "max":
      return <FormattedMessage id="composer.mode.local.reasoning.max.label" defaultMessage="Max" description="Reasoning effort label for a given model: maximum" />;
    default:
      return null;
  }
}
// Restored from ref/webview/assets/mention-item-Cs3Au6lU.js
// mention-item-Cs3Au6lU chunk restored from the Codex webview bundle.
import { mentionMessages } from "./mention-messages";
export function getDefaultMentionLabels(): {
  browserUse: string;
  computerUse: string;
} {
  return {
    browserUse: mentionMessages.label.defaultMessage,
    computerUse: "Computer",
  };
}
export function createMentionLabels(intl: {
  formatMessage: (descriptor: { defaultMessage: string }) => string;
}): {
  browserUse: string;
  computerUse: string;
} {
  return {
    browserUse: intl.formatMessage({
      defaultMessage: "Browser",
    }),
    computerUse: intl.formatMessage({
      defaultMessage: "Computer",
    }),
  };
}

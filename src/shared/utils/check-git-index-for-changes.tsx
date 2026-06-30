// Restored from ref/webview/assets/check-git-index-for-changes-adW1BmYE.js
// CheckGitIndexForChanges chunk restored from the Codex webview bundle.

const EVENT_NAME = "codex-check-git-index-for-changes";

export function dispatchGitIndexCheck(): void {
  window.dispatchEvent(new CustomEvent(EVENT_NAME));
}

export function subscribeToGitIndexCheck(listener: () => void): () => void {
  window.addEventListener(EVENT_NAME, listener);
  return () => {
    window.removeEventListener(EVENT_NAME, listener);
  };
}

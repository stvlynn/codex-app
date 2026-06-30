// Restored from ref/webview/assets/set-pinned-thread-BrrghWPc.js
import { h as log, n as sendMessage } from "../boundaries/vscode-api";

// ------------------------------------------------------------------
// Set a single thread's pinned status
// ------------------------------------------------------------------

export async function setThreadPinned(
  threadId: string,
  pinned: boolean,
  beforeThreadId?: string,
): Promise<void> {
  await sendMessage("set-thread-pinned", {
    params:
      beforeThreadId === undefined
        ? { threadId, pinned }
        : { threadId, pinned, beforeThreadId },
  });
}

// ------------------------------------------------------------------
// Reorder pinned threads
// ------------------------------------------------------------------

export async function setPinnedThreadsOrder(
  threadIds: string[],
): Promise<void> {
  try {
    await sendMessage("set-pinned-threads-order", {
      params: { threadIds },
    });
  } catch (err) {
    log.error("Failed to set pinned thread order", {
      safe: {},
      sensitive: { error: err },
    });
  }
}

// Restored from ref/webview/assets/copy-to-clipboard-C9EKP1fU.js
// CopyToClipboard chunk restored from the Codex webview bundle.

export interface ClipboardWriteOptions {
  target?: {
    ownerDocument?: {
      defaultView?: {
        navigator?: Navigator;
      };
    };
  };
}

export type ClipboardContent = string | Record<string, string | Blob>;

/**
 * Copies content to the system clipboard using the Clipboard API.
 * Supports both plain text strings and rich content with MIME types.
 */
export function copyToClipboard(
  content: ClipboardContent,
  options?: ClipboardWriteOptions,
): Promise<boolean> {
  const { navigator } = options?.target?.ownerDocument?.defaultView ?? window;

  return new Promise((resolve, reject) => {
    if (!navigator?.clipboard) {
      reject(new Error("Clipboard API unavailable"));
      return;
    }
    try {
      if (
        typeof content !== "string" &&
        "write" in navigator.clipboard &&
        typeof ClipboardItem !== "undefined" &&
        "supports" in ClipboardItem
      ) {
        const clipboardItem = new ClipboardItem(
          Object.fromEntries(
            Object.entries(content).map(([mimeType, data]) => [
              mimeType,
              typeof data === "string"
                ? new Blob([data], { type: mimeType })
                : data,
            ]),
          ),
        );
        navigator.clipboard.write([clipboardItem]).then(
          () => resolve(true),
          () => {
            reject(new Error("Failed to copy to clipboard"));
          },
        );
      } else {
        const textContent =
          typeof content === "string" ? content : (content["text/plain"] ?? "");
        navigator.clipboard.writeText(textContent).then(
          () => resolve(true),
          () => {
            reject(new Error("Failed to copy to clipboard"));
          },
        );
      }
    } catch {
      reject(new Error("Failed to copy to clipboard"));
    }
  });
}

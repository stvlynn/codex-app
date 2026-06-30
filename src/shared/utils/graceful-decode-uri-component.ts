// Restored from ref/webview/assets/gracefulDecodeURIComponent-DByonkCa.js
// GracefulDecodeURIComponent chunk restored from the Codex webview bundle.

export function gracefulDecodeURIComponent(value: string): string {
  try {
    return decodeURIComponent(value.replace(/\+/g, " "));
  } catch {
    return value;
  }
}

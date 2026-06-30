// Restored from ref/webview/assets/send-open-file-request-DcwYnVp4.js
import { n as sendMessage } from "../boundaries/vscode-api";

// ------------------------------------------------------------------
// Types
// ------------------------------------------------------------------

export interface OpenFileRequest {
  filePath: string;
  line?: number;
  column?: number;
}

// ------------------------------------------------------------------
// Send open-file request to the VSCode extension host
// ------------------------------------------------------------------

export function sendOpenFileRequest(request: OpenFileRequest): void {
  sendMessage("open-file", { params: request });
}

// Restored from ref/webview/assets/dictation-error-message-D58vnHhR.js
// dictation-error-message-D58vnHhR chunk restored from the Codex webview bundle.
import { c } from "../boundaries/vscode-api";
import { i } from "../boundaries/intl-messageformat";
import { parseCodexApiError } from "../utils/codex-api-error";
export interface DictationErrorResult {
  message: string;
  canRetry: boolean;
}
export function getDictationErrorMessage(
  intl: {
    formatMessage: (message: { id: string; defaultMessage: string }) => string;
  },
  _errorType: string,
  error: unknown,
): DictationErrorResult {
  if (_errorType === "transcription") {
    if (error instanceof c) {
      if (
        (
          error as {
            status: number;
          }
        ).status === 429
      ) {
        const apiError = parseCodexApiError(error as unknown as string);
        if (apiError != null)
          return {
            message: apiError.message,
            canRetry: false,
          };
      }
      const errorMessage = (
        error as {
          message: string;
        }
      ).message.toLowerCase();
      if (
        (
          error as {
            status: number;
          }
        ).status === 0 ||
        errorMessage.includes("fetch failed") ||
        errorMessage.includes("failed to fetch") ||
        errorMessage.includes("network")
      )
        return {
          message: intl.formatMessage(messages.connectionError),
          canRetry: true,
        };
    }
    return {
      message: intl.formatMessage(messages.transcribeError),
      canRetry: true,
    };
  }
  let errorName: string | null = null;
  if (
    error instanceof Error &&
    ((errorName = error.name),
    typeof DOMException !== "undefined" &&
      error instanceof DOMException &&
      (errorName = error.name),
    errorName === "NotAllowedError" || errorName === "SecurityError")
  ) {
    return {
      message: intl.formatMessage(messages.microphonePermissionDenied),
      canRetry: false,
    };
  }
  if (
    errorName === "NotFoundError" ||
    errorName === "DevicesNotFoundError" ||
    errorName === "OverconstrainedError" ||
    errorName === "ConstraintNotSatisfiedError"
  ) {
    return {
      message: intl.formatMessage(messages.microphoneMissing),
      canRetry: false,
    };
  }
  if (errorName === "NotReadableError" || errorName === "TrackStartError") {
    return {
      message: intl.formatMessage(messages.microphoneUnavailable),
      canRetry: false,
    };
  }
  if (errorName === "NotSupportedError" || errorName === "TypeError") {
    return {
      message: intl.formatMessage(messages.unsupported),
      canRetry: false,
    };
  }
  return {
    message: intl.formatMessage(messages.startError),
    canRetry: false,
  };
}
const messages = i({
  connectionError: {
    id: "dictation.error.connection",
    defaultMessage: "Check your connection and try again",
    description:
      "Toast text shown when dictation audio transcription fails because of a connection problem",
  },
  microphoneMissing: {
    id: "dictation.error.microphoneMissing",
    defaultMessage: "Connect a microphone to use dictation",
    description:
      "Toast text shown when dictation cannot find an available microphone",
  },
  microphonePermissionDenied: {
    id: "dictation.error.microphonePermissionDenied",
    defaultMessage: "Allow microphone access to use dictation",
    description:
      "Toast text shown when dictation cannot start because microphone permission was denied",
  },
  microphoneUnavailable: {
    id: "dictation.error.microphoneUnavailable",
    defaultMessage: "Close other apps using the microphone",
    description:
      "Toast text shown when dictation cannot start because the microphone is unavailable",
  },
  startError: {
    id: "composer.dictation.startError",
    defaultMessage: "Unable to start dictation",
    description: "Toast text shown when dictation could not be started",
  },
  transcribeError: {
    id: "composer.dictation.transcribeError",
    defaultMessage: "Unable to transcribe audio",
    description: "Toast text shown when dictation audio transcription fails",
  },
  unsupported: {
    id: "dictation.error.unsupported",
    defaultMessage: "Dictation is not available on this device",
    description:
      "Toast text shown when dictation is not supported on the current device",
  },
});

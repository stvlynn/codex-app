// Restored from ref/webview/assets/global-dictation-orb-D5sxKQB_.js

import clsx from "clsx";
import {
  l as useIntl,
  s as FormattedMessage,
} from "../../boundaries/intl-messageformat";
import { Spinner } from "../../ui/ui/spinner-dh-bmwxtt.tsx";
import { RegenerateIcon } from "../../icons/regenerate-icon";
import { XIcon } from "../../icons/x-icon";
import { RECORDING_ORB_CLASS, type OrbStatus } from "./types";
export interface DictationOrbButtonProps {
  canRetryError: boolean;
  errorMessage: string | null;
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  status: OrbStatus;
  waveformCanvasRef: React.RefObject<HTMLCanvasElement | null>;
}
export function DictationOrbButton({
  canRetryError,
  errorMessage,
  onClick,
  status,
  waveformCanvasRef,
}: DictationOrbButtonProps): JSX.Element {
  const intl = useIntl();
  const isTranscribing = status === "transcribing";
  const isRetryableError = status === "error" && canRetryError;
  let ariaLabel: string;
  if (isRetryableError) {
    ariaLabel =
      errorMessage == null
        ? intl.formatMessage({
            id: "globalDictation.orb.retry",
            defaultMessage: "Retry dictation",
            description:
              "Accessible label for retrying system-wide dictation from the floating dictation orb",
          })
        : intl.formatMessage(
            {
              id: "globalDictation.orb.retryWithError",
              defaultMessage: "Retry dictation: {errorMessage}",
              description:
                "Accessible label for retrying system-wide dictation from the floating dictation orb after an error",
            },
            {
              errorMessage,
            },
          );
  } else if (status === "error") {
    ariaLabel =
      errorMessage == null
        ? intl.formatMessage({
            id: "globalDictation.orb.dismiss",
            defaultMessage: "Dismiss dictation",
            description:
              "Accessible label for dismissing a system-wide dictation error from the floating dictation orb",
          })
        : intl.formatMessage(
            {
              id: "globalDictation.orb.dismissWithError",
              defaultMessage: "Dismiss dictation: {errorMessage}",
              description:
                "Accessible label for dismissing a system-wide dictation error from the floating dictation orb after an error",
            },
            {
              errorMessage,
            },
          );
  } else if (isTranscribing) {
    ariaLabel = intl.formatMessage({
      id: "globalDictation.orb.transcribing",
      defaultMessage: "Transcribing",
      description:
        "Accessible label for the floating dictation orb while system-wide dictation is transcribing",
    });
  } else {
    ariaLabel = intl.formatMessage({
      id: "globalDictation.orb.stop",
      defaultMessage: "Stop dictation",
      description:
        "Accessible label for stopping system-wide dictation from the floating dictation orb",
    });
  }
  const className = clsx(
    "no-drag pointer-events-auto flex size-10 shrink-0 items-center justify-center rounded-full border border-white/25",
    status === "listening"
      ? clsx("cursor-interaction text-white", RECORDING_ORB_CLASS)
      : "bg-token-dropdown-background text-token-text-secondary",
    status === "error" && "cursor-interaction",
  );
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      className={className}
      disabled={isTranscribing}
      onClick={onClick}
    >
      {status === "listening" ? (
        <canvas
          ref={waveformCanvasRef}
          className="size-10 text-white"
          aria-hidden="true"
        />
      ) : null}
      {isTranscribing ? <Spinner className="icon-sm" /> : null}
      {isRetryableError ? <RegenerateIcon className="icon-sm" /> : null}
      {status === "error" && !canRetryError ? (
        <XIcon className="icon-sm" />
      ) : null}
      <span className="sr-only">
        {status === "listening" ? (
          <FormattedMessage
            id="globalDictation.orb.listening"
            defaultMessage="Listening"
            description="Status text for the floating dictation orb while system-wide dictation is listening"
          />
        ) : null}
        {isTranscribing ? (
          <FormattedMessage
            id="globalDictation.orb.transcribingStatus"
            defaultMessage="Transcribing"
            description="Status text for the floating dictation orb while system-wide dictation is transcribing"
          />
        ) : null}
        {status === "error" && errorMessage != null ? errorMessage : null}
      </span>
    </button>
  );
}

// Restored from ref/webview/assets/global-dictation-orb-D5sxKQB_.js

import { useEffect, useRef, useState, type MouseEvent } from "react";
import {
  f as dispatchMessage,
  p as useVsCodeApiMessage,
} from "../../boundaries/vscode-api";
import { l as useIntl } from "../../boundaries/intl-messageformat";
import { getDictationErrorMessage } from "../../utils/dictation-error-message";
import { DictationOrbButton } from "./orb-button";
import {
  retryDictationTranscription,
  startDictationRecording,
  stopDictationRecording,
} from "./recording";
import { useOrbWaveform } from "./use-waveform";
import { type GlobalDictationOrbProps, type OrbStatus } from "./types";
export {
  startDictationRecording,
  stopDictationRecording,
  retryDictationTranscription,
};
export type { GlobalDictationOrbProps, OrbStatus };
export function GlobalDictationOrb({
  cleanupEnabled,
  streamingEnabled,
  onActiveSessionIdChange,
  registerNativePetRenderer = true,
  onVisibilityChange,
}: GlobalDictationOrbProps): JSX.Element | null {
  const intl = useIntl();
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [status, setStatus] = useState<OrbStatus>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [canRetryError, setCanRetryError] = useState(false);
  const activeSessionIdRef = useRef<string | null>(null);
  const {
    waveformCanvasRef,
    startWaveformCapture,
    stopWaveformCapture,
    resetWaveformDisplay,
  } = useOrbWaveform({
    variant: "orb",
  });
  const handleError = (errorType: string, error: unknown): void => {
    const result = getDictationErrorMessage(intl, errorType, error);
    setErrorMessage(result.message);
    setCanRetryError(result.canRetry);
    setStatus("error");
  };
  const resetToIdle = (): void => {
    activeSessionIdRef.current = null;
    setActiveSessionId(null);
    onActiveSessionIdChange?.(null);
    setErrorMessage(null);
    setCanRetryError(false);
    setStatus("idle");
    onVisibilityChange?.(false);
  };
  useVsCodeApiMessage("global-dictation-idle", resetToIdle, []);
  const handleStart = (event: { sessionId: string }): void => {
    activeSessionIdRef.current = event.sessionId;
    setActiveSessionId(event.sessionId);
    onActiveSessionIdChange?.(event.sessionId);
    setErrorMessage(null);
    setCanRetryError(false);
    setStatus("listening");
    onVisibilityChange?.(true);
    startDictationRecording(
      event.sessionId,
      {
        startWaveformCapture,
        stopWaveformCapture,
        resetWaveformDisplay,
        onTranscriptionFailed: (error) => handleError("transcription", error),
      },
      cleanupEnabled,
      streamingEnabled,
    ).catch((error) => handleError("start", error));
  };
  useVsCodeApiMessage("global-dictation-start", handleStart, [
    cleanupEnabled,
    onActiveSessionIdChange,
    onVisibilityChange,
    resetWaveformDisplay,
    handleError,
    startWaveformCapture,
    stopWaveformCapture,
    streamingEnabled,
  ]);
  const handleStop = (event: { sessionId: string }): void => {
    setErrorMessage(null);
    setCanRetryError(false);
    setStatus("transcribing");
    stopDictationRecording(event.sessionId);
  };
  useVsCodeApiMessage("global-dictation-stop", handleStop, []);
  useEffect(() => {
    let isActive = true;
    if (registerNativePetRenderer) {
      queueMicrotask(() => {
        if (isActive) {
          dispatchMessage("global-dictation-pet-renderer-ready", {
            ready: true,
          });
        }
      });
    }
    return () => {
      isActive = false;
      const currentId = activeSessionIdRef.current;
      if (currentId != null) {
        stopDictationRecording(currentId);
      }
      onActiveSessionIdChange?.(null);
      onVisibilityChange?.(false);
      if (registerNativePetRenderer) {
        dispatchMessage("global-dictation-pet-renderer-ready", {
          ready: false,
        });
      }
    };
  }, [onActiveSessionIdChange, onVisibilityChange, registerNativePetRenderer]);
  const handleRetry = (): void => {
    if (activeSessionId == null) return;
    setErrorMessage(null);
    setCanRetryError(false);
    setStatus("transcribing");
    retryDictationTranscription(activeSessionId, cleanupEnabled).catch(
      (error) => handleError("transcription", error),
    );
  };
  const handleClick = (event: MouseEvent<HTMLButtonElement>): void => {
    event.stopPropagation();
    if (status === "listening" && activeSessionId != null) {
      dispatchMessage("global-dictation-stop-requested", {
        sessionId: activeSessionId,
      });
      return;
    }
    if (status === "error" && canRetryError) {
      handleRetry();
      return;
    }
    if (status === "error" && activeSessionId != null) {
      dispatchMessage("global-dictation-dismiss", {
        sessionId: activeSessionId,
      });
    }
  };
  if (status === "idle") {
    return null;
  }
  return (
    <DictationOrbButton
      canRetryError={canRetryError}
      errorMessage={errorMessage}
      onClick={handleClick}
      status={status}
      waveformCanvasRef={waveformCanvasRef}
    />
  );
}

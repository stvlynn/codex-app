// Restored from ref/webview/assets/global-dictation-orb-D5sxKQB_.js

import { n as rpc } from "../../../entities/host/rpc-app-services.ts";
import { f as dispatchMessage } from "../../boundaries/vscode-api";
import {
  cleanupTranscript,
  DictationOrchestrator,
  transcribeAudioFile,
} from "../../utils/transcribe-audio";
import { requestMicrophoneStream } from "../../utils/microphone-input";
import {
  MIN_RECORDING_DURATION_MS,
  type ActiveRecordingSession,
  type RecordingControls,
  type RetryableAudio,
} from "./types";
let currentSession: ActiveRecordingSession | null = null;
let pendingStartSessionId: string | null = null;
let pendingStopSessionId: string | null = null;
let retryableAudio: RetryableAudio | null = null;
let pendingRetrySessionId: string | null = null;
export async function startDictationRecording(
  sessionId: string,
  controls: RecordingControls,
  cleanupEnabled: boolean,
  streamingEnabled: boolean,
): Promise<void> {
  if (
    currentSession?.sessionId === sessionId ||
    pendingStartSessionId === sessionId
  ) {
    return;
  }
  retryableAudio = null;
  if (currentSession != null) {
    stopDictationRecording(currentSession.sessionId);
  }
  let stream: MediaStream | null = null;
  try {
    pendingStartSessionId = sessionId;
    await rpc.systemPermissions?.requestMicrophoneAccess().catch(() => {});
    stream = await requestMicrophoneStream({
      channelCount: 1,
    });
    controls.startWaveformCapture(stream);
    const recorder = new MediaRecorder(stream);
    const session: ActiveRecordingSession = {
      sessionId,
      recorder,
      stream,
      chunks: [],
      startedAtMs: Date.now(),
      isStopping: false,
      cleanupEnabled,
      pendingStreamingSession: null,
      streamingSession: null,
      controls,
    };
    recorder.addEventListener("dataavailable", (event) => {
      if (event.data.size > 0) {
        session.chunks.push(event.data);
      }
    });
    recorder.start();
    currentSession = session;
    if (pendingStartSessionId === sessionId) {
      pendingStartSessionId = null;
    }
    if (pendingStopSessionId === sessionId) {
      pendingStopSessionId = null;
      stopDictationRecording(sessionId);
    }
    if (streamingEnabled && !session.isStopping) {
      const streamingSession = new DictationOrchestrator();
      session.pendingStreamingSession = streamingSession;
      try {
        await streamingSession.start(stream);
        if (session.pendingStreamingSession !== streamingSession) {
          return;
        }
        session.pendingStreamingSession = null;
        if (currentSession === session && !session.isStopping) {
          session.streamingSession = streamingSession;
        } else {
          streamingSession.close();
        }
      } catch {
        if (session.pendingStreamingSession === streamingSession) {
          session.pendingStreamingSession = null;
          streamingSession.close();
        }
      }
    }
  } catch (error) {
    stream?.getTracks().forEach((track) => track.stop());
    controls.stopWaveformCapture();
    controls.resetWaveformDisplay();
    if (pendingStartSessionId === sessionId) {
      pendingStartSessionId = null;
    }
    if (pendingStopSessionId === sessionId) {
      pendingStopSessionId = null;
    }
    dispatchMessage("global-dictation-failed", {
      sessionId,
      stage: "recording",
    });
    throw error;
  }
}
export function stopDictationRecording(sessionId: string): void {
  const session = currentSession;
  if (session == null || session.sessionId !== sessionId) {
    pendingStopSessionId = sessionId;
    return;
  }
  if (session.isStopping) {
    return;
  }
  session.isStopping = true;
  session.pendingStreamingSession?.close();
  session.pendingStreamingSession = null;
  dispatchMessage("global-dictation-recording-stopped", {
    sessionId,
  });
  finalizeRecording(session);
}
async function finalizeRecording(
  session: ActiveRecordingSession,
): Promise<void> {
  let capturedAudio: RetryableAudio | null = null;
  try {
    try {
      await waitForRecorderStop(session.recorder);
    } finally {
      session.stream.getTracks().forEach((track) => track.stop());
      session.controls.stopWaveformCapture();
      session.controls.resetWaveformDisplay();
      if (currentSession === session) {
        currentSession = null;
      }
    }
    if (
      session.chunks.length === 0 ||
      Date.now() - session.startedAtMs < MIN_RECORDING_DURATION_MS
    ) {
      session.streamingSession?.close();
      dispatchMessage("global-dictation-completed", {
        sessionId: session.sessionId,
        text: "",
      });
      return;
    }
    capturedAudio = {
      sessionId: session.sessionId,
      audio: new Blob(session.chunks),
      onTranscriptionFailed: session.controls.onTranscriptionFailed,
    };
    await transcribeCapturedAudio(
      capturedAudio,
      session.cleanupEnabled,
      session.streamingSession,
    );
  } catch (error) {
    handleTranscriptionFailure(
      session.sessionId,
      session.controls.onTranscriptionFailed,
      error,
      capturedAudio,
    );
  }
}
export async function retryDictationTranscription(
  sessionId: string,
  cleanupEnabled: boolean,
): Promise<void> {
  if (pendingRetrySessionId === sessionId) {
    return;
  }
  const audio = retryableAudio;
  if (audio == null || audio.sessionId !== sessionId) {
    throw new Error("No dictation audio to retry");
  }
  pendingRetrySessionId = sessionId;
  try {
    await transcribeCapturedAudio(audio, cleanupEnabled);
  } catch (error) {
    handleTranscriptionFailure(
      sessionId,
      audio.onTranscriptionFailed,
      error,
      audio,
    );
    throw error;
  } finally {
    if (pendingRetrySessionId === sessionId) {
      pendingRetrySessionId = null;
    }
  }
}
async function transcribeCapturedAudio(
  audio: RetryableAudio,
  cleanupEnabled: boolean,
  streamingSession: DictationOrchestrator | null = null,
): Promise<void> {
  const transcript =
    streamingSession == null
      ? await transcribeAudioFile(audio.audio)
      : await finishStreamingTranscript(streamingSession, audio.audio);
  if (retryableAudio === audio) {
    retryableAudio = null;
  }
  dispatchMessage("global-dictation-completed", {
    sessionId: audio.sessionId,
    text: await cleanupTranscript({
      transcript,
      cleanupEnabled,
    }),
  });
}
async function finishStreamingTranscript(
  streamingSession: DictationOrchestrator,
  fallbackAudio: Blob,
): Promise<string> {
  try {
    const streamed = await streamingSession.finish();
    if (streamed.trim().length > 0) {
      return streamed;
    }
  } catch {}
  return transcribeAudioFile(fallbackAudio);
}
function handleTranscriptionFailure(
  sessionId: string,
  onTranscriptionFailed: (error: unknown) => void,
  error: unknown,
  capturedAudio: RetryableAudio | null,
): void {
  retryableAudio = capturedAudio;
  onTranscriptionFailed(error);
  dispatchMessage("global-dictation-failed", {
    sessionId,
    stage: "transcription",
  });
}
function waitForRecorderStop(recorder: MediaRecorder): Promise<void> {
  if (recorder.state === "inactive") {
    return Promise.resolve();
  }
  return new Promise((resolve) => {
    recorder.addEventListener("stop", () => resolve(), {
      once: true,
    });
    recorder.stop();
  });
}

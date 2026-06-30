// Restored from ref/webview/assets/global-dictation-orb-D5sxKQB_.js

export interface GlobalDictationOrbProps {
  cleanupEnabled: boolean;
  streamingEnabled: boolean;
  onActiveSessionIdChange?: (sessionId: string | null) => void;
  registerNativePetRenderer?: boolean;
  onVisibilityChange?: (visible: boolean) => void;
}
export type OrbStatus = "idle" | "listening" | "transcribing" | "error";
export interface RecordingControls {
  startWaveformCapture: (stream: MediaStream) => void;
  stopWaveformCapture: () => void;
  resetWaveformDisplay: () => void;
  onTranscriptionFailed: (error: unknown) => void;
}
export interface ActiveRecordingSession {
  sessionId: string;
  recorder: MediaRecorder;
  stream: MediaStream;
  chunks: Blob[];
  startedAtMs: number;
  isStopping: boolean;
  cleanupEnabled: boolean;
  pendingStreamingSession:
    | import("../transcribe-audio").DictationOrchestrator
    | null;
  streamingSession: import("../transcribe-audio").DictationOrchestrator | null;
  controls: RecordingControls;
}
export interface RetryableAudio {
  sessionId: string;
  audio: Blob;
  onTranscriptionFailed: (error: unknown) => void;
}
export const MIN_RECORDING_DURATION_MS = 250;
export const RECORDING_ORB_CLASS = "_recordingOrb_1csnm_1";

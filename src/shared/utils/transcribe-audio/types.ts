// Restored from ref/webview/assets/transcribe-audio-PV06sNq2.js
// TranscribeAudio types.

// ------------------------------------------------------------------
// Dictation events
// ------------------------------------------------------------------

export interface DictationEvent {
  type: string;
  sequence_no: number;
}
export interface SessionStartedEvent extends DictationEvent {
  type: "session.started";
  session: DictationSession;
}
export interface SessionUpdatedEvent extends DictationEvent {
  type: "session.updated";
  session: DictationSession;
}
export interface SpeechStartedEvent extends DictationEvent {
  type: "speech.started";
  utterance_id: string;
}
export interface SpeechStoppedEvent extends DictationEvent {
  type: "speech.stopped";
  utterance_id: string;
}
export interface TranscriptDeltaEvent extends DictationEvent {
  type: "transcript.delta";
  utterance_id: string;
  revision: number;
  text: string;
}
export interface TranscriptSegmentEvent extends DictationEvent {
  type: "transcript.segment";
  utterance_id: string;
  revision: number;
  text: string;
}
export interface TranscriptFinalEvent extends DictationEvent {
  type: "transcript.final";
  utterance_id: string;
  revision: number;
  text: string;
}
export interface TranscriptFailedEvent extends DictationEvent {
  type: "transcript.failed";
  utterance_id: string | null;
  error: {
    code: string;
    message: string;
    retryable: boolean;
  };
}
export interface SessionErrorEvent extends DictationEvent {
  type: "session.error";
  fatal: boolean;
  error: {
    code: string;
    message: string;
    retryable: boolean;
  };
}
export type DictationServerEvent =
  | SessionStartedEvent
  | SessionUpdatedEvent
  | SpeechStartedEvent
  | SpeechStoppedEvent
  | TranscriptDeltaEvent
  | TranscriptSegmentEvent
  | TranscriptFinalEvent
  | TranscriptFailedEvent
  | SessionErrorEvent;
export interface DictationSession {
  session_id: string;
  status: "active" | "closed";
  config: {
    provider_mode: "buffered" | "streaming_sse";
    transcript_delivery_mode: "final_only" | "segment" | "delta";
  };
}
export interface TranscriptState {
  orderedUtteranceIds: string[];
  finalTextByUtteranceId: Record<string, string>;
}

// ------------------------------------------------------------------
// Transcription options
// ------------------------------------------------------------------

export interface TranscribeAudioOptions {
  contentType?: string;
  filename?: string;
  language?: string;
}
export interface CleanupTranscriptOptions {
  transcript: string;
  surroundingText?: string | null;
  cleanupEnabled: boolean;
}

// ------------------------------------------------------------------
// Errors
// ------------------------------------------------------------------

export class DictationStreamingError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "DictationStreamingError";
  }
}

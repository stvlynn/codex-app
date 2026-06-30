// Restored from ref/webview/assets/transcribe-audio-PV06sNq2.js
// TranscribeAudio dictation streaming via WebSocket.
import { l } from "../../boundaries/vscode-api";
import { encodeBytesToBase64 } from "../../utils/base64";
import {
  DictationStreamingError,
  type DictationServerEvent,
  type DictationSession,
  type TranscriptState,
} from "./types";

// ------------------------------------------------------------------
// Constants
// ------------------------------------------------------------------

export const DICTATION_PROTOCOLS = ["codex-app", "dictation", "streaming"].join(
  "-",
);

const SESSION_START_TIMEOUT_MS = 10000;
const SESSION_FINISH_TIMEOUT_MS = 8000;
const MAX_BUFFER_SIZE_BYTES = 4194304;
const MAX_UTTERANCE_DURATION_MS = 30000;
const SESSION_TTL_MS = 300000;

// ------------------------------------------------------------------
// WebSocket client
// ------------------------------------------------------------------

class DictationWebSocketClient {
  private websocket: WebSocket | null = null;
  private pendingStartupAudioAppends: Array<{
    type: string;
    audio: string;
  }> | null = [];
  private finishPromise: Promise<void> | null = null;
  private resolveFinish: (() => void) | null = null;
  private rejectFinish: ((error: Error) => void) | null = null;
  private rejectConnectBeforeWebsocket: ((error: Error) => void) | null = null;
  private sessionClosed = false;
  private terminalError: Error | null = null;

  constructor(
    private readonly onEvent: (event: DictationServerEvent) => void,
  ) {}

  async connect(sampleRate: number): Promise<void> {
    this.terminalError = null;
    this.sessionClosed = false;

    const connectAbortPromise = new Promise<never>((_resolve, reject) => {
      this.rejectConnectBeforeWebsocket = reject;
    });

    let connectInfo: { websocketUrl: string; protocols: string | string[] };
    try {
      connectInfo = await Promise.race([
        fetchDictationConnectInfo(),
        connectAbortPromise,
      ]);
    } finally {
      this.rejectConnectBeforeWebsocket = null;
    }

    const { websocketUrl, protocols } = connectInfo;

    return new Promise((resolve, reject) => {
      const ws = new WebSocket(websocketUrl, protocols);
      this.websocket = ws;

      let sessionStarted = false;
      let hasResolved = false;
      let terminalError: Error | null = null;

      const resolveOnce = () => {
        if (!hasResolved) {
          hasResolved = true;
          resolve();
        }
      };

      const rejectOnce = (error: Error) => {
        if (!hasResolved) {
          hasResolved = true;
          reject(error);
        }
      };

      const timeoutId = window.setTimeout(() => {
        const timeoutError = new DictationStreamingError(
          "Dictation stream timed out before session.start completed.",
        );
        terminalError = timeoutError;
        ws.close();
        rejectOnce(timeoutError);
      }, SESSION_START_TIMEOUT_MS);

      ws.addEventListener(
        "open",
        () => {
          this.send(buildSessionStartMessage(sampleRate));
        },
        { once: true },
      );

      ws.addEventListener("message", (event) => {
        const parsed = parseDictationEvent(event.data);
        if (parsed == null) {
          const parseError = new DictationStreamingError(
            "Dictation stream returned an invalid event payload.",
          );
          terminalError = parseError;
          ws.close();
          rejectOnce(parseError);
          return;
        }

        this.onEvent(parsed);

        if (parsed.type === "session.started") {
          sessionStarted = true;
          window.clearTimeout(timeoutId);
          this.drainPendingStartupAudioAppends();
          resolveOnce();
          return;
        }

        if (
          parsed.type === "session.updated" &&
          parsed.session.status === "closed"
        ) {
          this.sessionClosed = true;
          ws.close();
          this.resolveFinish?.();
          return;
        }

        if (parsed.type === "transcript.failed") {
          const transcriptError = new DictationStreamingError(
            parsed.error.message,
          );
          terminalError = transcriptError;
          this.rejectFinish?.(transcriptError);
          rejectOnce(transcriptError);
          ws.close();
          return;
        }

        if (parsed.type === "session.error" && parsed.fatal) {
          const sessionError = new DictationStreamingError(
            parsed.error.message,
          );
          terminalError = sessionError;
          this.rejectFinish?.(sessionError);
          rejectOnce(sessionError);
          ws.close();
        }
      });

      ws.addEventListener(
        "error",
        () => {
          terminalError ??= new DictationStreamingError(
            "Dictation stream websocket failed.",
          );
        },
        { once: true },
      );

      ws.addEventListener(
        "close",
        (closeEvent) => {
          window.clearTimeout(timeoutId);
          this.websocket = null;

          const closeError =
            terminalError ?? buildCloseError(closeEvent, sessionStarted);

          if (this.finishPromise) {
            if (closeError && !this.sessionClosed) {
              this.rejectFinish?.(closeError);
            } else {
              this.resolveFinish?.();
            }
          } else if (closeError && !this.sessionClosed) {
            this.terminalError = closeError;
          }

          if (!sessionStarted && closeError) {
            rejectOnce(closeError);
          }

          this.finishPromise = null;
          this.resolveFinish = null;
          this.rejectFinish = null;
        },
        { once: true },
      );
    });
  }

  appendPCM16(pcmData: Uint8Array): void {
    const message = {
      type: "audio.append",
      audio: encodeBytesToBase64(pcmData),
    };

    if (!this.sessionClosed && this.pendingStartupAudioAppends != null) {
      this.pendingStartupAudioAppends.push(message);
      return;
    }

    this.send(message);
  }

  finish(): Promise<void> {
    if (!this.websocket) {
      return this.terminalError == null
        ? Promise.resolve()
        : Promise.reject(this.terminalError);
    }

    if (this.finishPromise) {
      return this.finishPromise;
    }

    this.finishPromise = new Promise<void>((resolve, reject) => {
      const timeoutId = window.setTimeout(() => {
        const timeoutError = new DictationStreamingError(
          "Dictation stream timed out while closing the session.",
        );
        this.websocket?.close();
        reject(timeoutError);
      }, SESSION_FINISH_TIMEOUT_MS);

      this.resolveFinish = () => {
        window.clearTimeout(timeoutId);
        resolve();
      };

      this.rejectFinish = (error: Error) => {
        window.clearTimeout(timeoutId);
        reject(error);
      };
    });

    this.send({ type: "audio.flush", reason: "client" });
    this.send({ type: "session.close" });

    return this.finishPromise;
  }

  close(): void {
    this.pendingStartupAudioAppends = null;
    this.rejectConnectBeforeWebsocket?.(
      new DictationStreamingError(
        "Dictation stream closed before websocket connection started.",
      ),
    );
    this.rejectConnectBeforeWebsocket = null;
    this.websocket?.close();
    this.websocket = null;
  }

  private drainPendingStartupAudioAppends(): void {
    const pending = this.pendingStartupAudioAppends ?? [];
    this.pendingStartupAudioAppends = null;
    for (const message of pending) {
      this.send(message);
    }
  }

  private send(message: unknown): void {
    if (this.websocket?.readyState === WebSocket.OPEN) {
      this.websocket.send(JSON.stringify(message));
    }
  }
}

// ------------------------------------------------------------------
// Audio capture + dictation orchestrator
// ------------------------------------------------------------------

export class DictationOrchestrator {
  private transcriptState: TranscriptState = createEmptyTranscriptState();
  private client = new DictationWebSocketClient((event) => {
    updateTranscriptState(this.transcriptState, event);
  });
  private audioContext: AudioContext | null = null;
  private source: MediaStreamAudioSourceNode | null = null;
  private processor: ScriptProcessorNode | null = null;

  async start(stream: MediaStream): Promise<void> {
    const AudioContextCtor = window.AudioContext;
    if (AudioContextCtor == null) {
      throw new DictationStreamingError(
        "AudioContext is not available for streaming dictation.",
      );
    }

    const ctx = new AudioContextCtor();
    this.audioContext = ctx;
    this.source = ctx.createMediaStreamSource(stream);
    this.processor = ctx.createScriptProcessor(2048, 1, 1);

    this.processor.onaudioprocess = (event) => {
      const channelData = event.inputBuffer.getChannelData(0);
      this.client.appendPCM16(floatToPCM16(channelData));
    };

    this.source.connect(this.processor);
    this.processor.connect(ctx.destination);

    await this.client.connect(ctx.sampleRate);
  }

  async finish(): Promise<string> {
    this.stopAudioCapture();
    await this.client.finish();
    return buildFinalTranscript(this.transcriptState);
  }

  close(): void {
    this.stopAudioCapture();
    this.client.close();
  }

  private stopAudioCapture(): void {
    this.processor?.disconnect();
    this.source?.disconnect();
    this.processor = null;
    this.source = null;
    this.audioContext?.close().catch(() => {});
    this.audioContext = null;
  }
}

// ------------------------------------------------------------------
// Helpers
// ------------------------------------------------------------------

async function fetchDictationConnectInfo(): Promise<{
  websocketUrl: string;
  protocols: string | string[];
}> {
  const response = await l
    .getInstance()
    .post("/codex/dictation-stream-connect-info", undefined);
  return response.body as {
    websocketUrl: string;
    protocols: string | string[];
  };
}

function buildSessionStartMessage(sampleRate: number): Record<string, unknown> {
  return {
    type: "session.start",
    config: {
      input_audio_format: "pcm16",
      sample_rate_hz: sampleRate,
      num_channels: 1,
      max_buffer_size_bytes: MAX_BUFFER_SIZE_BYTES,
      max_utterance_duration_ms: MAX_UTTERANCE_DURATION_MS,
      session_ttl_ms: SESSION_TTL_MS,
      provider_mode: "streaming_sse",
      transcript_delivery_mode: "final_only",
      vad: {
        type: "server_vad",
        threshold: 0.5,
        prefix_padding_ms: 300,
        silence_duration_ms: 500,
      },
    },
  };
}

function buildCloseError(
  event: CloseEvent,
  sessionStarted: boolean,
): DictationStreamingError | null {
  if (sessionStarted && event.code === 1000) {
    return null;
  }

  if (event.reason.length > 0) {
    return new DictationStreamingError(
      sessionStarted
        ? `Dictation stream closed with reason '${event.reason}' and code ${event.code}.`
        : `Dictation stream closed before session.start completed with reason '${event.reason}' and code ${event.code}.`,
    );
  }

  return new DictationStreamingError(
    sessionStarted
      ? `Dictation stream closed unexpectedly with code ${event.code}.`
      : `Dictation stream closed before session.start completed with code ${event.code}.`,
  );
}

function floatToPCM16(floatData: Float32Array): Uint8Array {
  const int16Data = new Int16Array(floatData.length);
  for (let i = 0; i < floatData.length; i++) {
    const clamped = Math.max(-1, Math.min(1, floatData[i] ?? 0));
    int16Data[i] = clamped < 0 ? clamped * 32768 : clamped * 32767;
  }
  return new Uint8Array(int16Data.buffer);
}

function createEmptyTranscriptState(): TranscriptState {
  return {
    orderedUtteranceIds: [],
    finalTextByUtteranceId: {},
  };
}

function updateTranscriptState(
  state: TranscriptState,
  event: DictationServerEvent,
): void {
  switch (event.type) {
    case "session.started":
    case "session.updated":
      return;
    case "speech.started":
    case "speech.stopped":
      ensureUtteranceExists(state, event.utterance_id);
      return;
    case "transcript.delta":
    case "transcript.segment":
      return;
    case "transcript.final":
      ensureUtteranceExists(state, event.utterance_id);
      state.finalTextByUtteranceId[event.utterance_id] = event.text;
      return;
    case "transcript.failed":
    case "session.error":
      return;
  }
}

function ensureUtteranceExists(
  state: TranscriptState,
  utteranceId: string,
): void {
  if (!(utteranceId in state.finalTextByUtteranceId)) {
    state.finalTextByUtteranceId[utteranceId] = "";
    state.orderedUtteranceIds.push(utteranceId);
  }
}

function buildFinalTranscript(state: TranscriptState): string {
  return state.orderedUtteranceIds
    .map((id) => state.finalTextByUtteranceId[id] ?? "")
    .filter(Boolean)
    .join(" ")
    .trim();
}

function parseDictationEvent(data: unknown): DictationServerEvent | null {
  if (typeof data !== "string") return null;
  try {
    const parsed = JSON.parse(data);
    // Simplified: in production this would use a full Zod schema
    return parsed as DictationServerEvent;
  } catch {
    return null;
  }
}

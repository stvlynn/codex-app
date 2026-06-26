// Restored from ref/webview/assets/transcribe-audio-PV06sNq2.js
// TranscribeAudio transcript cleanup via LLM.
import { l } from "../../boundaries/vscode-api";
import { Sn } from "../../boundaries/zod";
import { useSettingValue } from "../../utils/setting-storage";
import type { CleanupTranscriptOptions } from "./types";

// ------------------------------------------------------------------
// Constants
// ------------------------------------------------------------------

const DICTATION_CLEANUP_PROMPT =
  "Clean up dictation transcripts. Fix likely speech recognition mistakes, punctuation, capitalization, and formatting. Remove filler words and disfluencies when they do not add meaning. When the user clearly self-corrects or backtracks, keep the corrected intent. Use surrounding text only as context. Dictionary entries are canonical spellings, names, file paths, and code symbols; when the transcript likely refers to one, copy the dictionary entry exactly, including casing and punctuation. Preserve the user's meaning, wording, and flow unless a small cleanup makes the transcript more coherent. Do not answer the user or add new content. Return only the cleaned transcript.";

// ------------------------------------------------------------------
// Public API: transcript cleanup
// ------------------------------------------------------------------

export async function cleanupTranscript({
  transcript,
  surroundingText,
  cleanupEnabled,
}: CleanupTranscriptOptions): Promise<string> {
  const trimmed = transcript.trim();
  if (trimmed.length === 0) return "";
  if (!cleanupEnabled) return trimmed;

  try {
    const dictionary = await loadDictationDictionary();
    const cleaned = await cleanupTranscriptWithLLM({
      instructions: DICTATION_CLEANUP_PROMPT,
      input: buildCleanupPrompt({
        transcript: trimmed,
        surroundingText: surroundingText ?? null,
        dictionary,
      }),
    });
    return cleaned ?? trimmed;
  } catch {
    return trimmed;
  }
}

// ------------------------------------------------------------------
// LLM cleanup helpers
// ------------------------------------------------------------------

async function cleanupTranscriptWithLLM({
  instructions,
  input,
  model = "gpt-5.4-mini",
  preserveOutputWhitespace = false,
  signal,
}: {
  instructions: string;
  input: string;
  model?: string;
  preserveOutputWhitespace?: boolean;
  signal?: AbortSignal;
}): Promise<string | null> {
  const trimmedInput = input.trim();
  if (trimmedInput.length === 0) return null;

  const requestBody = {
    model,
    instructions,
    input: [
      {
        type: "message" as const,
        role: "user" as const,
        content: [
          {
            type: "input_text" as const,
            text: trimmedInput,
          },
        ],
      },
    ],
    tools: [],
    tool_choice: "none" as const,
    parallel_tool_calls: false,
    reasoning: { effort: "low" as const },
    store: false,
    stream: true,
    include: [],
  };

  return streamCleanupRequest(
    JSON.stringify(requestBody),
    preserveOutputWhitespace,
    signal,
  );
}

function streamCleanupRequest(
  body: string,
  preserveWhitespace: boolean,
  signal?: AbortSignal,
): Promise<string | null> {
  signal?.throwIfAborted();

  return new Promise((resolve, reject) => {
    const deltas: string[] = [];
    let completedText: string | null = null;
    let streamId: string | null = null;
    let isSettled = false;

    function settleResolve(value: string | null): void {
      if (isSettled) return;
      isSettled = true;
      signal?.removeEventListener("abort", onAbort);
      resolve(value);
    }

    function settleReject(error: Error): void {
      if (isSettled) return;
      isSettled = true;
      signal?.removeEventListener("abort", onAbort);
      if (streamId != null) {
        l.getInstance().cancelStream(streamId);
      }
      reject(error);
    }

    function onAbort(): void {
      settleReject(new DOMException("The operation was aborted", "AbortError"));
    }

    signal?.addEventListener("abort", onAbort, { once: true });

    streamId = l.getInstance().stream("POST", "/codex/responses", {
      body,
      headers: { [Sn]: "1" },
      onEvent: (event: { data: unknown }) => {
        const parsed = parseStreamEvent(event.data, preserveWhitespace);
        if (parsed.error != null) {
          settleReject(new Error(parsed.error));
          return;
        }
        if (parsed.delta != null) {
          deltas.push(parsed.delta);
        }
        if (parsed.completedText != null) {
          completedText = parsed.completedText;
        }
      },
      onError: (error: { error: string }) => {
        settleReject(new Error(error.error));
      },
      onComplete: () => {
        settleResolve(
          completedText ??
            (preserveWhitespace
              ? joinDeltaTextPreserveWhitespace(deltas)
              : joinDeltaText(deltas)),
        );
      },
    }) as string;
  });
}

function parseStreamEvent(
  data: unknown,
  preserveWhitespace: boolean,
): { delta: string | null; completedText: string | null; error: string | null } {
  if (typeof data !== "object" || data == null) {
    return { delta: null, completedText: null, error: null };
  }

  const event = data as Record<string, unknown>;
  const errorMessage = extractErrorMessage(event.error);

  if (errorMessage != null) {
    return { delta: null, completedText: null, error: errorMessage };
  }

  if (event.response != null) {
    return {
      delta: null,
      completedText: preserveWhitespace
        ? extractResponseTextPreserveWhitespace(event.response as { output?: Array<{ content?: Array<{ text?: string }> }> })
        : extractResponseText(event.response as { output?: Array<{ content?: Array<{ text?: string }> }> }, preserveWhitespace),
      error: null,
    };
  }

  if (event.type === "response.output_text.delta" && typeof event.delta === "string") {
    return { delta: event.delta, completedText: null, error: null };
  }

  if (event.type === "response.output_text.done" && typeof event.text === "string") {
    return { delta: null, completedText: event.text, error: null };
  }

  return { delta: null, completedText: null, error: null };
}

function extractErrorMessage(error: unknown): string | null {
  if (typeof error === "string") return error;
  return (error as { message?: string })?.message ?? null;
}

function extractResponseText(
  response: { output?: Array<{ content?: Array<{ text?: string }> }> },
  preserveWhitespace: boolean,
): string | null {
  const text = response.output
    ?.flatMap((item) => item.content ?? [])
    .map((item) => item.text?.trim() ?? "")
    .filter((t) => t.length > 0)
    .join(preserveWhitespace ? "\n" : " ")
    .trim();

  return text && text.length > 0 ? text : null;
}

function extractResponseTextPreserveWhitespace(
  response: { output?: Array<{ content?: Array<{ text?: string }> }> },
): string | null {
  const text = response.output
    ?.flatMap((item) => item.content ?? [])
    .flatMap((item) => (item.text == null ? [] : [item.text]));

  return text.length === 0 ? null : text.join("");
}

function joinDeltaText(deltas: string[]): string | null {
  const joined = deltas.join("").trim();
  return joined.length === 0 ? null : joined;
}

function joinDeltaTextPreserveWhitespace(deltas: string[]): string | null {
  return deltas.length === 0 ? null : deltas.join("");
}

// ------------------------------------------------------------------
// Prompt building
// ------------------------------------------------------------------

function buildCleanupPrompt({
  transcript,
  surroundingText,
  dictionary,
}: {
  transcript: string;
  surroundingText: string | null;
  dictionary: string[];
}): string {
  const contextSection = surroundingText?.trim().slice(0, 2000) ?? "";
  const contextPrefix =
    contextSection.length === 0
      ? ""
      : `Surrounding text:\n${contextSection}\n\n`;

  return `${contextPrefix}Dictionary (canonical entries; use exact spelling, casing, and punctuation when they match):\n${dictionary.length === 0 ? "(none)" : dictionary.join("\n")}\n\nTranscript:\n${transcript.slice(0, 4000)}`;
}

async function loadDictationDictionary(): Promise<string[]> {
  const raw = await useSettingValue<string | null>({
    key: "dictationDictionary",
    default: null,
  });
  if (!Array.isArray(raw)) return [];
  return (raw as string[])
    .map((item) => item.trim())
    .filter((item) => item.length > 0)
    .slice(0, 100);
}

// Restored from ref/webview/assets/transcribe-audio-PV06sNq2.js
// TranscribeAudio file transcription via HTTP.
import { l } from "../../boundaries/vscode-api";
import { Sn } from "../../boundaries/zod";
import { encodeBytesToBase64 } from "../../utils/base64";
import type { TranscribeAudioOptions } from "./types";

// ------------------------------------------------------------------
// Public API: file transcription
// ------------------------------------------------------------------

export async function transcribeAudioFile(
  blob: Blob,
  options: TranscribeAudioOptions = {},
): Promise<string> {
  const contentType =
    options.contentType ??
    (blob.type && blob.type.trim().length > 0 ? blob.type : "audio/webm");
  const extension = contentType.split(/[/;]/)[1] ?? "webm";
  const filename = sanitizeFilename(options.filename ?? `codex.${extension}`);
  const boundary = generateMultipartBoundary();
  const multipartBody = await buildMultipartBody({
    blob,
    boundary,
    filename,
    contentType,
    language: options.language,
  });
  const encodedBody = encodeBytesToBase64(multipartBody);

  const headers: Record<string, string> = {
    "Content-Type": `multipart/form-data; boundary=${boundary}`,
    [Sn]: "1",
  };

  const response = await l
    .getInstance()
    .post("/transcribe", encodedBody, headers);
  return (response.body as { text: string }).text;
}

// ------------------------------------------------------------------
// Helpers
// ------------------------------------------------------------------

function sanitizeFilename(filename: string): string {
  return filename.replace(/"/g, "");
}

function generateMultipartBoundary(): string {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? `----codex-transcribe-${crypto.randomUUID()}`
    : `----codex-transcribe-${Math.random().toString(36).slice(2)}`;
}

async function buildMultipartBody({
  blob,
  boundary,
  filename,
  contentType,
  language,
}: {
  blob: Blob;
  boundary: string;
  filename: string;
  contentType: string;
  language?: string;
}): Promise<Uint8Array> {
  const encoder = new TextEncoder();
  const parts: Uint8Array[] = [];
  const fileBytes = new Uint8Array(await blob.arrayBuffer());

  parts.push(encoder.encode(`--${boundary}\r\n`));
  parts.push(
    encoder.encode(
      `Content-Disposition: form-data; name="file"; filename="${filename}"\r\n`,
    ),
  );
  parts.push(encoder.encode(`Content-Type: ${contentType}\r\n\r\n`));
  parts.push(fileBytes);
  parts.push(encoder.encode("\r\n"));

  if (language) {
    parts.push(encoder.encode(`--${boundary}\r\n`));
    parts.push(
      encoder.encode('Content-Disposition: form-data; name="language"\r\n\r\n'),
    );
    parts.push(encoder.encode(`${language}\r\n`));
  }

  parts.push(encoder.encode(`--${boundary}--\r\n`));

  const totalLength = parts.reduce((sum, part) => sum + part.byteLength, 0);
  const result = new Uint8Array(totalLength);
  let offset = 0;
  for (const part of parts) {
    result.set(part, offset);
    offset += part.byteLength;
  }
  return result;
}

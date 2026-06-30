// Restored from ref/webview/assets/base64-B03SNoD9.js
/**
 * @provenance
 *   Restored from: /Users/stvlynn/code/codex-reverse/ref/webview/assets/base64-B03SNoD9.js
 *   Chunk: base64-B03SNoD9
 *   Classification: app-feature
 *   Domain: utils
 *   Semantic path: utils/base64.tsx
 */

const CHUNK_SIZE = 32768;

/**
 * Decodes a Base64 string to a UTF-8 string.
 */
export function decodeBase64(base64: string): string {
  return new TextDecoder().decode(decodeBase64ToBytes(base64));
}

/**
 * Encodes a UTF-8 string to a Base64 string.
 */
export function encodeBase64(text: string): string {
  return encodeBytesToBase64(new TextEncoder().encode(text));
}

/**
 * Decodes a Base64 string to a Uint8Array.
 */
export function decodeBase64ToBytes(base64: string): Uint8Array {
  const binary = atob(base64);
  return Uint8Array.from(binary, (char) => char.charCodeAt(0));
}

/**
 * Encodes a Uint8Array to a Base64 string.
 * Uses native `toBase64()` if available, otherwise falls back to `btoa`.
 */
export function encodeBytesToBase64(bytes: Uint8Array): string {
  if (
    "toBase64" in bytes &&
    typeof (bytes as Uint8Array & { toBase64?: () => string }).toBase64 ===
      "function"
  ) {
    return (bytes as Uint8Array & { toBase64: () => string }).toBase64();
  }

  let result = "";
  for (let i = 0; i < bytes.byteLength; i += CHUNK_SIZE) {
    result += String.fromCharCode(...bytes.subarray(i, i + CHUNK_SIZE));
  }
  return btoa(result);
}

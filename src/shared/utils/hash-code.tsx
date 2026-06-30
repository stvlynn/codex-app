// Restored from ref/webview/assets/hash-code-Yqiujxc9.js
/**
 * @provenance
 *   Restored from: /Users/stvlynn/code/codex-reverse/ref/webview/assets/hash-code-Yqiujxc9.js
 *   Chunk: hash-code-Yqiujxc9
 *   Classification: app-feature
 *   Domain: utils
 *   Semantic path: utils/hash-code.tsx
 */

const DJB2_INITIAL = 5381;
const DJB2_MULTIPLIER = 33;
const DJB2_MODULUS = 4294967296;

const FNV1A_64_INITIAL = 14695981039346656037n;
const FNV1A_64_MULTIPLIER = 1099511628211n;
const FNV1A_64_BITS = 64;

/**
 * Computes a DJB2 hash of a string and returns it as a base-36 string.
 * This is a fast, non-cryptographic hash suitable for simple checksums or identifiers.
 */
export function djb2Hash(input: string): string {
  let hash = DJB2_INITIAL;
  for (let i = 0; i < input.length; i += 1) {
    hash = (hash * DJB2_MULTIPLIER + input.charCodeAt(i)) % DJB2_MODULUS;
  }
  return hash.toString(36);
}

/**
 * Computes a 64-bit FNV-1a hash of a string and returns it as a 16-character hex string.
 * This provides a more robust non-cryptographic hash than DJB2.
 */
export function fnv1a64Hash(input: string): string {
  let hash = FNV1A_64_INITIAL;
  for (const char of input) {
    hash ^= BigInt(char.codePointAt(0) ?? 0);
    hash = BigInt.asUintN(FNV1A_64_BITS, hash * FNV1A_64_MULTIPLIER);
  }
  return hash.toString(16).padStart(16, "0").slice(0, 16);
}

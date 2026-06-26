// Restored from ref/webview/assets/chunk-XPW4576I-Bqa38NHl.js
//
// TYPED BOUNDARY FACADE for js-yaml (YAML parser / dumper).
// This is a bundled vendored library consumed by local app code.
// Semantic names inferred from the bundled source.
/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Load a single YAML document from a string.
 * @param input - YAML string to parse
 * @param iterator - Optional callback invoked for each document (when loadAll is used)
 * @param options - Parser options
 * @returns Parsed JavaScript value
 */
export declare const load: (
  input: string,
  iterator?: (doc: unknown) => void,
  options?: Record<string, unknown>,
) => any;

/**
 * js-yaml Schema / Type constructor used for custom type definitions.
 */
export declare const Schema: any;

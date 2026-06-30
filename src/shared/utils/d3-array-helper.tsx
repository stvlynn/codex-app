// Restored from ref/webview/assets/array-hqvMvHot.js
// Array chunk restored from the Codex webview bundle.
Array.prototype.slice;
export function array(_array) {
  return typeof _array == "object" && "length" in _array
    ? _array
    : Array.from(_array);
}

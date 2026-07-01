export type ChunkRule = {
  package: string;
  /** When the chunk has a default export — name to use if the local alias is unknown. */
  defaultName?: string;
  /** When `true`, *every* specifier from this chunk is a named import. */
  namedOnly?: boolean;
};

/**
 * Known npm chunks by basename. A chunk path like `./clsx-DDuZWq6Y.js`
 * gets its basename stripped of the 6–12-char hash suffix; the result is
 * looked up here. High confidence — the bundler names chunks after the
 * package's entry module.
 */
export const CHUNK_NAME_REGISTRY: Record<string, ChunkRule> = {
  clsx: { package: "clsx", defaultName: "clsx" },
  classnames: { package: "classnames", defaultName: "classnames" },
  tslib: { package: "tslib", namedOnly: true },
  // Some bundlers emit `tslib.es6-HASH.js` as the chunk name.
  "tslib.es6": { package: "tslib", namedOnly: true },
  react: { package: "react", defaultName: "React" },
  "react-dom": { package: "react-dom", defaultName: "ReactDOM" },
  "jsx-runtime": { package: "react/jsx-runtime", namedOnly: true },
  "jsx-dev-runtime": { package: "react/jsx-dev-runtime", namedOnly: true },
  // @dnd-kit/* chunks usually ship as `core.esm`, `sortable.esm`, `utilities.esm`.
  "core.esm": { package: "@dnd-kit/core", namedOnly: true },
  "sortable.esm": { package: "@dnd-kit/sortable", namedOnly: true },
  "utilities.esm": { package: "@dnd-kit/utilities", namedOnly: true },
  // framer-motion chunks
  AnimatePresence: { package: "framer-motion", namedOnly: true },
  proxy: { package: "framer-motion", namedOnly: true },
  // react-intl
  "react-intl": { package: "react-intl", namedOnly: true },
  // markdown / parsers
  "marked.esm": { package: "marked", namedOnly: true },
  marked: { package: "marked", namedOnly: true },
  // Mermaid and search vendor chunks surfaced in Codex.app webview bundles.
  fuse: { package: "fuse.js", defaultName: "Fuse" },
  "rough.esm": { package: "roughjs", defaultName: "rough" },
  "cytoscape.esm": { package: "cytoscape", defaultName: "cytoscape" },
  // floating-ui — the common chunk basenames are dot-delimited.
  "floating-ui.react-dom": {
    package: "@floating-ui/react-dom",
    namedOnly: true,
  },
  "floating-ui.dom": { package: "@floating-ui/dom", namedOnly: true },
  "floating-ui.core": { package: "@floating-ui/core", namedOnly: true },
  "floating-ui.utils": { package: "@floating-ui/utils", namedOnly: true },
  "floating-ui.react": { package: "@floating-ui/react", namedOnly: true },
  // Statsig SDKs
  statsig: { package: "@statsig/js-client", namedOnly: true },
  // analytics.js / segment
  "ajs-destination": {
    package: "@segment/analytics.js-integration",
    namedOnly: true,
  },

  // Small standalone npm utilities surfaced as single chunks in Codex.app bundles.
  ccount: { package: "ccount", namedOnly: true },
  katex: { package: "katex", defaultName: "katex" },
  v4: { package: "uuid", namedOnly: true },
  queryOptions: { package: "@tanstack/react-query", namedOnly: true },

  // d3-path is split as its own chunk; the consumer uses the default path constructor.
  path: { package: "d3-path", defaultName: "path" },
};

/**
 * Extract the chunk basename from an import path.
 *  `../clsx-DDuZWq6Y.js`   →  `clsx`
 *  `./jsx-runtime-X.js`    →  `jsx-runtime`
 *  `./shared`              →  `shared`
 *  `./button-bq66r8jD.js`  →  `button`
 */
export function extractChunkBasename(source: string): string | null {
  if (!source) return null;
  // Skip bare specifiers (already an npm import).
  if (!source.startsWith(".") && !source.startsWith("/")) return null;
  // Strip last path segment.
  const segments = source.split("/");
  let last = segments[segments.length - 1] ?? "";
  // Strip extension.
  last = last.replace(/\.[mc]?[jt]sx?$/i, "");
  // Strip Rollup/Vite hash suffix.
  //
  // Vite/Rolldown defaults to an 8-char base64url-ish hash (`[A-Za-z0-9_-]{8}`)
  // at the very end. We anchor to *exactly* 8 chars so that multi-word chunk
  // names like `react-dom-De86Q4ix` and `floating-ui.react-dom-n8i6eMZZ` are
  // stripped to `react-dom` and `floating-ui.react-dom` respectively, rather
  // than greedily eating the `-dom-XXXXXXXX` tail and collapsing them to
  // `react` / `floating-ui.react`.
  //
  // Slightly longer hashes (10/12 chars) used by older Vite configs are also
  // covered as a fallback, but only if the 8-char strip didn't already match.
  const original = last;
  last = last.replace(/-[A-Za-z0-9_-]{8}$/u, "");
  if (last === original) {
    last = last.replace(/-[A-Za-z0-9_-]{10,12}$/u, "");
  }
  return last || null;
}

#!/usr/bin/env bun
import * as fs from "node:fs";
import * as path from "node:path";
import { parseArgs } from "node:util";
import * as parser from "@babel/parser";
import babelTraverse from "@babel/traverse";
import babelGenerator from "@babel/generator";
import * as t from "@babel/types";
import { applyRenames } from "./apply.ts";
import { extractSymbols, type SymbolEntry } from "./extract.ts";
import { formatPath } from "./format.ts";
import { polish } from "./polish.ts";
import { findRenames } from "./smart-rename.ts";
import { JS_GLOBALS } from "./chunk-classification.ts";
import { Progress } from "./progress.ts";

const traverse = ((
  babelTraverse as unknown as { default?: typeof babelTraverse }
).default ?? babelTraverse) as typeof babelTraverse;
const generate = ((
  babelGenerator as unknown as { default?: typeof babelGenerator }
).default ?? babelGenerator) as typeof babelGenerator;

const PARSER_PLUGINS: parser.ParserPlugin[] = [
  "jsx",
  "typescript",
  "classProperties",
  "classPrivateProperties",
  "classPrivateMethods",
  "dynamicImport",
  "importMeta",
  "objectRestSpread",
  "topLevelAwait",
];

type ManifestSpecifier = {
  imported: string;
  local: string;
  kind: "named" | "default" | "namespace";
};

type ManifestImport = {
  source: string;
  target: string;
  kind: "local" | "npm-leaf" | "external" | "oversized-local";
  npmPackage?: string;
  specifiers: ManifestSpecifier[];
};

type ManifestExport = {
  exported: string;
  local: string;
  kind: string;
};

type ManifestFile = {
  path: string;
  basename: string;
  kind: "local" | "npm-leaf" | "external" | "oversized-local";
  depth?: number;
  lineCount?: number;
  imports: ManifestImport[];
  exports: ManifestExport[];
  stages?: Record<string, boolean>;
};

type Manifest = {
  files: Record<string, ManifestFile>;
  rootDir?: string;
  targetDir: string;
};

type LedgerSymbol = Partial<SymbolEntry> & {
  importedFrom?: { target: string; imported: string } | null;
  isExport?: boolean;
  exportedAs?: string;
  originalName?: string;
  restoredName?: string | null;
  id: string;
  kind: string;
  referenceCount: number;
  declStart: number;
  declEnd: number;
};

type LedgerFile = {
  symbols: LedgerSymbol[];
};

type Ledger = {
  files: Record<string, LedgerFile>;
};

type RestoreReportFile = {
  basename: string;
  source: string;
  checkpointOutput: string;
  targetCheckpointOutput?: string;
  symbols: number;
  renames: number;
  smartRenames: number;
  fallbackRenames: number;
  importRenames: number;
  exportRenames: number;
  ignoredRenames: number;
  needsAgentRewrite: true;
};

type RestoreReport = {
  target: string;
  files: RestoreReportFile[];
};

const USAGE =
  "Usage: bun scripts/auto-restore-full.ts --target restored " +
  "[--manifest restored/.deobfuscate-javascript/_full/manifest.json] " +
  "[--ledger restored/.deobfuscate-javascript/_full/ledger.json] " +
  "[--checkpoint-dir dir] [--write-target-checkpoints] [--resume] [--format]";

const SHORT_ALLOWLIST = new Set([
  "as",
  "at",
  "be",
  "bg",
  "by",
  "do",
  "el",
  "fs",
  "id",
  "if",
  "in",
  "is",
  "js",
  "key",
  "no",
  "of",
  "on",
  "or",
  "os",
  "to",
  "tx",
  "ui",
]);

const JSX_INTRINSIC_TAGS = new Set([
  "a",
  "abbr",
  "address",
  "area",
  "article",
  "aside",
  "audio",
  "b",
  "base",
  "bdi",
  "bdo",
  "blockquote",
  "body",
  "br",
  "button",
  "canvas",
  "caption",
  "circle",
  "cite",
  "clipPath",
  "code",
  "col",
  "colgroup",
  "data",
  "datalist",
  "dd",
  "defs",
  "del",
  "details",
  "dfn",
  "dialog",
  "div",
  "dl",
  "dt",
  "ellipse",
  "em",
  "embed",
  "fieldset",
  "figcaption",
  "figure",
  "filter",
  "footer",
  "foreignObject",
  "form",
  "g",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "head",
  "header",
  "hgroup",
  "hr",
  "html",
  "i",
  "iframe",
  "image",
  "img",
  "input",
  "kbd",
  "label",
  "legend",
  "li",
  "line",
  "linearGradient",
  "link",
  "main",
  "map",
  "mark",
  "mask",
  "menu",
  "meta",
  "meter",
  "nav",
  "noscript",
  "object",
  "ol",
  "optgroup",
  "option",
  "output",
  "p",
  "path",
  "pattern",
  "picture",
  "polygon",
  "polyline",
  "pre",
  "progress",
  "q",
  "radialGradient",
  "rect",
  "rp",
  "rt",
  "ruby",
  "s",
  "samp",
  "script",
  "search",
  "section",
  "select",
  "small",
  "source",
  "span",
  "stop",
  "strong",
  "style",
  "sub",
  "summary",
  "sup",
  "svg",
  "table",
  "tbody",
  "td",
  "template",
  "textarea",
  "text",
  "tfoot",
  "th",
  "thead",
  "time",
  "title",
  "tr",
  "track",
  "tspan",
  "u",
  "ul",
  "use",
  "var",
  "video",
  "wbr",
]);

const KNOWN_EXPORTS: Record<string, Record<string, string>> = {
  "app-shell-JLpboL12": {
    a: "sidebarCollapsedSignal",
    c: "AppUpdateButton",
    i: "sidebarHoverSignal",
    n: "useWindowsMenuBarVisible",
    o: "SidebarExpandedIcon",
    r: "SidebarToggleButton",
    s: "SidebarCollapsedIcon",
    t: "AppShell",
  },
  "app-shell-panel-animation-C6SMnz6V": {
    a: "useMotionValueState",
    i: "useCombinedMotionValue",
    n: "PanelResizeHandle",
    o: "useMotionValueEvent",
    r: "useMotionTransform",
    t: "useAnimatedPanelState",
  },
  "app-shell-bottom-panel-scroll-sync-6LSVEVV8": {
    t: "useAppShellBottomPanelScrollSync",
  },
  "app-shell-tab-controller-B2eCi4Le": {
    a: "createAppShellTabController",
    i: "threadSidePanelTabKind",
    n: "createTabPanelController",
    r: "createAppShellTabId",
    t: "useAppShellTabController",
  },
  "browser-sidebar-manager-ivre5jEI": {
    t: "browserSidebarManager",
  },
  "button-bq66r8jD": {
    n: "buttonRadiusClassNames",
    t: "Button",
  },
  "chunk-Bj-mKKzh": {
    a: "runtimeRequire",
    i: "copyDefaultExports",
    n: "createLazyValue",
    o: "toCommonJS",
    r: "createExportObject",
    s: "toESModule",
    t: "createCommonJSModule",
  },
  "command-keybindings-CvjN6DDf": {
    a: "isModifierKey",
    i: "formatCommandKeybinding",
    n: "modifierKeyLabels",
    o: "shortcutTokenLabels",
    r: "parseCommandShortcut",
    s: "formatShortcutTokens",
    t: "commandShortcutLabels",
  },
  "download-Cf0FyA1Y": { t: "DownloadIcon" },
  "expand-BVUB1pRY": { n: "CollapseIcon", t: "ExpandIcon" },
  "arrow-left-NB8jxLlJ": { t: "ArrowLeftIcon" },
  "info-B8KL--OU": { t: "InfoIcon" },
  "x-DMqExXY8": { t: "XIcon" },
  "check-md-I6RRy8DL": { t: "CheckIcon" },
  "chevron-right-DcOUsgCQ": { t: "ChevronRightIcon" },
  "homepage-logo-Cefynusy": { t: "HomepageLogo" },
  "data-url-from-svg-D5V7WfjE": { t: "dataUrlFromSvg" },
  "get-resize-observer-entry-size-mwySqXGV": {
    t: "getResizeObserverEntrySize",
  },
  "image-preview-shortcuts-KUvoZhoW": {
    a: "registerImagePreviewShortcut",
    r: "imagePreviewShortcutReducer",
    t: "useImagePreviewShortcuts",
  },
  "keyboard-modifier-state-PdQRQ-ed": {
    a: "isKeyboardModifierActive",
    i: "keyboardModifierState",
    n: "getKeyboardModifierSnapshot",
    r: "subscribeKeyboardModifierState",
    t: "useKeyboardModifierState",
  },
  "loading-page-DBwzKObk": {
    n: "LoadingPageSkeleton",
    t: "LoadingPage",
  },
  "modal-controller-state-DPULK8bl": {
    i: "modalControllerInitialState",
    n: "modalControllerState",
    r: "resetModalControllerState",
    t: "setModalControllerState",
  },
  "product-logger-CdHJrfqL": {
    n: "productLogger",
    r: "recordProductEvent",
    t: "logProductEvent",
  },
  "route-scope-BpEoGCxV": {
    n: "createRouteState",
    r: "getRouteConversationKey",
    t: "RouteScope",
  },
  "run-command-DVjMKoR7": {
    a: "runCommandAction",
    i: "runCommandResult",
    n: "runCommandOptions",
    r: "runCommand",
    t: "useRunCommand",
  },
  "score-query-match-BVCuhDNS": { t: "scoreQueryMatch" },
  "spinner-D37df5tU": {
    n: "SpinnerSize",
    r: "SpinnerIcon",
    t: "Spinner",
  },
  "thread-side-panel-browser-tab-state-PqkmuSww": {
    i: "browserTabInitialState",
    n: "browserTabState",
    r: "resetBrowserTabState",
    t: "useBrowserTabState",
  },
  "tooltip-DzyyaBl-": {
    n: "TooltipContent",
    r: "TooltipRoot",
    t: "Tooltip",
  },
  "tooltip-dismiss-DFX6aZnQ": {
    n: "dismissTooltip",
    t: "useTooltipDismiss",
  },
  "use-merged-ref-DVMlCgDR": { t: "useMergedRef" },
  "use-os-info-DRsIehae": { n: "osInfoQuery", t: "useOsInfo" },
  "use-platform-ByMJlQVq": { t: "usePlatform" },
  "use-resize-observer-DyNosLxo": {
    a: "resizeObserverState",
    i: "useResizeObserverEntry",
    n: "useResizeObserver",
    r: "useResizeObserverSize",
    t: "createResizeObserver",
  },
  "use-stable-callback-D_6XYV-7": { t: "useStableCallback" },
  "use-window-controls-safe-area-j_2OHg07": {
    t: "useWindowControlsSafeArea",
  },
  "v4-Bk0goSq-": { t: "uuidV4" },
  "window-zoom-context-BgcP82Wr": {
    n: "useWindowZoom",
    t: "WindowZoomContext",
  },
  "with-window-C7Mmo_xd": { t: "withWindow" },
};

function isCryptic(name: string): boolean {
  return (
    /^(?:_0x[0-9a-fA-F]+|[a-zA-Z_]\d*|[a-zA-Z]{1,2})$/.test(name) &&
    !SHORT_ALLOWLIST.has(name)
  );
}

function stripHashSuffix(basename: string): string {
  // Anchor to Vite/Rolldown's 8-char base64url hash first so multi-word chunk
  // names survive (`app-shell-D1abc234` → `app-shell`, not `app`). The greedy
  // `{6,16}` we used before ate the `-shell-XXXXXXXX` tail because the char
  // class includes `-`. Fall back to 10–12-char hashes only if 8 didn't match.
  const stripped = basename.replace(/-[A-Za-z0-9_-]{8}$/u, "");
  if (stripped !== basename) return stripped;
  return basename.replace(/-[A-Za-z0-9_-]{10,12}$/u, "");
}

function words(value: string): string[] {
  return value
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .split(/[^A-Za-z0-9]+/)
    .filter(Boolean);
}

function pascalCase(value: string): string {
  return words(value)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join("");
}

function camelCase(value: string): string {
  const pascal = pascalCase(value);
  return pascal.charAt(0).toLowerCase() + pascal.slice(1);
}

function safeName(value: string): string {
  const cleaned = value.replace(/[^A-Za-z0-9_$]+/g, "_");
  if (!cleaned) return "restoredExport";
  return /^[0-9]/.test(cleaned) ? `_${cleaned}` : cleaned;
}

function aliasLabel(alias: string): string {
  if (alias === "$") return "Dollar";
  if (alias === "_") return "Underscore";
  return pascalCase(alias) || "Value";
}

function fileStem(basename: string): string {
  return stripHashSuffix(basename);
}

/** Avoid emitting a name that collides with a JS global (`Array`, `Map`, …) —
 * the collision-safe applier underscore-prefixes those (`Array` → `_Array`),
 * which is exactly the mechanical residue we're trying to eliminate. */
function avoidJsGlobal(name: string): string {
  if (!JS_GLOBALS.has(name)) return name;
  return /^[A-Z]/.test(name) ? `${name}Component` : `${name}Value`;
}

export function inferSingleExportName(
  basename: string,
  source: string,
): string {
  const stem = fileStem(basename);
  if (/^use-/.test(stem)) return camelCase(stem);
  if (/^(?:get|set|create|parse|format|score|data)-/.test(stem))
    return camelCase(stem);
  if (
    /(?:jsx|jsxs)\(\s*[`'"]svg[`'"]/.test(source) ||
    /\bviewBox\s*:/.test(source)
  ) {
    return `${pascalCase(stem)}Icon`;
  }
  // PascalCase only when the export is actually a component/class — otherwise a
  // plain utility (`array-XXXX`) would pascal-case onto a global (`Array`) and
  // get underscore-prefixed. Default utilities to camelCase.
  const looksComponentOrClass =
    /\b(?:jsx|jsxs|jsxDEV|createElement)\b/.test(source) ||
    /<[A-Z][A-Za-z0-9]*[\s/>]/.test(source) ||
    /\bclass[\s{]/.test(source); // `class Foo`, `class {`, `class extends`
  const name = looksComponentOrClass ? pascalCase(stem) : camelCase(stem);
  return avoidJsGlobal(name);
}

function inferExportNames(
  basename: string,
  file: ManifestFile,
  source: string,
): Record<string, string> {
  const known = KNOWN_EXPORTS[basename] ?? {};
  const out: Record<string, string> = {};
  const stem = fileStem(basename);
  const camelStem = camelCase(stem) || "restored";
  const pascalStem = pascalCase(stem) || "Restored";

  for (const item of file.exports) {
    const knownName = known[item.exported] ?? known[item.local];
    if (knownName) {
      out[item.exported] = knownName;
      continue;
    }
    if (file.exports.length === 1) {
      out[item.exported] = inferSingleExportName(basename, source);
      continue;
    }
    const label = aliasLabel(item.exported);
    if (/^[A-Z]/.test(item.local) && item.local.length > 2) {
      out[item.exported] = `${pascalStem}${label}`;
    } else if (stem.endsWith("-state")) {
      out[item.exported] = `${camelStem}${label}State`;
    } else {
      out[item.exported] = `${camelStem}${label}`;
    }
  }
  return out;
}

function parseSource(source: string): t.File {
  return parser.parse(source, {
    sourceType: "unambiguous",
    errorRecovery: true,
    allowImportExportEverywhere: true,
    allowReturnOutsideFunction: true,
    allowAwaitOutsideFunction: true,
    allowUndeclaredExports: true,
    plugins: PARSER_PLUGINS,
  });
}

function print(ast: t.File): string {
  const code = generate(ast, {
    compact: false,
    concise: false,
    jsescOption: { minimal: true },
  }).code;
  return code.endsWith("\n") ? code : `${code}\n`;
}

function importBasename(source: string): string | null {
  if (!source.startsWith(".")) return null;
  return path.basename(source).replace(/\.[cm]?[jt]sx?$/i, "");
}

function specifierName(node: t.ImportSpecifier["imported"]): string {
  return t.isIdentifier(node) ? node.name : node.value;
}

function rewriteImportsAndExports(
  source: string,
  exportNames: Record<string, Record<string, string>>,
): string {
  const ast = parseSource(source);
  traverse(ast, {
    ImportDeclaration(importPath) {
      const target = importBasename(importPath.node.source.value);
      if (!target) return;
      const targetExports = exportNames[target];
      if (!targetExports) return;
      importPath.node.source.value = `./${target}`;
      for (const spec of importPath.node.specifiers) {
        if (!t.isImportSpecifier(spec)) continue;
        const importedName = specifierName(spec.imported);
        const replacement = targetExports[importedName];
        if (!replacement) continue;
        const oldLocal = spec.local.name;
        spec.imported = t.identifier(replacement);
        if (
          (oldLocal === importedName || isCryptic(oldLocal)) &&
          oldLocal !== replacement &&
          !importPath.scope.hasBinding(replacement)
        ) {
          importPath.scope.rename(oldLocal, replacement);
          spec.local = t.identifier(replacement);
        } else if (oldLocal === replacement) {
          spec.local = t.identifier(replacement);
        }
      }
    },
    ExportNamedDeclaration(exportPath) {
      if (exportPath.node.source) return;
      for (const spec of exportPath.node.specifiers) {
        if (!t.isExportSpecifier(spec)) continue;
        const localName = t.isIdentifier(spec.local)
          ? spec.local.name
          : spec.local.value;
        const exportedName = t.isIdentifier(spec.exported)
          ? spec.exported.name
          : spec.exported.value;
        if (!isCryptic(exportedName)) continue;
        if (!isCryptic(localName)) {
          spec.exported = t.identifier(localName);
        }
      }
    },
  });
  return print(ast);
}

function fixLowercaseJsxComponents(source: string): string {
  const ast = parseSource(source);
  const renameMap = new Map<string, string>();

  traverse(ast, {
    JSXOpeningElement(jsxPath) {
      const name = jsxPath.node.name;
      if (!t.isJSXIdentifier(name)) return;
      if (!/^[a-z]/.test(name.name)) return;
      if (JSX_INTRINSIC_TAGS.has(name.name)) return;
      const replacement = pascalCase(name.name);
      if (!replacement || replacement === name.name) return;
      renameMap.set(name.name, replacement);
    },
  });

  if (renameMap.size === 0) return source;

  traverse(ast, {
    Program(programPath) {
      for (const [oldName, newName] of renameMap) {
        if (
          programPath.scope.hasBinding(oldName) &&
          !programPath.scope.hasBinding(newName)
        ) {
          programPath.scope.rename(oldName, newName);
        }
      }
    },
    JSXIdentifier(jsxPath) {
      const replacement = renameMap.get(jsxPath.node.name);
      if (replacement) jsxPath.node.name = replacement;
    },
  });

  return print(ast);
}

function fallbackNameFactory(
  basename: string,
): (symbol: LedgerSymbol, extracted?: SymbolEntry) => string {
  const stem = camelCase(fileStem(basename)) || "restored";
  const pascalStem = pascalCase(fileStem(basename)) || "Restored";
  const counters = new Map<string, number>();
  return (symbol: LedgerSymbol, extracted?: SymbolEntry): string => {
    let noun = "Value";
    if (symbol.kind === "param") noun = "Param";
    else if (symbol.kind === "module") noun = "Import";
    else if (extracted?.bindingPathType.includes("Function")) noun = "Helper";
    else if (extracted?.bindingPathType.includes("Class")) noun = "Class";
    else if (symbol.kind === "hoisted") noun = "Helper";
    const key = `${stem}${noun}`;
    const next = (counters.get(key) ?? 0) + 1;
    counters.set(key, next);
    if (noun === "Class") return `${pascalStem}Class${next}`;
    return safeName(`${stem}${noun}${next}`);
  };
}

function buildRenames(
  basename: string,
  file: ManifestFile,
  source: string,
  ledgerFile: LedgerFile,
  exportNames: Record<string, Record<string, string>>,
): {
  renames: Record<string, string>;
  smartRenames: number;
  fallbackRenames: number;
  importRenames: number;
  exportRenames: number;
} {
  const renames: Record<string, string> = {};
  let smartRenames = 0;
  let fallbackRenames = 0;
  let importRenames = 0;
  let exportRenames = 0;

  const exportByLocal = new Map<string, string>();
  for (const item of file.exports) {
    const semantic = exportNames[basename]?.[item.exported];
    if (!semantic) continue;
    exportByLocal.set(item.local, semantic);
  }

  for (const symbol of ledgerFile.symbols) {
    const exportName =
      symbol.exportedAs != null
        ? exportNames[basename]?.[symbol.exportedAs]
        : exportByLocal.get(symbol.originalName ?? symbol.name ?? "");
    if (exportName) {
      renames[symbol.id] = exportName;
      exportRenames++;
      continue;
    }
    const imported = symbol.importedFrom;
    if (imported) {
      const importedName = exportNames[imported.target]?.[imported.imported];
      if (importedName) {
        renames[symbol.id] = importedName;
        importRenames++;
      }
    }
  }

  for (const item of findRenames(source)) {
    if (!renames[item.id]) {
      renames[item.id] = item.newName;
      smartRenames++;
    }
  }

  const fallbackName = fallbackNameFactory(basename);
  const extracted = new Map(extractSymbols(source, 0).map((s) => [s.id, s]));
  for (const symbol of ledgerFile.symbols) {
    if (renames[symbol.id]) continue;
    const extractedSymbol = extracted.get(symbol.id);
    if (!extractedSymbol || !isCryptic(extractedSymbol.name)) continue;
    renames[symbol.id] = fallbackName(symbol, extractedSymbol);
    fallbackRenames++;
  }

  return {
    renames,
    smartRenames,
    fallbackRenames,
    importRenames,
    exportRenames,
  };
}

function descriptionFor(basename: string): string {
  return `${pascalCase(fileStem(basename)) || "Restored"} chunk restored from the Codex webview bundle.`;
}

function toPosixPath(input: string): string {
  return input.split(path.sep).join("/");
}

function repoRelativeSourcePath(
  filePath: string | undefined,
  basename: string,
  rootDir?: string,
): string {
  const fromRoot = rootDir
    ? path.posix.join(toPosixPath(rootDir), `${basename}.js`)
    : `${basename}.js`;
  const raw = toPosixPath(filePath ?? fromRoot);
  const refIndex = raw.indexOf("ref/webview/assets/");
  if (refIndex >= 0) return raw.slice(refIndex);
  if (path.isAbsolute(filePath ?? "")) {
    const relative = toPosixPath(path.relative(process.cwd(), filePath!));
    if (!relative.startsWith("..")) return relative;
  }
  return fromRoot;
}

function readJson<T>(file: string): T {
  return JSON.parse(fs.readFileSync(file, "utf-8")) as T;
}

function localFilesInRestoreOrder(
  manifest: Manifest,
): Array<[string, ManifestFile]> {
  return Object.entries(manifest.files)
    .filter(
      (entry): entry is [string, ManifestFile] =>
        entry[1].kind === "local" && entry[1].stages?.faced !== true,
    )
    .sort(([, a], [, b]) => {
      const aLines = a.lineCount ?? Number.MAX_SAFE_INTEGER;
      const bLines = b.lineCount ?? Number.MAX_SAFE_INTEGER;
      if (aLines !== bLines) return aLines - bLines;
      return (b.depth ?? 0) - (a.depth ?? 0);
    });
}

async function main(): Promise<void> {
  let parsed;
  try {
    parsed = parseArgs({
      args: process.argv.slice(2),
      options: {
        target: { type: "string" },
        manifest: { type: "string" },
        ledger: { type: "string" },
        "checkpoint-dir": { type: "string" },
        "write-target-checkpoints": { type: "boolean", default: false },
        resume: { type: "boolean", default: false },
        format: { type: "boolean", default: false },
      },
      allowPositionals: false,
    });
  } catch (err) {
    console.error(USAGE);
    console.error((err as Error).message);
    process.exit(64);
  }

  const targetDir = parsed.values.target;
  if (!targetDir) {
    console.error(USAGE);
    process.exit(64);
  }
  const fullDir = path.join(targetDir, ".deobfuscate-javascript", "_full");
  const manifestPath =
    parsed.values.manifest ?? path.join(fullDir, "manifest.json");
  const ledgerPath = parsed.values.ledger ?? path.join(fullDir, "ledger.json");
  const checkpointDir =
    parsed.values["checkpoint-dir"] ?? path.join(fullDir, "checkpoints");
  fs.mkdirSync(checkpointDir, { recursive: true });
  if (parsed.values["write-target-checkpoints"]) {
    console.error(
      "auto-restore: --write-target-checkpoints writes visible checkpoint files only; " +
        "they still need host-agent rewrite and Stage E PASS",
    );
  }

  const manifest = readJson<Manifest>(manifestPath);
  const ledger = readJson<Ledger>(ledgerPath);
  const exportNames: Record<string, Record<string, string>> = {};
  const localEntries = localFilesInRestoreOrder(manifest);

  for (const [basename, file] of localEntries) {
    const workspaceOriginal = path.join(
      fullDir,
      "files",
      basename,
      "original.js",
    );
    const sourcePath = fs.existsSync(workspaceOriginal)
      ? workspaceOriginal
      : file.path;
    const source = fs.readFileSync(sourcePath, "utf-8");
    exportNames[basename] = inferExportNames(basename, file, source);
  }

  const report: RestoreReport = { target: targetDir, files: [] };
  const prog = new Progress({
    label: "checkpoint",
    total: localEntries.length,
  });
  for (const [basename, file] of localEntries) {
    const ledgerFile = ledger.files[basename];
    if (!ledgerFile) continue;
    const workspace = path.join(fullDir, "files", basename);
    const polishedPath = path.join(workspace, "auto-polished.tsx");
    const checkpointPath = path.join(checkpointDir, `${basename}.tsx`);
    const targetCheckpointPath = path.join(targetDir, `${basename}.tsx`);
    if (
      parsed.values.resume &&
      fs.existsSync(polishedPath) &&
      fs.existsSync(checkpointPath) &&
      (!parsed.values["write-target-checkpoints"] ||
        fs.existsSync(targetCheckpointPath))
    ) {
      prog.tick(1, `${basename} (cached)`);
      continue;
    }
    const originalPath = path.join(workspace, "original.js");
    const original = fs.readFileSync(originalPath, "utf-8");
    const built = buildRenames(
      basename,
      file,
      original,
      ledgerFile,
      exportNames,
    );
    const renamesPath = path.join(workspace, "auto-renames.json");
    fs.writeFileSync(
      renamesPath,
      `${JSON.stringify(built.renames, null, 2)}\n`,
    );

    const applied = applyRenames(original, built.renames);
    const renamedPath = path.join(workspace, "auto-renamed.js");
    fs.writeFileSync(renamedPath, applied.code);

    const polished = polish(applied.code, {
      sourcePath: repoRelativeSourcePath(file.path, basename, manifest.rootDir),
      description: descriptionFor(basename),
      preferExportName: "local",
    });
    const rewritten = fixLowercaseJsxComponents(
      rewriteImportsAndExports(polished.code, exportNames),
    );
    fs.writeFileSync(polishedPath, rewritten);

    fs.writeFileSync(checkpointPath, rewritten);
    if (parsed.values["write-target-checkpoints"]) {
      fs.writeFileSync(targetCheckpointPath, rewritten);
    }
    report.files.push({
      basename,
      source: file.path,
      checkpointOutput: checkpointPath,
      targetCheckpointOutput: parsed.values["write-target-checkpoints"]
        ? targetCheckpointPath
        : undefined,
      symbols: ledgerFile.symbols.length,
      renames: Object.keys(built.renames).length,
      smartRenames: built.smartRenames,
      fallbackRenames: built.fallbackRenames,
      importRenames: built.importRenames,
      exportRenames: built.exportRenames,
      ignoredRenames: applied.stats.ignored,
      needsAgentRewrite: true,
    });
    prog.tick(1, `${basename} (${Object.keys(built.renames).length} renames)`);
  }
  prog.done("checkpoints built");

  const reportPath = path.join(fullDir, "auto-restore-report.json");
  fs.writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`);

  if (parsed.values.format) {
    const formatted = formatPath(targetDir);
    if (formatted.stdout) process.stdout.write(formatted.stdout);
    if (formatted.stderr) process.stderr.write(formatted.stderr);
    if (!formatted.ok) process.exit(formatted.code);
  }

  console.error(
    `auto-restore: wrote ${report.files.length} file(s) and ${reportPath}`,
  );
}

if (import.meta.main) {
  await main();
}

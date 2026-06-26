import * as fs from "node:fs";
import { parseArgs } from "node:util";
import * as parser from "@babel/parser";
import * as t from "@babel/types";
import { PARSER_PLUGINS } from "./extract.ts";

/**
 * make-facade.ts — generate a TYPED BOUNDARY FACADE for a large vendored or
 * runtime chunk that is consumed by many local chunks through short export
 * aliases (an app's `app-scope`, `vscode-api`, the 308-export Zod `src` chunk,
 * the `statsig` SDK).
 *
 * The facade exposes every export token as `any` so the hundreds of consumers
 * type-check immediately, BEFORE the runtime itself is deep-restored. It is a
 * dependency-boundary artifact, not a final semantic deliverable — record its
 * alias map in the project IMPORT_MAP (`dependencyBoundaryFacades`) and
 * deep-restore the runtime only when it is explicitly scoped.
 *
 * Reserved-word exports are real (the Zod `src` chunk literally exports `in`):
 * those are emitted as `declare const in_: any; export { in_ as in };`.
 * `--name-map map.json` supplies semantic names ({ "<token>": "<name>" }).
 */

export const FACADE_MARKER = "TYPED BOUNDARY FACADE";

// Names that cannot appear as `export declare const <name>`.
const RESERVED = new Set([
  "break",
  "case",
  "catch",
  "class",
  "const",
  "continue",
  "debugger",
  "default",
  "delete",
  "do",
  "else",
  "enum",
  "export",
  "extends",
  "false",
  "finally",
  "for",
  "function",
  "if",
  "import",
  "in",
  "instanceof",
  "new",
  "null",
  "return",
  "super",
  "switch",
  "this",
  "throw",
  "true",
  "try",
  "typeof",
  "var",
  "void",
  "while",
  "with",
  "yield",
  "let",
  "static",
  "implements",
  "interface",
  "package",
  "private",
  "protected",
  "public",
  "await",
]);

/**
 * facade      — every export token as `export declare const <name>: any` (default).
 * reexport    — a thin third-party shim: `export … from "<specifier>"`. The chunk
 *               IS a recognised npm package; this resolves to the real package
 *               types and is a finished deliverable, not an open boundary.
 * passthrough — a runnable interim for a genuine app/runtime boundary: re-export
 *               the ORIGINAL ref chunk (`@ts-nocheck` + `// TODO: deep-restore`)
 *               so the app works before the runtime is deep-restored.
 */
export type MakeFacadeMode = "facade" | "reexport" | "passthrough";

export type MakeFacadeOptions = {
  /**
   * facade mode: source export token → emitted public binding name.
   * reexport/passthrough mode: public name (what consumers import) → real export
   * name in the target module. A blind `export *` won't satisfy consumers that
   * import cryptic aliases (`appScopeC`), so the map bridges alias → real name.
   */
  nameMap?: Record<string, string>;
  provenance?: string;
  mode?: MakeFacadeMode;
  /** reexport: bare npm specifier the chunk really is (`react-intl`, `lodash`). */
  specifier?: string;
  /** reexport: emit `export * from "<specifier>"` instead of enumerating names. */
  exportStar?: boolean;
  /** reexport/passthrough: explicit public-name list (else use chunk export tokens). */
  names?: string[];
  /** passthrough: path to the original ref chunk, relative to the boundary file. */
  refPath?: string;
};

export type MakeFacadeResult = {
  code: string;
  stats: {
    exports: number;
    reserved: number;
    mapped: number;
    hasExportStar: boolean;
    usedRegexFallback: boolean;
    parseError?: string;
    mode: MakeFacadeMode;
  };
};

/**
 * Collect every PUBLIC export token (the exported name, not the local binding).
 * Top-level only, with a regex fallback for chunks Babel can't fully parse.
 */
export function collectExportTokens(source: string): {
  tokens: string[];
  hasExportStar: boolean;
  usedRegexFallback: boolean;
  parseError?: string;
} {
  const tokens = new Set<string>();
  let hasExportStar = false;
  let parseError: string | undefined;
  let parsedOk = false;

  try {
    const ast = parser.parse(source, {
      sourceType: "unambiguous",
      errorRecovery: true,
      allowReturnOutsideFunction: true,
      allowImportExportEverywhere: true,
      allowUndeclaredExports: true,
      plugins: PARSER_PLUGINS,
    });
    parsedOk = true;
    for (const node of ast.program.body) {
      if (t.isExportNamedDeclaration(node)) {
        for (const spec of node.specifiers) {
          if (t.isExportSpecifier(spec)) {
            const exported = spec.exported;
            tokens.add(
              t.isIdentifier(exported) ? exported.name : exported.value,
            );
          }
        }
        const decl = node.declaration;
        if (decl) {
          if (t.isVariableDeclaration(decl)) {
            for (const d of decl.declarations) {
              if (t.isIdentifier(d.id)) tokens.add(d.id.name);
            }
          } else if (
            (t.isFunctionDeclaration(decl) || t.isClassDeclaration(decl)) &&
            decl.id
          ) {
            tokens.add(decl.id.name);
          }
        }
      } else if (t.isExportDefaultDeclaration(node)) {
        tokens.add("default");
      } else if (t.isExportAllDeclaration(node)) {
        hasExportStar = true;
        // `export * as ns from "…"` — `.exported` is only present on some
        // @babel/types versions; read it defensively.
        const exported = (node as { exported?: t.Identifier | t.StringLiteral })
          .exported;
        if (exported) {
          tokens.add(t.isIdentifier(exported) ? exported.name : exported.value);
        }
      }
    }
  } catch (err) {
    parseError = (err as Error).message;
    parsedOk = false;
  }

  // Regex fallback for exotic chunks (parse failure or no exports found).
  let usedRegexFallback = false;
  if (!parsedOk || tokens.size === 0) {
    for (const block of source.matchAll(/export\s*\{([^}]*)\}/g)) {
      usedRegexFallback = true;
      for (const part of block[1]!.split(",")) {
        const p = part.trim();
        if (!p) continue;
        const aliased = p.match(/\bas\s+([A-Za-z_$][\w$]*)\s*$/);
        const bare = p.match(/^([A-Za-z_$][\w$]*)\s*$/);
        if (aliased) tokens.add(aliased[1]!);
        else if (bare) tokens.add(bare[1]!);
      }
    }
  }

  return {
    tokens: [...tokens].sort(),
    hasExportStar,
    usedRegexFallback,
    parseError,
  };
}

/**
 * Build `export { real as public } from "<target>"` lines for a public-name set.
 * `nameMap` maps a public name (what consumers import) → the real export name in
 * the target module; when they match (or no map entry) we emit a bare re-export.
 * Reserved-word public names are bridged through a local `declare`.
 */
function emitNamedReexports(
  names: string[],
  target: string,
  nameMap: Record<string, string>,
): { lines: string[]; mapped: number } {
  const lines: string[] = [];
  const emitted = new Set<string>();
  let mapped = 0;
  const grouped: string[] = [];
  for (const publicName of names) {
    if (publicName === "default") continue;
    if (emitted.has(publicName)) continue;
    emitted.add(publicName);
    const real = nameMap[publicName] ?? publicName;
    if (nameMap[publicName]) mapped++;
    // `export { x as in }` is legal even when the public name is a reserved word.
    grouped.push(real === publicName ? publicName : `${real} as ${publicName}`);
  }
  if (grouped.length > 0) {
    lines.push(`export {\n  ${grouped.join(",\n  ")},\n} from "${target}";`);
  }
  return { lines, mapped };
}

export function makeFacade(
  source: string,
  opts: MakeFacadeOptions = {},
): MakeFacadeResult {
  const mode = opts.mode ?? "facade";
  const nameMap = opts.nameMap ?? {};
  const { tokens, hasExportStar, usedRegexFallback, parseError } =
    collectExportTokens(source);
  const hasDefaultExport = tokens.includes("default");

  if (mode === "reexport") {
    const specifier = opts.specifier ?? "<specifier>";
    const provenance = opts.provenance ?? "<unknown chunk>";
    const header =
      `// Restored from ${provenance} — vendored ${specifier}\n` +
      `//\n` +
      `// ${specifier} re-export boundary (generated by scripts/make-facade.ts\n` +
      `// --reexport). This bundled chunk IS the third-party package "${specifier}";\n` +
      `// consumers import it through this thin shim, which resolves to the real\n` +
      `// package types. Verify the package is stock (not a fork) before relying on it.\n`;
    const lines: string[] = [];
    let mapped = 0;
    if (opts.exportStar || !opts.names) {
      lines.push(`export * from "${specifier}";`);
      if (hasDefaultExport) lines.push(`export { default } from "${specifier}";`);
    } else {
      const r = emitNamedReexports(opts.names, specifier, nameMap);
      lines.push(...r.lines);
      mapped = r.mapped;
      if (hasDefaultExport) lines.push(`export { default } from "${specifier}";`);
    }
    return {
      code: header + "\n" + lines.join("\n") + "\n",
      stats: {
        exports: opts.names?.length ?? tokens.length,
        reserved: 0,
        mapped,
        hasExportStar,
        usedRegexFallback,
        parseError,
        mode,
      },
    };
  }

  if (mode === "passthrough") {
    const refPath = opts.refPath ?? "<ref-chunk-path>";
    const provenance = opts.provenance ?? "<unknown chunk>";
    const header =
      `// @ts-nocheck\n` +
      `// Restored from ${provenance}\n` +
      `//\n` +
      `// RUNTIME PASSTHROUGH (generated by scripts/make-facade.ts --passthrough).\n` +
      `// Re-exports the ORIGINAL bundled chunk so the app runs before this runtime\n` +
      `// boundary is deep-restored. Untyped on purpose (@ts-nocheck).\n` +
      `// TODO: deep-restore this chunk and move it out of boundaries/.\n`;
    const names = opts.names ?? tokens.filter((tk) => tk !== "default");
    const lines: string[] = [];
    let mapped = 0;
    if (names.length === 0 || (!opts.names && Object.keys(nameMap).length === 0)) {
      lines.push(`export * from "${refPath}";`);
      if (hasDefaultExport) lines.push(`export { default } from "${refPath}";`);
    } else {
      const r = emitNamedReexports(names, refPath, nameMap);
      lines.push(...r.lines);
      mapped = r.mapped;
      if (hasDefaultExport) lines.push(`export { default } from "${refPath}";`);
    }
    return {
      code: header + "\n" + lines.join("\n") + "\n",
      stats: {
        exports: names.length,
        reserved: 0,
        mapped,
        hasExportStar,
        usedRegexFallback,
        parseError,
        mode,
      },
    };
  }

  const lines: string[] = [];
  const emitted = new Set<string>();
  let reserved = 0;
  let mapped = 0;
  let hasDefault = false;

  for (const token of tokens) {
    const name = nameMap[token] ?? token;
    if (nameMap[token]) mapped++;
    if (name === "default") {
      hasDefault = true;
      continue;
    }
    if (emitted.has(name)) continue;
    emitted.add(name);
    if (RESERVED.has(name)) {
      reserved++;
      lines.push(`declare const ${name}_: any;`);
      lines.push(`export { ${name}_ as ${name} };`);
    } else {
      lines.push(`export declare const ${name}: any;`);
    }
  }
  if (hasDefault) {
    lines.push(`declare const _default: any;`);
    lines.push(`export default _default;`);
  }

  const provenance = opts.provenance ?? "<unknown chunk>";
  const header =
    `// Restored from ${provenance}\n` +
    `//\n` +
    `// ${FACADE_MARKER} (generated by scripts/make-facade.ts). Large vendored/\n` +
    `// runtime module consumed by many local chunks via short export aliases.\n` +
    `// Every export token is exposed as \`any\`; replace with real types or\n` +
    `// semantic names (or pass --name-map) as the module is scoped. ` +
    `${tokens.length} export token(s).\n` +
    `/* eslint-disable @typescript-eslint/no-explicit-any */\n`;

  const body = lines.length > 0 ? lines.join("\n") + "\n" : "";
  const starNote = hasExportStar
    ? `// NOTE: source has \`export * from …\` — re-exported names are not\n` +
      `// enumerable here; add them by hand or facade the re-export target too.\n`
    : "";

  return {
    code: header + "\n" + starNote + body,
    stats: {
      exports: tokens.length,
      reserved,
      mapped,
      hasExportStar,
      usedRegexFallback,
      parseError,
      mode,
    },
  };
}

const USAGE =
  "Usage: bun scripts/make-facade.ts <chunk.js> [--name-map map.json] " +
  "[--out facade.ts] [--provenance <relpath>]\n" +
  "  Default: emit an `export declare const … : any` typed boundary facade.\n" +
  "  --reexport <specifier> [--export-star | --reexport-named a,b,c]\n" +
  "      Third-party shim: `export … from \"<specifier>\"` (the chunk IS that npm package).\n" +
  "  --passthrough <ref-relpath>\n" +
  "      Runtime interim: re-export the original ref chunk with @ts-nocheck + // TODO.\n" +
  "  --name-map maps a public name (what consumers import) → the real export name\n" +
  "  in the target module, for reexport/passthrough; → emitted facade name otherwise.\n" +
  "Exit: 0 ok · 2 no exports found · 1 I/O · 64 usage.";

function main(): void {
  let parsed;
  try {
    parsed = parseArgs({
      args: process.argv.slice(2),
      options: {
        "name-map": { type: "string" },
        out: { type: "string", short: "o" },
        provenance: { type: "string" },
        reexport: { type: "string" },
        "export-star": { type: "boolean", default: false },
        "reexport-named": { type: "string" },
        passthrough: { type: "string" },
      },
      allowPositionals: true,
    });
  } catch (err) {
    console.error(USAGE);
    console.error((err as Error).message);
    process.exit(64);
  }
  const { positionals, values } = parsed;
  if (positionals.length === 0) {
    console.error(USAGE);
    process.exit(64);
  }

  const input = positionals[0]!;
  let source: string;
  try {
    source = fs.readFileSync(input, "utf-8");
  } catch (err) {
    console.error(`failed to read input: ${(err as Error).message}`);
    process.exit(1);
  }

  let nameMap: Record<string, string> | undefined;
  if (values["name-map"]) {
    try {
      nameMap = JSON.parse(fs.readFileSync(values["name-map"], "utf-8"));
    } catch (err) {
      console.error(`failed to read name-map: ${(err as Error).message}`);
      process.exit(1);
    }
  }

  if (values.reexport && values.passthrough) {
    console.error("--reexport and --passthrough are mutually exclusive");
    process.exit(64);
  }

  const mode: MakeFacadeMode = values.reexport
    ? "reexport"
    : values.passthrough
      ? "passthrough"
      : "facade";
  const names = values["reexport-named"]
    ? values["reexport-named"]
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
    : undefined;

  const result = makeFacade(source, {
    nameMap,
    provenance: values.provenance ?? input,
    mode,
    specifier: values.reexport,
    exportStar: values["export-star"],
    names,
    refPath: values.passthrough,
  });

  if (mode === "facade" && result.stats.exports === 0) {
    console.error(
      "no named exports found — is this an ESM chunk with an `export { … }` block?",
    );
    process.exit(2);
  }

  const target =
    values.out ?? input.replace(/\.[mc]?jsx?$/i, "") + ".facade.ts";
  try {
    fs.writeFileSync(target, result.code);
  } catch (err) {
    console.error(`failed to write output: ${(err as Error).message}`);
    process.exit(1);
  }

  const s = result.stats;
  console.error(
    `${s.mode}: ${s.exports} export token(s) → ${target}` +
      (s.reserved ? ` · ${s.reserved} reserved-word` : "") +
      (s.mapped ? ` · ${s.mapped} name-mapped` : "") +
      (s.hasExportStar ? " · has export *" : "") +
      (s.usedRegexFallback ? " · regex fallback" : ""),
  );
  process.exit(0);
}

if (import.meta.main) {
  main();
}

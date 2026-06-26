import * as fs from "node:fs";
import { parseArgs } from "node:util";
import { formatPath } from "./format.ts";
import {
  stripReactCompiler,
  type StripResult,
} from "./strip-react-compiler.ts";
import { simplify, type SimplifyResult } from "./simplify.ts";
import { convertJsxRuntime, type JsxRuntimeResult } from "./jsx-runtime.ts";
import {
  inlineDefaults,
  type InlineDefaultsResult,
} from "./inline-defaults.ts";
import {
  normalizeExports,
  type NormalizeExportsResult,
} from "./normalize-exports.ts";
import {
  eliminateReactShim,
  type ReactShimElimResult,
} from "./react-shim-elim.ts";
import {
  resolveNpmImports,
  type ResolveResult,
} from "./resolve-npm-imports.ts";
import { eliminateDeadShim, type DeadShimResult } from "./dead-shim-elim.ts";
import {
  eliminateNpmCjsShim,
  type NpmCjsShimResult,
} from "./npm-cjs-shim-elim.ts";
import { findRenames } from "./smart-rename.ts";
import { applyRenames } from "./apply.ts";

export const POLISH_STEPS = [
  "strip-react-compiler",
  "simplify",
  "jsx-runtime",
  "inline-defaults",
  "normalize-exports",
  "react-shim-elim",
  "resolve-npm-imports",
  "npm-cjs-shim-elim",
  "dead-shim-elim",
] as const;
export type PolishStep = (typeof POLISH_STEPS)[number];

/**
 * The `--fast` (default readable-tier) profile skips the import-resolution /
 * shim-elimination tail. Those passes make the output resolve against
 * `node_modules` (a compilability concern); they do not improve how the code
 * *reads*. Skipping them keeps the readability passes — strip-react-compiler,
 * simplify, jsx-runtime, inline-defaults, normalize-exports — and is the right
 * default when "readable" matters more than "compiles". Drop `--fast` (deep
 * mode) to get resolvable npm imports.
 */
export const FAST_SKIP_STEPS: PolishStep[] = [
  "react-shim-elim",
  "resolve-npm-imports",
  "npm-cjs-shim-elim",
  "dead-shim-elim",
];

export type PolishStepResult =
  | { step: "strip-react-compiler"; stats: StripResult["stats"] }
  | { step: "simplify"; stats: SimplifyResult["stats"] }
  | { step: "jsx-runtime"; stats: JsxRuntimeResult["stats"] }
  | { step: "inline-defaults"; stats: InlineDefaultsResult["stats"] }
  | { step: "normalize-exports"; stats: NormalizeExportsResult["stats"] }
  | { step: "react-shim-elim"; stats: ReactShimElimResult["stats"] }
  | { step: "resolve-npm-imports"; stats: ResolveResult["stats"] }
  | { step: "npm-cjs-shim-elim"; stats: NpmCjsShimResult["stats"] }
  | { step: "dead-shim-elim"; stats: DeadShimResult["stats"] }
  | { step: PolishStep; error: string };

export type PolishOptions = {
  skip?: PolishStep[];
  stopAfter?: PolishStep;
  noInline?: boolean;
  simplifyMaxPasses?: number;
  preferExportName?: "exported" | "local";
  sourcePath?: string;
  description?: string;
  /** Run the deterministic mechanical renamer (smart-rename) before polishing. */
  rename?: boolean;
  /** Skip the import-resolution tail (FAST_SKIP_STEPS) — the readable-tier profile. */
  fast?: boolean;
};

export type PolishResult = {
  code: string;
  steps: PolishStepResult[];
  originalSize: number;
  finalSize: number;
  /** Bindings renamed by the `rename` pre-step (0 if `rename` was off). */
  renamedSymbols: number;
};

function isStep(name: string): name is PolishStep {
  return (POLISH_STEPS as readonly string[]).includes(name);
}

function buildHeader(
  sourcePath: string | undefined,
  description: string | undefined,
): string {
  const lines: string[] = [];
  if (sourcePath) lines.push(`// Restored from ${sourcePath}`);
  if (description) lines.push(`// ${description}`);
  return lines.length ? lines.join("\n") + "\n" : "";
}

/**
 * Bundlers often append `//# sourceMappingURL=foo.js.map` as a trailing
 * comment. Once we've restored the chunk to a .tsx, that map no longer matches
 * the new code and prettier renders it on the same line as the closing `}`.
 * Strip it during finalize so the output reads cleanly.
 */
function stripSourceMapComment(code: string): string {
  return code.replace(/\s*\/\/# sourceMappingURL=[^\n]*\s*$/m, "\n");
}

function finalize(
  code: string,
  steps: PolishStepResult[],
  originalSize: number,
  sourcePath: string | undefined,
  description: string | undefined,
  renamedSymbols: number,
): PolishResult {
  const header = buildHeader(sourcePath, description);
  const cleaned = stripSourceMapComment(code);
  const finalCode = header + cleaned;
  return {
    code: finalCode,
    steps,
    originalSize,
    finalSize: finalCode.length,
    renamedSymbols,
  };
}

export function polish(source: string, opts: PolishOptions = {}): PolishResult {
  const skip = new Set(opts.skip ?? []);
  if (opts.fast) for (const step of FAST_SKIP_STEPS) skip.add(step);
  const stopAfter = opts.stopAfter;
  const stops = (step: PolishStep) => stopAfter === step;
  const sourcePath = opts.sourcePath;
  const description = opts.description;

  const steps: PolishStepResult[] = [];
  let code = source;
  const originalSize = source.length;

  // Stage-B mechanical pre-rename: smart-rename covers ~80% of the boring cases
  // (props, event handlers, iteratees, reducers, promise handlers, hook
  // returns, destructure aliases) deterministically, so a one-shot run lands a
  // readable draft before the agent hand-names only the residue.
  let renamedSymbols = 0;
  if (opts.rename) {
    const renames: Record<string, string> = {};
    for (const item of findRenames(code)) renames[item.id] = item.newName;
    const applied = applyRenames(code, renames);
    code = applied.code;
    renamedSymbols = applied.stats.renamed;
  }

  if (!skip.has("strip-react-compiler")) {
    try {
      const r = stripReactCompiler(code);
      code = r.code;
      steps.push({ step: "strip-react-compiler", stats: r.stats });
    } catch (err) {
      steps.push({
        step: "strip-react-compiler",
        error: (err as Error).message,
      });
    }
    if (stops("strip-react-compiler"))
      return finalize(
        code,
        steps,
        originalSize,
        sourcePath,
        description,
        renamedSymbols,
      );
  }

  if (!skip.has("simplify")) {
    try {
      const r = simplify(code, {
        maxPasses: opts.simplifyMaxPasses,
        noInline: opts.noInline,
      });
      code = r.code;
      steps.push({ step: "simplify", stats: r.stats });
    } catch (err) {
      steps.push({ step: "simplify", error: (err as Error).message });
    }
    if (stops("simplify"))
      return finalize(
        code,
        steps,
        originalSize,
        sourcePath,
        description,
        renamedSymbols,
      );
  }

  if (!skip.has("jsx-runtime")) {
    try {
      const r = convertJsxRuntime(code);
      code = r.code;
      steps.push({ step: "jsx-runtime", stats: r.stats });
    } catch (err) {
      steps.push({ step: "jsx-runtime", error: (err as Error).message });
    }
    if (stops("jsx-runtime"))
      return finalize(
        code,
        steps,
        originalSize,
        sourcePath,
        description,
        renamedSymbols,
      );
  }

  if (!skip.has("inline-defaults")) {
    try {
      const r = inlineDefaults(code);
      code = r.code;
      steps.push({ step: "inline-defaults", stats: r.stats });
    } catch (err) {
      steps.push({ step: "inline-defaults", error: (err as Error).message });
    }
    if (stops("inline-defaults"))
      return finalize(
        code,
        steps,
        originalSize,
        sourcePath,
        description,
        renamedSymbols,
      );
  }

  if (!skip.has("normalize-exports")) {
    try {
      const r = normalizeExports(code, {
        prefer: opts.preferExportName ?? "local",
      });
      code = r.code;
      steps.push({ step: "normalize-exports", stats: r.stats });
    } catch (err) {
      steps.push({ step: "normalize-exports", error: (err as Error).message });
    }
    if (stops("normalize-exports"))
      return finalize(
        code,
        steps,
        originalSize,
        sourcePath,
        description,
        renamedSymbols,
      );
  }

  if (!skip.has("react-shim-elim")) {
    try {
      const r = eliminateReactShim(code);
      code = r.code;
      steps.push({ step: "react-shim-elim", stats: r.stats });
    } catch (err) {
      steps.push({ step: "react-shim-elim", error: (err as Error).message });
    }
    if (stops("react-shim-elim"))
      return finalize(
        code,
        steps,
        originalSize,
        sourcePath,
        description,
        renamedSymbols,
      );
  }

  if (!skip.has("resolve-npm-imports")) {
    try {
      const r = resolveNpmImports(code);
      code = r.code;
      steps.push({ step: "resolve-npm-imports", stats: r.stats });
    } catch (err) {
      steps.push({
        step: "resolve-npm-imports",
        error: (err as Error).message,
      });
    }
    if (stops("resolve-npm-imports"))
      return finalize(
        code,
        steps,
        originalSize,
        sourcePath,
        description,
        renamedSymbols,
      );
  }

  if (!skip.has("npm-cjs-shim-elim")) {
    try {
      const r = eliminateNpmCjsShim(code);
      code = r.code;
      steps.push({ step: "npm-cjs-shim-elim", stats: r.stats });
    } catch (err) {
      steps.push({ step: "npm-cjs-shim-elim", error: (err as Error).message });
    }
    if (stops("npm-cjs-shim-elim"))
      return finalize(
        code,
        steps,
        originalSize,
        sourcePath,
        description,
        renamedSymbols,
      );
  }

  if (!skip.has("dead-shim-elim")) {
    try {
      const r = eliminateDeadShim(code);
      code = r.code;
      steps.push({ step: "dead-shim-elim", stats: r.stats });
    } catch (err) {
      steps.push({ step: "dead-shim-elim", error: (err as Error).message });
    }
  }

  return finalize(
    code,
    steps,
    originalSize,
    sourcePath,
    description,
    renamedSymbols,
  );
}

const USAGE =
  "Usage: bun scripts/polish.ts <input.js|-> [--out output.js] [--report report.json] " +
  "[--rename] [--fast] [--skip step1,step2] [--stop-after step] [--no-inline] [--max-passes 10] " +
  "[--prefer local|exported] [--source <original-path>] [--description <one-line summary>] [--format]";

async function readInput(inputPath: string): Promise<string> {
  if (inputPath === "-") {
    return await Bun.stdin.text();
  }
  return fs.readFileSync(inputPath, "utf-8");
}

function parseStepList(value: string | undefined): PolishStep[] {
  if (!value) return [];
  const out: PolishStep[] = [];
  for (const raw of value.split(",")) {
    const name = raw.trim();
    if (!name) continue;
    if (!isStep(name)) {
      throw new Error(`unknown step: ${name}`);
    }
    out.push(name);
  }
  return out;
}

async function main(): Promise<void> {
  let parsed;
  try {
    parsed = parseArgs({
      args: process.argv.slice(2),
      options: {
        out: { type: "string", short: "o" },
        report: { type: "string" },
        rename: { type: "boolean", default: false },
        fast: { type: "boolean", default: false },
        skip: { type: "string" },
        "stop-after": { type: "string" },
        "no-inline": { type: "boolean", default: false },
        "max-passes": { type: "string", default: "10" },
        prefer: { type: "string", default: "local" },
        source: { type: "string" },
        description: { type: "string" },
        format: { type: "boolean", default: false },
      },
      allowPositionals: true,
    });
  } catch (err) {
    console.error(USAGE);
    console.error((err as Error).message);
    process.exit(64);
  }
  const { values, positionals } = parsed;

  if (positionals.length === 0) {
    console.error(USAGE);
    process.exit(64);
  }

  let skip: PolishStep[];
  try {
    skip = parseStepList(values.skip);
  } catch (err) {
    console.error(USAGE);
    console.error((err as Error).message);
    process.exit(64);
  }
  const stopAfter = values["stop-after"];
  if (stopAfter && !isStep(stopAfter)) {
    console.error(USAGE);
    console.error(`unknown stop-after step: ${stopAfter}`);
    process.exit(64);
  }
  const prefer = values.prefer;
  if (prefer !== "exported" && prefer !== "local") {
    console.error(USAGE);
    console.error(`unknown --prefer value: ${prefer}`);
    process.exit(64);
  }
  const maxPasses = parseInt(values["max-passes"] ?? "10", 10);
  if (!Number.isFinite(maxPasses) || maxPasses <= 0) {
    console.error("--max-passes must be a positive integer");
    process.exit(64);
  }

  const inputPath = positionals[0]!;
  let source: string;
  try {
    source = await readInput(inputPath);
  } catch (err) {
    console.error(`failed to read input: ${(err as Error).message}`);
    process.exit(1);
  }

  const result = polish(source, {
    skip,
    stopAfter: stopAfter as PolishStep | undefined,
    noInline: values["no-inline"],
    simplifyMaxPasses: maxPasses,
    preferExportName: prefer as "exported" | "local",
    sourcePath: values.source,
    description: values.description,
    rename: values.rename,
    fast: values.fast,
  });

  if (values.out) {
    try {
      fs.writeFileSync(values.out, result.code);
    } catch (err) {
      console.error(`failed to write output: ${(err as Error).message}`);
      process.exit(1);
    }
  } else {
    process.stdout.write(result.code);
  }

  if (values.format && values.out) {
    const fr = formatPath(values.out);
    if (!fr.ok) {
      console.error(`polish[format]: prettier failed (${fr.code})`);
      if (fr.stderr) console.error(fr.stderr);
    } else {
      console.error(`polish[format]: ran ${fr.command}`);
    }
  } else if (values.format && !values.out) {
    console.error(
      "polish[format]: --format requires --out (cannot format stdout)",
    );
  }

  if (values.report) {
    try {
      fs.writeFileSync(
        values.report,
        JSON.stringify(
          {
            originalSize: result.originalSize,
            finalSize: result.finalSize,
            steps: result.steps,
          },
          null,
          2,
        ) + "\n",
      );
    } catch (err) {
      console.error(`failed to write report: ${(err as Error).message}`);
      process.exit(1);
    }
  }

  if (values.rename) {
    console.error(`polish[rename]: ${result.renamedSymbols} bindings renamed`);
  }

  for (const step of result.steps) {
    if ("error" in step) {
      console.error(`polish[${step.step}]: error — ${step.error}`);
    } else if (step.step === "strip-react-compiler") {
      const s = step.stats;
      console.error(
        `polish[strip-react-compiler]: ${s.conditionalsStripped} conds, ` +
          `${s.cacheVarsRemoved} cache vars, ${s.uninitMerged} merged, ` +
          `${s.unusedLocalsRemoved} unused`,
      );
    } else if (step.step === "simplify") {
      const s = step.stats;
      console.error(
        `polish[simplify]: ${s.passes}p, ${s.constantsFolded} folded, ` +
          `${s.inlinedConstants} inlined, ${s.zeroCommaStripped} (0,fn), ` +
          `${s.templateLiteralsCollapsed} tpl→str, ${s.shorthandRestored} short, ` +
          `${s.boolObjectKeyCollapsed} bool-obj`,
      );
    } else if (step.step === "jsx-runtime") {
      const s = step.stats;
      console.error(
        `polish[jsx-runtime]: ${s.callsConverted} calls, ${s.fragmentsConverted} frags, ` +
          `${s.unconvertible} unconvertible`,
      );
    } else if (step.step === "inline-defaults") {
      const s = step.stats;
      console.error(
        `polish[inline-defaults]: ${s.letAssignMerged} merged, ${s.defaultsInlined} defaults, ` +
          `${s.aliasesRemoved} aliases`,
      );
    } else if (step.step === "normalize-exports") {
      const s = step.stats;
      console.error(
        `polish[normalize-exports]: ${s.inlined} inlined, ${s.preserved} preserved`,
      );
    } else if (step.step === "resolve-npm-imports") {
      const s = step.stats;
      console.error(
        `polish[resolve-npm-imports]: ${s.importsRewritten} rewritten, ` +
          `${s.importsSplit} split, ${s.specifiersResolved} specifiers, ` +
          `${s.referencesRenamed} refs renamed`,
      );
    } else if (step.step === "npm-cjs-shim-elim") {
      const s = step.stats;
      console.error(
        `polish[npm-cjs-shim-elim]: ${s.namespaceVarsCollapsed} vars, ` +
          `${s.directMembersCollapsed} direct members`,
      );
    } else {
      const s = step.stats;
      console.error(
        `polish[dead-shim-elim]: ${s.varsRemoved} vars, ` +
          `${s.importsRemoved} import specs, ${s.importDeclarationsRemoved} decls`,
      );
    }
  }
}

if (import.meta.main) {
  await main();
}

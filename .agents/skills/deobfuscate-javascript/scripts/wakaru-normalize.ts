import * as fs from "node:fs";
import { parseArgs } from "node:util";
import { spawnSync } from "node:child_process";

/**
 * Pre-rename mechanical normalization via wakaru (`@wakaru/cli`).
 *
 * wakaru is a Rust transpiler/minifier decompiler — it recovers ES6 classes,
 * async/await from generator state-machines, optional chaining, for-of,
 * destructuring, TS enums, template literals, etc. (~66 rules) that the skill's
 * own polish passes don't cover. Running it BEFORE the rename means the agent
 * names cleaner code and hand-fixes less.
 *
 * It is NOT a deobfuscator and NOT a semantic renamer — run Stage 1 first on
 * obfuscated input, and never treat wakaru output as the readable deliverable.
 *
 * This wraps the subprocess so the skill has one stable entry point (pipeline
 * docs and the readable-tier default flow call this rather than re-implementing
 * the binary probe / version pin / flag defaults).
 *
 * Default-on safety: when the binary can't be resolved or spawned (offline / CI
 * / sandbox), the input is passed through to the output unchanged and the call
 * exits 0 with a one-line stderr note, so the pipeline never breaks. The output
 * file is ALWAYS written (wakaru's own output on success, a passthrough copy on
 * skip or failure) so the next pipeline step always has a file to read.
 */

export const WAKARU_VERSION = "1.5.0";
export const WAKARU_PKG = `@wakaru/cli@${WAKARU_VERSION}`;

export type Level = "minimal" | "standard" | "aggressive";

export type NormalizeOptions = {
  /** Rewrite aggressiveness. Default "standard". "minimal" for fidelity-critical
   *  / untrusted code; "aggressive" only with explicit verification. */
  level?: Level;
  /** Split a single bundle into modules (single-bundle only; NEVER on an
   *  already-split chunk tree). `true` → auto. Requires `output` to be a dir. */
  unpack?: boolean | "auto" | "strict";
  /** Full dead-code reachability sweep. Off by default (can drop side effects). */
  dce?: boolean;
  /** Sourcemap for identifier recovery + import dedup. */
  sourceMap?: string;
};

export type NormalizeResult = {
  ok: boolean;
  /** True when the binary was unavailable and the input was passed through. */
  skipped: boolean;
  command: string;
  stdout: string;
  stderr: string;
  code: number;
};

type Runner = { cmd: string; base: string[] };
type WhichFn = (cmd: string) => string | null;

function which(cmd: string): string | null {
  const res = spawnSync("which", [cmd], { encoding: "utf-8" });
  if (res.status !== 0) return null;
  return res.stdout.trim() || null;
}

/**
 * Build the wakaru CLI argv that follows the runner/prefix. Pure — easy to test.
 */
export function buildWakaruArgs(
  input: string,
  output: string,
  opts: NormalizeOptions = {},
): string[] {
  const args = [input, "-o", output, "--level", opts.level ?? "standard"];
  if (opts.unpack) {
    args.push(opts.unpack === true ? "--unpack" : `--unpack=${opts.unpack}`);
  }
  if (opts.dce) args.push("--dce");
  if (opts.sourceMap) args.push("--source-map", opts.sourceMap);
  // Always overwrite — the workspace output is ours to own.
  args.push("--force");
  return args;
}

/**
 * Prefer a globally-installed `wakaru`; fall back to `npx <pinned pkg>`.
 * Returns null when neither a global binary nor npx is available.
 */
export function resolveRunner(whichFn: WhichFn = which): Runner | null {
  if (whichFn("wakaru")) return { cmd: "wakaru", base: [] };
  if (whichFn("npx")) return { cmd: "npx", base: ["--yes", WAKARU_PKG] };
  return null;
}

function passthrough(input: string, output: string): void {
  if (input !== output) fs.copyFileSync(input, output);
}

type SpawnResult = { status: number | null; stdout?: string; stderr?: string };
type Deps = {
  resolve?: () => Runner | null;
  spawn?: (cmd: string, args: string[]) => SpawnResult;
};

export function normalizePath(
  input: string,
  output: string,
  opts: NormalizeOptions = {},
  deps: Deps = {},
): NormalizeResult {
  if (!fs.existsSync(input)) {
    return { ok: false, skipped: false, command: "", stdout: "", stderr: `input does not exist: ${input}`, code: 1 };
  }

  const runner = (deps.resolve ?? (() => resolveRunner()))();
  if (!runner) {
    passthrough(input, output);
    return {
      ok: true,
      skipped: true,
      command: "",
      stdout: "",
      stderr: "wakaru unavailable — skipping mechanical normalization, continuing with original",
      code: 0,
    };
  }

  const args = [...runner.base, ...buildWakaruArgs(input, output, opts)];
  const command = `${runner.cmd} ${args.join(" ")}`;
  const spawn =
    deps.spawn ?? ((cmd: string, a: string[]) => spawnSync(cmd, a, { encoding: "utf-8" }));
  const res = spawn(runner.cmd, args);

  // status === null → the runner itself couldn't start (ENOENT, offline npx
  // fetch failure). Treat as unavailable: passthrough and skip rather than break.
  if (res.status === null || res.status === undefined) {
    passthrough(input, output);
    return {
      ok: true,
      skipped: true,
      command,
      stdout: res.stdout ?? "",
      stderr: "wakaru could not be launched — skipping mechanical normalization, continuing with original",
      code: 0,
    };
  }

  if (res.status !== 0) {
    // wakaru ran but failed (e.g. parse error). Surface it, but still leave a
    // usable output so the pipeline can proceed if the caller chooses to.
    passthrough(input, output);
    // wakaru uses 2 for parse errors; map anything else to a generic I/O error.
    const code = res.status === 2 ? 2 : 1;
    return { ok: false, skipped: false, command, stdout: res.stdout ?? "", stderr: res.stderr ?? "", code };
  }

  return { ok: true, skipped: false, command, stdout: res.stdout ?? "", stderr: res.stderr ?? "", code: 0 };
}

const USAGE =
  "Usage: bun scripts/wakaru-normalize.ts <input> -o <output> [--level minimal|standard|aggressive] [--unpack[=auto|strict]] [--dce] [--source-map <file>]";

function main(): void {
  let parsed;
  try {
    parsed = parseArgs({
      args: process.argv.slice(2),
      options: {
        out: { type: "string", short: "o" },
        level: { type: "string" },
        unpack: { type: "string" }, // empty string when given as bare --unpack
        dce: { type: "boolean", default: false },
        "source-map": { type: "string", short: "m" },
      },
      allowPositionals: true,
    });
  } catch (err) {
    console.error(USAGE);
    console.error((err as Error).message);
    process.exit(64);
  }

  const { values, positionals } = parsed;
  const input = positionals[0];
  const output = values.out;
  if (!input || !output) {
    console.error(USAGE);
    process.exit(64);
  }

  const level = values.level as Level | undefined;
  if (level && !["minimal", "standard", "aggressive"].includes(level)) {
    console.error(USAGE);
    console.error(`unknown --level: ${level}`);
    process.exit(64);
  }

  const unpack =
    values.unpack === undefined
      ? undefined
      : values.unpack === "" || values.unpack === "auto"
        ? "auto"
        : values.unpack === "strict"
          ? "strict"
          : (() => {
              console.error(USAGE);
              console.error(`unknown --unpack mode: ${values.unpack}`);
              process.exit(64);
            })();

  const result = normalizePath(input!, output!, {
    level,
    unpack: unpack as NormalizeOptions["unpack"],
    dce: values.dce,
    sourceMap: values["source-map"],
  });

  if (result.stdout) process.stdout.write(result.stdout);
  if (result.stderr) process.stderr.write(result.stderr + "\n");
  process.exit(result.code);
}

if (import.meta.main) {
  main();
}

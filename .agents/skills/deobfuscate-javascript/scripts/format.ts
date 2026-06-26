import * as fs from "node:fs";
import * as path from "node:path";
import { parseArgs } from "node:util";
import { spawnSync } from "node:child_process";

/**
 * Run prettier on a file or directory using `bunx prettier --write`.
 *
 * The caller is expected to have prettier installed in their project, or
 * accessible via the npm registry (bunx will fetch it on demand).
 *
 * This wraps a shell call so the skill has a single, stable entry point
 * for "format the deliverable" — pipeline docs and the polish.ts
 * `--format` flag both call this rather than duplicating the spawn logic.
 */
export type FormatResult = {
  ok: boolean;
  command: string;
  stdout: string;
  stderr: string;
  code: number;
};

export type FormatOptions = {
  /** Don't write — fail with a diff-style report if anything would change. */
  check?: boolean;
  /** Glob to limit which files prettier touches (passed via --no-error-on-unmatched-pattern). */
  glob?: string;
};

function which(cmd: string): string | null {
  const res = spawnSync("which", [cmd], { encoding: "utf-8" });
  if (res.status !== 0) return null;
  return res.stdout.trim() || null;
}

export function formatPath(targetPath: string, opts: FormatOptions = {}): FormatResult {
  if (!fs.existsSync(targetPath)) {
    return {
      ok: false,
      command: "",
      stdout: "",
      stderr: `target does not exist: ${targetPath}`,
      code: 1,
    };
  }

  const stat = fs.statSync(targetPath);
  // If a directory, default to the common JS/TS extensions.
  const target =
    stat.isDirectory() && !opts.glob
      ? path.join(targetPath, "**/*.{ts,tsx,js,jsx,mjs,cjs}")
      : opts.glob
        ? path.join(targetPath, opts.glob)
        : targetPath;

  const prettierArgs = [
    opts.check ? "--check" : "--write",
    "--no-error-on-unmatched-pattern",
    // Prettier 3 honours `.gitignore` by default. Restore deliverables routinely
    // live under a gitignored tree (e.g. a repo that gitignores `restored/`), so
    // the default would SILENTLY skip every file we mean to format. Pin the ignore
    // path to `.prettierignore` only — a missing file is treated as empty, and a
    // real `.prettierignore` is still honoured.
    "--ignore-path",
    ".prettierignore",
    target,
  ];

  // Prefer a `prettier` already on PATH (no network fetch, works offline); fall
  // back to `bunx`, then `npx`, which fetch the package on demand.
  const direct = which("prettier");
  const [runner, args] = direct
    ? [direct, prettierArgs]
    : which("bunx")
      ? ["bunx", ["prettier", ...prettierArgs]]
      : ["npx", ["prettier", ...prettierArgs]];
  const command = `${runner} ${args.join(" ")}`;
  const res = spawnSync(runner, args, { encoding: "utf-8" });
  return {
    ok: res.status === 0,
    command,
    stdout: res.stdout ?? "",
    stderr: res.stderr ?? "",
    code: res.status ?? 1,
  };
}

const USAGE =
  "Usage: bun scripts/format.ts <file-or-dir> [--check] [--glob '**/*.tsx']";

async function main(): Promise<void> {
  let parsed;
  try {
    parsed = parseArgs({
      args: process.argv.slice(2),
      options: {
        check: { type: "boolean", default: false },
        glob: { type: "string" },
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
  const target = positionals[0]!;
  const result = formatPath(target, {
    check: values.check,
    glob: values.glob,
  });

  if (result.stdout) process.stdout.write(result.stdout);
  if (result.stderr) process.stderr.write(result.stderr);
  process.exit(result.code);
}

if (import.meta.main) {
  await main();
}

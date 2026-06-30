import { describe, expect, test } from "bun:test";
import * as fs from "node:fs";
import * as os from "node:os";
import * as path from "node:path";
import { spawnSync } from "node:child_process";
import {
  buildWakaruArgs,
  resolveRunner,
  normalizePath,
  WAKARU_PKG,
} from "./wakaru-normalize.ts";

const SCRIPT = path.join(import.meta.dir, "wakaru-normalize.ts");

function runCLI(args: string[]): { stdout: string; stderr: string; code: number } {
  const result = spawnSync("bun", [SCRIPT, ...args], { encoding: "utf-8" });
  return { stdout: result.stdout ?? "", stderr: result.stderr ?? "", code: result.status ?? 0 };
}

function tmpdir(): string {
  return fs.mkdtempSync(path.join(os.tmpdir(), "wakaru-norm-"));
}

describe("buildWakaruArgs", () => {
  test("default → standard level, force, no unpack/dce", () => {
    const args = buildWakaruArgs("in.js", "out.js");
    expect(args).toEqual(["in.js", "-o", "out.js", "--level", "standard", "--force"]);
  });

  test("honors level / dce / source-map", () => {
    const args = buildWakaruArgs("in.js", "out.js", {
      level: "minimal",
      dce: true,
      sourceMap: "in.js.map",
    });
    expect(args).toContain("minimal");
    expect(args).toContain("--dce");
    expect(args.join(" ")).toContain("--source-map in.js.map");
  });

  test("unpack=true → bare --unpack; string → --unpack=<mode>", () => {
    expect(buildWakaruArgs("in.js", "out/", { unpack: true })).toContain("--unpack");
    expect(buildWakaruArgs("in.js", "out/", { unpack: "strict" })).toContain("--unpack=strict");
  });
});

describe("resolveRunner", () => {
  test("prefers a global wakaru binary", () => {
    const runner = resolveRunner((cmd) => (cmd === "wakaru" ? "/usr/local/bin/wakaru" : null));
    expect(runner).toEqual({ cmd: "wakaru", base: [] });
  });

  test("falls back to pinned npx when only npx exists", () => {
    const runner = resolveRunner((cmd) => (cmd === "npx" ? "/usr/bin/npx" : null));
    expect(runner?.cmd).toBe("npx");
    expect(runner?.base).toContain(WAKARU_PKG);
  });

  test("returns null when neither is available", () => {
    expect(resolveRunner(() => null)).toBeNull();
  });
});

describe("normalizePath — graceful degradation (default-on safety)", () => {
  test("binary unavailable → passthrough copy, skipped, exit 0", () => {
    const dir = tmpdir();
    const input = path.join(dir, "original.js");
    const output = path.join(dir, "normalized.js");
    fs.writeFileSync(input, "const x = 1;\n");

    const res = normalizePath(input, output, {}, { resolve: () => null });

    expect(res.ok).toBe(true);
    expect(res.skipped).toBe(true);
    expect(res.code).toBe(0);
    expect(fs.readFileSync(output, "utf-8")).toBe("const x = 1;\n");
  });

  test("runner can't launch (status null) → passthrough, skipped, exit 0", () => {
    const dir = tmpdir();
    const input = path.join(dir, "original.js");
    const output = path.join(dir, "normalized.js");
    fs.writeFileSync(input, "const y = 2;\n");

    const res = normalizePath(
      input,
      output,
      {},
      { resolve: () => ({ cmd: "wakaru", base: [] }), spawn: () => ({ status: null }) },
    );

    expect(res.skipped).toBe(true);
    expect(res.code).toBe(0);
    expect(fs.readFileSync(output, "utf-8")).toBe("const y = 2;\n");
  });
});

describe("normalizePath — failure surfacing", () => {
  test("wakaru parse error (exit 2) → surfaced as code 2, output still written", () => {
    const dir = tmpdir();
    const input = path.join(dir, "original.js");
    const output = path.join(dir, "normalized.js");
    fs.writeFileSync(input, "const z = 3;\n");

    const res = normalizePath(
      input,
      output,
      {},
      {
        resolve: () => ({ cmd: "wakaru", base: [] }),
        spawn: () => ({ status: 2, stderr: "parse error" }),
      },
    );

    expect(res.ok).toBe(false);
    expect(res.skipped).toBe(false);
    expect(res.code).toBe(2);
    // Passthrough leaves a usable file for the next pipeline step.
    expect(fs.readFileSync(output, "utf-8")).toBe("const z = 3;\n");
  });

  test("success (exit 0) → not skipped, command carries the pinned argv", () => {
    const dir = tmpdir();
    const input = path.join(dir, "original.js");
    const output = path.join(dir, "normalized.js");
    fs.writeFileSync(input, "const a = 4;\n");

    const res = normalizePath(
      input,
      output,
      { level: "standard" },
      {
        resolve: () => ({ cmd: "npx", base: ["--yes", WAKARU_PKG] }),
        spawn: () => ({ status: 0 }),
      },
    );

    expect(res.ok).toBe(true);
    expect(res.skipped).toBe(false);
    expect(res.code).toBe(0);
    expect(res.command).toContain(WAKARU_PKG);
    expect(res.command).toContain("--level standard");
  });

  test("missing input → code 1", () => {
    const res = normalizePath("/nonexistent/nope.js", "/tmp/out.js", {}, { resolve: () => null });
    expect(res.code).toBe(1);
    expect(res.ok).toBe(false);
  });
});

describe("CLI", () => {
  test("no args → usage error, exit 64", () => {
    expect(runCLI([]).code).toBe(64);
  });

  test("missing -o → usage error, exit 64", () => {
    expect(runCLI(["in.js"]).code).toBe(64);
  });

  test("unknown --level → usage error, exit 64", () => {
    const dir = tmpdir();
    const input = path.join(dir, "in.js");
    fs.writeFileSync(input, "1;\n");
    expect(runCLI([input, "-o", path.join(dir, "out.js"), "--level", "bogus"]).code).toBe(64);
  });
});

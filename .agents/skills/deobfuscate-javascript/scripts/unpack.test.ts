import { describe, expect, test } from "bun:test";
import * as fs from "node:fs";
import * as path from "node:path";
import { spawnSync } from "node:child_process";
import { unpack } from "./unpack.ts";

const FIXTURES = path.join(import.meta.dir, "..", "fixtures");
const UNPACK_SCRIPT = path.join(import.meta.dir, "unpack.ts");

function fixture(name: string): string {
  return fs.readFileSync(path.join(FIXTURES, name), "utf-8");
}

function runCLI(
  args: string[],
  input?: string,
): { stdout: string; stderr: string; code: number } {
  const result = spawnSync("bun", [UNPACK_SCRIPT, ...args], {
    input,
    encoding: "utf-8",
  });
  return {
    stdout: result.stdout ?? "",
    stderr: result.stderr ?? "",
    code: result.status ?? 0,
  };
}

describe("unpack (library)", () => {
  test("clean code is unchanged", () => {
    const src = "function add(a, b) { return a + b; } console.log(add(1, 2));";
    const result = unpack(src);
    expect(result.code).toBe(src);
    expect(result.steps).toEqual([]);
    expect(result.evalUsed).toBe(false);
  });

  test("decodes Dean Edwards Packer", () => {
    const result = unpack(fixture("packed.dean-edwards.min.js"));
    expect(result.steps.length).toBeGreaterThan(0);
    expect(result.steps[0]!.kind).toBe("packer");
    expect(result.code).toContain("var a=42");
    expect(result.code).toContain("console.log(a)");
    expect(result.evalUsed).toBe(true);
  });

  test("decodes URL-encoded payload", () => {
    const result = unpack(fixture("url-encoded.min.js"));
    expect(result.steps.length).toBe(1);
    expect(result.steps[0]!.kind).toBe("urlencoded");
    expect(result.code).toContain('var msg = "hello"');
    expect(result.evalUsed).toBe(false);
  });

  test("--no-eval refuses Packer and returns unchanged", () => {
    const warnings: string[] = [];
    const src = fixture("packed.dean-edwards.min.js");
    const result = unpack(src, { noEval: true, warn: (m) => warnings.push(m) });
    expect(result.code).toBe(src);
    expect(result.steps).toEqual([]);
    expect(result.evalRefused).toBe(true);
    expect(result.evalUsed).toBe(false);
    expect(warnings.some((w) => w.includes("refused"))).toBe(true);
  });

  test("--no-eval refuses AAEncode and returns unchanged", () => {
    const warnings: string[] = [];
    const src = fixture("aaencode.min.js");
    const result = unpack(src, { noEval: true, warn: (m) => warnings.push(m) });
    expect(result.code).toBe(src);
    expect(result.evalRefused).toBe(true);
    expect(result.evalUsed).toBe(false);
  });

  test("--no-eval still allows URL-decode (no eval needed)", () => {
    const result = unpack(fixture("url-encoded.min.js"), { noEval: true });
    expect(result.steps.length).toBe(1);
    expect(result.steps[0]!.kind).toBe("urlencoded");
    expect(result.evalUsed).toBe(false);
    expect(result.evalRefused).toBe(false);
  });

  test("idempotent: re-unpacking unpacked output is a no-op", () => {
    const first = unpack(fixture("packed.dean-edwards.min.js"));
    const second = unpack(first.code);
    expect(second.steps).toEqual([]);
    expect(second.code).toBe(first.code);
  });

  test("respects maxIterations", () => {
    const result = unpack(fixture("packed.dean-edwards.min.js"), {
      maxIterations: 1,
    });
    expect(result.iterations).toBeLessThanOrEqual(1);
  });

  test("emits warn callback on eval attempts", () => {
    const warnings: string[] = [];
    unpack(fixture("packed.dean-edwards.min.js"), {
      warn: (m) => warnings.push(m),
    });
    expect(warnings.some((w) => w.includes("new Function"))).toBe(true);
  });
});

describe("unpack (CLI)", () => {
  test("missing arg exits 64", () => {
    const { code, stderr } = runCLI([]);
    expect(code).toBe(64);
    expect(stderr).toContain("Usage");
  });

  test("decodes packer fixture to stdout", () => {
    const { stdout, stderr, code } = runCLI([
      path.join(FIXTURES, "packed.dean-edwards.min.js"),
    ]);
    expect(code).toBe(0);
    expect(stdout).toContain("var a=42");
    expect(stderr).toContain("packer");
  });

  test("decodes from stdin via -", () => {
    const src = fixture("url-encoded.min.js");
    const { stdout, code } = runCLI(["-"], src);
    expect(code).toBe(0);
    expect(stdout).toContain('var msg = "hello"');
  });

  test("--no-eval refuses packer and stderr warns", () => {
    const { stdout, stderr, code } = runCLI([
      path.join(FIXTURES, "packed.dean-edwards.min.js"),
      "--no-eval",
    ]);
    expect(code).toBe(0);
    expect(stdout).toContain("eval(function(p,a,c,k,e,d)");
    expect(stderr).toContain("refused");
  });

  test("--out writes to file", () => {
    const tmp = path.join(
      import.meta.dir,
      "..",
      `tmp-unpack-${Date.now()}.js`,
    );
    try {
      const { code } = runCLI([
        path.join(FIXTURES, "url-encoded.min.js"),
        "--out",
        tmp,
      ]);
      expect(code).toBe(0);
      const written = fs.readFileSync(tmp, "utf-8");
      expect(written).toContain('var msg = "hello"');
    } finally {
      if (fs.existsSync(tmp)) fs.unlinkSync(tmp);
    }
  });
});

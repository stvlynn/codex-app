import { describe, expect, test } from "bun:test";
import * as fs from "node:fs";
import * as path from "node:path";
import { spawnSync } from "node:child_process";
import { decodeStrings } from "./decode-strings.ts";

const FIXTURES = path.join(import.meta.dir, "..", "fixtures");
const SCRIPT = path.join(import.meta.dir, "decode-strings.ts");

function fixture(name: string): string {
  return fs.readFileSync(path.join(FIXTURES, name), "utf-8");
}

function runCLI(
  args: string[],
  input?: string,
): { stdout: string; stderr: string; code: number } {
  const result = spawnSync("bun", [SCRIPT, ...args], {
    input,
    encoding: "utf-8",
  });
  return {
    stdout: result.stdout ?? "",
    stderr: result.stderr ?? "",
    code: result.status ?? 0,
  };
}

describe("decode-strings (library)", () => {
  test("empty source returns empty", () => {
    const result = decodeStrings("");
    expect(result.code).toBe("");
  });

  test("decodes String.fromCharCode with all numeric args", () => {
    const src = 'var x = String.fromCharCode(72, 105);\n';
    const result = decodeStrings(src);
    expect(result.stats.fromCharCode).toBe(1);
    expect(result.code).toContain('"Hi"');
    expect(result.code).not.toContain("fromCharCode");
  });

  test("leaves String.fromCharCode with non-numeric arg alone", () => {
    const src = "var x = String.fromCharCode(72, n);\n";
    const result = decodeStrings(src);
    expect(result.stats.fromCharCode).toBe(0);
    expect(result.code).toContain("String.fromCharCode(72, n)");
  });

  test("decodes atob with string literal arg", () => {
    const src = 'var x = atob("aGVsbG8=");\n';
    const result = decodeStrings(src);
    expect(result.stats.atob).toBe(1);
    expect(result.code).toContain('"hello"');
    expect(result.code).not.toContain("atob");
  });

  test("leaves atob with variable arg alone", () => {
    const src = "var x = atob(payload);\n";
    const result = decodeStrings(src);
    expect(result.stats.atob).toBe(0);
    expect(result.code).toContain("atob(payload)");
  });

  test("ignores invalid base64 in atob", () => {
    const src = 'var x = atob("!!!not-base64");\n';
    const result = decodeStrings(src);
    // Bun's atob is lenient — accept either behavior, but no crash
    expect(result.stats).toBeDefined();
  });

  test("normalizes \\xNN escapes in string literals", () => {
    const src = 'var x = "\\x48\\x69";\n';
    const result = decodeStrings(src);
    expect(result.stats.escapesNormalized).toBe(true);
    expect(result.code).toContain('"Hi"');
    expect(result.code).not.toContain("\\x48");
  });

  test("normalizes \\uNNNN escapes in string literals", () => {
    const src = 'var x = "\\u0048\\u0069";\n';
    const result = decodeStrings(src);
    expect(result.stats.escapesNormalized).toBe(true);
    expect(result.code).toContain('"Hi"');
    expect(result.code).not.toContain("\\u00");
  });

  test("from-char-code fixture decodes correctly", () => {
    const result = decodeStrings(fixture("from-char-code.min.js"));
    expect(result.code).toContain('"Hello"');
    expect(result.code).toContain('"World"');
    expect(result.code).toContain('"hello world"');
    expect(result.code).toContain("String.fromCharCode(72, x)");
  });

  test("idempotent: re-run produces same code", () => {
    const first = decodeStrings(fixture("from-char-code.min.js"));
    const second = decodeStrings(first.code);
    expect(second.code).toBe(first.code);
    expect(second.stats.fromCharCode).toBe(0);
    expect(second.stats.atob).toBe(0);
  });

  test("clean code with no encoded strings is essentially unchanged", () => {
    const src = "function add(a, b) {\n  return a + b;\n}\n";
    const result = decodeStrings(src);
    expect(result.stats.fromCharCode).toBe(0);
    expect(result.stats.atob).toBe(0);
    expect(result.code.replace(/\s+/g, " ").trim()).toBe(
      src.replace(/\s+/g, " ").trim(),
    );
  });
});

describe("decode-strings (CLI)", () => {
  test("missing arg exits 64", () => {
    const { code, stderr } = runCLI([]);
    expect(code).toBe(64);
    expect(stderr).toContain("Usage");
  });

  test("decodes fixture", () => {
    const { stdout, stderr, code } = runCLI([
      path.join(FIXTURES, "from-char-code.min.js"),
    ]);
    expect(code).toBe(0);
    expect(stdout).toContain('"Hello"');
    expect(stderr).toContain("fromCharCode");
  });

  test("stdin works", () => {
    const { stdout, code } = runCLI(
      ["-"],
      'var x = String.fromCharCode(72, 105);\n',
    );
    expect(code).toBe(0);
    expect(stdout).toContain('"Hi"');
  });

  test("invalid source exits 2", () => {
    const { code } = runCLI(["-"], "var x = {");
    expect(code).toBe(2);
  });
});

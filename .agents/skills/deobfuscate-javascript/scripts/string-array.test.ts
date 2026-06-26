import { describe, expect, test } from "bun:test";
import * as fs from "node:fs";
import * as path from "node:path";
import { spawnSync } from "node:child_process";
import { transformStringArrays } from "./string-array.ts";

const FIXTURES = path.join(import.meta.dir, "..", "fixtures");
const SCRIPT = path.join(import.meta.dir, "string-array.ts");

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

describe("string-array (library)", () => {
  test("empty source returns empty", () => {
    const result = transformStringArrays("");
    expect(result.code).toBe("");
    expect(result.stats.arraysCollected).toBe(0);
  });

  test("code with no _0x arrays is unchanged", () => {
    const src = "var x = ['a', 'b']; console.log(x[0]);\n";
    const result = transformStringArrays(src);
    expect(result.stats.arraysCollected).toBe(0);
    expect(result.code).toBe(src);
  });

  test("collects array, inlines refs, removes declaration", () => {
    const result = transformStringArrays(fixture("string-array-obfuscator.min.js"));
    expect(result.stats.arraysCollected).toBe(1);
    expect(result.stats.referencesReplaced).toBeGreaterThanOrEqual(4);
    expect(result.stats.arraysRemoved).toBe(1);
    expect(result.code).not.toMatch(/_0xabc1/);
    expect(result.code).not.toMatch(/\bpush\b.*\bshift\b/);
  });

  test("applies numeric rotation count", () => {
    const src = `
      var _0xa = ['log', 'hello', 'world', 'info'];
      (function (_0xb, _0xc) {
        var _0xd = function (_0xe) {
          while (--_0xe) { _0xb['push'](_0xb['shift']()); }
        };
        _0xd(2);
      }(_0xa, 1));
      console[_0xa[0]](_0xa[1]);
    `;
    const result = transformStringArrays(src);
    expect(result.stats.rotationsApplied).toBe(1);
    expect(result.code).toContain('"hello"');
    expect(result.code).toContain('"world"');
  });

  test("decoder indirection: collected but only accessed via dynamic index", () => {
    const src = `
      var _0xabc = ['foo', 'bar'];
      function _0xdec(i) { return _0xabc[i]; }
      console.log(_0xdec(0));
    `;
    const result = transformStringArrays(src);
    expect(result.stats.arraysCollected).toBe(1);
    expect(result.stats.referencesReplaced).toBe(0);
    expect(result.stats.decoderIndirection).toBe(true);
  });

  test("decoder indirection: collected but never indexed at all", () => {
    const src = `
      var _0xabc = ['foo', 'bar'];
      var x = _0xabc;
      console.log(x);
    `;
    const result = transformStringArrays(src);
    expect(result.stats.arraysCollected).toBe(1);
    expect(result.stats.decoderIndirection).toBe(true);
  });

  test("idempotent: re-run produces no further changes", () => {
    const first = transformStringArrays(fixture("string-array-obfuscator.min.js"));
    const second = transformStringArrays(first.code);
    expect(second.stats.arraysCollected).toBe(0);
    expect(second.code).toBe(first.code);
  });

  test("respects scope: same name in different scope is not replaced", () => {
    const src = `
      var _0xabc = ['outer'];
      function f() {
        var _0xabc = ['inner'];
        return _0xabc[0];
      }
      console.log(_0xabc[0], f());
    `;
    const result = transformStringArrays(src);
    expect(result.code).toContain('"outer"');
    expect(result.code).toContain('"inner"');
  });

  test("ignores arrays with non-string elements", () => {
    const src = `
      var _0xmixed = ['ok', 42, 'no'];
      console.log(_0xmixed[0]);
    `;
    const result = transformStringArrays(src);
    expect(result.stats.arraysCollected).toBe(0);
    expect(result.code).toContain("_0xmixed");
  });

  test("string-index access also works", () => {
    const src = `
      var _0xabc = ['a', 'b'];
      console.log(_0xabc['0'], _0xabc['1']);
    `;
    const result = transformStringArrays(src);
    expect(result.stats.referencesReplaced).toBe(2);
    expect(result.code).toContain('"a"');
    expect(result.code).toContain('"b"');
  });
});

describe("string-array (CLI)", () => {
  test("missing arg exits 64", () => {
    const { code, stderr } = runCLI([]);
    expect(code).toBe(64);
    expect(stderr).toContain("Usage");
  });

  test("decodes string-array fixture", () => {
    const { stdout, stderr, code } = runCLI([
      path.join(FIXTURES, "string-array-obfuscator.min.js"),
    ]);
    expect(code).toBe(0);
    expect(stdout).not.toMatch(/_0xabc1/);
    expect(stderr).toContain("array(s)");
  });

  test("reads from stdin", () => {
    const src = fixture("string-array-obfuscator.min.js");
    const { stdout, code } = runCLI(["-"], src);
    expect(code).toBe(0);
    expect(stdout).not.toMatch(/_0xabc1/);
  });

  test("invalid input exits 2", () => {
    const { code } = runCLI(["-"], "var x = {");
    expect(code).toBe(2);
  });
});

import { describe, expect, test } from "bun:test";
import * as path from "node:path";
import { spawnSync } from "node:child_process";
import { inlineDefaults } from "./inline-defaults.ts";

const SCRIPT = path.join(import.meta.dir, "inline-defaults.ts");

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

function normalize(code: string): string {
  return code.replace(/\s+/g, " ").trim();
}

describe("inline-defaults (library)", () => {
  test("empty source", () => {
    expect(inlineDefaults("").code).toBe("");
  });

  test("merges let A, B; ({A, B} = expr); into let { A, B } = expr;", () => {
    const src = `
      function f(props) {
        let a, b;
        ({ a, b } = props);
        return a + b;
      }
    `;
    const out = inlineDefaults(src);
    expect(out.stats.letAssignMerged).toBe(1);
    const n = normalize(out.code);
    expect(n).toContain("let { a, b } = props");
    expect(n).not.toContain("({ a, b } = props)");
  });

  test("inlines === undefined default into destructure", () => {
    const src = `
      function f(props) {
        let { a } = props;
        let resolved = a === undefined ? "fallback" : a;
        return resolved;
      }
    `;
    const out = inlineDefaults(src);
    expect(out.stats.defaultsInlined).toBe(1);
    const n = normalize(out.code);
    expect(n).toContain('a = "fallback"');
    expect(n).not.toContain("let resolved =");
    expect(n).toContain("return a");
  });

  test("inlines ?? default into destructure", () => {
    const src = `
      function f(props) {
        let { a } = props;
        let resolved = a ?? "fallback";
        return resolved;
      }
    `;
    const out = inlineDefaults(src);
    expect(out.stats.defaultsInlined).toBe(1);
    const n = normalize(out.code);
    expect(n).toContain('a = "fallback"');
  });

  test("handles void 0 form on the right side", () => {
    const src = `
      function f(props) {
        let { a } = props;
        let resolved = a === void 0 ? false : a;
        return resolved;
      }
    `;
    const out = inlineDefaults(src);
    expect(out.stats.defaultsInlined).toBe(1);
    const n = normalize(out.code);
    expect(n).toContain("a = false");
  });

  test("handles undefined === a form (operand order flipped)", () => {
    const src = `
      function f(props) {
        let { a } = props;
        let resolved = undefined === a ? 0 : a;
        return resolved;
      }
    `;
    const out = inlineDefaults(src);
    expect(out.stats.defaultsInlined).toBe(1);
  });

  test("handles !== reversed form", () => {
    const src = `
      function f(props) {
        let { a } = props;
        let resolved = a !== undefined ? a : "fallback";
        return resolved;
      }
    `;
    const out = inlineDefaults(src);
    expect(out.stats.defaultsInlined).toBe(1);
    const n = normalize(out.code);
    expect(n).toContain('a = "fallback"');
  });

  test("merges + inlines defaults end-to-end (typical React Compiler output)", () => {
    const src = `
      function Button(props) {
        let uniform, color, size;
        ({ uniform, color, size } = props);
        let isUniform = uniform === undefined ? false : uniform,
          resolvedColor = color === undefined ? "primary" : color,
          resolvedSize = size === undefined ? "default" : size;
        return [isUniform, resolvedColor, resolvedSize];
      }
    `;
    const out = inlineDefaults(src);
    expect(out.stats.letAssignMerged).toBe(1);
    expect(out.stats.defaultsInlined).toBe(3);
    expect(out.stats.aliasesRemoved).toBe(3);
    const n = normalize(out.code);
    expect(n).toContain("uniform = false");
    expect(n).toContain('color = "primary"');
    expect(n).toContain('size = "default"');
    expect(n).toContain("return [uniform, color, size]");
  });

  test("safe default check: skips non-literal defaults", () => {
    const src = `
      function f(props) {
        let { a } = props;
        let resolved = a === undefined ? compute() : a;
        return resolved;
      }
    `;
    const out = inlineDefaults(src);
    expect(out.stats.defaultsInlined).toBe(0);
    expect(normalize(out.code)).toContain("let resolved");
  });

  test("leaves untouched when source name isn't destructured", () => {
    const src = `
      function f(p) {
        let resolved = p === undefined ? "default" : p;
        return resolved;
      }
    `;
    const out = inlineDefaults(src);
    expect(out.stats.defaultsInlined).toBe(0);
  });

  test("leaves untouched when destructure already has a different default", () => {
    const src = `
      function f(props) {
        let { a = "other" } = props;
        let resolved = a === undefined ? "fallback" : a;
        return resolved;
      }
    `;
    const out = inlineDefaults(src);
    expect(out.stats.defaultsInlined).toBe(0);
  });

  test("collapses default-equivalent existing default and removes alias", () => {
    const src = `
      function f(props) {
        let { a = "X" } = props;
        let resolved = a === undefined ? "X" : a;
        return resolved;
      }
    `;
    const out = inlineDefaults(src);
    expect(out.stats.defaultsInlined).toBe(1);
    expect(normalize(out.code)).toContain("return a");
  });

  test("merge skipped when sibling assignment names mismatch", () => {
    const src = `
      function f(props) {
        let a, b, c;
        ({ a, b } = props);
        return a + b + c;
      }
    `;
    const out = inlineDefaults(src);
    expect(out.stats.letAssignMerged).toBe(0);
  });
});

describe("inline-defaults (CLI)", () => {
  test("reads stdin, writes stdout", () => {
    const src = `function f(p) { let { a } = p; let r = a === undefined ? "x" : a; return r; }`;
    const res = runCLI(["-"], src);
    expect(res.code).toBe(0);
    expect(res.stdout).toContain('a = "x"');
    expect(res.stderr).toContain("inline-defaults:");
  });

  test("missing positional → exit 64", () => {
    const res = runCLI([]);
    expect(res.code).toBe(64);
  });
});

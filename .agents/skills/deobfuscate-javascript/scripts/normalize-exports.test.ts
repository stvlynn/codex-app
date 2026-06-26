import { describe, expect, test } from "bun:test";
import * as path from "node:path";
import { spawnSync } from "node:child_process";
import { normalizeExports } from "./normalize-exports.ts";

const SCRIPT = path.join(import.meta.dir, "normalize-exports.ts");

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

describe("normalize-exports (library)", () => {
  test("empty source", () => {
    expect(normalizeExports("").code).toBe("");
  });

  test("merges var X = expr; export { X as Y }; into export const Y = expr", () => {
    const src = `var X = 42; export { X as Y };`;
    const out = normalizeExports(src);
    expect(normalize(out.code)).toContain("export const Y = 42");
    expect(normalize(out.code)).not.toContain("export {");
    expect(out.stats.inlined).toBe(1);
  });

  test("--prefer local keeps the local name", () => {
    const src = `var X = 42; export { X as Y };`;
    const out = normalizeExports(src, { prefer: "local" });
    expect(normalize(out.code)).toContain("export const X = 42");
    expect(out.stats.inlined).toBe(1);
  });

  test("splits multi-declarator var", () => {
    const src = `var r = 1, i = 2; export { i as t };`;
    const out = normalizeExports(src);
    const n = normalize(out.code);
    expect(n).toContain("var r = 1");
    expect(n).toContain("export const t = 2");
    expect(n).not.toContain("export { i");
    expect(out.stats.inlined).toBe(1);
  });

  test("preserves destructured declarators instead of replacing the whole pattern", () => {
    const src = `
      var { schedule: frameSchedule, cancel: frameCancel, state: frameState } = createFrame();
      export { frameSchedule, frameCancel, frameState };
    `;
    const out = normalizeExports(src, { prefer: "local" });
    const n = normalize(out.code);
    expect(n).toContain(
      "var { schedule: frameSchedule, cancel: frameCancel, state: frameState } = createFrame();",
    );
    expect(n).toContain("export { frameSchedule, frameCancel, frameState };");
    expect(out.stats.inlined).toBe(0);
    expect(out.stats.preserved).toBe(3);
  });

  test("converts function declaration", () => {
    const src = `function X() { return 1; } export { X as Y };`;
    const out = normalizeExports(src);
    const n = normalize(out.code);
    expect(n).toContain("export function Y()");
    expect(out.stats.inlined).toBe(1);
  });

  test("converts class declaration", () => {
    const src = `class X {} export { X as Y };`;
    const out = normalizeExports(src);
    const n = normalize(out.code);
    expect(n).toContain("export class Y");
    expect(out.stats.inlined).toBe(1);
  });

  test("preserves when local has additional references", () => {
    const src = `var X = 1; console.log(X); export { X as Y };`;
    const out = normalizeExports(src);
    expect(normalize(out.code)).toContain("export {");
    expect(out.stats.preserved).toBeGreaterThan(0);
  });

  test("preserves re-export (export { ... } from '...')", () => {
    const src = `export { X as Y } from "./other.js";`;
    const out = normalizeExports(src);
    expect(out.code).toContain("export {");
    expect(out.code).toContain('from "./other.js"');
  });

  test("clock-icon shaped: var with arrow, exported aliased", () => {
    const src = `
      var r = require_jsx();
      var i = (e) => <svg {...e}/>;
      export { i as t };
    `;
    const out = normalizeExports(src);
    const n = normalize(out.code);
    expect(n).toContain("export const t = e => <svg");
    expect(out.stats.inlined).toBe(1);
  });
});

describe("normalize-exports (CLI)", () => {
  test("reads stdin, writes stdout", () => {
    const res = runCLI(["-"], `var X = 1; export { X as Y };`);
    expect(res.code).toBe(0);
    expect(res.stdout).toContain("export const Y = 1");
  });

  test("--prefer with bad value → exit 64", () => {
    const res = runCLI(["-", "--prefer", "weird"], `var X = 1;`);
    expect(res.code).toBe(64);
  });
});

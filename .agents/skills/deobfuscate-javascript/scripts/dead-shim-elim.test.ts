import { describe, expect, test } from "bun:test";
import { eliminateDeadShim } from "./dead-shim-elim.ts";

describe("eliminateDeadShim", () => {
  test("removes a dead lazy-getter cascade (var → import)", () => {
    const src = [
      `import { t as loadJsxRuntime } from "./jsx-runtime-X.js";`,
      `import { foo } from "./other.js";`,
      `var jsxRuntime = loadJsxRuntime();`,
      `export function App() { return foo(); }`,
    ].join("\n");
    const { code, stats } = eliminateDeadShim(src);
    expect(stats.varsRemoved).toBe(1);
    expect(stats.importsRemoved).toBe(1);
    expect(stats.importDeclarationsRemoved).toBe(1);
    expect(code).not.toContain("loadJsxRuntime");
    expect(code).not.toContain("jsxRuntime");
    expect(code).toContain('import { foo } from "./other.js"');
    expect(code).toContain("export function App");
  });

  test("preserves vars whose init has real side effects", () => {
    const src = [
      `import { sideEffect } from "./other.js";`,
      `var keep = sideEffect();`, // unreferenced but the import has another use
      `export function App() { sideEffect(); }`,
    ].join("\n");
    const { code, stats } = eliminateDeadShim(src);
    expect(stats.varsRemoved).toBe(0);
    expect(code).toContain("var keep = sideEffect()");
  });

  test("does not remove an import specifier that still has refs", () => {
    const src = [
      `import { used, unused } from "./other.js";`,
      `export const value = used;`,
    ].join("\n");
    const { code, stats } = eliminateDeadShim(src);
    expect(stats.importsRemoved).toBe(1);
    expect(code).toContain('import { used } from "./other.js"');
    expect(code).not.toContain("unused");
  });

  test("removes unused literal vars", () => {
    const src = [
      `var dead = 42;`,
      `var aliveButTouched = { foo: 1 };`,
      `console.log(aliveButTouched);`,
    ].join("\n");
    const { code, stats } = eliminateDeadShim(src);
    expect(stats.varsRemoved).toBe(1);
    expect(code).not.toContain("var dead");
    expect(code).toContain("aliveButTouched");
  });

  test("doesn't touch CallExpression vars whose callee has external refs", () => {
    const src = [
      `import { f } from "./other.js";`,
      `var x = f();`,
      `f();`, // additional call site
    ].join("\n");
    const { code, stats } = eliminateDeadShim(src);
    expect(stats.varsRemoved).toBe(0);
    expect(code).toContain("var x = f()");
  });

  test("iteratively cascades: removing one dead var unlocks another", () => {
    const src = [
      `import { a, b } from "./other.js";`,
      `var first = a();`,
      `var second = b();`,
      // No further references → both should be removed and the whole import dropped.
    ].join("\n");
    const { code, stats } = eliminateDeadShim(src);
    expect(stats.varsRemoved).toBe(2);
    expect(stats.importDeclarationsRemoved).toBe(1);
    expect(code.trim()).toBe("");
  });

  test("removes dead JSX runtime initialization expression", () => {
    const src = [
      `import { s as __toESM } from "./chunk-Bj-mKKzh.js";`,
      `import { n as loadJsxRuntimeRaw } from "./jsx-runtime-CiQ1k8xo.js";`,
      `__toESM(loadJsxRuntimeRaw());`,
      `export function DownloadIcon(props) { return <svg {...props} />; }`,
    ].join("\n");
    const { code, stats } = eliminateDeadShim(src);
    expect(stats.expressionStatementsRemoved).toBe(1);
    expect(stats.importDeclarationsRemoved).toBe(2);
    expect(code).not.toContain("__toESM");
    expect(code).not.toContain("loadJsxRuntimeRaw");
    expect(code).not.toContain("jsx-runtime");
    expect(code).toContain("DownloadIcon");
  });

  test("preserves runtime-looking calls when helper has another reference", () => {
    const src = [
      `import { s as __toESM } from "./chunk-Bj-mKKzh.js";`,
      `import { n as loadJsxRuntimeRaw } from "./jsx-runtime-CiQ1k8xo.js";`,
      `__toESM(loadJsxRuntimeRaw());`,
      `export const helper = __toESM;`,
    ].join("\n");
    const { code, stats } = eliminateDeadShim(src);
    expect(stats.expressionStatementsRemoved).toBe(0);
    expect(code).toContain("__toESM(loadJsxRuntimeRaw())");
  });
});

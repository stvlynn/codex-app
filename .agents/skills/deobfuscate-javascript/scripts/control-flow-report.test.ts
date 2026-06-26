import { describe, expect, test } from "bun:test";
import * as fs from "node:fs";
import * as path from "node:path";
import { spawnSync } from "node:child_process";
import { analyzeControlFlow } from "./control-flow-report.ts";

const FIXTURES = path.join(import.meta.dir, "..", "fixtures");
const SCRIPT = path.join(import.meta.dir, "control-flow-report.ts");

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

describe("control-flow-report (library)", () => {
  test("empty input returns empty report", () => {
    const report = analyzeControlFlow("");
    expect(report.size).toBe(0);
    expect(report.flatteners).toEqual([]);
    expect(report.splitDispatches).toEqual([]);
    expect(report.opaquePredicates).toEqual([]);
    expect(report.summary).toBe("empty input");
  });

  test("clean code returns empty pattern arrays", () => {
    const src = "function add(a, b) { return a + b; }\n";
    const report = analyzeControlFlow(src);
    expect(report.flatteners).toEqual([]);
    expect(report.splitDispatches).toEqual([]);
    expect(report.opaquePredicates).toEqual([]);
    expect(report.summary).toBe("no control-flow obfuscation patterns detected");
  });

  test("detects while(true){switch} flattener with case count", () => {
    const src = `
      function f() {
        var state = 0;
        while (true) {
          switch (state) {
            case 0: state = 1; break;
            case 1: state = 2; break;
            case 2: return;
          }
        }
      }
    `;
    const report = analyzeControlFlow(src);
    expect(report.flatteners).toHaveLength(1);
    expect(report.flatteners[0]!.caseCount).toBe(3);
    expect(report.flatteners[0]!.dispatchVariable).toBe("state");
    expect(report.flatteners[0]!.caseLabels).toEqual([0, 1, 2]);
    expect(report.flatteners[0]!.containingFunction).toBe("f");
  });

  test("detects while(!![]){switch} flattener", () => {
    const src = `
      var s = 0;
      while (!![]) {
        switch (s) {
          case 0: s = 1; break;
          case 1: return;
        }
      }
    `;
    const report = analyzeControlFlow(src);
    expect(report.flatteners).toHaveLength(1);
    expect(report.flatteners[0]!.caseCount).toBe(2);
  });

  test("detects while(1){switch} flattener", () => {
    const src = `
      var s = 0;
      while (1) {
        switch (s) {
          case 0: s = 1; break;
          default: return;
        }
      }
    `;
    const report = analyzeControlFlow(src);
    expect(report.flatteners).toHaveLength(1);
  });

  test("ignores while(true) without inner switch", () => {
    const src = `
      while (true) {
        if (done) break;
        step();
      }
    `;
    const report = analyzeControlFlow(src);
    expect(report.flatteners).toEqual([]);
  });

  test("ignores while(cond) with non-constant test", () => {
    const src = `
      while (x < 10) {
        switch (x) {
          case 0: x = 1; break;
          default: x++;
        }
      }
    `;
    const report = analyzeControlFlow(src);
    expect(report.flatteners).toEqual([]);
  });

  test("detects split-string-dispatch with all numeric parts", () => {
    const src = 'var order = "0|1|2|3".split("|");\n';
    const report = analyzeControlFlow(src);
    expect(report.splitDispatches).toHaveLength(1);
    expect(report.splitDispatches[0]!.states).toEqual(["0", "1", "2", "3"]);
    expect(report.splitDispatches[0]!.splitOn).toBe("|");
  });

  test("ignores split with non-numeric parts", () => {
    const src = 'var parts = "foo|bar|baz".split("|");\n';
    const report = analyzeControlFlow(src);
    expect(report.splitDispatches).toEqual([]);
  });

  test("ignores split with single result", () => {
    const src = 'var only = "5".split("|");\n';
    const report = analyzeControlFlow(src);
    expect(report.splitDispatches).toEqual([]);
  });

  test("detects literal-vs-literal opaque predicate (truthy)", () => {
    const src = "if (5 > 3) { f(); }\n";
    const report = analyzeControlFlow(src);
    expect(report.opaquePredicates).toHaveLength(1);
    expect(report.opaquePredicates[0]!.flavor).toBe("literal-vs-literal");
    expect(report.opaquePredicates[0]!.alwaysTruthy).toBe(true);
  });

  test("detects literal-vs-literal opaque predicate (falsy)", () => {
    const src = "if (1 === 2) { f(); }\n";
    const report = analyzeControlFlow(src);
    expect(report.opaquePredicates).toHaveLength(1);
    expect(report.opaquePredicates[0]!.alwaysTruthy).toBe(false);
  });

  test("detects !![] opaque predicate", () => {
    const src = "if (!![]) { f(); }\n";
    const report = analyzeControlFlow(src);
    expect(report.opaquePredicates).toHaveLength(1);
    expect(report.opaquePredicates[0]!.flavor).toBe("not-not-array");
    expect(report.opaquePredicates[0]!.alwaysTruthy).toBe(true);
  });

  test("detects !!{} opaque predicate", () => {
    const src = "if (!!{}) { f(); }\n";
    const report = analyzeControlFlow(src);
    expect(report.opaquePredicates).toHaveLength(1);
    expect(report.opaquePredicates[0]!.flavor).toBe("not-not-object");
    expect(report.opaquePredicates[0]!.alwaysTruthy).toBe(true);
  });

  test("detects void 0 opaque predicate", () => {
    const src = "if (void 0) { f(); }\n";
    const report = analyzeControlFlow(src);
    expect(report.opaquePredicates).toHaveLength(1);
    expect(report.opaquePredicates[0]!.flavor).toBe("void-zero");
    expect(report.opaquePredicates[0]!.alwaysTruthy).toBe(false);
  });

  test("ignores normal if condition", () => {
    const src = "if (x > 5) { f(); }\n";
    const report = analyzeControlFlow(src);
    expect(report.opaquePredicates).toEqual([]);
  });

  test("control-flow-flat fixture: one flattener with 4 cases", () => {
    const report = analyzeControlFlow(fixture("control-flow-flat.min.js"));
    expect(report.flatteners).toHaveLength(1);
    const f = report.flatteners[0]!;
    expect(f.caseCount).toBe(4);
    expect(f.dispatchVariable).toBe("state");
    expect(f.containingFunction).toBe("process");
  });

  test("opaque-predicates fixture: detects all three", () => {
    const report = analyzeControlFlow(fixture("opaque-predicates.min.js"));
    expect(report.opaquePredicates).toHaveLength(3);
    const flavors = report.opaquePredicates.map((p) => p.flavor);
    expect(flavors).toContain("literal-vs-literal");
    expect(flavors).toContain("not-not-array");
    const literals = report.opaquePredicates.filter(
      (p) => p.flavor === "literal-vs-literal",
    );
    expect(literals).toHaveLength(2);
    expect(literals.some((p) => p.alwaysTruthy)).toBe(true);
    expect(literals.some((p) => !p.alwaysTruthy)).toBe(true);
  });

  test("report is read-only (does not mutate source)", () => {
    const src = "if (5 > 3) { f(); }\n";
    const before = src;
    analyzeControlFlow(src);
    expect(src).toBe(before);
  });

  test("summary mentions all categories when all present", () => {
    const src = `
      var order = "0|1".split("|");
      while (true) {
        switch (s) { case 0: break; }
      }
      if (5 > 3) { f(); }
    `;
    const report = analyzeControlFlow(src);
    expect(report.summary).toContain("flattener");
    expect(report.summary).toContain("split-dispatch");
    expect(report.summary).toContain("opaque predicate");
  });
});

describe("control-flow-report (CLI)", () => {
  test("missing arg exits 64", () => {
    const { code, stderr } = runCLI([]);
    expect(code).toBe(64);
    expect(stderr).toContain("Usage");
  });

  test("reports on fixture via stdout", () => {
    const { stdout, stderr, code } = runCLI([
      path.join(FIXTURES, "control-flow-flat.min.js"),
    ]);
    expect(code).toBe(0);
    const report = JSON.parse(stdout);
    expect(report.flatteners).toHaveLength(1);
    expect(stderr).toContain("flattener");
  });

  test("stdin works", () => {
    const { stdout, code } = runCLI(["-"], "if (5 > 3) { f(); }\n");
    expect(code).toBe(0);
    const report = JSON.parse(stdout);
    expect(report.opaquePredicates).toHaveLength(1);
  });

  test("--out writes report to file", () => {
    const tmpOut = path.join(import.meta.dir, "..", "tmp-cf-report.json");
    try {
      const { code } = runCLI([
        path.join(FIXTURES, "opaque-predicates.min.js"),
        "--out",
        tmpOut,
      ]);
      expect(code).toBe(0);
      const content = fs.readFileSync(tmpOut, "utf-8");
      const report = JSON.parse(content);
      expect(report.opaquePredicates).toHaveLength(3);
    } finally {
      try {
        fs.unlinkSync(tmpOut);
      } catch {}
    }
  });

  test("invalid source exits 2", () => {
    const { code } = runCLI(["-"], "var x = {");
    expect(code).toBe(2);
  });
});

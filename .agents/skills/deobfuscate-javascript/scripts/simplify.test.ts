import { describe, expect, test } from "bun:test";
import * as fs from "node:fs";
import * as path from "node:path";
import { spawnSync } from "node:child_process";
import { simplify } from "./simplify.ts";

const FIXTURES = path.join(import.meta.dir, "..", "fixtures");
const SCRIPT = path.join(import.meta.dir, "simplify.ts");

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

function normalize(code: string): string {
  return code.replace(/\s+/g, " ").trim();
}

describe("simplify (library)", () => {
  test("empty source returns empty", () => {
    const result = simplify("");
    expect(result.code).toBe("");
  });

  test("folds 1+2 to 3", () => {
    const result = simplify("var x = 1 + 2;\n");
    expect(result.code).toContain("var x = 3");
  });

  test("folds bitwise ops", () => {
    const result = simplify("var x = 0xff & 0x0f;\n");
    expect(result.code).toContain("var x = 15");
  });

  test("concatenates string literals", () => {
    const result = simplify('var x = "foo" + "bar";\n');
    expect(result.code).toContain('"foobar"');
  });

  test("folds comparison true cases", () => {
    const result = simplify("if (5 > 3) { f(); }\n");
    expect(result.code).toContain("f()");
    expect(result.code).not.toContain("if (");
  });

  test("removes if(false) block", () => {
    const result = simplify('if (false) { console.log("dead"); }\n');
    expect(result.code.trim()).toBe("");
    expect(result.stats.deadIfsRemoved).toBeGreaterThan(0);
  });

  test("collapses if(!1) block", () => {
    const result = simplify('if (!1) { console.log("dead"); }\n');
    expect(result.code.trim()).toBe("");
  });

  test("collapses !![]", () => {
    const result = simplify("if (!![]) { f(); }\n");
    expect(result.code).toContain("f()");
    expect(result.code).not.toContain("!![]");
  });

  test("collapses !!!x to !x", () => {
    const result = simplify("var y = !!!x;\n");
    expect(result.code).toContain("var y = !x");
  });

  test("collapses true && x to x", () => {
    const result = simplify("var y = true && f();\n");
    expect(result.code).toContain("var y = f()");
  });

  test("collapses false || x to x", () => {
    const result = simplify("var y = false || f();\n");
    expect(result.code).toContain("var y = f()");
  });

  test("collapses true ? a : b to a", () => {
    const result = simplify("var y = true ? a : b;\n");
    expect(result.code).toContain("var y = a");
  });

  test("collapses x + 0 to x", () => {
    const result = simplify("var y = x + 0;\n");
    expect(normalize(result.code)).toBe("var y = x;");
  });

  test("converts obj['prop'] to obj.prop when identifier-safe", () => {
    const result = simplify('var y = obj["foo"];\n');
    expect(result.code).toContain("obj.foo");
  });

  test("leaves obj['not-id'] alone", () => {
    const result = simplify('var y = obj["not-id"];\n');
    expect(result.code).toContain('obj["not-id"]');
  });

  test("leaves obj['for'] (reserved word) computed", () => {
    const result = simplify('var y = obj["for"];\n');
    expect(result.code).toContain('obj["for"]');
  });

  test("expands sequence expression in statement position", () => {
    const result = simplify("(a, b, c);\n");
    expect(result.code).toContain("a;");
    expect(result.code).toContain("b;");
    expect(result.code).toContain("c;");
  });

  test("inlines const-literal variable", () => {
    const result = simplify("var k = 5; console.log(k + 1);\n");
    expect(result.code).toContain("console.log(6)");
    expect(result.code).not.toMatch(/\bvar k\b/);
  });

  test("--no-inline keeps the variable", () => {
    const result = simplify("var k = 5; console.log(k);\n", { noInline: true });
    expect(result.code).toContain("var k = 5");
  });

  test("scope-aware: doesn't inline outer when inner shadows", () => {
    const src = `
      var k = 5;
      function f() {
        var k = 99;
        return k;
      }
      console.log(k, f());
    `;
    const result = simplify(src);
    expect(result.code).toContain("5");
    expect(result.code).toContain("99");
  });

  test("scope-aware: reassigned vars are not inlined", () => {
    const src = "var k = 5; k = 10; console.log(k);\n";
    const result = simplify(src);
    expect(result.code).toContain("var k = 5");
    expect(result.code).toContain("k = 10");
  });

  test("dead-code fixture: dead branches removed, computation preserved", () => {
    const result = simplify(fixture("dead-code.min.js"));
    expect(result.code).not.toMatch(/if \(false\)/);
    expect(result.code).not.toMatch(/if \(!1\)/);
    expect(result.code).toContain("a + b");
    expect(result.stats.deadIfsRemoved).toBeGreaterThan(0);
  });

  test("opaque-predicates fixture: all three predicates resolved", () => {
    const result = simplify(fixture("opaque-predicates.min.js"));
    expect(result.code).not.toMatch(/5 > 3/);
    expect(result.code).not.toMatch(/1 === 2/);
    expect(result.code).not.toMatch(/!!\s*\[\s*\]/);
    expect(result.code).toContain('"always-via-not-not"');
  });

  test("idempotent: fixed point reached", () => {
    const first = simplify(fixture("dead-code.min.js"));
    const second = simplify(first.code);
    expect(second.code).toBe(first.code);
  });

  test("respects maxPasses", () => {
    const result = simplify("var x = 1 + 2 + 3 + 4;\n", { maxPasses: 1 });
    expect(result.stats.passes).toBe(1);
  });
});

describe("simplify (CLI)", () => {
  test("missing arg exits 64", () => {
    const { code, stderr } = runCLI([]);
    expect(code).toBe(64);
    expect(stderr).toContain("Usage");
  });

  test("decodes via stdout", () => {
    const { stdout, code } = runCLI([], undefined);
    expect(code).toBe(64);
  });

  test("simplifies fixture", () => {
    const { stdout, stderr, code } = runCLI([
      path.join(FIXTURES, "dead-code.min.js"),
    ]);
    expect(code).toBe(0);
    expect(stdout).not.toMatch(/if \(false\)/);
    expect(stderr).toContain("simplify");
  });

  test("invalid source exits 2", () => {
    const { code } = runCLI(["-"], "var x = {");
    expect(code).toBe(2);
  });
});

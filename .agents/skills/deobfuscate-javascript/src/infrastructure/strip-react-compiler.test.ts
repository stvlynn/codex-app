import { describe, expect, test } from "bun:test";
import * as path from "node:path";
import { spawnSync } from "node:child_process";
import { stripReactCompiler } from "./strip-react-compiler.ts";

const SCRIPT = path.join(import.meta.dir, "strip-react-compiler.ts");

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

describe("strip-react-compiler (library)", () => {
  test("empty source", () => {
    expect(stripReactCompiler("").code).toBe("");
  });

  test("no cache var → input unchanged", () => {
    const src = `function f(x) { return x + 1; }\n`;
    const out = stripReactCompiler(src);
    expect(out.stats.cacheVarsRemoved).toBe(0);
    expect(out.stats.conditionalsStripped).toBe(0);
    expect(normalize(out.code)).toContain("function f(x)");
  });

  test("strips simple cache conditional and removes cache var", () => {
    const src = `
      function f(props) {
        let cache = react.c(2);
        let a;
        cache[0] === props
          ? (a = cache[1])
          : ((a = props.a + 1), (cache[0] = props), (cache[1] = a));
        return a;
      }
    `;
    const out = stripReactCompiler(src);
    const n = normalize(out.code);
    expect(n).not.toContain("cache[");
    expect(n).not.toContain("react.c(");
    expect(n).toContain("a = props.a + 1");
    expect(out.stats.conditionalsStripped).toBe(1);
    expect(out.stats.cacheVarsRemoved).toBe(1);
  });

  test("handles (0, react.c)(N) callee form", () => {
    const src = `
      function f(props) {
        let cache = (0, react.c)(2);
        let a;
        cache[0] === props
          ? (a = cache[1])
          : ((a = props.a + 1), (cache[0] = props), (cache[1] = a));
        return a;
      }
    `;
    const out = stripReactCompiler(src);
    expect(out.stats.cacheVarsRemoved).toBe(1);
    expect(normalize(out.code)).not.toContain("cache[");
  });

  test("handles useMemoCache callee form", () => {
    const src = `
      function f(props) {
        let cache = react.useMemoCache(1);
        let a;
        cache[0] === props ? (a = cache[1]) : ((a = props.a), (cache[0] = props), (cache[1] = a));
        return a;
      }
    `;
    const out = stripReactCompiler(src);
    expect(out.stats.cacheVarsRemoved).toBe(1);
  });

  test("merges 'let X; X = expr;' into 'let X = expr'", () => {
    const src = `
      function f(props) {
        let cache = react.c(1);
        let result;
        cache[0] === props
          ? (result = cache[1])
          : ((result = compute(props)), (cache[0] = props), (cache[1] = result));
        return result;
      }
    `;
    const out = stripReactCompiler(src);
    const n = normalize(out.code);
    expect(out.stats.uninitMerged).toBeGreaterThanOrEqual(1);
    expect(n).toContain("compute(props)");
  });

  test("removes unused locals left after stripping", () => {
    const src = `
      function f(props) {
        let cache = react.c(2);
        let element;
        cache[0] === props
          ? (element = cache[1])
          : ((element = render(props)), (cache[0] = props), (cache[1] = element));
        return element;
      }
    `;
    const out = stripReactCompiler(src);
    // element is used; should remain
    const n = normalize(out.code);
    expect(n).toContain("render(props)");
    // assert element is not redeclared as unused
    expect(n.match(/let element/g)?.length).toBeLessThanOrEqual(1);
  });

  test("leaves non-cache conditionals alone", () => {
    const src = `
      function f(x) {
        let cache = react.c(1);
        let y = x > 0 ? 1 : 2;
        cache[0] === x ? (y = cache[1]) : ((y = x + 1), (cache[0] = x), (cache[1] = y));
        return y;
      }
    `;
    const out = stripReactCompiler(src);
    expect(normalize(out.code)).toContain("x > 0 ? 1 : 2");
  });

  test("preserves correct sequence semantics in compute branch", () => {
    const src = `
      function f(props) {
        let cache = react.c(3);
        let a, b;
        cache[0] === props.x
          ? ((a = cache[1]), (b = cache[2]))
          : ((a = props.x + 1), (b = a * 2), (cache[0] = props.x), (cache[1] = a), (cache[2] = b));
        return a + b;
      }
    `;
    const out = stripReactCompiler(src);
    const n = normalize(out.code);
    expect(n).toContain("a = props.x + 1");
    expect(n).toContain("b = a * 2");
    expect(n).not.toContain("cache[");
  });

  test("handles cache.length === N test variant", () => {
    const src = `
      function f(props) {
        let cache = react.c(1);
        let a;
        cache[0] !== props
          ? ((a = compute(props)), (cache[0] = props), (cache[1] = a))
          : (a = cache[1]);
        return a;
      }
    `;
    const out = stripReactCompiler(src);
    expect(out.stats.conditionalsStripped).toBe(1);
    expect(normalize(out.code)).toContain("compute(props)");
  });

  test("strips block if/else cache scaffolding", () => {
    const src = `
      function f(props) {
        let cache = react.c(4), result, label;
        if (cache[0] !== props.value || cache[1] !== props.label) {
          result = compute(props.value);
          label = props.label.toUpperCase();
          cache[0] = props.value;
          cache[1] = props.label;
          cache[2] = result;
          cache[3] = label;
        } else {
          result = cache[2];
          label = cache[3];
        }
        return result + label;
      }
    `;
    const out = stripReactCompiler(src);
    const n = normalize(out.code);
    expect(n).toContain("result = compute(props.value)");
    expect(n).toContain("label = props.label.toUpperCase()");
    expect(n).not.toContain("cache[");
    expect(n).not.toContain("react.c(");
    expect(out.stats.conditionalsStripped).toBe(1);
    expect(out.stats.cacheVarsRemoved).toBe(1);
  });

  test("keeps block scope when stripped branch declares an outer-colliding let", () => {
    const src = `
      function f(props) {
        let cache = react.c(3), result;
        let e = props.fallback;
        if (cache[0] !== props.value) {
          let e = props.value + 1;
          result = e;
          cache[0] = props.value;
          cache[1] = result;
        } else {
          result = cache[1];
        }
        return result + e;
      }
    `;
    const out = stripReactCompiler(src);
    const n = normalize(out.code);
    expect(n).toContain("{ let e = props.value + 1; result = e; }");
    expect(n).not.toContain("cache[");
    expect(n).not.toContain("react.c(");
  });
});

describe("strip-react-compiler (CLI)", () => {
  test("reads stdin, writes stdout", () => {
    const src = `function f(p) { let cache = react.c(1); let a; cache[0] === p ? (a = cache[1]) : ((a = p), (cache[0] = p), (cache[1] = a)); return a; }`;
    const res = runCLI(["-"], src);
    expect(res.code).toBe(0);
    expect(res.stdout).not.toContain("cache[");
    expect(res.stderr).toContain("strip-react-compiler:");
  });

  test("missing positional → exit 64", () => {
    const res = runCLI([]);
    expect(res.code).toBe(64);
  });
});

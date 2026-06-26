import { describe, expect, test } from "bun:test";
import * as path from "node:path";
import { spawnSync } from "node:child_process";
import { polish } from "./polish.ts";

const SCRIPT = path.join(import.meta.dir, "polish.ts");

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

describe("polish (library)", () => {
  test("clock-icon end-to-end", () => {
    const src = `
      import { s as toESM } from "./chunk.js";
      import { n as reqReact, t as reqJsx } from "./jsx-runtime.js";
      toESM(reqReact());
      var jsxRuntime = reqJsx(),
        ClockIcon = props => (0, jsxRuntime.jsx)(\`svg\`, {
          width: 18,
          ...props,
          children: (0, jsxRuntime.jsx)(\`path\`, { d: \`M0\` })
        });
      export { ClockIcon as t };
    `;
    const result = polish(src);
    const n = normalize(result.code);
    expect(n).toContain('<svg width={18}');
    expect(n).toContain('{...props}');
    expect(n).toContain('<path d="M0"');
    expect(n).toContain("export const ClockIcon = props =>");
    expect(n).not.toContain("(0, jsxRuntime.jsx)");
    expect(n).not.toContain("`svg`");
  });

  test("--prefer local preserves the renamed local name", () => {
    const src = `var ClockIcon = 1; export { ClockIcon as t };`;
    const result = polish(src, { preferExportName: "local" });
    expect(normalize(result.code)).toContain("export const ClockIcon = 1");
  });

  test("skip step", () => {
    const src = `var X = 1; export { X as Y };`;
    const result = polish(src, { skip: ["normalize-exports"] });
    expect(normalize(result.code)).toContain("export {");
  });

  test("stop-after simplify", () => {
    const src = `var x = jsxRuntime.jsx(\`svg\`, {});`;
    const result = polish(src, { stopAfter: "simplify" });
    expect(result.code).toContain('jsxRuntime.jsx("svg"');
  });

  test("sourcePath prepends provenance header", () => {
    const src = `var X = 1; export { X as Y };`;
    const result = polish(src, {
      sourcePath: "ref/webview/assets/button-bq66r8jD.js",
    });
    expect(result.code.startsWith("// Restored from ref/webview/assets/button-bq66r8jD.js\n")).toBe(
      true,
    );
    expect(normalize(result.code)).toContain("export const X = 1");
  });

  test("sourcePath header included even when stopAfter fires early", () => {
    const src = `var x = jsxRuntime.jsx(\`svg\`, {});`;
    const result = polish(src, {
      stopAfter: "simplify",
      sourcePath: "src/foo.js",
    });
    expect(result.code.startsWith("// Restored from src/foo.js\n")).toBe(true);
  });

  test("no header without sourcePath", () => {
    const src = `var X = 1;`;
    const result = polish(src);
    expect(result.code.startsWith("// Restored from")).toBe(false);
  });

  test("description adds a second header line under source", () => {
    const src = `var X = 1; export { X as Y };`;
    const result = polish(src, {
      sourcePath: "ref/webview/assets/button-bq66r8jD.js",
      description: "Semantic button component: named variants, typed props, and direct JSX.",
    });
    expect(result.code.startsWith(
      "// Restored from ref/webview/assets/button-bq66r8jD.js\n" +
        "// Semantic button component: named variants, typed props, and direct JSX.\n",
    )).toBe(true);
  });

  test("description alone (no sourcePath) still emits a single description line", () => {
    const src = `var X = 1;`;
    const result = polish(src, { description: "Hand-restored from production bundle." });
    expect(result.code.startsWith("// Hand-restored from production bundle.\n")).toBe(true);
    expect(result.code).not.toContain("// Restored from");
  });

  test("resolve-npm-imports runs after normalize-exports", () => {
    const src = `
      import { t as clsx } from "../clsx-DDuZWq6Y.js";
      var X = clsx("a"); export { X as Y };
    `;
    const result = polish(src);
    const n = normalize(result.code);
    expect(n).toContain('import clsx from "clsx"');
    expect(n).toContain("export const X = clsx");
    expect(n).not.toContain("clsx-DDuZWq6Y");
  });

  test("resolve-npm-imports step listed in stats", () => {
    const src = `import { t as clsx } from "../clsx-X.js"; clsx;`;
    const result = polish(src);
    const step = result.steps.find((s) => s.step === "resolve-npm-imports");
    expect(step).toBeDefined();
    expect(step && "stats" in step ? step.stats.specifiersResolved : 0).toBe(1);
  });

  test("--skip resolve-npm-imports leaves chunk paths alone", () => {
    const src = `import { t as clsx } from "../clsx-X.js"; clsx;`;
    const result = polish(src, { skip: ["resolve-npm-imports"] });
    expect(result.code).toContain("clsx-X.js");
  });

  test("React-Compiler memoized Button end-to-end", () => {
    const src = `
      import { t as clsx } from "./clsx.js";
      import { c as requireReact } from "./react.js";
      var react = requireReact();
      function Button(props) {
        let cache = react.c(8);
        let children, className, color, size;
        cache[0] === props
          ? ((children = cache[1]), (className = cache[2]), (color = cache[3]), (size = cache[4]))
          : (({ children, className, color, size } = props),
             (cache[0] = props),
             (cache[1] = children),
             (cache[2] = className),
             (cache[3] = color),
             (cache[4] = size));
        let resolvedColor = color === undefined ? "primary" : color,
          resolvedSize = size === undefined ? "default" : size,
          merged;
        cache[5] !== className || cache[6] !== resolvedColor
          ? ((merged = clsx(\`base\`, resolvedColor, resolvedSize, className)),
             (cache[5] = className), (cache[6] = resolvedColor), (cache[7] = merged))
          : (merged = cache[7]);
        return merged;
      }
      export { Button as t };
    `;
    const result = polish(src);
    const n = normalize(result.code);
    expect(n).not.toContain("cache[");
    expect(n).not.toContain("react.c(");
    expect(n).toContain('color = "primary"');
    expect(n).toContain('size = "default"');
    expect(n).toContain("export function Button");
    expect(n).toContain("clsx(");
  });
});

describe("polish (CLI)", () => {
  test("stdin → stdout integration (default --prefer local)", () => {
    const src = `var X = (0, foo.bar)(); export { X as Y };`;
    const res = runCLI(["-"], src);
    expect(res.code).toBe(0);
    expect(res.stdout).toContain("export const X = foo.bar()");
  });

  test("--prefer exported overrides default", () => {
    const src = `var X = (0, foo.bar)(); export { X as Y };`;
    const res = runCLI(["-", "--prefer", "exported"], src);
    expect(res.code).toBe(0);
    expect(res.stdout).toContain("export const Y = foo.bar()");
  });

  test("unknown --skip step → exit 64", () => {
    const res = runCLI(["-", "--skip", "made-up"], "var x = 1;");
    expect(res.code).toBe(64);
    expect(res.stderr).toContain("unknown step");
  });

  test("--source prepends provenance header to stdout", () => {
    const src = `var X = 1; export { X as Y };`;
    const res = runCLI(["-", "--source", "ref/webview/assets/button-bq66r8jD.js"], src);
    expect(res.code).toBe(0);
    expect(res.stdout.startsWith("// Restored from ref/webview/assets/button-bq66r8jD.js\n")).toBe(
      true,
    );
    expect(res.stdout).toContain("export const X = 1");
  });

  test("--source + --description emits both header lines", () => {
    const src = `var X = 1; export { X as Y };`;
    const res = runCLI(
      [
        "-",
        "--source",
        "ref/webview/assets/button-bq66r8jD.js",
        "--description",
        "Semantic button component: named variants, typed props, and direct JSX.",
      ],
      src,
    );
    expect(res.code).toBe(0);
    expect(res.stdout.startsWith(
      "// Restored from ref/webview/assets/button-bq66r8jD.js\n" +
        "// Semantic button component: named variants, typed props, and direct JSX.\n",
    )).toBe(true);
  });
});

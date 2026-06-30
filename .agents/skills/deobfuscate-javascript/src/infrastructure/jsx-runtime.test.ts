import { describe, expect, test } from "bun:test";
import * as path from "node:path";
import { spawnSync } from "node:child_process";
import { convertJsxRuntime } from "./jsx-runtime.ts";

const SCRIPT = path.join(import.meta.dir, "jsx-runtime.ts");

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

describe("jsx-runtime (library)", () => {
  test("empty source", () => {
    expect(convertJsxRuntime("").code).toBe("");
  });

  test("converts jsx() with string tag and props", () => {
    const src = `var x = jsxRuntime.jsx("svg", { width: 18, fill: "none" });`;
    const out = convertJsxRuntime(src);
    expect(normalize(out.code)).toContain('<svg width={18} fill="none"');
    expect(out.stats.callsConverted).toBe(1);
  });

  test("uses expression attributes for strings that would be invalid quoted JSX", () => {
    const src = `var x = jsxRuntime.jsx(Message, { defaultMessage: '"{text}"' });`;
    const out = convertJsxRuntime(src);
    expect(out.code).toContain(`defaultMessage={`);
    expect(() => convertJsxRuntime(out.code)).not.toThrow();
  });

  test("converts nested children via `children` prop", () => {
    const src = `
      var x = jsxRuntime.jsx("svg", {
        width: 18,
        children: jsxRuntime.jsx("path", { d: "M0 0" })
      });
    `;
    const out = convertJsxRuntime(src);
    const n = normalize(out.code);
    expect(n).toContain("<svg width={18}>");
    expect(n).toContain('<path d="M0 0" />');
    expect(n).toContain("</svg>");
    expect(out.stats.callsConverted).toBe(2);
  });

  test("converts spread props (...props)", () => {
    const src = `var x = jsxRuntime.jsx("svg", { width: 18, ...props });`;
    const out = convertJsxRuntime(src);
    expect(normalize(out.code)).toContain("{...props}");
  });

  test("jsxs with array children", () => {
    const src = `
      var x = jsxRuntime.jsxs("ul", {
        children: [
          jsxRuntime.jsx("li", { children: "a" }),
          jsxRuntime.jsx("li", { children: "b" })
        ]
      });
    `;
    const out = convertJsxRuntime(src);
    const n = normalize(out.code);
    expect(n).toContain("<ul>");
    expect(n).toContain("<li>");
    expect(n).toMatch(/li>.*\{"a"\}/);
    expect(out.stats.callsConverted).toBe(3);
  });

  test("Fragment becomes <></>", () => {
    const src = `
      var x = jsxRuntime.jsx(jsxRuntime.Fragment, {
        children: jsxRuntime.jsx("span", {})
      });
    `;
    const out = convertJsxRuntime(src);
    const n = normalize(out.code);
    expect(n).toContain("<>");
    expect(n).toContain("</>");
    expect(out.stats.fragmentsConverted).toBe(1);
    expect(out.stats.callsConverted).toBe(1);
  });

  test("third arg becomes key= attribute", () => {
    const src = `var x = jsxRuntime.jsx("li", { children: "a" }, "k1");`;
    const out = convertJsxRuntime(src);
    expect(normalize(out.code)).toContain('key="k1"');
  });

  test("identifier component reference", () => {
    const src = `var x = jsxRuntime.jsx(Button, { disabled: true });`;
    const out = convertJsxRuntime(src);
    expect(normalize(out.code)).toContain("<Button disabled={true} />");
  });

  test("leaves lowercase identifier component aliases for semantic renaming", () => {
    const src = `var x = jsxRuntime.jsx(buttonAlias, { disabled: true });`;
    const out = convertJsxRuntime(src);
    expect(normalize(out.code)).toContain("jsxRuntime.jsx(buttonAlias");
    expect(out.stats.unconvertible).toBeGreaterThan(0);
  });

  test("member expression component reference", () => {
    const src = `var x = jsxRuntime.jsx(Form.Field, {});`;
    const out = convertJsxRuntime(src);
    expect(normalize(out.code)).toContain("<Form.Field />");
  });

  test("non-identifier string tag (e.g. with dash) is left alone", () => {
    const src = `var x = jsxRuntime.jsx("my-element", {});`;
    const out = convertJsxRuntime(src);
    expect(out.code).toContain('jsx("my-element"');
    expect(out.stats.unconvertible).toBeGreaterThan(0);
  });

  test("freestanding jsx() (no namespace) also converts", () => {
    const src = `import { jsx } from "react/jsx-runtime"; var x = jsx("div", { id: "a" });`;
    const out = convertJsxRuntime(src);
    expect(normalize(out.code)).toContain('<div id="a" />');
  });

  test("removes unused react/jsx-runtime imports after conversion", () => {
    const src = `import { jsx, jsxs, Fragment } from "react/jsx-runtime"; var x = jsxs(Fragment, { children: [jsx("span", {})] });`;
    const out = convertJsxRuntime(src);
    expect(out.code).not.toContain("react/jsx-runtime");
    expect(out.stats.importsRemoved).toBe(3);
  });

  test("converts existing runtime Fragment JSX to shorthand", () => {
    const src = `import { Fragment } from "react/jsx-runtime"; var x = <Fragment><span /></Fragment>;`;
    const out = convertJsxRuntime(src);
    expect(normalize(out.code)).toContain("var x = <><span /></>;");
    expect(out.code).not.toContain("react/jsx-runtime");
    expect(out.stats.fragmentsConverted).toBe(1);
  });

  test("converts local aliases imported from react/jsx-runtime", () => {
    const src = `import { jsx as _jsx, Fragment as RuntimeFragment } from "react/jsx-runtime"; var x = _jsx(RuntimeFragment, { children: _jsx("span", {}) });`;
    const out = convertJsxRuntime(src);
    const n = normalize(out.code);
    expect(n).toContain("var x = <><span /></>;");
    expect(out.code).not.toContain("react/jsx-runtime");
    expect(out.stats.callsConverted).toBe(1);
    expect(out.stats.fragmentsConverted).toBe(1);
  });

  test("parses TypeScript annotations in restored TSX files", () => {
    const src = `
      import { jsx } from "react/jsx-runtime";
      type OverlayProps = { children?: React.ReactNode };
      export function Overlay(props: OverlayProps): JSX.Element {
        const element: JSX.Element = jsx("div", { children: props.children });
        return element;
      }
    `;
    const out = convertJsxRuntime(src);
    expect(normalize(out.code)).toContain("<div>{props.children}</div>");
    expect(out.stats.callsConverted).toBe(1);
  });

  test("converts bundler-safe sequence callee", () => {
    const src = `var x = (0, jsxRuntime.jsx)("div", { id: "a" });`;
    const out = convertJsxRuntime(src);
    expect(normalize(out.code)).toContain('<div id="a" />');
    expect(out.stats.callsConverted).toBe(1);
  });

  test("converts static template literal tags", () => {
    const src = "var x = jsxRuntime.jsx(`span`, { children: label });";
    const out = convertJsxRuntime(src);
    expect(normalize(out.code)).toContain("<span>{label}</span>");
    expect(out.stats.callsConverted).toBe(1);
  });
});

describe("jsx-runtime (CLI)", () => {
  test("reads stdin and writes stdout", () => {
    const result = runCLI(["-"], `var x = jsxRuntime.jsx("svg", {});`);
    expect(result.code).toBe(0);
    expect(result.stdout).toContain("<svg />");
  });

  test("missing arg → exit 64", () => {
    const result = runCLI([]);
    expect(result.code).toBe(64);
    expect(result.stderr).toContain("Usage:");
  });
});

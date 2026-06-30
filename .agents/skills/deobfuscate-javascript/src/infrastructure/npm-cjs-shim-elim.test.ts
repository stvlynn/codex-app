import { describe, expect, test } from "bun:test";
import * as path from "node:path";
import { spawnSync } from "node:child_process";
import { eliminateNpmCjsShim } from "./npm-cjs-shim-elim.ts";
import { polish } from "./polish.ts";

const SCRIPT = path.join(import.meta.dir, "npm-cjs-shim-elim.ts");

function normalize(code: string): string {
  return code.replace(/\s+/g, " ").trim();
}

describe("npm-cjs-shim-elim", () => {
  test("collapses toESModule(defaultImport()) namespace variables", () => {
    const source = `
      import { toESModule } from "./chunk-Bj-mKKzh.js";
      import ReactDOM from "react-dom";
      var domNamespace = toESModule(ReactDOM(), 1);
      export const portal = domNamespace.createPortal;
    `;

    const result = eliminateNpmCjsShim(source);

    expect(result.stats.namespaceVarsCollapsed).toBe(1);
    expect(normalize(result.code)).toContain(
      "export const portal = ReactDOM.createPortal;",
    );
    expect(result.code).not.toContain("domNamespace");
    expect(result.code).not.toContain("ReactDOM()");
  });

  test("collapses direct toESModule(defaultImport()).member expressions", () => {
    const source = `
      import { toESModule } from "./chunk-Bj-mKKzh.js";
      import ReactDOM from "react-dom";
      export const portal = toESModule(ReactDOM(), 1).createPortal;
    `;

    const result = eliminateNpmCjsShim(source);

    expect(result.stats.directMembersCollapsed).toBe(1);
    expect(normalize(result.code)).toContain(
      "export const portal = ReactDOM.createPortal;",
    );
  });

  test("runs inside polish after npm import resolution", () => {
    const source = `
      import { s as toESModule } from "./chunk-Bj-mKKzh.js";
      import { t as loadReactDom } from "./react-dom-De86Q4ix.js";
      var domNamespace = toESModule(loadReactDom(), 1);
      export const portal = domNamespace.createPortal;
    `;

    const result = polish(source).code;

    expect(result).toContain('import ReactDOM from "react-dom";');
    expect(result).toContain("ReactDOM.createPortal");
    expect(result).not.toContain("toESModule");
    expect(result).not.toContain("loadReactDom");
  });

  test("CLI reads stdin and writes stdout", () => {
    const source = `
      import { toESModule } from "./chunk-Bj-mKKzh.js";
      import ReactDOM from "react-dom";
      var domNamespace = toESModule(ReactDOM(), 1);
      export const portal = domNamespace.createPortal;
    `;
    const result = spawnSync("bun", [SCRIPT, "-"], {
      input: source,
      encoding: "utf-8",
    });
    expect(result.status).toBe(0);
    expect(result.stdout).toContain("ReactDOM.createPortal");
    expect(result.stderr).toContain("npm-cjs-shim-elim:");
  });
});

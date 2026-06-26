import { afterAll, describe, expect, test } from "bun:test";
import * as fs from "node:fs";
import * as os from "node:os";
import * as path from "node:path";
import { spawnSync } from "node:child_process";
import {
  FACADE_MARKER,
  collectExportTokens,
  makeFacade,
} from "./make-facade.ts";

const SCRIPT = path.join(import.meta.dir, "make-facade.ts");

function runCLI(args: string[]): {
  stdout: string;
  stderr: string;
  code: number;
} {
  const result = spawnSync("bun", [SCRIPT, ...args], { encoding: "utf-8" });
  return {
    stdout: result.stdout ?? "",
    stderr: result.stderr ?? "",
    code: result.status ?? 0,
  };
}

const tmpFiles: string[] = [];
function tmp(content: string, ext = ".js"): string {
  const p = path.join(
    fs.mkdtempSync(path.join(os.tmpdir(), "make-facade-")),
    `chunk${ext}`,
  );
  fs.writeFileSync(p, content);
  tmpFiles.push(p);
  return p;
}

afterAll(() => {
  for (const p of tmpFiles)
    fs.rmSync(path.dirname(p), { recursive: true, force: true });
});

describe("collectExportTokens", () => {
  test("collects aliased, declared, and default exports", () => {
    const src = `
      const a = 1, c = 2;
      export { a as b, c };
      export const d = 3;
      export function e() {}
      export default 5;
    `;
    const { tokens } = collectExportTokens(src);
    expect(tokens).toEqual(["b", "c", "d", "default", "e"].sort());
  });

  test("flags export *", () => {
    const { hasExportStar } = collectExportTokens(`export * from "./x.js";`);
    expect(hasExportStar).toBe(true);
  });

  test("regex fallback when AST yields nothing parseable", () => {
    // Minified one-liner with an export block.
    const { tokens, usedRegexFallback } = collectExportTokens(
      `var x=1,y=2;export{x as foo,y as bar};`,
    );
    expect(tokens).toContain("foo");
    expect(tokens).toContain("bar");
    void usedRegexFallback;
  });
});

describe("makeFacade", () => {
  test("emits typed any stubs with marker and provenance", () => {
    const { code, stats } = makeFacade(
      `export const foo = 1; export const bar = 2;`,
      {
        provenance: "ref/webview/assets/thing-XXXX.js",
      },
    );
    expect(code).toContain(FACADE_MARKER);
    expect(code).toContain("// Restored from ref/webview/assets/thing-XXXX.js");
    expect(code).toContain("export declare const foo: any;");
    expect(code).toContain("export declare const bar: any;");
    expect(stats.exports).toBe(2);
  });

  test("handles reserved-word exports via aliasing", () => {
    const { code, stats } = makeFacade(`const x = 1; export { x as in };`);
    expect(code).toContain("declare const in_: any;");
    expect(code).toContain("export { in_ as in };");
    expect(code).not.toContain("export declare const in:");
    expect(stats.reserved).toBe(1);
  });

  test("default export aliases through a declare const", () => {
    const { code } = makeFacade(`export default function () {}`);
    expect(code).toContain("declare const _default: any;");
    expect(code).toContain("export default _default;");
  });

  test("applies a name map", () => {
    const { code, stats } = makeFacade(`export const z9 = 1;`, {
      nameMap: { z9: "createStore" },
    });
    expect(code).toContain("export declare const createStore: any;");
    expect(code).not.toContain("z9");
    expect(stats.mapped).toBe(1);
  });

  test("dedupes when a name map collapses tokens", () => {
    const { code } = makeFacade(`export const a = 1; export const b = 2;`, {
      nameMap: { a: "dup", b: "dup" },
    });
    const occurrences = code.split("export declare const dup: any;").length - 1;
    expect(occurrences).toBe(1);
  });
});

describe("makeFacade — reexport mode", () => {
  test("export-star shim re-exports the bare specifier with a re-export header", () => {
    const { code, stats } = makeFacade(
      `export const isEqualA = 1; export default function () {}`,
      { mode: "reexport", specifier: "lodash", exportStar: true },
    );
    expect(code).toContain("re-export boundary");
    expect(code).toContain('export * from "lodash";');
    expect(code).toContain('export { default } from "lodash";');
    expect(code).not.toContain("declare const");
    expect(stats.mode).toBe("reexport");
  });

  test("named re-export with alias name-map bridges cryptic consumer aliases", () => {
    const { code, stats } = makeFacade(`export const x = 1; export const y = 2;`, {
      mode: "reexport",
      specifier: "react-intl",
      names: ["FormattedMessage", "useIntl", "isEqualA"],
      nameMap: { isEqualA: "isEqual" },
    });
    expect(code).toContain('} from "react-intl";');
    expect(code).toContain("FormattedMessage");
    expect(code).toContain("isEqual as isEqualA");
    expect(stats.mapped).toBe(1);
  });
});

describe("makeFacade — passthrough mode", () => {
  test("emits @ts-nocheck + TODO and re-exports the original ref chunk", () => {
    const { code, stats } = makeFacade(
      `export const A = 1; export const B = 2;`,
      {
        mode: "passthrough",
        refPath: "../../ref/webview/assets/app-scope-CWE.js",
        names: ["appScopeA", "appScopeB"],
        nameMap: { appScopeA: "A", appScopeB: "B" },
      },
    );
    expect(code.startsWith("// @ts-nocheck")).toBe(true);
    expect(code).toContain("TODO: deep-restore");
    expect(code).toContain('A as appScopeA');
    expect(code).toContain('} from "../../ref/webview/assets/app-scope-CWE.js";');
    expect(stats.mode).toBe("passthrough");
  });

  test("falls back to export * when no names or map are supplied", () => {
    const { code } = makeFacade(`export const A = 1;`, {
      mode: "passthrough",
      refPath: "../../ref/x.js",
    });
    expect(code).toContain('export * from "../../ref/x.js";');
  });
});

describe("CLI — reexport / passthrough", () => {
  test("--reexport --export-star writes a third-party shim", () => {
    const input = tmp(`export const isEqualA = 1;`);
    const out = input.replace(/\.js$/, ".shim.ts");
    const res = runCLI([input, "--reexport", "lodash", "--export-star", "--out", out]);
    expect(res.code).toBe(0);
    const written = fs.readFileSync(out, "utf-8");
    expect(written).toContain('export * from "lodash";');
    expect(written).toContain("re-export boundary");
  });

  test("--passthrough writes an @ts-nocheck runtime interim", () => {
    const input = tmp(`export const A = 1;`);
    const out = input.replace(/\.js$/, ".pass.ts");
    const res = runCLI([input, "--passthrough", "../../ref/x.js", "--out", out]);
    expect(res.code).toBe(0);
    const written = fs.readFileSync(out, "utf-8");
    expect(written.startsWith("// @ts-nocheck")).toBe(true);
    expect(written).toContain("TODO: deep-restore");
  });
});

describe("CLI", () => {
  test("writes a facade and exits 0", () => {
    const input = tmp(`export const alpha = 1; export { beta } from "./y.js";`);
    const out = input.replace(/\.js$/, ".facade.ts");
    const res = runCLI([input, "--out", out]);
    expect(res.code).toBe(0);
    const written = fs.readFileSync(out, "utf-8");
    expect(written).toContain("export declare const alpha: any;");
    expect(written).toContain("export declare const beta: any;");
  });

  test("exits 2 when there are no exports", () => {
    const input = tmp(`const x = 1; console.log(x);`);
    const res = runCLI([input]);
    expect(res.code).toBe(2);
  });

  test("exits 64 with no args", () => {
    expect(runCLI([]).code).toBe(64);
  });
});

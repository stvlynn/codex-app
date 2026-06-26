import { afterAll, describe, expect, test } from "bun:test";
import * as fs from "node:fs";
import * as os from "node:os";
import * as path from "node:path";
import { spawnSync } from "node:child_process";
import {
  checkEntry,
  countLocalOutDegree,
  discoverEntry,
  readIndexRoots,
} from "./check-entry.ts";

const SCRIPT = path.join(import.meta.dir, "check-entry.ts");

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

const tmpDirs: string[] = [];
function makeTree(files: Record<string, string>): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "check-entry-"));
  tmpDirs.push(dir);
  for (const [name, content] of Object.entries(files)) {
    fs.writeFileSync(path.join(dir, name), content);
  }
  return dir;
}

afterAll(() => {
  for (const d of tmpDirs) fs.rmSync(d, { recursive: true, force: true });
});

describe("countLocalOutDegree", () => {
  test("counts relative local imports, ignores bare + asset", () => {
    const src = `
      import { a } from "./foo-AAAA.js";
      import b from "./bar-BBBB.js";
      import react from "react";
      import "./styles.css";
      export { x } from "./baz-CCCC.js";
    `;
    expect(countLocalOutDegree(src).count).toBe(3);
  });

  test("known npm-leaf chunks do not count as local", () => {
    // clsx is in CHUNK_NAME_REGISTRY -> npm-leaf, not local.
    const src = `import x from "./clsx-DDuZWq6Y.js"; import y from "./real-EEEE.js";`;
    expect(countLocalOutDegree(src).count).toBe(1);
  });
});

describe("readIndexRoots", () => {
  test("extracts script src and modulepreload href basenames", () => {
    const dir = makeTree({
      "index.html": `<!doctype html><html><head>
        <script type="module" crossorigin src="./assets/index-7yFy.js"></script>
        <link rel="modulepreload" crossorigin href="./assets/polyfill-Cf3x.js">
      </head></html>`,
    });
    const roots = readIndexRoots(path.join(dir, "index.html"));
    expect(roots.scriptRoots).toEqual(["index-7yFy"]);
    expect(roots.preloadRoots).toEqual(["polyfill-Cf3x"]);
  });
});

describe("checkEntry", () => {
  test("flags a transitive vendor leaf as suspicious", () => {
    // leaf is imported by 6 siblings and imports only 2 locals.
    const files: Record<string, string> = {
      "leaf-LEAF01.js": `import a from "./util-UU01.js"; import b from "./util-UU02.js"; export const z = 1;`,
      "util-UU01.js": `export default 1;`,
      "util-UU02.js": `export default 2;`,
    };
    for (let i = 0; i < 6; i++) {
      files[`consumer-${i}.js`] = `import { z } from "./leaf-LEAF01.js";`;
    }
    const dir = makeTree(files);
    const report = checkEntry(path.join(dir, "leaf-LEAF01.js"), {
      rootDir: dir,
    });
    expect(report.inDegree).toBe(6);
    expect(report.localOutDegree).toBe(2);
    expect(report.isRoot).toBe(false);
    expect(report.suspicious).toBe(true);
  });

  test("a high-fan-out entry not in index.html is NOT suspicious", () => {
    const files: Record<string, string> = {};
    const imports: string[] = [];
    for (let i = 0; i < 20; i++) {
      files[`mod-${i}.js`] = `export const v${i} = ${i};`;
      imports.push(`import { v${i} } from "./mod-${i}.js";`);
    }
    files["app-main-XYZ.js"] = imports.join("\n");
    const dir = makeTree(files);
    const report = checkEntry(path.join(dir, "app-main-XYZ.js"), {
      rootDir: dir,
    });
    expect(report.inDegree).toBe(0);
    expect(report.localOutDegree).toBe(20);
    expect(report.suspicious).toBe(false);
  });

  test("an index.html <script> root is never suspicious", () => {
    const files: Record<string, string> = {
      "index-ROOT01.js": `import "./a-AA.js";`,
      "a-AA.js": `export default 1;`,
      "index.html": `<script type="module" src="./assets/index-ROOT01.js"></script>`,
    };
    // make it look leaf-ish (imported by many) to prove isRoot wins.
    for (let i = 0; i < 8; i++) {
      files[`c-${i}.js`] = `import "./index-ROOT01.js";`;
    }
    const dir = makeTree(files);
    const report = checkEntry(path.join(dir, "index-ROOT01.js"), {
      rootDir: dir,
      indexHtml: path.join(dir, "index.html"),
    });
    expect(report.isRoot).toBe(true);
    expect(report.suspicious).toBe(false);
  });
});

describe("discoverEntry", () => {
  function appTree(): string {
    const files: Record<string, string> = {};
    const imports: string[] = [];
    for (let i = 0; i < 20; i++) {
      files[`mod-${i}.js`] = `export const v${i} = ${i};`;
      imports.push(`import { v${i} } from "./mod-${i}.js";`);
    }
    files["index-ROOT01.js"] = imports.join("\n");
    files["polyfill-VEND01.js"] = `export default 1;`;
    files["index.html"] =
      `<!doctype html><html><head>` +
      `<script type="module" src="./assets/index-ROOT01.js"></script>` +
      `<link rel="modulepreload" href="./assets/polyfill-VEND01.js">` +
      `</head></html>`;
    return makeTree(files);
  }

  test("picks the high-fan-out script root over a vendor preload", () => {
    const dir = appTree();
    const result = discoverEntry(dir);
    expect(result.chosen?.basename).toBe("index-ROOT01");
    expect(result.chosen?.resolvedFile?.endsWith("index-ROOT01.js")).toBe(true);
    expect(result.candidates).toHaveLength(2);
    // the vendored polyfill is a candidate but not chosen.
    const polyfill = result.candidates.find(
      (c) => c.basename === "polyfill-VEND01",
    );
    expect(polyfill?.report?.looksVendored).toBe(true);
  });

  test("does not choose a modulepreload polyfill over a script root that looks vendored", () => {
    const dir = makeTree({
      "index-HASH01.js": `
        import "./modulepreload-polyfill-HASH01.js";
        import { preload } from "./preload-helper-HASH01.js";
        const runtime = "react-dom";
        await preload(() => import("./app-main-HASH01.js"));
      `,
      "modulepreload-polyfill-HASH01.js": `export {};`,
      "preload-helper-HASH01.js": `export function preload(loader) { return loader(); }`,
      "app-main-HASH01.js": `import "./feature-HASH01.js";`,
      "feature-HASH01.js": `export const feature = true;`,
      "index.html": `
        <script type="module" src="./assets/index-HASH01.js"></script>
        <link rel="modulepreload" href="./assets/modulepreload-polyfill-HASH01.js">
        <link rel="modulepreload" href="./assets/preload-helper-HASH01.js">
      `,
    });
    const result = discoverEntry(dir);
    expect(result.chosen?.basename).toBe("index-HASH01");
    expect(result.reason).toContain("script root");
  });

  test("returns no entry when there is no index.html", () => {
    const dir = makeTree({ "lonely-AAAA.js": `export const x = 1;` });
    const result = discoverEntry(dir);
    expect(result.chosen).toBeNull();
    expect(result.reason).toContain("no index.html");
  });

  test("falls back with a risk note when every root looks vendored", () => {
    const dir = makeTree({
      "polyfill-ONLY01.js": `import a from "./util-UU01.js"; export const x = 1;`,
      "util-UU01.js": `export default 1;`,
      "index.html": `<script type="module" src="./assets/polyfill-ONLY01.js"></script>`,
    });
    const result = discoverEntry(dir);
    expect(result.chosen?.basename).toBe("polyfill-ONLY01");
    expect(result.reason).toContain("verify");
  });
});

describe("CLI", () => {
  test("exits 3 on a suspicious entry", () => {
    const files: Record<string, string> = {
      "leaf-CLI01.js": `export const z = 1;`,
    };
    for (let i = 0; i < 6; i++) {
      files[`u-${i}.js`] = `import { z } from "./leaf-CLI01.js";`;
    }
    const dir = makeTree(files);
    const res = runCLI([path.join(dir, "leaf-CLI01.js"), "--root", dir]);
    expect(res.code).toBe(3);
    expect(res.stderr).toContain("suspicious");
  });

  test("exits 64 with no args, 1 on missing file", () => {
    expect(runCLI([]).code).toBe(64);
    expect(runCLI(["/no/such/file-ZZZZ.js"]).code).toBe(1);
  });

  test("--discover prints the chosen entry path to stdout (exit 0)", () => {
    const files: Record<string, string> = {
      "index-DISC01.js": `import "./a-AA.js"; import "./b-BB.js";`,
      "a-AA.js": `export default 1;`,
      "b-BB.js": `export default 2;`,
      "index.html": `<script type="module" src="./assets/index-DISC01.js"></script>`,
    };
    const dir = makeTree(files);
    const res = runCLI([
      "--discover",
      "--root",
      dir,
      "--index",
      path.join(dir, "index.html"),
    ]);
    expect(res.code).toBe(0);
    expect(res.stdout.trim().endsWith("index-DISC01.js")).toBe(true);
  });

  test("--discover without --root exits 64", () => {
    expect(runCLI(["--discover"]).code).toBe(64);
  });
});

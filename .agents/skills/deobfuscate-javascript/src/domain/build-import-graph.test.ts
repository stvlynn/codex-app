import { describe, expect, test, afterEach } from "bun:test";
import * as fs from "node:fs";
import * as path from "node:path";
import * as os from "node:os";
import { spawnSync } from "node:child_process";
import {
  buildImportGraph,
  classifyTarget,
  parseImportsExports,
} from "./build-import-graph.ts";

const SCRIPT = path.join(import.meta.dir, "build-import-graph.ts");

const tmpRoots: string[] = [];

function makeTmpRoot(): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "build-import-graph-"));
  tmpRoots.push(dir);
  return dir;
}

afterEach(() => {
  while (tmpRoots.length > 0) {
    const dir = tmpRoots.pop()!;
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

/**
 * Make a Vite/Rollup-style sibling tree where every chunk lives at the same
 * level. `entry` imports `child` (a local sibling) and `clsx-AbCdEf12.js`
 * (an npm leaf the registry recognises).
 */
function makeFixture(): { rootDir: string; targetDir: string; entry: string } {
  const rootDir = makeTmpRoot();
  const targetDir = path.join(rootDir, "decode");
  fs.mkdirSync(targetDir, { recursive: true });
  const assets = path.join(rootDir, "assets");
  fs.mkdirSync(assets, { recursive: true });

  const entry = path.join(assets, "entry-AaAaAaAa.js");
  fs.writeFileSync(
    entry,
    [
      `import { foo as f } from "./child-BbBbBbBb.js";`,
      `import { default as React, useState as us } from "./react-CcCcCcCc.js";`,
      `import { clsx as cx } from "./clsx-DdDdDdDd.js";`,
      `export { f as a };`,
    ].join("\n") + "\n",
  );

  fs.writeFileSync(
    path.join(assets, "child-BbBbBbBb.js"),
    [
      `import { tweenProps as tp } from "./grandchild-EeEeEeEe.js";`,
      `var _foo = 1;`,
      `export { _foo as foo };`,
    ].join("\n") + "\n",
  );

  fs.writeFileSync(
    path.join(assets, "grandchild-EeEeEeEe.js"),
    [`var tweenProps = (a, b) => a + b;`, `export { tweenProps };`].join("\n") +
      "\n",
  );

  // npm leaves shouldn't be opened — but create files so we'd notice if BFS misbehaved.
  fs.writeFileSync(
    path.join(assets, "react-CcCcCcCc.js"),
    `export default {}; export const useState = () => [];\n`,
  );
  fs.writeFileSync(
    path.join(assets, "clsx-DdDdDdDd.js"),
    `export default function clsx() { return ""; }\n`,
  );

  return { rootDir: assets, targetDir, entry };
}

describe("classifyTarget", () => {
  test("bare specifiers are external (e.g. 'react')", () => {
    expect(classifyTarget("react", new Set()).kind).toBe("external");
  });

  test("./clsx-XXXX.js maps to npm-leaf via CHUNK_NAME_REGISTRY", () => {
    const c = classifyTarget("./clsx-DDuZWq6Y.js", new Set());
    expect(c.kind).toBe("npm-leaf");
    expect(c.npmPackage).toBe("clsx");
  });

  test("./react-XXXX.js maps to npm-leaf react", () => {
    const c = classifyTarget("./react-CcCcCcCc.js", new Set());
    expect(c.kind).toBe("npm-leaf");
    expect(c.npmPackage).toBe("react");
  });

  test("./cytoscape.esm-XXXX.js maps to npm-leaf cytoscape", () => {
    const c = classifyTarget("./cytoscape.esm-EFcka3gR.js", new Set());
    expect(c.kind).toBe("npm-leaf");
    expect(c.npmPackage).toBe("cytoscape");
  });

  test("./react-dom-XXXXXXXX.js correctly resolves to react-dom (not greedy-stripped to react)", () => {
    // Regression: the old regex /-[A-Za-z0-9_-]{6,12}$/ was greedy and would
    // eat `-dom-XXXXXXXX` (12 chars) collapsing the chunk to `react`. We now
    // anchor to exactly 8 chars first so multi-word chunk names survive.
    const c = classifyTarget("./react-dom-De86Q4ix.js", new Set());
    expect(c.kind).toBe("npm-leaf");
    expect(c.npmPackage).toBe("react-dom");
  });

  test("./jsx-runtime-XXXX.js maps to react/jsx-runtime", () => {
    const c = classifyTarget("./jsx-runtime-CiQ1k8xo.js", new Set());
    expect(c.kind).toBe("npm-leaf");
    expect(c.npmPackage).toBe("react/jsx-runtime");
  });

  test("./core.esm-XXXX.js maps to @dnd-kit/core", () => {
    const c = classifyTarget("./core.esm-By0M5Loj.js", new Set());
    expect(c.npmPackage).toBe("@dnd-kit/core");
  });

  test("./tslib.es6-XXXX.js maps to tslib", () => {
    const c = classifyTarget("./tslib.es6-PiNIxp0T.js", new Set());
    expect(c.kind).toBe("npm-leaf");
    expect(c.npmPackage).toBe("tslib");
  });

  test("./marked.esm-XXXX.js maps to marked", () => {
    const c = classifyTarget("./marked.esm-B1dI5d9h.js", new Set());
    expect(c.kind).toBe("npm-leaf");
    expect(c.npmPackage).toBe("marked");
  });

  test("./floating-ui.react-dom-XXXX.js maps to @floating-ui/react-dom", () => {
    const c = classifyTarget("./floating-ui.react-dom-n8i6eMZZ.js", new Set());
    expect(c.kind).toBe("npm-leaf");
    expect(c.npmPackage).toBe("@floating-ui/react-dom");
  });

  test("project-local chunk is local when basename is not in the npm registry", () => {
    const c = classifyTarget("./app-shell-state-HP0T5lEX.js", new Set());
    expect(c.kind).toBe("local");
  });

  test("--treat-as-npm overrides the local classification", () => {
    const c = classifyTarget("./mything-AbCdEf12.js", new Set(["mything"]));
    expect(c.kind).toBe("npm-leaf");
    expect(c.npmPackage).toBe("mything");
  });
});

describe("parseImportsExports", () => {
  test("collects every import specifier with kind", () => {
    const src = [
      `import x from "./a.js";`,
      `import * as ns from "./b.js";`,
      `import { y, z as q } from "./c.js";`,
    ].join("\n");
    const { imports } = parseImportsExports(src);
    expect(imports).toHaveLength(3);
    expect(imports[0]!.specifiers[0]!.kind).toBe("default");
    expect(imports[1]!.specifiers[0]!.kind).toBe("namespace");
    expect(imports[2]!.specifiers.map((s) => s.kind)).toEqual([
      "named",
      "named",
    ]);
    expect(imports[2]!.specifiers[1]!.imported).toBe("z");
    expect(imports[2]!.specifiers[1]!.local).toBe("q");
  });

  test("`export … from` records both an exports row and a graph edge", () => {
    const src = `export { foo as bar } from "./other.js";`;
    const { imports, exports } = parseImportsExports(src);
    expect(imports).toHaveLength(1);
    expect(imports[0]!.reExport).toBe(true);
    expect(exports[0]!.exported).toBe("bar");
    expect(exports[0]!.local).toBe("foo");
    expect(exports[0]!.reExportFrom).toBe("./other.js");
  });

  test("`export const X = …` is recorded as a non-re-export entry", () => {
    const src = `export const X = 1; export function Y() {}`;
    const { exports } = parseImportsExports(src);
    expect(exports.map((e) => e.exported).sort()).toEqual(["X", "Y"]);
  });

  test("`var X = …; export { X as alias }` produces alias≠local", () => {
    const src = `var X = 1; export { X as alias };`;
    const { exports } = parseImportsExports(src);
    expect(exports[0]).toEqual({
      exported: "alias",
      local: "X",
      kind: "named",
    });
  });

  test("dynamic import('./other.js') produces a graph edge", () => {
    const src = `const p = import("./other.js");`;
    const { imports } = parseImportsExports(src);
    expect(imports).toHaveLength(1);
    expect(imports[0]!.target).toBe("other");
  });

  test("dynamic import with a static template literal produces a graph edge", () => {
    const src = "const p = import(`./register-app-actions-DNoVtMUb.js`);";
    const { imports, unresolved } = parseImportsExports(src);
    expect(unresolved).toEqual([]);
    expect(imports).toHaveLength(1);
    expect(imports[0]!.target).toBe("register-app-actions-DNoVtMUb");
  });

  test("non-literal dynamic import is recorded under unresolved", () => {
    const src = `const p = (n) => import(n);`;
    const { unresolved } = parseImportsExports(src);
    expect(unresolved).toContain("dynamic-import-non-literal");
  });

  test("asset imports (.css, .svg, .woff2) are skipped", () => {
    const src = `import "./style.css"; import url from "./icon.svg";`;
    const { imports } = parseImportsExports(src);
    expect(imports).toHaveLength(0);
  });
});

describe("buildImportGraph (BFS)", () => {
  test("walks all transitive local chunks, stops at npm leaves", () => {
    const { rootDir, targetDir, entry } = makeFixture();
    const manifest = buildImportGraph(entry, { rootDir, targetDir });

    expect(manifest.entry).toBe("entry-AaAaAaAa");
    // 3 local: entry, child, grandchild — and 2 npm leaves: react, clsx.
    const local = Object.values(manifest.files).filter(
      (f) => f.kind === "local",
    );
    const npm = Object.values(manifest.files).filter(
      (f) => f.kind === "npm-leaf",
    );
    expect(local.map((f) => f.basename).sort()).toEqual([
      "child-BbBbBbBb",
      "entry-AaAaAaAa",
      "grandchild-EeEeEeEe",
    ]);
    expect(npm.map((f) => f.npmPackage).sort()).toEqual(["clsx", "react"]);
  });

  test("bundled vendor DATA (Shiki grammar) is a terminal npm-leaf, not restored", () => {
    const rootDir = makeTmpRoot();
    const targetDir = path.join(rootDir, "decode");
    fs.mkdirSync(targetDir, { recursive: true });
    const assets = path.join(rootDir, "assets");
    fs.mkdirSync(assets, { recursive: true });
    const entry = path.join(assets, "highlighter-Aa11Bb22.js");
    fs.writeFileSync(
      entry,
      `import grammar from "./rust-Cc33Dd44.js";\nexport const langs = [grammar];\n`,
    );
    // A Shiki TextMate grammar chunk — recognised by content, not by name.
    fs.writeFileSync(
      path.join(assets, "rust-Cc33Dd44.js"),
      `export default {name:"rust",scopeName:"source.rust",patterns:[{include:"#x"}],repository:{}};\n`,
    );

    const manifest = buildImportGraph(entry, { rootDir: assets, targetDir });
    const rust = manifest.files["rust-Cc33Dd44"];
    expect(rust?.kind).toBe("npm-leaf");
    expect(rust?.vendorSpecifier).toBe("@shikijs/langs/rust");
    expect(rust?.stages.skipped).toBe(true);
    // It must NOT be staged as a local chunk to restore.
    const local = Object.values(manifest.files).filter((f) => f.kind === "local");
    expect(local.map((f) => f.basename)).toEqual(["highlighter-Aa11Bb22"]);
  });

  test("npm leaves have stages.skipped = true and no imports/exports", () => {
    const { rootDir, targetDir, entry } = makeFixture();
    const manifest = buildImportGraph(entry, { rootDir, targetDir });
    const reactLeaf = manifest.files["react-CcCcCcCc"];
    expect(reactLeaf?.kind).toBe("npm-leaf");
    expect(reactLeaf?.stages.skipped).toBe(true);
    expect(reactLeaf?.imports).toBeUndefined();
  });

  test("preserves prior stages on re-run (idempotent merge)", () => {
    const { rootDir, targetDir, entry } = makeFixture();
    const first = buildImportGraph(entry, { rootDir, targetDir });
    // Simulate progress: mark entry as renamed.
    first.files["entry-AaAaAaAa"]!.stages.renamed = true;
    first.files["entry-AaAaAaAa"]!.owner = "agent-1";

    const second = buildImportGraph(entry, {
      rootDir,
      targetDir,
      prior: first,
    });
    expect(second.files["entry-AaAaAaAa"]!.stages.renamed).toBe(true);
    expect(second.files["entry-AaAaAaAa"]!.owner).toBe("agent-1");
    // createdAt is preserved
    expect(second.createdAt).toBe(first.createdAt);
  });

  test("preserves organization (domain/path) across a rebuild", () => {
    const { rootDir, targetDir, entry } = makeFixture();
    const first = buildImportGraph(entry, { rootDir, targetDir });
    first.files["entry-AaAaAaAa"]!.stages.organized = true;
    first.files["entry-AaAaAaAa"]!.organization = {
      domain: "app-shell",
      semanticPath: "app-shell/AppShell.tsx",
      classification: "app-feature",
      source: "agent-override",
      decidedAt: "2026-06-24T00:00:00.000Z",
    };

    const second = buildImportGraph(entry, { rootDir, targetDir, prior: first });
    const file = second.files["entry-AaAaAaAa"]!;
    expect(file.stages.organized).toBe(true);
    expect(file.organization?.semanticPath).toBe("app-shell/AppShell.tsx");
    expect(file.organization?.domain).toBe("app-shell");
  });

  test("records depth from entry (entry=0)", () => {
    const { rootDir, targetDir, entry } = makeFixture();
    const manifest = buildImportGraph(entry, { rootDir, targetDir });
    expect(manifest.files["entry-AaAaAaAa"]!.depth).toBe(0);
    expect(manifest.files["child-BbBbBbBb"]!.depth).toBe(1);
    expect(manifest.files["grandchild-EeEeEeEe"]!.depth).toBe(2);
  });

  test("handles cyclic imports without re-visiting", () => {
    const rootDir = makeTmpRoot();
    const assets = path.join(rootDir, "assets");
    fs.mkdirSync(assets, { recursive: true });
    fs.writeFileSync(
      path.join(assets, "a-1234abcd.js"),
      `import { b } from "./b-5678efgh.js"; export const a = 1;\n`,
    );
    fs.writeFileSync(
      path.join(assets, "b-5678efgh.js"),
      `import { a } from "./a-1234abcd.js"; export const b = 2;\n`,
    );
    const manifest = buildImportGraph(path.join(assets, "a-1234abcd.js"), {
      rootDir: assets,
      targetDir: path.join(rootDir, "decode"),
    });
    expect(Object.keys(manifest.files).sort()).toEqual([
      "a-1234abcd",
      "b-5678efgh",
    ]);
    expect(manifest.edges).toHaveLength(2);
  });

  test("`--treat-as-npm` short-circuits a chunk we don't want to descend into", () => {
    const { rootDir, targetDir, entry } = makeFixture();
    const treatAsNpm = new Set(["child"]);
    const manifest = buildImportGraph(entry, {
      rootDir,
      targetDir,
      treatAsNpm,
    });
    // child is now an npm leaf, so we don't descend to grandchild.
    expect(manifest.files["child-BbBbBbBb"]?.kind).toBe("npm-leaf");
    expect(manifest.files["grandchild-EeEeEeEe"]).toBeUndefined();
  });

  test("default full restoration follows oversized siblings", () => {
    const rootDir = makeTmpRoot();
    const assets = path.join(rootDir, "assets");
    fs.mkdirSync(assets, { recursive: true });
    fs.writeFileSync(
      path.join(assets, "entry-AaAaAaAa.js"),
      `import { bar } from "./huge-CcCcCcCc.js"; export const x = bar();\n`,
    );
    const hugeBody = ["export const bar = () => 1;"]
      .concat(Array(2050).fill("// pad"))
      .join("\n");
    fs.writeFileSync(path.join(assets, "huge-CcCcCcCc.js"), hugeBody + "\n");

    const manifest = buildImportGraph(path.join(assets, "entry-AaAaAaAa.js"), {
      rootDir: assets,
      targetDir: path.join(rootDir, "decode"),
    });

    expect(manifest.files["huge-CcCcCcCc"]?.kind).toBe("local");
    expect(manifest.files["huge-CcCcCcCc"]?.stages.skipped).toBeUndefined();
  });

  test("--max-lines marks oversized siblings as oversized-local and stops the BFS", () => {
    const rootDir = makeTmpRoot();
    const assets = path.join(rootDir, "assets");
    fs.mkdirSync(assets, { recursive: true });
    // Entry imports two siblings: tiny-XX and huge-XX.
    fs.writeFileSync(
      path.join(assets, "entry-AaAaAaAa.js"),
      [
        `import { foo } from "./tiny-BbBbBbBb.js";`,
        `import { bar } from "./huge-CcCcCcCc.js";`,
        `export const x = foo() + bar();`,
      ].join("\n") + "\n",
    );
    fs.writeFileSync(
      path.join(assets, "tiny-BbBbBbBb.js"),
      [
        `import { stuff } from "./grandchild-DdDdDdDd.js";`,
        `export const foo = () => stuff;`,
      ].join("\n") + "\n",
    );
    // Huge file is over the threshold (2000 lines) AND imports another sibling
    // we should NOT descend into.
    const hugeBody = ["export const bar = () => 1;"]
      .concat(Array(2050).fill("// pad"))
      .join("\n");
    fs.writeFileSync(
      path.join(assets, "huge-CcCcCcCc.js"),
      `import { hidden } from "./hidden-EeEeEeEe.js";\n` + hugeBody + "\n",
    );
    fs.writeFileSync(
      path.join(assets, "grandchild-DdDdDdDd.js"),
      `export const stuff = 1;\n`,
    );
    fs.writeFileSync(
      path.join(assets, "hidden-EeEeEeEe.js"),
      `export const hidden = 2;\n`,
    );

    const manifest = buildImportGraph(path.join(assets, "entry-AaAaAaAa.js"), {
      rootDir: assets,
      targetDir: path.join(rootDir, "decode"),
      maxLines: 2000,
    });

    // The entry, the tiny sibling, and the tiny grandchild are all `local`.
    expect(manifest.files["entry-AaAaAaAa"]?.kind).toBe("local");
    expect(manifest.files["tiny-BbBbBbBb"]?.kind).toBe("local");
    expect(manifest.files["grandchild-DdDdDdDd"]?.kind).toBe("local");
    // Huge is marked oversized-local with stages.skipped.
    expect(manifest.files["huge-CcCcCcCc"]?.kind).toBe("oversized-local");
    expect(manifest.files["huge-CcCcCcCc"]?.stages.skipped).toBe(true);
    // We did NOT descend into huge → hidden is not in the manifest.
    expect(manifest.files["hidden-EeEeEeEe"]).toBeUndefined();
    // The huge file's lineCount is set so the agent can see why it was skipped.
    expect(manifest.files["huge-CcCcCcCc"]?.lineCount).toBeGreaterThan(2000);
  });

  test("entry is exempt from --max-lines (always restored)", () => {
    const rootDir = makeTmpRoot();
    const assets = path.join(rootDir, "assets");
    fs.mkdirSync(assets, { recursive: true });
    // Even with 20 lines of content and --max-lines 5, the entry is `local`.
    const lines: string[] = ["export const x = 0;"];
    for (let i = 0; i < 20; i++) lines.push(`// pad line ${i}`);
    fs.writeFileSync(
      path.join(assets, "big-AaAaAaAa.js"),
      lines.join("\n") + "\n",
    );
    const manifest = buildImportGraph(path.join(assets, "big-AaAaAaAa.js"), {
      rootDir: assets,
      targetDir: path.join(rootDir, "decode"),
      maxLines: 5,
    });
    expect(manifest.files["big-AaAaAaAa"]?.kind).toBe("local");
  });

  test("--include forces oversized siblings to be restored", () => {
    const rootDir = makeTmpRoot();
    const assets = path.join(rootDir, "assets");
    fs.mkdirSync(assets, { recursive: true });
    fs.writeFileSync(
      path.join(assets, "entry-AaAaAaAa.js"),
      `import { bar } from "./huge-CcCcCcCc.js"; export const x = bar();\n`,
    );
    const hugeBody = ["export const bar = () => 1;"]
      .concat(Array(2050).fill("// pad"))
      .join("\n");
    fs.writeFileSync(path.join(assets, "huge-CcCcCcCc.js"), hugeBody + "\n");

    const manifest = buildImportGraph(path.join(assets, "entry-AaAaAaAa.js"), {
      rootDir: assets,
      targetDir: path.join(rootDir, "decode"),
      maxLines: 2000,
      forceInclude: new Set(["huge-CcCcCcCc"]),
    });
    expect(manifest.files["huge-CcCcCcCc"]?.kind).toBe("local");
    expect(manifest.files["huge-CcCcCcCc"]?.stages.skipped).toBeUndefined();
  });

  test("--max-lines 0 disables the heuristic (everything is local)", () => {
    const rootDir = makeTmpRoot();
    const assets = path.join(rootDir, "assets");
    fs.mkdirSync(assets, { recursive: true });
    fs.writeFileSync(
      path.join(assets, "entry-AaAaAaAa.js"),
      `import { bar } from "./huge-CcCcCcCc.js"; export const x = bar();\n`,
    );
    const hugeBody = ["export const bar = () => 1;"]
      .concat(Array(2050).fill("// pad"))
      .join("\n");
    fs.writeFileSync(path.join(assets, "huge-CcCcCcCc.js"), hugeBody + "\n");

    const manifest = buildImportGraph(path.join(assets, "entry-AaAaAaAa.js"), {
      rootDir: assets,
      targetDir: path.join(rootDir, "decode"),
      maxLines: 0,
    });
    expect(manifest.files["huge-CcCcCcCc"]?.kind).toBe("local");
  });
});

describe("CLI auto-discovery", () => {
  test("discovers the entry from index.html when no positional is given", () => {
    const { rootDir, targetDir } = makeFixture(); // rootDir is the assets dir
    fs.writeFileSync(
      path.join(path.dirname(rootDir), "index.html"),
      `<script type="module" src="./assets/entry-AaAaAaAa.js"></script>\n`,
    );
    const res = spawnSync(
      "bun",
      [SCRIPT, "--target", targetDir, "--root", rootDir],
      { encoding: "utf-8" },
    );
    expect(res.status).toBe(0);
    const manifest = JSON.parse(
      fs.readFileSync(
        path.join(
          targetDir,
          ".deobfuscate-javascript",
          "_full",
          "manifest.json",
        ),
        "utf-8",
      ),
    );
    expect(manifest.entry).toBe("entry-AaAaAaAa");
  });

  test("exits 64 when neither an entry nor --root is given", () => {
    const { targetDir } = makeFixture();
    const res = spawnSync("bun", [SCRIPT, "--target", targetDir], {
      encoding: "utf-8",
    });
    expect(res.status).toBe(64);
  });
});

import { describe, expect, test, afterEach } from "bun:test";
import * as fs from "node:fs";
import * as path from "node:path";
import * as os from "node:os";
import { buildImportGraph } from "./build-import-graph.ts";
import {
  buildLedger,
  buildLedgerFile,
  buildCrossFileBindings,
} from "./build-symbol-ledger.ts";

const tmpRoots: string[] = [];

function makeTmpRoot(): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "build-symbol-ledger-"));
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
 * Three local files plus an npm leaf:
 *   entry imports `foo` (locally `f`) from child + `clsx` (locally `cx`) from clsx leaf.
 *   child imports `tweenProps` (locally `tp`) from grandchild.
 *   `_foo` is exported from child as `foo`.
 *   `tweenProps` is exported from grandchild as itself.
 */
function makeFixture(): {
  rootDir: string;
  targetDir: string;
  fullDir: string;
  entry: string;
} {
  const rootDir = makeTmpRoot();
  const assets = path.join(rootDir, "assets");
  fs.mkdirSync(assets, { recursive: true });
  const targetDir = path.join(rootDir, "decode");
  fs.mkdirSync(targetDir, { recursive: true });
  const fullDir = path.join(targetDir, ".deobfuscate-javascript", "_full");

  const entry = path.join(assets, "entry-AaAaAaAa.js");
  fs.writeFileSync(
    entry,
    [
      `import { foo as f } from "./child-BbBbBbBb.js";`,
      `import { clsx as cx } from "./clsx-DdDdDdDd.js";`,
      `var topThing = f + 1;`,
      `export { topThing as t };`,
    ].join("\n") + "\n",
  );

  fs.writeFileSync(
    path.join(assets, "child-BbBbBbBb.js"),
    [
      `import { tweenProps as tp } from "./grandchild-EeEeEeEe.js";`,
      `var _foo = tp(1, 2);`,
      `export { _foo as foo };`,
    ].join("\n") + "\n",
  );

  fs.writeFileSync(
    path.join(assets, "grandchild-EeEeEeEe.js"),
    [`var tweenProps = (a, b) => a + b;`, `export { tweenProps };`].join("\n") +
      "\n",
  );

  fs.writeFileSync(
    path.join(assets, "clsx-DdDdDdDd.js"),
    `export default function clsx() { return ""; }\n`,
  );

  return { rootDir: assets, targetDir, fullDir, entry };
}

describe("buildLedgerFile", () => {
  test("tags exported and imported bindings on the symbols", () => {
    const src = [
      `import { foo as f } from "./child-XXXX.js";`,
      `var _topThing = f + 1;`,
      `export { _topThing as t };`,
    ].join("\n");
    const file = {
      basename: "entry-X",
      kind: "local" as const,
      depth: 0,
      stages: {},
      owner: null,
      claimedAt: null,
      lastUpdated: null,
      imports: [
        {
          source: "./child-XXXX.js",
          target: "child-XXXX",
          kind: "local" as const,
          specifiers: [{ imported: "foo", local: "f", kind: "named" as const }],
          reExport: false,
        },
      ],
      exports: [{ exported: "t", local: "_topThing", kind: "named" as const }],
    };
    const ledgerFile = buildLedgerFile(src, file);
    const f = ledgerFile.symbols.find((s) => s.originalName === "f");
    const top = ledgerFile.symbols.find((s) => s.originalName === "_topThing");
    expect(f?.importedFrom?.target).toBe("child-XXXX");
    expect(f?.importedFrom?.imported).toBe("foo");
    expect(top?.isExport).toBe(true);
    expect(top?.exportedAs).toBe("t");
  });

  test("preserves prior status/restoredName on incremental rebuild", () => {
    const src = `var _x = 1; export { _x as a };`;
    const file = {
      basename: "x",
      kind: "local" as const,
      depth: 0,
      stages: {},
      owner: null,
      claimedAt: null,
      lastUpdated: null,
      exports: [{ exported: "a", local: "_x", kind: "named" as const }],
    };
    const first = buildLedgerFile(src, file);
    const xId = first.symbols.find((s) => s.originalName === "_x")!.id;
    first.symbols[0]!.restoredName = "myValue";
    first.symbols[0]!.status = "done";
    first.symbols[0]!.completedAt = "2026-05-22T00:00:00Z";

    const second = buildLedgerFile(src, file, first);
    const sym = second.symbols.find((s) => s.id === xId);
    expect(sym?.restoredName).toBe("myValue");
    expect(sym?.status).toBe("done");
    expect(second.totals.done).toBe(1);
    expect(second.totals.pending).toBe(0);
  });

  test("totals match per-symbol status counts", () => {
    const src = `var a = 1; var b = 2; var c = 3;`;
    const file = {
      basename: "x",
      kind: "local" as const,
      depth: 0,
      stages: {},
      owner: null,
      claimedAt: null,
      lastUpdated: null,
    };
    const ledger = buildLedgerFile(src, file);
    expect(ledger.totals.pending).toBe(ledger.symbols.length);
    expect(ledger.totals.done).toBe(0);
    expect(ledger.totals.claimed).toBe(0);
  });
});

describe("buildCrossFileBindings", () => {
  test("links consumer-local aliases back to producer symbols (with restored name when available)", () => {
    const { rootDir, targetDir, fullDir, entry } = makeFixture();
    const manifest = buildImportGraph(entry, { rootDir, targetDir });
    const ledger = buildLedger({ fullDir, manifest });

    const fromEntry = ledger.crossFileBindings.filter(
      (b) => b.consumer === "entry-AaAaAaAa",
    );
    const childEdge = fromEntry.find((b) => b.producer === "child-BbBbBbBb")!;
    const clsxEdge = fromEntry.find((b) => b.producer === "clsx-DdDdDdDd")!;

    expect(childEdge.consumerLocal).toBe("f");
    expect(childEdge.producerExportedAs).toBe("foo");
    // child has `var _foo = …; export { _foo as foo }` — so producer symbol id
    // points at the `_foo` declaration.
    expect(childEdge.producerSymbolId).toMatch(/^_foo@\d+$/);
    expect(childEdge.producerRestoredName).toBeNull();

    // npm-leaf bindings record the package export name with a null producer symbol id.
    expect(clsxEdge.producer).toBe("clsx-DdDdDdDd");
    expect(clsxEdge.producerExportedAs).toBe("clsx");
    expect(clsxEdge.producerSymbolId).toBeNull();
  });

  test("`producerRestoredName` updates after we set restoredName on the producer", () => {
    const { rootDir, targetDir, fullDir, entry } = makeFixture();
    const manifest = buildImportGraph(entry, { rootDir, targetDir });
    const ledger = buildLedger({ fullDir, manifest });

    // Find the child's `_foo` export and set restoredName.
    const child = ledger.files["child-BbBbBbBb"]!;
    const exp = child.symbols.find((s) => s.exportedAs === "foo")!;
    exp.restoredName = "fooHelper";

    // Re-derive bindings with the same in-memory ledger files.
    const refreshed = buildCrossFileBindings({
      manifest,
      ledgerFiles: ledger.files,
    });
    const link = refreshed.find(
      (b) => b.consumer === "entry-AaAaAaAa" && b.producer === "child-BbBbBbBb",
    )!;
    expect(link.producerRestoredName).toBe("fooHelper");
  });
});

describe("buildLedger (integration)", () => {
  test("emits a per-file workspace + symbols.json + populates totals", () => {
    const { rootDir, targetDir, fullDir, entry } = makeFixture();
    const manifest = buildImportGraph(entry, { rootDir, targetDir });
    const ledger = buildLedger({ fullDir, manifest });

    expect(Object.keys(ledger.files).sort()).toEqual([
      "child-BbBbBbBb",
      "entry-AaAaAaAa",
      "grandchild-EeEeEeEe",
    ]);
    for (const basename of Object.keys(ledger.files)) {
      const ws = path.join(fullDir, "files", basename);
      expect(fs.existsSync(path.join(ws, "original.js"))).toBe(true);
      expect(fs.existsSync(path.join(ws, "symbols.json"))).toBe(true);
    }
    // Every symbol starts pending.
    for (const f of Object.values(ledger.files)) {
      expect(f.totals.pending).toBe(f.symbols.length);
      expect(f.totals.done).toBe(0);
    }
  });

  test("--rebuild discards prior progress, default keeps done symbols' restoredName", () => {
    const { rootDir, targetDir, fullDir, entry } = makeFixture();
    const manifest = buildImportGraph(entry, { rootDir, targetDir });
    const first = buildLedger({ fullDir, manifest });

    // Mark one binding as done with a name.
    const child = first.files["child-BbBbBbBb"]!;
    const fooSym = child.symbols.find((s) => s.exportedAs === "foo")!;
    fooSym.restoredName = "computeFoo";
    fooSym.status = "done";

    const incremental = buildLedger({ fullDir, manifest, prior: first });
    const incrementalFoo = incremental.files["child-BbBbBbBb"]!.symbols.find(
      (s) => s.id === fooSym.id,
    )!;
    expect(incrementalFoo.restoredName).toBe("computeFoo");
    expect(incrementalFoo.status).toBe("done");

    const rebuilt = buildLedger({
      fullDir,
      manifest,
      prior: first,
      rebuild: true,
    });
    const rebuiltFoo = rebuilt.files["child-BbBbBbBb"]!.symbols.find(
      (s) => s.id === fooSym.id,
    )!;
    expect(rebuiltFoo.restoredName).toBeNull();
    expect(rebuiltFoo.status).toBe("pending");
  });

  test("--only restricts the rebuild to specific basenames", () => {
    const { rootDir, targetDir, fullDir, entry } = makeFixture();
    const manifest = buildImportGraph(entry, { rootDir, targetDir });
    const first = buildLedger({ fullDir, manifest });
    // Mark a grandchild symbol as done.
    const gcFile = first.files["grandchild-EeEeEeEe"]!;
    const tweenSym = gcFile.symbols.find(
      (s) => s.originalName === "tweenProps",
    )!;
    tweenSym.status = "done";
    tweenSym.restoredName = "addNumbers";

    const partial = buildLedger({
      fullDir,
      manifest,
      prior: first,
      rebuild: true,
      onlyBasenames: new Set(["child-BbBbBbBb"]),
    });
    // child was rebuilt, grandchild kept its prior progress.
    const gcAfter = partial.files["grandchild-EeEeEeEe"]!.symbols.find(
      (s) => s.id === tweenSym.id,
    )!;
    expect(gcAfter.restoredName).toBe("addNumbers");
    expect(gcAfter.status).toBe("done");
  });

  test("oversized-local files don't get a ledger entry or workspace dir", () => {
    const rootDir = makeTmpRoot();
    const assets = path.join(rootDir, "assets");
    fs.mkdirSync(assets, { recursive: true });
    const targetDir = path.join(rootDir, "decode");
    fs.mkdirSync(targetDir, { recursive: true });
    const fullDir = path.join(targetDir, ".deobfuscate-javascript", "_full");

    fs.writeFileSync(
      path.join(assets, "entry-AaAaAaAa.js"),
      `import { foo } from "./huge-BbBbBbBb.js"; export const x = foo();\n`,
    );
    const hugeBody = ["export const foo = () => 1;"]
      .concat(Array(2050).fill("// pad"))
      .join("\n");
    fs.writeFileSync(path.join(assets, "huge-BbBbBbBb.js"), hugeBody + "\n");

    const manifest = buildImportGraph(path.join(assets, "entry-AaAaAaAa.js"), {
      rootDir: assets,
      targetDir,
      maxLines: 2000,
    });
    expect(manifest.files["huge-BbBbBbBb"]?.kind).toBe("oversized-local");

    const ledger = buildLedger({ fullDir, manifest });
    expect(ledger.files["entry-AaAaAaAa"]).toBeDefined();
    expect(ledger.files["huge-BbBbBbBb"]).toBeUndefined();
    // No workspace dir should be created for the oversized file.
    expect(fs.existsSync(path.join(fullDir, "files", "huge-BbBbBbBb"))).toBe(
      false,
    );
    // But the cross-file binding from entry → huge IS recorded so the
    // consumer-side rename can still see the producer.
    const binding = ledger.crossFileBindings.find(
      (b) => b.producer === "huge-BbBbBbBb",
    );
    expect(binding).toBeDefined();
    expect(binding!.consumerLocal).toBe("foo");
  });
});

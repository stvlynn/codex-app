import { describe, expect, test, afterEach } from "bun:test";
import * as fs from "node:fs";
import * as path from "node:path";
import * as os from "node:os";
import { spawnSync } from "node:child_process";
import { buildImportGraph } from "./build-import-graph.ts";
import { buildLedger } from "./build-symbol-ledger.ts";
import {
  acquireLock,
  applyRenamesToLedger,
  computeFrontier,
  computeStatus,
  isStale,
  LockHeldError,
  pathsForTarget,
  propagateCrossFile,
  releaseLock,
  setOrganization,
  suggestNext,
} from "./ledger.ts";

const SCRIPT = path.join(import.meta.dir, "ledger.ts");

const tmpRoots: string[] = [];

function makeTmpRoot(): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "ledger-cli-"));
  tmpRoots.push(dir);
  return dir;
}

afterEach(() => {
  while (tmpRoots.length > 0) {
    const dir = tmpRoots.pop()!;
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

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

/**
 * Build a fixture identical to build-symbol-ledger.test.ts so we have a real
 * manifest + ledger pair to drive the CLI/library against.
 */
function makeFixture(): {
  rootDir: string;
  targetDir: string;
  fullDir: string;
  manifestPath: string;
  ledgerPath: string;
  entry: string;
} {
  const rootDir = makeTmpRoot();
  const assets = path.join(rootDir, "assets");
  fs.mkdirSync(assets, { recursive: true });
  const targetDir = path.join(rootDir, "decode");
  fs.mkdirSync(targetDir, { recursive: true });

  const entry = path.join(assets, "entry-AaAaAaAa.js");
  fs.writeFileSync(
    entry,
    [
      `import { foo as f } from "./child-BbBbBbBb.js";`,
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

  const paths = pathsForTarget(targetDir);
  fs.mkdirSync(paths.fullDir, { recursive: true });
  const manifest = buildImportGraph(entry, { rootDir: assets, targetDir });
  // buildLedger() mutates `manifest.files[*].stages.extracted` — write it after
  // so the on-disk manifest reflects the post-extract state.
  const ledger = buildLedger({ fullDir: paths.fullDir, manifest });
  fs.writeFileSync(
    paths.manifestPath,
    JSON.stringify(manifest, null, 2) + "\n",
  );
  fs.writeFileSync(paths.ledgerPath, JSON.stringify(ledger, null, 2) + "\n");

  return {
    rootDir: assets,
    targetDir,
    fullDir: paths.fullDir,
    manifestPath: paths.manifestPath,
    ledgerPath: paths.ledgerPath,
    entry,
  };
}

describe("acquireLock / releaseLock (library)", () => {
  test("first claim wins, second claim throws LockHeldError", () => {
    const fullDir = makeTmpRoot();
    fs.mkdirSync(path.join(fullDir, "locks"), { recursive: true });
    acquireLock(fullDir, "foo", "rename", "agent-1");
    expect(() => acquireLock(fullDir, "foo", "rename", "agent-2")).toThrow(
      LockHeldError,
    );
  });

  test("release frees the lock so a second agent can claim", () => {
    const fullDir = makeTmpRoot();
    fs.mkdirSync(path.join(fullDir, "locks"), { recursive: true });
    acquireLock(fullDir, "foo", "rename", "agent-1");
    expect(releaseLock(fullDir, "foo", "rename", { owner: "agent-1" })).toBe(
      true,
    );
    const info = acquireLock(fullDir, "foo", "rename", "agent-2");
    expect(info.owner).toBe("agent-2");
  });

  test("release refuses to free a lock held by a different owner unless --force", () => {
    const fullDir = makeTmpRoot();
    fs.mkdirSync(path.join(fullDir, "locks"), { recursive: true });
    acquireLock(fullDir, "foo", "rename", "agent-1");
    expect(() =>
      releaseLock(fullDir, "foo", "rename", { owner: "agent-2" }),
    ).toThrow(LockHeldError);
    expect(releaseLock(fullDir, "foo", "rename", { force: true })).toBe(true);
  });

  test("--steal reclaims a stale lock (>30 min old)", () => {
    const fullDir = makeTmpRoot();
    fs.mkdirSync(path.join(fullDir, "locks"), { recursive: true });
    acquireLock(fullDir, "foo", "rename", "agent-1");
    const lockPath = path.join(fullDir, "locks", "foo.rename.lock");
    // Backdate the lockfile.
    const oldStamp = (Date.now() - 31 * 60 * 1000) / 1000;
    fs.utimesSync(lockPath, oldStamp, oldStamp);
    expect(isStale(lockPath)).toBe(true);
    const info = acquireLock(fullDir, "foo", "rename", "agent-2", {
      steal: true,
    });
    expect(info.owner).toBe("agent-2");
  });
});

describe("applyRenamesToLedger / propagateCrossFile (library)", () => {
  test("matched ids flip to done and unmatched are reported", () => {
    const { fullDir, manifestPath, ledgerPath } = makeFixture();
    const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf-8"));
    const ledger = JSON.parse(fs.readFileSync(ledgerPath, "utf-8"));
    const child = ledger.files["child-BbBbBbBb"];
    const fooSym = child.symbols.find(
      (s: { exportedAs?: string }) => s.exportedAs === "foo",
    )!;
    const result = applyRenamesToLedger(
      child,
      { [fooSym.id]: "fooHelper", "missing@9999": "ignored" },
      null,
    );
    expect(result.matched).toBe(1);
    expect(result.unmatched).toEqual(["missing@9999"]);
    expect(
      child.symbols.find((s: { id: string }) => s.id === fooSym.id)?.status,
    ).toBe("done");
    expect(child.totals.done).toBe(1);

    // After propagate-cross-file, the entry's binding picks up the new name.
    propagateCrossFile(ledger, manifest);
    const link = ledger.crossFileBindings.find(
      (b: { consumer: string; producer: string }) =>
        b.consumer === "entry-AaAaAaAa" && b.producer === "child-BbBbBbBb",
    );
    expect(link.producerRestoredName).toBe("fooHelper");
    expect(fullDir).toBeTruthy();
  });

  test("--auto-fill carries the restored name into pending consumer symbols", () => {
    const { manifestPath, ledgerPath } = makeFixture();
    const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf-8"));
    const ledger = JSON.parse(fs.readFileSync(ledgerPath, "utf-8"));
    const child = ledger.files["child-BbBbBbBb"];
    const fooSym = child.symbols.find(
      (s: { exportedAs?: string }) => s.exportedAs === "foo",
    )!;
    applyRenamesToLedger(child, { [fooSym.id]: "fooHelper" }, null);

    const out = propagateCrossFile(ledger, manifest, {
      autoFillConsumers: true,
    });
    expect(out.consumersUpdated).toBeGreaterThanOrEqual(1);
    const entry = ledger.files["entry-AaAaAaAa"];
    const fLocal = entry.symbols.find(
      (s: { originalName: string }) => s.originalName === "f",
    );
    expect(fLocal?.restoredName).toBe("fooHelper");
    expect(fLocal?.status).toBe("done");
  });
});

describe("suggestNext / computeStatus (library)", () => {
  test("status counts files-by-stage and symbols-by-status", () => {
    const { manifestPath, ledgerPath, fullDir } = makeFixture();
    const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf-8"));
    const ledger = JSON.parse(fs.readFileSync(ledgerPath, "utf-8"));
    const status = computeStatus(manifest, ledger, fullDir);
    expect(status.files).toBe(3);
    expect(status.byStage.extract.done).toBe(3);
    expect(status.byStage.rename.done).toBe(0);
    expect(status.symbols.pending).toBeGreaterThan(0);
  });

  test("next prefers files whose dependencies are at-or-past the requested stage", () => {
    const { manifestPath, ledgerPath, fullDir } = makeFixture();
    const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf-8"));
    const ledger = JSON.parse(fs.readFileSync(ledgerPath, "utf-8"));
    const cand = suggestNext(manifest, ledger, fullDir, { stage: "rename" });
    // grandchild has no local deps → it should be ready first.
    expect(cand?.basename).toBe("grandchild-EeEeEeEe");
    expect(cand?.stage).toBe("rename");
  });

  test("next skips files whose lock is held", () => {
    const { manifestPath, ledgerPath, fullDir } = makeFixture();
    const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf-8"));
    const ledger = JSON.parse(fs.readFileSync(ledgerPath, "utf-8"));
    acquireLock(fullDir, "grandchild-EeEeEeEe", "rename", "agent-1");
    const cand = suggestNext(manifest, ledger, fullDir, { stage: "rename" });
    expect(cand?.basename).not.toBe("grandchild-EeEeEeEe");
  });

  test("next ignores oversized-local files entirely", () => {
    const { manifestPath, ledgerPath, fullDir } = makeFixture();
    const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf-8"));
    const ledger = JSON.parse(fs.readFileSync(ledgerPath, "utf-8"));
    // Synthesise an oversized-local entry so we don't have to write a 2050-line
    // fixture. suggestNext should never propose it.
    manifest.files["mega-FfFfFfFf"] = {
      basename: "mega-FfFfFfFf",
      kind: "oversized-local",
      depth: 1,
      lineCount: 5000,
      stages: { skipped: true },
      owner: null,
      claimedAt: null,
      lastUpdated: null,
    };
    // computeStatus reports it under `oversized` not `files`.
    const status = computeStatus(manifest, ledger, fullDir);
    expect(status.oversized).toBe(1);
    // Even when we ask for every stage, suggestNext never names mega.
    for (const stage of ["extract", "rename", "polish", "finalize"] as const) {
      const cand = suggestNext(manifest, ledger, fullDir, { stage });
      expect(cand?.basename).not.toBe("mega-FfFfFfFf");
    }
  });
});

describe("ledger.ts CLI (subprocess)", () => {
  test("status prints stage and symbol breakdown", () => {
    const { targetDir } = makeFixture();
    const { stdout, code } = runCLI(["status", "--target", targetDir]);
    expect(code).toBe(0);
    expect(stdout).toContain("files: 3 local");
    expect(stdout).toContain("extract  done=3");
  });

  test("claim succeeds; second claim returns exit 75", () => {
    const { targetDir } = makeFixture();
    const a = runCLI([
      "claim",
      "grandchild-EeEeEeEe",
      "rename",
      "--target",
      targetDir,
      "--owner",
      "agent-A",
    ]);
    expect(a.code).toBe(0);
    expect(a.stdout).toContain("claimed grandchild-EeEeEeEe.rename");
    const b = runCLI([
      "claim",
      "grandchild-EeEeEeEe",
      "rename",
      "--target",
      targetDir,
      "--owner",
      "agent-B",
    ]);
    expect(b.code).toBe(75);
    expect(b.stderr).toContain("lock held");
  });

  test("mark-done with --renames flips the symbols and propagates downstream", () => {
    const { targetDir, fullDir, ledgerPath } = makeFixture();
    // Find the grandchild's tweenProps symbol id from its workspace symbols.json.
    const gcWs = path.join(fullDir, "files", "grandchild-EeEeEeEe");
    const symbols = JSON.parse(
      fs.readFileSync(path.join(gcWs, "symbols.json"), "utf-8"),
    ) as Array<{ name: string; id: string }>;
    const tweenSym = symbols.find((s) => s.name === "tweenProps")!;
    const renamesPath = path.join(gcWs, "renames.json");
    fs.writeFileSync(
      renamesPath,
      JSON.stringify({ [tweenSym.id]: "addNumbers" }),
    );

    const claim = runCLI([
      "claim",
      "grandchild-EeEeEeEe",
      "rename",
      "--target",
      targetDir,
      "--owner",
      "agent-A",
    ]);
    expect(claim.code).toBe(0);

    const done = runCLI([
      "mark-done",
      "grandchild-EeEeEeEe",
      "rename",
      "--target",
      targetDir,
      "--renames",
      renamesPath,
    ]);
    expect(done.code).toBe(0);
    expect(done.stdout).toContain("renames: 1 matched");

    // The producerRestoredName for the consumer (child-BbBbBbBb) should now be set.
    const ledger = JSON.parse(fs.readFileSync(ledgerPath, "utf-8"));
    const link = ledger.crossFileBindings.find(
      (b: { consumer: string; producer: string }) =>
        b.consumer === "child-BbBbBbBb" && b.producer === "grandchild-EeEeEeEe",
    );
    expect(link.producerRestoredName).toBe("addNumbers");

    // The lock should be released.
    const lockPath = path.join(
      fullDir,
      "locks",
      "grandchild-EeEeEeEe.rename.lock",
    );
    expect(fs.existsSync(lockPath)).toBe(false);
  });

  test("reset rolls a file back to pending and clears restoredName", () => {
    const { targetDir, ledgerPath } = makeFixture();
    const ledgerBefore = JSON.parse(fs.readFileSync(ledgerPath, "utf-8"));
    const child = ledgerBefore.files["child-BbBbBbBb"];
    const fooSym = child.symbols.find(
      (s: { exportedAs?: string }) => s.exportedAs === "foo",
    )!;
    const renames = path.join(makeTmpRoot(), "renames.json");
    fs.writeFileSync(renames, JSON.stringify({ [fooSym.id]: "fooHelper" }));

    runCLI([
      "claim",
      "child-BbBbBbBb",
      "rename",
      "--target",
      targetDir,
      "--owner",
      "agent-A",
    ]);
    runCLI([
      "mark-done",
      "child-BbBbBbBb",
      "rename",
      "--target",
      targetDir,
      "--renames",
      renames,
    ]);

    const reset = runCLI([
      "reset",
      "child-BbBbBbBb",
      "--stage",
      "rename",
      "--target",
      targetDir,
    ]);
    expect(reset.code).toBe(0);
    expect(reset.stdout).toContain("reset child-BbBbBbBb.rename");

    const ledgerAfter = JSON.parse(fs.readFileSync(ledgerPath, "utf-8"));
    const childAfter = ledgerAfter.files["child-BbBbBbBb"];
    const fooAfter = childAfter.symbols.find(
      (s: { id: string }) => s.id === fooSym.id,
    );
    expect(fooAfter.restoredName).toBeNull();
    expect(fooAfter.status).toBe("pending");
  });

  test("next without --stage reports a tab-separated basename/stage row", () => {
    const { targetDir } = makeFixture();
    const out = runCLI(["next", "--target", targetDir]);
    expect(out.code).toBe(0);
    const cols = out.stdout.trim().split("\t");
    expect(cols.length).toBeGreaterThanOrEqual(2);
    expect(["extract", "rename", "polish", "finalize"]).toContain(cols[1]!);
  });

  test("missing manifest exits 1 with a clear message", () => {
    const targetDir = path.join(makeTmpRoot(), "decode");
    fs.mkdirSync(targetDir, { recursive: true });
    const out = runCLI(["status", "--target", targetDir]);
    expect(out.code).toBe(1);
    expect(out.stderr).toContain("manifest not found");
  });

  test("unknown subcommand exits 64", () => {
    const out = runCLI(["frobnicate"]);
    expect(out.code).toBe(64);
    expect(out.stderr).toContain("Usage:");
  });
});

describe("computeFrontier (library)", () => {
  function load(fx: ReturnType<typeof makeFixture>) {
    const manifest = JSON.parse(fs.readFileSync(fx.manifestPath, "utf-8"));
    const ledger = JSON.parse(fs.readFileSync(fx.ledgerPath, "utf-8"));
    return { manifest, ledger };
  }

  test("only the leaf is restorable at rename; consumers are deferred", () => {
    const fx = makeFixture();
    const { manifest, ledger } = load(fx);
    const frontier = computeFrontier(manifest, ledger, fx.fullDir, {
      stage: "rename",
    });
    expect(frontier.map((f) => f.basename)).toEqual(["grandchild-EeEeEeEe"]);
  });

  test("marking the leaf renamed advances the frontier to its consumer", () => {
    const fx = makeFixture();
    const { manifest, ledger } = load(fx);
    manifest.files["grandchild-EeEeEeEe"]!.stages.renamed = true;
    const frontier = computeFrontier(manifest, ledger, fx.fullDir, {
      stage: "rename",
    });
    expect(frontier.map((f) => f.basename)).toEqual(["child-BbBbBbBb"]);
  });

  test("a faced dependency satisfies consumers without being renamed", () => {
    const fx = makeFixture();
    const { manifest, ledger } = load(fx);
    manifest.files["grandchild-EeEeEeEe"]!.stages.faced = true;
    const frontier = computeFrontier(manifest, ledger, fx.fullDir, {
      stage: "rename",
    });
    const names = frontier.map((f) => f.basename);
    // the faced leaf itself is excluded; its consumer is now restorable.
    expect(names).not.toContain("grandchild-EeEeEeEe");
    expect(names).toContain("child-BbBbBbBb");
  });
});

describe("organize / promote stages", () => {
  function load(fx: ReturnType<typeof makeFixture>) {
    const manifest = JSON.parse(fs.readFileSync(fx.manifestPath, "utf-8"));
    const ledger = JSON.parse(fs.readFileSync(fx.ledgerPath, "utf-8"));
    return { manifest, ledger };
  }

  test("setOrganization records domain/path and flips stages.organized", () => {
    const fx = makeFixture();
    const { manifest } = load(fx);
    setOrganization(manifest, "grandchild-EeEeEeEe", {
      domain: "utils",
      semanticPath: "utils/addNumbers.ts",
      classification: "single-util",
    });
    const file = manifest.files["grandchild-EeEeEeEe"];
    expect(file.organization.semanticPath).toBe("utils/addNumbers.ts");
    expect(file.organization.domain).toBe("utils");
    expect(file.organization.classification).toBe("single-util");
    expect(file.stages.organized).toBe(true);
  });

  test("setOrganization throws on an unknown basename", () => {
    const fx = makeFixture();
    const { manifest } = load(fx);
    expect(() =>
      setOrganization(manifest, "nope-ZZZZ", {
        domain: "utils",
        semanticPath: "utils/x.ts",
        classification: "single-util",
      }),
    ).toThrow("unknown basename");
  });

  test("promote frontier defers a consumer until its producer is promoted", () => {
    const fx = makeFixture();
    const { manifest, ledger } = load(fx);
    // Leaf-first: only the leaf is promotable; consumers wait on it.
    const first = computeFrontier(manifest, ledger, fx.fullDir, {
      stage: "promote",
    });
    expect(first.map((f) => f.basename)).toEqual(["grandchild-EeEeEeEe"]);

    manifest.files["grandchild-EeEeEeEe"].stages.promoted = true;
    const next = computeFrontier(manifest, ledger, fx.fullDir, {
      stage: "promote",
    });
    expect(next.map((f) => f.basename)).toEqual(["child-BbBbBbBb"]);
  });

  test("set-organization CLI writes the manifest entry", () => {
    const fx = makeFixture();
    const out = runCLI([
      "set-organization",
      "grandchild-EeEeEeEe",
      "--domain",
      "utils",
      "--semantic-path",
      "utils/addNumbers.ts",
      "--classification",
      "single-util",
      "--target",
      fx.targetDir,
    ]);
    expect(out.code).toBe(0);
    expect(out.stdout).toContain("organized");
    const manifest = JSON.parse(fs.readFileSync(fx.manifestPath, "utf-8"));
    const file = manifest.files["grandchild-EeEeEeEe"];
    expect(file.organization.semanticPath).toBe("utils/addNumbers.ts");
    expect(file.stages.organized).toBe(true);
  });

  test("set-organization CLI rejects an unknown --classification", () => {
    const fx = makeFixture();
    const out = runCLI([
      "set-organization",
      "grandchild-EeEeEeEe",
      "--domain",
      "utils",
      "--semantic-path",
      "utils/addNumbers.ts",
      "--classification",
      "bogus",
      "--target",
      fx.targetDir,
    ]);
    expect(out.code).toBe(64);
  });
});

describe("frontier / mark-faced (CLI)", () => {
  test("frontier lists the leaf, mark-faced advances it", () => {
    const fx = makeFixture();
    const first = runCLI([
      "frontier",
      "--stage",
      "rename",
      "--target",
      fx.targetDir,
    ]);
    expect(first.code).toBe(0);
    expect(first.stdout).toContain("grandchild-EeEeEeEe");

    const faced = runCLI([
      "mark-faced",
      "grandchild-EeEeEeEe",
      "--target",
      fx.targetDir,
    ]);
    expect(faced.code).toBe(0);
    expect(faced.stdout).toContain("faced");

    const after = runCLI([
      "frontier",
      "--stage",
      "rename",
      "--target",
      fx.targetDir,
    ]);
    expect(after.stdout).toContain("child-BbBbBbBb");
    expect(after.stdout).not.toContain("grandchild-EeEeEeEe");
  });

  test("mark-faced on an unknown basename exits 1", () => {
    const fx = makeFixture();
    const out = runCLI(["mark-faced", "nope-ZZZZ", "--target", fx.targetDir]);
    expect(out.code).toBe(1);
  });

  test("mark-faced refuses an app-entry basename without --force, allows with --force", () => {
    const fx = makeFixture();
    const manifest = JSON.parse(fs.readFileSync(fx.manifestPath, "utf-8"));
    // clone an existing leaf node as an app-shell (app/feature) chunk
    const node = JSON.parse(
      JSON.stringify(manifest.files["grandchild-EeEeEeEe"]),
    );
    node.stages.faced = false;
    manifest.files["app-shell-Test1234"] = node;
    fs.writeFileSync(fx.manifestPath, JSON.stringify(manifest, null, 2) + "\n");

    // Without --force: refused, and the chunk is NOT faced.
    const refused = runCLI([
      "mark-faced",
      "app-shell-Test1234",
      "--target",
      fx.targetDir,
    ]);
    expect(refused.code).not.toBe(0);
    const afterRefuse = JSON.parse(fs.readFileSync(fx.manifestPath, "utf-8"));
    expect(afterRefuse.files["app-shell-Test1234"].stages.faced).toBeFalsy();

    // With --force: allowed.
    const forced = runCLI([
      "mark-faced",
      "app-shell-Test1234",
      "--target",
      fx.targetDir,
      "--force",
    ]);
    expect(forced.code).toBe(0);
    const afterForce = JSON.parse(fs.readFileSync(fx.manifestPath, "utf-8"));
    expect(afterForce.files["app-shell-Test1234"].stages.faced).toBe(true);
  });
});

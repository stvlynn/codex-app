import { describe, expect, test } from "bun:test";
import * as fs from "node:fs";
import * as path from "node:path";
import { spawnSync } from "node:child_process";
import { planBatches, formatChecklist } from "./plan.ts";
import type { SymbolEntry } from "./extract.ts";

const SCRIPT = path.join(import.meta.dir, "plan.ts");

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

function makeSymbol(overrides: Partial<SymbolEntry>): SymbolEntry {
  return {
    id: "a@1",
    name: "a",
    kind: "var",
    bindingPathType: "VariableDeclarator",
    scopeKind: "Program",
    scopeSize: 1000,
    declStart: 1,
    declEnd: 2,
    referenceCount: 1,
    constant: true,
    sameScopeBindings: ["a"],
    context: "",
    ...overrides,
  };
}

describe("planBatches (library)", () => {
  test("empty input → 0 batches", () => {
    const plan = planBatches([], "x.js");
    expect(plan.totalSymbols).toBe(0);
    expect(plan.batches).toHaveLength(0);
    expect(plan.input).toBe("x.js");
  });

  test("single scope, fits in one batch", () => {
    const syms = [
      makeSymbol({ id: "a@1", name: "a", referenceCount: 3 }),
      makeSymbol({ id: "b@5", name: "b", referenceCount: 5 }),
    ];
    const plan = planBatches(syms, "x.js", { batchSize: 100 });
    expect(plan.batches).toHaveLength(1);
    expect(plan.batches[0]!.symbolCount).toBe(2);
    // Sorted by referenceCount desc within batch
    expect(plan.batches[0]!.symbolIds).toEqual(["b@5", "a@1"]);
  });

  test("splits a scope into multiple batches by batchSize", () => {
    const syms = Array.from({ length: 250 }, (_, i) =>
      makeSymbol({ id: `s${i}@${i * 10}`, name: `s${i}` }),
    );
    const plan = planBatches(syms, "x.js", { batchSize: 100 });
    expect(plan.batches).toHaveLength(3);
    expect(plan.batches[0]!.symbolCount).toBe(100);
    expect(plan.batches[1]!.symbolCount).toBe(100);
    expect(plan.batches[2]!.symbolCount).toBe(50);
  });

  test("groups by scope (key = scopeKind:scopeSize)", () => {
    const syms = [
      makeSymbol({ id: "a@1", scopeKind: "Program", scopeSize: 1000 }),
      makeSymbol({ id: "b@2", scopeKind: "Program", scopeSize: 1000 }),
      makeSymbol({
        id: "c@3",
        scopeKind: "FunctionDeclaration",
        scopeSize: 200,
      }),
    ];
    const plan = planBatches(syms, "x.js", { batchSize: 100 });
    expect(plan.batches).toHaveLength(2);
    // Largest scope first
    expect(plan.batches[0]!.scopeKind).toBe("Program");
    expect(plan.batches[0]!.scopeSize).toBe(1000);
    expect(plan.batches[1]!.scopeKind).toBe("FunctionDeclaration");
  });

  test("largest scope appears first (by scopeSize desc)", () => {
    const syms = [
      makeSymbol({ id: "a@1", scopeKind: "FunctionDeclaration", scopeSize: 50 }),
      makeSymbol({ id: "b@2", scopeKind: "Program", scopeSize: 9000 }),
      makeSymbol({
        id: "c@3",
        scopeKind: "FunctionDeclaration",
        scopeSize: 500,
      }),
    ];
    const plan = planBatches(syms, "x.js");
    expect(plan.batches.map((b) => b.scopeSize)).toEqual([9000, 500, 50]);
  });

  test("--only-cryptic filters non-cryptic names", () => {
    const syms = [
      makeSymbol({ id: "a@1", name: "a" }),
      makeSymbol({ id: "useState@2", name: "useState" }),
      makeSymbol({ id: "_0x4f3@3", name: "_0x4f3" }),
      makeSymbol({ id: "parseUrl@4", name: "parseUrl" }),
    ];
    const plan = planBatches(syms, "x.js", { onlyCryptic: true });
    expect(plan.totalSymbols).toBe(2);
    expect(plan.batches[0]!.symbolIds.sort()).toEqual(["_0x4f3@3", "a@1"]);
  });

  test("--min-refs filters low-reference bindings", () => {
    const syms = [
      makeSymbol({ id: "a@1", referenceCount: 0 }),
      makeSymbol({ id: "b@2", referenceCount: 1 }),
      makeSymbol({ id: "c@3", referenceCount: 5 }),
    ];
    const plan = planBatches(syms, "x.js", { minRefs: 2 });
    expect(plan.totalSymbols).toBe(1);
    expect(plan.batches[0]!.symbolIds).toEqual(["c@3"]);
  });

  test("batches contain stable indices", () => {
    const syms = Array.from({ length: 5 }, (_, i) =>
      makeSymbol({
        id: `s${i}@${i}`,
        scopeKind: i < 3 ? "Program" : "FunctionDeclaration",
        scopeSize: i < 3 ? 1000 : 100,
      }),
    );
    const plan = planBatches(syms, "x.js", { batchSize: 2 });
    expect(plan.batches.map((b) => b.index)).toEqual([0, 1, 2]);
  });
});

describe("formatChecklist", () => {
  test("includes input, totals, batch list", () => {
    const syms = [
      makeSymbol({ id: "a@1", name: "a" }),
      makeSymbol({ id: "b@2", name: "b" }),
    ];
    const plan = planBatches(syms, "myinput.js", { batchSize: 1 });
    const md = formatChecklist(plan, "/tmp/out");
    expect(md).toContain("Rename Checklist — myinput.js");
    expect(md).toContain("**Total symbols:** 2");
    expect(md).toContain("**Batches:** 2");
    expect(md).toContain("**Batch size:** 1");
    expect(md).toContain("- [ ] **Batch 0**");
    expect(md).toContain("- [ ] **Batch 1**");
    expect(md).toContain("/tmp/out");
  });

  test("empty plan still renders header", () => {
    const plan = planBatches([], "empty.js");
    const md = formatChecklist(plan, "/tmp/out");
    expect(md).toContain("**Total symbols:** 0");
    expect(md).toContain("**Batches:** 0");
  });
});

describe("plan (CLI)", () => {
  test("missing positional exits 64", () => {
    const { code, stderr } = runCLI([]);
    expect(code).toBe(64);
    expect(stderr).toContain("Usage");
  });

  test("missing --out-dir exits 64", () => {
    const tmp = fs.mkdtempSync(path.join(import.meta.dir, "..", "tmp-plan-"));
    const symPath = path.join(tmp, "sym.json");
    fs.writeFileSync(symPath, "[]\n");
    try {
      const { code, stderr } = runCLI([symPath]);
      expect(code).toBe(64);
      expect(stderr).toContain("--out-dir");
    } finally {
      fs.rmSync(tmp, { recursive: true, force: true });
    }
  });

  test("invalid --batch-size exits 64", () => {
    const tmp = fs.mkdtempSync(path.join(import.meta.dir, "..", "tmp-plan-"));
    const symPath = path.join(tmp, "sym.json");
    fs.writeFileSync(symPath, "[]\n");
    const outDir = path.join(tmp, "out");
    try {
      const { code, stderr } = runCLI([
        symPath,
        "--out-dir",
        outDir,
        "--batch-size",
        "0",
      ]);
      expect(code).toBe(64);
      expect(stderr).toContain("--batch-size");
    } finally {
      fs.rmSync(tmp, { recursive: true, force: true });
    }
  });

  test("writes plan.json, CHECKLIST.md, batch-N.json", () => {
    const tmp = fs.mkdtempSync(path.join(import.meta.dir, "..", "tmp-plan-"));
    const symPath = path.join(tmp, "sym.json");
    const outDir = path.join(tmp, "out");
    const syms = [
      makeSymbol({ id: "a@1", name: "a" }),
      makeSymbol({ id: "b@2", name: "b" }),
      makeSymbol({ id: "c@3", name: "c" }),
    ];
    fs.writeFileSync(symPath, JSON.stringify(syms));
    try {
      const { code, stderr } = runCLI([
        symPath,
        "--out-dir",
        outDir,
        "--batch-size",
        "2",
      ]);
      expect(code).toBe(0);
      expect(stderr).toContain("plan:");

      expect(fs.existsSync(path.join(outDir, "plan.json"))).toBe(true);
      expect(fs.existsSync(path.join(outDir, "CHECKLIST.md"))).toBe(true);
      expect(fs.existsSync(path.join(outDir, "batch-0.json"))).toBe(true);
      expect(fs.existsSync(path.join(outDir, "batch-1.json"))).toBe(true);

      const plan = JSON.parse(
        fs.readFileSync(path.join(outDir, "plan.json"), "utf-8"),
      );
      expect(plan.totalSymbols).toBe(3);
      expect(plan.batches).toHaveLength(2);

      const batch0 = JSON.parse(
        fs.readFileSync(path.join(outDir, "batch-0.json"), "utf-8"),
      );
      expect(batch0).toHaveLength(2);
      expect(batch0[0].id).toBeDefined();

      const checklist = fs.readFileSync(
        path.join(outDir, "CHECKLIST.md"),
        "utf-8",
      );
      expect(checklist).toContain("Batch 0");
      expect(checklist).toContain("Batch 1");
    } finally {
      fs.rmSync(tmp, { recursive: true, force: true });
    }
  });

  test("reads symbols from stdin via '-'", () => {
    const tmp = fs.mkdtempSync(path.join(import.meta.dir, "..", "tmp-plan-"));
    const outDir = path.join(tmp, "out");
    const syms = [makeSymbol({ id: "x@1", name: "x" })];
    try {
      const { code } = runCLI(
        ["-", "--out-dir", outDir, "--input", "stdin.js"],
        JSON.stringify(syms),
      );
      expect(code).toBe(0);
      const plan = JSON.parse(
        fs.readFileSync(path.join(outDir, "plan.json"), "utf-8"),
      );
      expect(plan.input).toBe("stdin.js");
      expect(plan.totalSymbols).toBe(1);
    } finally {
      fs.rmSync(tmp, { recursive: true, force: true });
    }
  });

  test("--only-cryptic + --min-refs filter chain on CLI", () => {
    const tmp = fs.mkdtempSync(path.join(import.meta.dir, "..", "tmp-plan-"));
    const symPath = path.join(tmp, "sym.json");
    const outDir = path.join(tmp, "out");
    const syms = [
      makeSymbol({ id: "a@1", name: "a", referenceCount: 5 }),
      makeSymbol({ id: "useState@2", name: "useState", referenceCount: 10 }),
      makeSymbol({ id: "b@3", name: "b", referenceCount: 0 }),
    ];
    fs.writeFileSync(symPath, JSON.stringify(syms));
    try {
      const { code } = runCLI([
        symPath,
        "--out-dir",
        outDir,
        "--only-cryptic",
        "--min-refs",
        "1",
      ]);
      expect(code).toBe(0);
      const plan = JSON.parse(
        fs.readFileSync(path.join(outDir, "plan.json"), "utf-8"),
      );
      // 'useState' filtered by --only-cryptic, 'b' filtered by --min-refs
      expect(plan.totalSymbols).toBe(1);
    } finally {
      fs.rmSync(tmp, { recursive: true, force: true });
    }
  });
});

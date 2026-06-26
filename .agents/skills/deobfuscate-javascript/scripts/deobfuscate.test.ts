import { describe, expect, test } from "bun:test";
import * as fs from "node:fs";
import * as path from "node:path";
import { spawnSync } from "node:child_process";
import { deobfuscate } from "./deobfuscate.ts";

const FIXTURES = path.join(import.meta.dir, "..", "fixtures");
const SCRIPT = path.join(import.meta.dir, "deobfuscate.ts");

function fixture(name: string): string {
  return fs.readFileSync(path.join(FIXTURES, name), "utf-8");
}

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

describe("deobfuscate (library)", () => {
  test("empty input returns empty", () => {
    const result = deobfuscate("");
    expect(result.code).toBe("");
    expect(result.originalSize).toBe(0);
    expect(result.finalSize).toBe(0);
  });

  test("runs all 6 default steps on clean code", () => {
    const result = deobfuscate("function add(a, b) { return a + b; }\n", {
      warn: () => {},
    });
    const stepNames = result.steps.map((s) => s.step);
    expect(stepNames).toContain("detect");
    expect(stepNames).toContain("unpack");
    expect(stepNames).toContain("string-array");
    expect(stepNames).toContain("decode-strings");
    expect(stepNames).toContain("simplify");
    expect(stepNames).toContain("control-flow-report");
  });

  test("composite fixture: removes string-array + decodes + simplifies", () => {
    const result = deobfuscate(fixture("composite.min.js"), { warn: () => {} });
    expect(result.code).toContain('"hello world"');
    expect(result.code).toContain('"Hi"');
    expect(result.code).not.toContain("_0xc0de");
    expect(result.code).not.toContain("fromCharCode");
    expect(result.code).not.toContain("if (false)");
    expect(result.code).not.toContain("if (5 > 3)");
  });

  test("composite fixture: reduces size meaningfully", () => {
    const result = deobfuscate(fixture("composite.min.js"), { warn: () => {} });
    expect(result.finalSize).toBeLessThan(result.originalSize);
  });

  test("composite fixture: detect step reports techniques", () => {
    const result = deobfuscate(fixture("composite.min.js"), { warn: () => {} });
    const detect = result.steps.find((s) => s.step === "detect");
    expect(detect).toBeDefined();
    if (detect && "report" in detect) {
      expect(detect.report.techniques.length).toBeGreaterThan(0);
    }
  });

  test("packer fixture: unpacks then continues pipeline", () => {
    const result = deobfuscate(fixture("packed.dean-edwards.min.js"), {
      warn: () => {},
    });
    expect(result.code).toContain("console.log");
    expect(result.code).toContain("42");
    expect(result.code).not.toContain("eval(function(p,a,c,k,e,d)");

    const unpackStep = result.steps.find((s) => s.step === "unpack");
    expect(unpackStep).toBeDefined();
    if (unpackStep && "result" in unpackStep) {
      expect(unpackStep.result.evalUsed).toBe(true);
    }

    const afterUnpackDetect = result.steps.find(
      (s) => s.step === "detect-after-unpack",
    );
    expect(afterUnpackDetect).toBeDefined();
  });

  test("--no-eval refuses to unpack packer", () => {
    const result = deobfuscate(fixture("packed.dean-edwards.min.js"), {
      noEval: true,
      warn: () => {},
    });
    const unpackStep = result.steps.find((s) => s.step === "unpack");
    expect(unpackStep).toBeDefined();
    if (unpackStep && "result" in unpackStep) {
      expect(unpackStep.result.evalRefused).toBe(true);
      expect(unpackStep.result.evalUsed).toBe(false);
    }
    expect(result.code).toMatch(
      /eval\s*\(\s*function\s*\(\s*p\s*,\s*a\s*,\s*c\s*,\s*k\s*,\s*e\s*,\s*d\s*\)/,
    );
  });

  test("skip unpack: leaves packed code alone", () => {
    const result = deobfuscate(fixture("packed.dean-edwards.min.js"), {
      skip: ["unpack"],
      warn: () => {},
    });
    const unpackStep = result.steps.find((s) => s.step === "unpack");
    expect(unpackStep).toBeUndefined();
    expect(result.code).toMatch(
      /eval\s*\(\s*function\s*\(\s*p\s*,\s*a\s*,\s*c\s*,\s*k\s*,\s*e\s*,\s*d\s*\)/,
    );
  });

  test("stop-after detect: only runs detect", () => {
    const result = deobfuscate(fixture("composite.min.js"), {
      stopAfter: "detect",
      warn: () => {},
    });
    expect(result.steps).toHaveLength(1);
    expect(result.steps[0]!.step).toBe("detect");
    expect(result.code).toBe(fixture("composite.min.js"));
  });

  test("stop-after string-array: runs detect, unpack, string-array only", () => {
    const result = deobfuscate(fixture("composite.min.js"), {
      stopAfter: "string-array",
      warn: () => {},
    });
    const names = result.steps.map((s) => s.step);
    expect(names).toContain("detect");
    expect(names).toContain("unpack");
    expect(names).toContain("string-array");
    expect(names).not.toContain("decode-strings");
    expect(names).not.toContain("simplify");
    expect(names).not.toContain("control-flow-report");
  });

  test("skip multiple steps", () => {
    const result = deobfuscate(fixture("composite.min.js"), {
      skip: ["string-array", "simplify"],
      warn: () => {},
    });
    const names = result.steps.map((s) => s.step);
    expect(names).not.toContain("string-array");
    expect(names).not.toContain("simplify");
    expect(names).toContain("decode-strings");
  });

  test("control-flow-flat fixture: produces report at end", () => {
    const result = deobfuscate(fixture("control-flow-flat.min.js"), {
      warn: () => {},
    });
    const cfStep = result.steps.find((s) => s.step === "control-flow-report");
    expect(cfStep).toBeDefined();
    if (cfStep && "report" in cfStep) {
      expect(cfStep.report.flatteners.length).toBeGreaterThan(0);
    }
  });

  test("idempotent: re-running on output produces same code", () => {
    const first = deobfuscate(fixture("composite.min.js"), { warn: () => {} });
    const second = deobfuscate(first.code, { warn: () => {} });
    expect(second.code).toBe(first.code);
  });

  test("step error in one step doesn't abort pipeline", () => {
    // Passing invalid JS still lets detect run (regex-based);
    // later AST steps will record errors but pipeline continues.
    const result = deobfuscate("var x = {", { warn: () => {} });
    const errored = result.steps.filter(
      (s) => "error" in s,
    );
    expect(errored.length).toBeGreaterThan(0);
    // detect doesn't parse — it should succeed
    const detect = result.steps.find((s) => s.step === "detect");
    expect(detect).toBeDefined();
    expect(detect).not.toHaveProperty("error");
  });
});

describe("deobfuscate (CLI)", () => {
  test("missing arg exits 64", () => {
    const { code, stderr } = runCLI([]);
    expect(code).toBe(64);
    expect(stderr).toContain("Usage");
  });

  test("invalid skip step exits 64", () => {
    const { code, stderr } = runCLI([
      path.join(FIXTURES, "composite.min.js"),
      "--skip",
      "bogus-step",
    ]);
    expect(code).toBe(64);
    expect(stderr).toContain("unknown step");
  });

  test("invalid stop-after step exits 64", () => {
    const { code, stderr } = runCLI([
      path.join(FIXTURES, "composite.min.js"),
      "--stop-after",
      "nope",
    ]);
    expect(code).toBe(64);
    expect(stderr).toContain("unknown step");
  });

  test("deobfuscates composite via stdout", () => {
    const { stdout, stderr, code } = runCLI([
      path.join(FIXTURES, "composite.min.js"),
    ]);
    expect(code).toBe(0);
    expect(stdout).toContain('"hello world"');
    expect(stdout).not.toContain("_0xc0de");
    expect(stderr).toContain("deobfuscate");
  });

  test("writes --out and --report", () => {
    const tmpDir = fs.mkdtempSync(path.join(import.meta.dir, "..", "tmp-"));
    const outPath = path.join(tmpDir, "clean.js");
    const reportPath = path.join(tmpDir, "report.json");
    try {
      const { code } = runCLI([
        path.join(FIXTURES, "composite.min.js"),
        "--out",
        outPath,
        "--report",
        reportPath,
      ]);
      expect(code).toBe(0);
      const out = fs.readFileSync(outPath, "utf-8");
      expect(out).toContain('"hello world"');
      const report = JSON.parse(fs.readFileSync(reportPath, "utf-8"));
      expect(report.originalSize).toBeGreaterThan(0);
      expect(report.finalSize).toBeGreaterThan(0);
      expect(Array.isArray(report.steps)).toBe(true);
    } finally {
      fs.rmSync(tmpDir, { recursive: true, force: true });
    }
  });

  test("stdin works", () => {
    const { stdout, code } = runCLI(
      ["-"],
      'var x = String.fromCharCode(72, 105);\n',
    );
    expect(code).toBe(0);
    expect(stdout).toContain('"Hi"');
  });

  test("--no-eval refuses packer via CLI", () => {
    const { stdout, stderr, code } = runCLI([
      path.join(FIXTURES, "packed.dean-edwards.min.js"),
      "--no-eval",
    ]);
    expect(code).toBe(0);
    expect(stdout).toMatch(
      /eval\s*\(\s*function\s*\(\s*p\s*,\s*a\s*,\s*c\s*,\s*k\s*,\s*e\s*,\s*d\s*\)/,
    );
    expect(stderr).toContain("eval-refused");
  });

  test("--stop-after detect prints unchanged source", () => {
    const { stdout, code } = runCLI([
      path.join(FIXTURES, "composite.min.js"),
      "--stop-after",
      "detect",
    ]);
    expect(code).toBe(0);
    expect(stdout).toBe(fixture("composite.min.js"));
  });
});

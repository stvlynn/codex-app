import { describe, expect, test } from "bun:test";
import * as fs from "node:fs";
import * as path from "node:path";
import { detectReport, detectTechniques, type TechniqueName } from "./detect.ts";

const FIXTURES = path.join(import.meta.dir, "..", "fixtures");

function fixture(name: string): string {
  return fs.readFileSync(path.join(FIXTURES, name), "utf-8");
}

function hasTechnique(
  reports: ReturnType<typeof detectTechniques>,
  name: TechniqueName,
  minConfidence = 0.5,
): boolean {
  return reports.some((r) => r.name === name && r.confidence >= minConfidence);
}

describe("detect", () => {
  test("empty input returns empty techniques", () => {
    expect(detectTechniques("")).toEqual([]);
  });

  test("clean readable code returns no techniques", () => {
    const source = "function add(a, b) { return a + b; } console.log(add(1, 2));";
    expect(detectTechniques(source)).toEqual([]);
  });

  test("detects Dean Edwards Packer", () => {
    const reports = detectTechniques(fixture("packed.dean-edwards.min.js"));
    expect(hasTechnique(reports, "packer", 0.9)).toBe(true);
  });

  test("detects AAEncode", () => {
    const reports = detectTechniques(fixture("aaencode.min.js"));
    expect(hasTechnique(reports, "aaencode", 0.9)).toBe(true);
  });

  test("detects URL-encoded payload", () => {
    const reports = detectTechniques(fixture("url-encoded.min.js"));
    expect(hasTechnique(reports, "urlencoded")).toBe(true);
  });

  test("detects Obfuscator.IO string-array + rotation", () => {
    const reports = detectTechniques(fixture("string-array-obfuscator.min.js"));
    expect(hasTechnique(reports, "string-array")).toBe(true);
    expect(hasTechnique(reports, "string-array-rotation")).toBe(true);
    expect(hasTechnique(reports, "obfuscator-io")).toBe(true);
  });

  test("detects fromCharCode + hex + unicode + base64", () => {
    const reports = detectTechniques(fixture("from-char-code.min.js"));
    expect(hasTechnique(reports, "from-char-code")).toBe(true);
    expect(hasTechnique(reports, "hex-encoding", 0.3)).toBe(true);
    expect(hasTechnique(reports, "unicode-encoding", 0.3)).toBe(true);
    expect(hasTechnique(reports, "base64-decoding")).toBe(true);
  });

  test("detects dead code injection", () => {
    const reports = detectTechniques(fixture("dead-code.min.js"));
    expect(hasTechnique(reports, "dead-code-injection")).toBe(true);
  });

  test("detects opaque predicates", () => {
    const reports = detectTechniques(fixture("opaque-predicates.min.js"));
    expect(hasTechnique(reports, "opaque-predicates")).toBe(true);
  });

  test("detects while/switch flattening", () => {
    const reports = detectTechniques(fixture("control-flow-flat.min.js"));
    expect(hasTechnique(reports, "control-flow-flattening")).toBe(true);
  });

  test("composite fixture detects multiple techniques", () => {
    const reports = detectTechniques(fixture("composite.min.js"));
    expect(hasTechnique(reports, "string-array")).toBe(true);
    expect(hasTechnique(reports, "from-char-code")).toBe(true);
    expect(hasTechnique(reports, "opaque-predicates")).toBe(true);
    expect(hasTechnique(reports, "dead-code-injection")).toBe(true);
  });

  test("report includes input path, size, recommendation", () => {
    const source = fixture("packed.dean-edwards.min.js");
    const report = detectReport("foo.js", source);
    expect(report.input).toBe("foo.js");
    expect(report.size).toBe(source.length);
    expect(report.recommendation).toContain("scripts/unpack.ts");
  });

  test("recommendation for clean code suggests Stage B", () => {
    const report = detectReport("clean.js", "function add(a,b){return a+b;}");
    expect(report.recommendation).toContain("Stage B");
  });

  test("techniques sorted by confidence descending", () => {
    const reports = detectReport(
      "x.js",
      fixture("string-array-obfuscator.min.js"),
    ).techniques;
    for (let i = 1; i < reports.length; i++) {
      expect(reports[i - 1]!.confidence).toBeGreaterThanOrEqual(reports[i]!.confidence);
    }
  });

  test("idempotent: detect on its own JSON output finds no JS techniques", () => {
    const report = detectReport("x.js", fixture("packed.dean-edwards.min.js"));
    const json = JSON.stringify(report, null, 2);
    const secondPass = detectTechniques(json);
    expect(secondPass.filter((r) => r.confidence >= 0.7)).toEqual([]);
  });
});

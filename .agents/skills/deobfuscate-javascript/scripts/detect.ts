import * as fs from "node:fs";
import { parseArgs } from "node:util";

export type TechniqueName =
  | "packer"
  | "aaencode"
  | "urlencoded"
  | "string-array"
  | "string-array-rotation"
  | "hex-encoding"
  | "unicode-encoding"
  | "from-char-code"
  | "base64-decoding"
  | "control-flow-flattening"
  | "opaque-predicates"
  | "dead-code-injection"
  | "obfuscator-io"
  | "webpack"
  | "single-line-uglify";

export type TechniqueReport = {
  name: TechniqueName;
  confidence: number;
  evidence: string;
};

export type DetectReport = {
  input: string;
  size: number;
  techniques: TechniqueReport[];
  recommendation: string;
};

const PACKER_RE =
  /eval\s*\(\s*function\s*\(\s*p\s*,\s*a\s*,\s*c\s*,\s*k\s*,\s*e\s*,\s*[dr]\s*\)/;
const STRING_ARRAY_DECL_RE = /var\s+_0x[a-f0-9]+\s*=\s*\[/i;
const STRING_ARRAY_REF_RE = /_0x[a-f0-9]+\s*\[\s*(?:0x[0-9a-f]+|\d+)\s*\]/gi;
const STRING_ARRAY_ROTATION_RE =
  /\(\s*function\s*\(\s*_0x[a-f0-9]+\s*,\s*_0x[a-f0-9]+\s*\)[\s\S]{0,400}?(?:\.\s*push|\[\s*['"]push['"]\s*\])[\s\S]{0,200}?(?:\.\s*shift|\[\s*['"]shift['"]\s*\])/i;
const HEX_RE = /\\x[0-9a-f]{2}/i;
const UNICODE_RE = /\\u[0-9a-f]{4}/i;
const FROM_CHAR_CODE_RE = /String\s*\.\s*fromCharCode\s*\(/;
const ATOB_RE = /\batob\s*\(\s*["'`]/;
const FLATTENING_WHILE_SWITCH_RE = /while\s*\(\s*(?:true|!!\s*\[\s*\]|1)\s*\)\s*\{?\s*switch\s*\(/;
const FLATTENING_SPLIT_RE = /["'][0-9]+(?:\|[0-9]+)+["']\s*\.\s*split\s*\(\s*["']\|["']\s*\)/;
const OPAQUE_LITERAL_CMP_RE = /if\s*\(\s*-?\d+\s*(?:===|!==|==|!=|>=|<=|>|<)\s*-?\d+\s*\)/;
const OPAQUE_NOT_NOT_ARRAY_RE = /!!\s*\[\s*\]/;
const DEAD_CODE_RE = /if\s*\(\s*(?:false|!1)\s*\)/;
const WEBPACK_RE = /__webpack_require__|webpackJsonp/;
const URL_ENCODED_RE = /%[0-9A-Fa-f]{2}/g;
const OBFUSCATOR_IO_ID_RE = /_0x[a-f0-9]{4,6}/gi;

function countMatches(source: string, regex: RegExp): number {
  if (!regex.global) throw new Error("countMatches needs a global regex");
  let count = 0;
  let m: RegExpExecArray | null;
  regex.lastIndex = 0;
  while ((m = regex.exec(source)) !== null) {
    count++;
    if (m.index === regex.lastIndex) regex.lastIndex++;
  }
  return count;
}

function aaencodeSignature(source: string): boolean {
  return (
    source.includes("゜-゜") ||
    source.includes("ω゜") ||
    source.includes("o゜)") ||
    source.includes("(ﾟДﾟ)")
  );
}

export function detectTechniques(source: string): TechniqueReport[] {
  const reports: TechniqueReport[] = [];

  if (PACKER_RE.test(source)) {
    reports.push({
      name: "packer",
      confidence: 0.95,
      evidence: "Dean Edwards Packer header detected (eval+function with P,A,C,K,E,D parameter signature)",
    });
  }

  if (aaencodeSignature(source)) {
    reports.push({
      name: "aaencode",
      confidence: 0.95,
      evidence: "found AAEncode emoji glyphs (゜-゜ / ω゜ / (ﾟДﾟ))",
    });
  }

  const percentCount = countMatches(source, URL_ENCODED_RE);
  if (percentCount > 10) {
    const density = percentCount / Math.max(1, source.length);
    const confidence = density > 0.05 ? 0.9 : density > 0.02 ? 0.7 : 0.4;
    reports.push({
      name: "urlencoded",
      confidence,
      evidence: `${percentCount} %XX sequences (density ${(density * 100).toFixed(2)}%)`,
    });
  }

  const idMatches = source.match(OBFUSCATOR_IO_ID_RE);
  const idCount = idMatches ? idMatches.length : 0;
  if (idCount > 0) {
    const confidence = idCount > 20 ? 0.9 : idCount > 5 ? 0.7 : 0.5;
    reports.push({
      name: "obfuscator-io",
      confidence,
      evidence: `${idCount} _0x... identifiers (Obfuscator.IO / JavaScript-obfuscator default naming)`,
    });
  }

  if (STRING_ARRAY_DECL_RE.test(source)) {
    const refCount = countMatches(source, STRING_ARRAY_REF_RE);
    const confidence = refCount > 20 ? 0.9 : refCount > 5 ? 0.7 : 0.5;
    reports.push({
      name: "string-array",
      confidence,
      evidence: `_0x... array declaration with ${refCount} indexed access(es)`,
    });
  }

  if (STRING_ARRAY_ROTATION_RE.test(source)) {
    reports.push({
      name: "string-array-rotation",
      confidence: 0.85,
      evidence: "found rotation IIFE with .push(...shift()) pattern",
    });
  }

  if (HEX_RE.test(source)) {
    const count = countMatches(source, /\\x[0-9a-f]{2}/gi);
    const confidence = count > 20 ? 0.9 : count > 5 ? 0.6 : 0.3;
    reports.push({
      name: "hex-encoding",
      confidence,
      evidence: `${count} \\xNN escape(s)`,
    });
  }

  if (UNICODE_RE.test(source)) {
    const count = countMatches(source, /\\u[0-9a-f]{4}/gi);
    const confidence = count > 20 ? 0.8 : count > 5 ? 0.5 : 0.3;
    reports.push({
      name: "unicode-encoding",
      confidence,
      evidence: `${count} \\uNNNN escape(s)`,
    });
  }

  if (FROM_CHAR_CODE_RE.test(source)) {
    const count = countMatches(source, /String\s*\.\s*fromCharCode\s*\(/g);
    reports.push({
      name: "from-char-code",
      confidence: count > 5 ? 0.85 : 0.6,
      evidence: `${count} String.fromCharCode(...) call(s)`,
    });
  }

  if (ATOB_RE.test(source)) {
    const count = countMatches(source, /\batob\s*\(\s*["'`]/g);
    reports.push({
      name: "base64-decoding",
      confidence: count > 3 ? 0.8 : 0.5,
      evidence: `${count} atob("…") call(s) on string literals`,
    });
  }

  if (FLATTENING_WHILE_SWITCH_RE.test(source) || FLATTENING_SPLIT_RE.test(source)) {
    const evidence: string[] = [];
    if (FLATTENING_WHILE_SWITCH_RE.test(source)) evidence.push("while(true){switch(...)}");
    if (FLATTENING_SPLIT_RE.test(source)) evidence.push("'0|1|2'.split('|') dispatch");
    reports.push({
      name: "control-flow-flattening",
      confidence: 0.8,
      evidence: evidence.join(" + "),
    });
  }

  if (OPAQUE_LITERAL_CMP_RE.test(source) || OPAQUE_NOT_NOT_ARRAY_RE.test(source)) {
    const literalCount = countMatches(
      source,
      /if\s*\(\s*-?\d+\s*(?:===|!==|==|!=|>=|<=|>|<)\s*-?\d+\s*\)/g,
    );
    const arrayCount = countMatches(source, /!!\s*\[\s*\]/g);
    reports.push({
      name: "opaque-predicates",
      confidence: literalCount + arrayCount > 3 ? 0.8 : 0.5,
      evidence: `${literalCount} literal-vs-literal compare(s), ${arrayCount} !![] pattern(s)`,
    });
  }

  if (DEAD_CODE_RE.test(source)) {
    const count = countMatches(source, /if\s*\(\s*(?:false|!1)\s*\)/g);
    reports.push({
      name: "dead-code-injection",
      confidence: count > 3 ? 0.85 : 0.6,
      evidence: `${count} if(false)/if(!1) block(s)`,
    });
  }

  if (WEBPACK_RE.test(source)) {
    reports.push({
      name: "webpack",
      confidence: 0.95,
      evidence: "matched __webpack_require__/webpackJsonp signature",
    });
  }

  if (source.length > 1000 && !source.includes("\n")) {
    reports.push({
      name: "single-line-uglify",
      confidence: 0.6,
      evidence: `${source.length} bytes on one line — likely uglify/terser minified`,
    });
  }

  return reports;
}

function recommendationFor(reports: TechniqueReport[]): string {
  const has = (name: TechniqueName) =>
    reports.some((r) => r.name === name && r.confidence >= 0.5);
  if (reports.length === 0) {
    return "No obfuscation detected. If you only see short identifiers (a, e, t), skip Stage A and go straight to Stage B (extract → apply).";
  }
  const steps: string[] = [];
  if (has("packer") || has("aaencode") || has("urlencoded")) {
    steps.push("scripts/unpack.ts");
  }
  if (has("string-array") || has("string-array-rotation") || has("obfuscator-io")) {
    steps.push("scripts/string-array.ts");
  }
  if (has("hex-encoding") || has("unicode-encoding") || has("from-char-code") || has("base64-decoding")) {
    steps.push("scripts/decode-strings.ts");
  }
  if (
    has("opaque-predicates") ||
    has("dead-code-injection") ||
    has("string-array") ||
    has("obfuscator-io")
  ) {
    steps.push("scripts/simplify.ts");
  }
  if (has("control-flow-flattening")) {
    steps.push("scripts/control-flow-report.ts (then manual unflatten — see SKILL.md)");
  }
  if (steps.length === 0) {
    return "Detected techniques are low-confidence. Inspect the file manually before running transforms.";
  }
  return `Run, in order: ${steps.join(" → ")}. Or run scripts/deobfuscate.ts to do all at once.`;
}

export function detectReport(inputPath: string, source: string): DetectReport {
  const techniques = detectTechniques(source).sort(
    (a, b) => b.confidence - a.confidence,
  );
  return {
    input: inputPath,
    size: source.length,
    techniques,
    recommendation: recommendationFor(techniques),
  };
}

const USAGE = "Usage: bun scripts/detect.ts <input.js|-> [--out report.json]";

async function readInput(inputPath: string): Promise<string> {
  if (inputPath === "-") {
    return await Bun.stdin.text();
  }
  return fs.readFileSync(inputPath, "utf-8");
}

async function main(): Promise<void> {
  let parsed;
  try {
    parsed = parseArgs({
      args: process.argv.slice(2),
      options: { out: { type: "string", short: "o" } },
      allowPositionals: true,
    });
  } catch (err) {
    console.error(USAGE);
    console.error((err as Error).message);
    process.exit(64);
  }
  const { values, positionals } = parsed;

  if (positionals.length === 0) {
    console.error(USAGE);
    process.exit(64);
  }

  const inputPath = positionals[0]!;
  let source: string;
  try {
    source = await readInput(inputPath);
  } catch (err) {
    console.error(`failed to read input: ${(err as Error).message}`);
    process.exit(1);
  }

  const report = detectReport(inputPath, source);
  const json = JSON.stringify(report, null, 2) + "\n";

  if (values.out) {
    try {
      fs.writeFileSync(values.out, json);
    } catch (err) {
      console.error(`failed to write output: ${(err as Error).message}`);
      process.exit(1);
    }
  } else {
    process.stdout.write(json);
  }

  if (report.techniques.length === 0) {
    console.error("detect: no obfuscation techniques found");
  } else {
    const top = report.techniques
      .slice(0, 3)
      .map((t) => `${t.name}(${(t.confidence * 100).toFixed(0)}%)`)
      .join(", ");
    console.error(
      `detect: ${report.techniques.length} technique(s) — ${top}${
        report.techniques.length > 3 ? ", …" : ""
      }`,
    );
  }
}

if (import.meta.main) {
  await main();
}

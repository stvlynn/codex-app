import * as fs from "node:fs";
import { parseArgs } from "node:util";
import { detectReport, type DetectReport } from "./detect.ts";
import { unpack, type UnpackResult } from "./unpack.ts";
import {
  transformStringArrays,
  type StringArrayResult,
} from "./string-array.ts";
import { decodeStrings, type DecodeResult } from "./decode-strings.ts";
import { simplify, type SimplifyResult } from "./simplify.ts";
import {
  analyzeControlFlow,
  type ControlFlowReport,
} from "./control-flow-report.ts";

export const STEP_NAMES = [
  "detect",
  "unpack",
  "string-array",
  "decode-strings",
  "simplify",
  "control-flow-report",
] as const;
export type StepName = (typeof STEP_NAMES)[number];

export type StepResult =
  | { step: "detect"; report: DetectReport }
  | { step: "detect-after-unpack"; report: DetectReport }
  | { step: "unpack"; result: Omit<UnpackResult, "code"> }
  | {
      step: "string-array";
      stats: StringArrayResult["stats"];
    }
  | {
      step: "decode-strings";
      stats: DecodeResult["stats"];
    }
  | {
      step: "simplify";
      stats: SimplifyResult["stats"];
    }
  | { step: "control-flow-report"; report: ControlFlowReport }
  | { step: StepName; error: string };

export type DeobfuscateOptions = {
  skip?: StepName[];
  stopAfter?: StepName;
  noEval?: boolean;
  noInline?: boolean;
  unpackMaxIterations?: number;
  simplifyMaxPasses?: number;
  inputPath?: string;
  warn?: (msg: string) => void;
};

export type DeobfuscateResult = {
  code: string;
  steps: StepResult[];
  originalSize: number;
  finalSize: number;
};

function isStepName(s: string): s is StepName {
  return (STEP_NAMES as readonly string[]).includes(s);
}

function shouldRun(
  step: StepName,
  skip: Set<StepName>,
  stopAfter: StepName | undefined,
  stoppedAt: { value: boolean },
): boolean {
  if (stoppedAt.value) return false;
  if (skip.has(step)) return false;
  return true;
}

function markStopAfter(
  step: StepName,
  stopAfter: StepName | undefined,
  stoppedAt: { value: boolean },
): void {
  if (stopAfter === step) stoppedAt.value = true;
}

export function deobfuscate(
  source: string,
  opts: DeobfuscateOptions = {},
): DeobfuscateResult {
  const skip = new Set(opts.skip ?? []);
  const stopAfter = opts.stopAfter;
  const warn = opts.warn ?? ((m: string) => console.error(m));
  const inputPath = opts.inputPath ?? "<stdin>";

  const steps: StepResult[] = [];
  let current = source;
  const originalSize = source.length;
  const stoppedAt = { value: false };

  if (shouldRun("detect", skip, stopAfter, stoppedAt)) {
    try {
      const report = detectReport(inputPath, current);
      steps.push({ step: "detect", report });
    } catch (err) {
      steps.push({ step: "detect", error: (err as Error).message });
    }
    markStopAfter("detect", stopAfter, stoppedAt);
  }

  if (shouldRun("unpack", skip, stopAfter, stoppedAt)) {
    try {
      const result = unpack(current, {
        maxIterations: opts.unpackMaxIterations,
        noEval: opts.noEval,
        warn,
      });
      const changed = result.code !== current;
      current = result.code;
      const { code: _omit, ...rest } = result;
      steps.push({ step: "unpack", result: rest });

      if (changed && !skip.has("detect")) {
        try {
          const report = detectReport(inputPath, current);
          steps.push({ step: "detect-after-unpack", report });
        } catch (err) {
          steps.push({
            step: "detect-after-unpack" as StepName,
            error: (err as Error).message,
          });
        }
      }
    } catch (err) {
      steps.push({ step: "unpack", error: (err as Error).message });
    }
    markStopAfter("unpack", stopAfter, stoppedAt);
  }

  if (shouldRun("string-array", skip, stopAfter, stoppedAt)) {
    try {
      const result = transformStringArrays(current);
      current = result.code;
      steps.push({ step: "string-array", stats: result.stats });
    } catch (err) {
      steps.push({ step: "string-array", error: (err as Error).message });
    }
    markStopAfter("string-array", stopAfter, stoppedAt);
  }

  if (shouldRun("decode-strings", skip, stopAfter, stoppedAt)) {
    try {
      const result = decodeStrings(current);
      current = result.code;
      steps.push({ step: "decode-strings", stats: result.stats });
    } catch (err) {
      steps.push({ step: "decode-strings", error: (err as Error).message });
    }
    markStopAfter("decode-strings", stopAfter, stoppedAt);
  }

  if (shouldRun("simplify", skip, stopAfter, stoppedAt)) {
    try {
      const result = simplify(current, {
        maxPasses: opts.simplifyMaxPasses,
        noInline: opts.noInline,
      });
      current = result.code;
      steps.push({ step: "simplify", stats: result.stats });
    } catch (err) {
      steps.push({ step: "simplify", error: (err as Error).message });
    }
    markStopAfter("simplify", stopAfter, stoppedAt);
  }

  if (shouldRun("control-flow-report", skip, stopAfter, stoppedAt)) {
    try {
      const report = analyzeControlFlow(current, inputPath);
      steps.push({ step: "control-flow-report", report });
    } catch (err) {
      steps.push({
        step: "control-flow-report",
        error: (err as Error).message,
      });
    }
    markStopAfter("control-flow-report", stopAfter, stoppedAt);
  }

  return {
    code: current,
    steps,
    originalSize,
    finalSize: current.length,
  };
}

const USAGE =
  "Usage: bun scripts/deobfuscate.ts <input.js|-> [--out output.js] [--report report.json] " +
  "[--skip step1,step2] [--stop-after step] [--no-eval] [--no-inline] " +
  "[--max-iterations 5] [--max-passes 10]";

async function readInput(inputPath: string): Promise<string> {
  if (inputPath === "-") {
    return await Bun.stdin.text();
  }
  return fs.readFileSync(inputPath, "utf-8");
}

function parseSkip(value: string | undefined): StepName[] {
  if (!value) return [];
  const parts = value.split(",").map((s) => s.trim()).filter(Boolean);
  const out: StepName[] = [];
  for (const p of parts) {
    if (!isStepName(p)) {
      throw new Error(
        `unknown step: ${p} (valid: ${STEP_NAMES.join(", ")})`,
      );
    }
    out.push(p);
  }
  return out;
}

function parseStopAfter(value: string | undefined): StepName | undefined {
  if (!value) return undefined;
  if (!isStepName(value)) {
    throw new Error(
      `unknown step: ${value} (valid: ${STEP_NAMES.join(", ")})`,
    );
  }
  return value;
}

function summarizeStep(step: StepResult): string {
  if ("error" in step) return `${step.step}: ERROR ${step.error}`;
  switch (step.step) {
    case "detect":
    case "detect-after-unpack": {
      const techniques = step.report.techniques.length;
      return `${step.step}: ${techniques} technique(s)`;
    }
    case "unpack": {
      const r = step.result;
      const parts: string[] = [`${r.iterations} iter`];
      if (r.evalUsed) parts.push("eval-used");
      if (r.evalRefused) parts.push("eval-refused");
      const layers = r.steps.map((s) => s.kind).join("+");
      if (layers) parts.push(layers);
      return `unpack: ${parts.join(", ")}`;
    }
    case "string-array": {
      const s = step.stats;
      const parts: string[] = [];
      if (s.arraysCollected > 0)
        parts.push(`${s.arraysCollected} arrays collected`);
      if (s.referencesReplaced > 0)
        parts.push(`${s.referencesReplaced} refs replaced`);
      if (s.arraysRemoved > 0) parts.push(`${s.arraysRemoved} removed`);
      if (s.decoderIndirection) parts.push("DECODER-INDIRECTION");
      return `string-array: ${parts.length > 0 ? parts.join(", ") : "no changes"}`;
    }
    case "decode-strings": {
      const s = step.stats;
      const parts: string[] = [];
      if (s.fromCharCode > 0) parts.push(`${s.fromCharCode} fromCharCode`);
      if (s.atob > 0) parts.push(`${s.atob} atob`);
      if (s.escapesNormalized) parts.push("escapes normalized");
      return `decode-strings: ${parts.length > 0 ? parts.join(", ") : "no changes"}`;
    }
    case "simplify": {
      const s = step.stats;
      const parts: string[] = [`${s.passes} pass(es)`];
      if (s.constantsFolded > 0) parts.push(`${s.constantsFolded} folded`);
      if (s.deadIfsRemoved > 0) parts.push(`${s.deadIfsRemoved} dead`);
      if (s.inlinedConstants > 0) parts.push(`${s.inlinedConstants} inlined`);
      return `simplify: ${parts.join(", ")}`;
    }
    case "control-flow-report": {
      const r = step.report;
      const total =
        r.flatteners.length +
        r.splitDispatches.length +
        r.opaquePredicates.length;
      return `control-flow-report: ${total} pattern(s) ${total > 0 ? "— see report" : ""}`;
    }
  }
}

async function main(): Promise<void> {
  let parsed;
  try {
    parsed = parseArgs({
      args: process.argv.slice(2),
      options: {
        out: { type: "string", short: "o" },
        report: { type: "string", short: "r" },
        skip: { type: "string" },
        "stop-after": { type: "string" },
        "no-eval": { type: "boolean", default: false },
        "no-inline": { type: "boolean", default: false },
        "max-iterations": { type: "string", default: "5" },
        "max-passes": { type: "string", default: "10" },
      },
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

  let skip: StepName[];
  let stopAfter: StepName | undefined;
  try {
    skip = parseSkip(values.skip);
    stopAfter = parseStopAfter(values["stop-after"]);
  } catch (err) {
    console.error((err as Error).message);
    process.exit(64);
  }

  const maxIterations = Number(values["max-iterations"] ?? 5);
  const maxPasses = Number(values["max-passes"] ?? 10);
  if (!Number.isFinite(maxIterations) || maxIterations <= 0) {
    console.error("--max-iterations must be a positive number");
    process.exit(64);
  }
  if (!Number.isFinite(maxPasses) || maxPasses <= 0) {
    console.error("--max-passes must be a positive number");
    process.exit(64);
  }

  let result: DeobfuscateResult;
  try {
    result = deobfuscate(source, {
      skip,
      stopAfter,
      noEval: values["no-eval"],
      noInline: values["no-inline"],
      unpackMaxIterations: maxIterations,
      simplifyMaxPasses: maxPasses,
      inputPath,
    });
  } catch (err) {
    console.error(`deobfuscate failed: ${(err as Error).message}`);
    process.exit(2);
  }

  if (values.out) {
    try {
      fs.writeFileSync(values.out, result.code);
    } catch (err) {
      console.error(`failed to write output: ${(err as Error).message}`);
      process.exit(1);
    }
  } else {
    process.stdout.write(result.code);
  }

  if (values.report) {
    const reportPayload = {
      input: inputPath,
      originalSize: result.originalSize,
      finalSize: result.finalSize,
      reduction:
        result.originalSize > 0
          ? (
              ((result.originalSize - result.finalSize) /
                result.originalSize) *
                100
            ).toFixed(1) + "%"
          : "0%",
      steps: result.steps,
    };
    try {
      fs.writeFileSync(
        values.report,
        JSON.stringify(reportPayload, null, 2) + "\n",
      );
    } catch (err) {
      console.error(`failed to write report: ${(err as Error).message}`);
      process.exit(1);
    }
  }

  for (const step of result.steps) {
    console.error(`deobfuscate: ${summarizeStep(step)}`);
  }
  console.error(
    `deobfuscate: done — ${result.originalSize} → ${result.finalSize} bytes`,
  );
}

if (import.meta.main) {
  await main();
}

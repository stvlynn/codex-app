import * as fs from "node:fs";
import { parseArgs } from "node:util";

const PACKER_DETECT_RE =
  /eval\s*\(\s*function\s*\(\s*p\s*,\s*a\s*,\s*c\s*,\s*k\s*,\s*e\s*,\s*[dr]\s*\)/;
const PACKER_FULL_RE =
  /eval\s*\(\s*function\s*\(\s*p\s*,\s*a\s*,\s*c\s*,\s*k\s*,\s*e\s*,\s*[dr]\s*\)\s*\{([\s\S]*?)\}\s*\(([\s\S]*?)\)\s*\)/;

function isAAEncode(code: string): boolean {
  return (
    code.includes("゜-゜") ||
    code.includes("ω゜") ||
    code.includes("o゜)") ||
    code.includes("(ﾟДﾟ)")
  );
}

function isURLEncode(code: string): boolean {
  const matches = code.match(/%[0-9A-Fa-f]{2}/g);
  return matches !== null && matches.length > 10;
}

function base(num: number, radix: number): string {
  const digits =
    "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  if (num === 0) return "0";
  let result = "";
  while (num > 0) {
    result = digits[num % radix]! + result;
    num = Math.floor(num / radix);
  }
  return result || "0";
}

type PackerParams = {
  p: string;
  a: number;
  c: number;
  k: string[];
};

function parsePackerArgs(argsString: string): PackerParams | null {
  try {
    const parseFunc = new Function(`return [${argsString}];`);
    const params = parseFunc() as unknown[];
    if (params.length < 4) return null;
    const k = Array.isArray(params[3])
      ? (params[3] as unknown[]).map(String)
      : String(params[3] ?? "").split("|");
    return {
      p: String(params[0] ?? ""),
      a: Number(params[1] ?? 0),
      c: Number(params[2] ?? 0),
      k,
    };
  } catch {
    return null;
  }
}

function executePackerUnpack(params: PackerParams): string {
  const { p, a, k } = params;
  let { c } = params;
  let result = p;
  while (c--) {
    const replacement = k[c];
    if (replacement) {
      const pattern = new RegExp("\\b" + base(c, a) + "\\b", "g");
      result = result.replace(pattern, replacement);
    }
  }
  return result;
}

export function unpackPackerOnce(code: string): string {
  const match = code.match(PACKER_FULL_RE);
  if (!match || !match[2]) return code;
  const params = parsePackerArgs(match[2]);
  if (!params) return code;
  try {
    const unpacked = executePackerUnpack(params);
    if (!unpacked) return code;
    return code.replace(match[0], unpacked);
  } catch {
    return code;
  }
}

export function unpackAAEncode(code: string): string {
  try {
    const fn = new Function(`return (${code})`);
    const result = fn();
    return typeof result === "string" ? result : code;
  } catch {
    return code;
  }
}

export function unpackURLEncode(code: string): string {
  try {
    return decodeURIComponent(code);
  } catch {
    return code;
  }
}

export type UnpackKind = "packer" | "aaencode" | "urlencoded";

export type UnpackStep = {
  kind: UnpackKind;
  before: number;
  after: number;
};

export type UnpackResult = {
  code: string;
  steps: UnpackStep[];
  iterations: number;
  evalUsed: boolean;
  evalRefused: boolean;
};

export type UnpackOptions = {
  maxIterations?: number;
  noEval?: boolean;
  warn?: (msg: string) => void;
};

export function unpack(code: string, opts: UnpackOptions = {}): UnpackResult {
  const maxIterations = opts.maxIterations ?? 5;
  const noEval = opts.noEval ?? false;
  const warn = opts.warn ?? (() => {});

  let current = code;
  const steps: UnpackStep[] = [];
  let evalUsed = false;
  let evalRefused = false;

  for (let i = 0; i < maxIterations; i++) {
    let changed = false;

    if (PACKER_DETECT_RE.test(current)) {
      if (noEval) {
        warn(
          "unpack: refused Dean Edwards Packer (--no-eval set; pattern parse uses new Function)",
        );
        evalRefused = true;
      } else {
        warn(
          "unpack: evaluating Dean Edwards Packer arg list via new Function (use --no-eval to refuse)",
        );
        evalUsed = true;
        const before = current.length;
        const next = unpackPackerOnce(current);
        if (next !== current) {
          steps.push({ kind: "packer", before, after: next.length });
          current = next;
          changed = true;
        }
      }
    }

    if (!changed && isAAEncode(current)) {
      if (noEval) {
        warn("unpack: refused AAEncode (--no-eval set; AAEncode requires new Function)");
        evalRefused = true;
      } else {
        warn(
          "unpack: evaluating AAEncode payload via new Function (use --no-eval to refuse)",
        );
        evalUsed = true;
        const before = current.length;
        const next = unpackAAEncode(current);
        if (next !== current) {
          steps.push({ kind: "aaencode", before, after: next.length });
          current = next;
          changed = true;
        }
      }
    }

    if (!changed && isURLEncode(current)) {
      const before = current.length;
      const next = unpackURLEncode(current);
      if (next !== current) {
        steps.push({ kind: "urlencoded", before, after: next.length });
        current = next;
        changed = true;
      }
    }

    if (!changed) break;
  }

  return {
    code: current,
    steps,
    iterations: steps.length,
    evalUsed,
    evalRefused,
  };
}

const USAGE =
  "Usage: bun scripts/unpack.ts <input.js|-> [--out output.js] [--max-iterations 5] [--no-eval]";

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
      options: {
        out: { type: "string", short: "o" },
        "max-iterations": { type: "string", default: "5" },
        "no-eval": { type: "boolean", default: false },
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
  const maxIterations = parseInt(values["max-iterations"] ?? "5", 10);
  if (!Number.isFinite(maxIterations) || maxIterations <= 0) {
    console.error("--max-iterations must be a positive integer");
    process.exit(64);
  }

  let source: string;
  try {
    source = await readInput(inputPath);
  } catch (err) {
    console.error(`failed to read input: ${(err as Error).message}`);
    process.exit(1);
  }

  const result = unpack(source, {
    maxIterations,
    noEval: values["no-eval"],
    warn: (msg) => console.error(msg),
  });

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

  if (result.steps.length === 0) {
    if (result.evalRefused) {
      console.error("unpack: no changes (eval refused)");
    } else {
      console.error("unpack: no packer/aaencode/urlencode detected — unchanged");
    }
  } else {
    const summary = result.steps
      .map((s) => `${s.kind}(${s.before}→${s.after})`)
      .join(", ");
    const dest = values.out ? ` → ${values.out}` : "";
    console.error(`unpack: ${result.iterations} step(s) — ${summary}${dest}`);
  }
}

if (import.meta.main) {
  await main();
}

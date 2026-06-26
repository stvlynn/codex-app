import * as fs from "node:fs";
import * as os from "node:os";
import * as path from "node:path";
import { afterEach, describe, expect, test } from "bun:test";
import { promoteFinal } from "./promote-final.ts";
import { DEFAULT_OPTIONS } from "./quality-gate.ts";

const tempRoots: string[] = [];

function tempDir(): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "promote-final-"));
  tempRoots.push(dir);
  return dir;
}

afterEach(() => {
  for (const dir of tempRoots.splice(0)) {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

describe("promote-final", () => {
  test("does not overwrite target when the candidate fails quality gate", () => {
    const root = tempDir();
    const candidate = path.join(root, "candidate");
    const target = path.join(root, "target");
    const reportPath = path.join(root, "quality-report.json");
    fs.mkdirSync(candidate);
    fs.mkdirSync(target);
    fs.writeFileSync(
      path.join(candidate, "toolbar.tsx"),
      `const callbackValue1 = () => "bad"; export const Toolbar = callbackValue1;\n`,
    );
    fs.writeFileSync(
      path.join(target, "Existing.ts"),
      `export const existing = true;\n`,
    );

    const result = promoteFinal({
      candidate,
      target,
      reportPath,
      qualityOptions: { ...DEFAULT_OPTIONS, allowFlat: true },
    });

    expect(result.promoted).toBe(false);
    expect(fs.existsSync(path.join(target, "Existing.ts"))).toBe(true);
    expect(fs.existsSync(path.join(target, "toolbar.tsx"))).toBe(false);
    expect(
      JSON.parse(fs.readFileSync(reportPath, "utf-8"))[0].issues[0].code,
    ).toBe("mechanical-names");
  });

  test("copies candidate only after every file passes quality gate", () => {
    const root = tempDir();
    const candidate = path.join(root, "candidate");
    const target = path.join(root, "target");
    fs.mkdirSync(candidate);
    fs.mkdirSync(target);
    fs.writeFileSync(path.join(target, "Old.ts"), `export const old = true;\n`);
    fs.writeFileSync(
      path.join(candidate, "button.tsx"),
      `export function Button() { return <button>Save</button>; }\n`,
    );

    const result = promoteFinal({
      candidate,
      target,
      qualityOptions: { ...DEFAULT_OPTIONS, allowFlat: true },
    });

    expect(result.promoted).toBe(true);
    expect(fs.existsSync(path.join(target, "Old.ts"))).toBe(false);
    expect(fs.readFileSync(path.join(target, "button.tsx"), "utf-8")).toContain(
      "function Button",
    );
  });
});

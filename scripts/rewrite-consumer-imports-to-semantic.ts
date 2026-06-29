import * as fs from "node:fs";
import * as path from "node:path";
import {
  rewriteSemanticImports,
  type SemanticImportMapping,
} from "../.agents/skills/deobfuscate-javascript/scripts/semantic-finalize.ts";

const ROOT = path.resolve(import.meta.dir, "..");
const TARGET = path.join(ROOT, "restored");
const MANIFEST = JSON.parse(
  fs.readFileSync(
    path.join(TARGET, ".deobfuscate-javascript/_full/manifest.json"),
    "utf-8",
  ),
);
const IM = JSON.parse(fs.readFileSync(path.join(TARGET, "IMPORT_MAP.json"), "utf-8"));

function getClass(b: string): string | undefined {
  return MANIFEST.files[b]?.organization?.classification;
}

function targetExports(restored: string): Set<string> {
  const p = path.join(TARGET, restored);
  if (!fs.existsSync(p)) return new Set();
  let file = p;
  if (fs.statSync(p).isDirectory()) {
    let found = false;
    for (const name of ["index.ts", "index.tsx", "index.js", "index.jsx"]) {
      const cand = path.join(p, name);
      if (fs.existsSync(cand)) {
        file = cand;
        found = true;
        break;
      }
    }
    if (!found) return new Set();
  }
  const src = fs.readFileSync(file, "utf-8");
  const names = new Set<string>();
  const declRe =
    /\bexport\s+(?:declare\s+)?(?:const|function|class|type|interface)\s+([A-Za-z0-9_$]+)/g;
  for (const m of src.matchAll(declRe)) names.add(m[1]);
  for (const m of src.matchAll(/\bexport\s*\{([^}]+)\}/g)) {
    for (const part of m[1].split(",")) {
      const trimmed = part.trim();
      if (!trimmed) continue;
      names.add(trimmed.includes(" as ") ? trimmed.split(" as ")[1].trim() : trimmed);
    }
  }
  if (/\bexport\s+default\b/.test(src)) names.add("default");
  return names;
}

const checkpointsDir = path.join(TARGET, ".deobfuscate-javascript/_full/checkpoints");
const files = fs.readdirSync(checkpointsDir).filter((f) => /\.[cm]?[jt]sx?$/.test(f));

let fixedFiles = 0;
let fixedImports = 0;

for (const file of files) {
  const cp = path.join(checkpointsDir, file);
  let source = fs.readFileSync(cp, "utf-8");
  const importRe = /import\s+\{([^}]+)\}\s+from\s+(['"])([^'"]+)\2/g;
  const mappings: SemanticImportMapping[] = [];
  for (const m of source.matchAll(importRe)) {
    const srcValue = m[3];
    if (!srcValue.startsWith("./")) continue;
    const base = srcValue.slice(2).split("/")[0];
    if (!base.includes("-")) continue;
    const cls = getClass(base);
    if (cls !== "app-feature" && cls !== "ui-component") continue;
    const entry = IM.chunks?.[base];
    if (!entry || entry.status !== "done" || !entry.restored) continue;
    const exports: Record<string, string> = entry.exports ?? {};
    if (Object.keys(exports).length === 0) continue;
    const tExports = targetExports(entry.restored as string);
    const renameMap: Record<string, string> = {};
    for (const spec of m[1].split(",")) {
      const trimmed = spec.trim();
      if (!trimmed) continue;
      const parts = trimmed.split(" as ").map((s) => s.trim());
      const imported = parts[0];
      if (imported === "default") continue;
      if (tExports.has(imported)) continue;
      let semantic: string | null = null;
      if (exports[imported]) semantic = exports[imported];
      else {
        const low = imported.toLowerCase();
        for (const [orig, sem] of Object.entries(exports)) {
          if (low.endsWith(orig.toLowerCase()) && tExports.has(sem)) {
            semantic = sem;
            break;
          }
        }
      }
      if (!semantic) continue;
      renameMap[imported] = semantic;
    }
    if (Object.keys(renameMap).length > 0) {
      mappings.push({ source: srcValue, exports: renameMap });
      fixedImports += Object.keys(renameMap).length;
    }
  }
  if (mappings.length === 0) continue;
  const rewritten = rewriteSemanticImports(source, mappings);
  if (rewritten !== source) {
    fs.writeFileSync(cp, rewritten);
    fixedFiles++;
  }
}

console.log(`Rewrote ${fixedImports} imports in ${fixedFiles} checkpoint files.`);

#!/usr/bin/env node
/**
 * Clean Architecture / DDD layer-dependency check for the deobfuscation skill.
 *
 * Enforces inward value dependencies only:
 *   interfaces → application / infrastructure / domain
 *   application → infrastructure / domain
 *   infrastructure → domain
 *   domain → (nothing inside the skill)
 *
 * Type-only imports are ignored because they are erased at compile time and do
 * not create runtime coupling. Test files may import subjects from any layer.
 *
 * The checker supports a baseline file: existing violations recorded in
 * `check-ddd-baseline.json` are reported as accepted legacy debt, but any new
 * violation causes a non-zero exit. Use `--update-baseline` to refresh the
 * baseline after deliberate refactors.
 */

import { readFileSync, statSync, globSync, writeFileSync } from 'node:fs';
import { resolve, dirname, relative, join } from 'node:path';

const ROOT = resolve(process.cwd(), '.agents/skills/deobfuscate-javascript/src');
const BASELINE_PATH = resolve(process.cwd(), 'scripts/check-ddd-baseline.json');

const LAYER_ORDER = {
  interfaces: 40,
  application: 30,
  infrastructure: 20,
  domain: 10,
};

function classifyLayer(filePath) {
  const rel = relative(ROOT, filePath).replace(/\\/g, '/');
  const layer = rel.split('/')[0];
  if (!LAYER_ORDER[layer]) return null;
  return { layer, rel };
}

function isNodeBuiltin(spec) {
  return /^(node:|bun:|assert|buffer|child_process|cluster|console|constants|crypto|dgram|dns|domain|events|fs|http|https|module|net|os|path|punycode|querystring|readline|repl|stream|string_decoder|sys|timers|tls|tty|url|util|v8|vm|zlib)$/.test(spec);
}

function resolveLocalImport(spec, fromFile) {
  if (!spec.startsWith('.')) return null;
  const baseDir = dirname(fromFile);
  const withoutQuery = spec.split('?')[0];
  let resolved = resolve(baseDir, withoutQuery);
  try {
    const s = statSync(resolved);
    if (s.isDirectory()) {
      for (const ext of ['.ts', '.tsx', '.mjs', '.js']) {
        const candidate = join(resolved, 'index' + ext);
        try {
          if (statSync(candidate).isFile()) return candidate;
        } catch {}
      }
      return null;
    }
    return resolved;
  } catch {
    for (const ext of ['.ts', '.tsx', '.mjs', '.js']) {
      const candidate = resolved + ext;
      try {
        if (statSync(candidate).isFile()) return candidate;
      } catch {}
    }
    for (const ext of ['.ts', '.tsx', '.mjs', '.js']) {
      const candidate = join(resolved, 'index' + ext);
      try {
        if (statSync(candidate).isFile()) return candidate;
      } catch {}
    }
  }
  return null;
}

function extractImports(source) {
  const imports = [];
  const staticRe = /import\s+(?:type\s+)?(?:(?:\{[^}]*\}|[^'"{]*?)\s+from\s+)?['"]([^'"]+)['"];?/g;
  let m;
  while ((m = staticRe.exec(source)) !== null) imports.push(m[1]);
  const dynamicRe = /import\s*\(\s*['"]([^'"]+)['"]\s*\)/g;
  while ((m = dynamicRe.exec(source)) !== null) imports.push(m[1]);
  return imports;
}

function isTypeOnlyImportLine(source, spec) {
  // Quick regex: the line that mentions this specifier starts with `import type`.
  const lines = source.split(/\r?\n/);
  for (const line of lines) {
    if (line.includes(`'${spec}'`) || line.includes(`"${spec}"`)) {
      return /^\s*import\s+type\b/.test(line);
    }
  }
  return false;
}

function isTestFile(filePath) {
  return /\.test\.(ts|tsx|js|jsx|mjs)$/.test(filePath);
}

function violationSignature(fileRel, toLayer, spec) {
  return JSON.stringify({ file: fileRel, targetLayer: toLayer, spec });
}

function run() {
  const updateBaseline = process.argv.includes('--update-baseline');
  const files = globSync('**/*.{ts,tsx,mjs,js,jsx}', { cwd: ROOT, absolute: false, withFileTypes: false })
    .map((f) => resolve(ROOT, f));
  const violations = [];
  let unresolved = 0;

  for (const file of files) {
    const fromMeta = classifyLayer(file);
    if (!fromMeta) continue;
    const source = readFileSync(file, 'utf-8');
    for (const spec of extractImports(source)) {
      if (isNodeBuiltin(spec)) continue;
      if (!spec.startsWith('.')) continue;
      if (isTypeOnlyImportLine(source, spec)) continue;
      const target = resolveLocalImport(spec, file);
      if (!target) {
        unresolved++;
        continue;
      }
      const toMeta = classifyLayer(target);
      if (!toMeta) continue;

      // Test files may pull in subjects/helpers from any layer.
      if (isTestFile(file)) continue;

      if (LAYER_ORDER[toMeta.layer] > LAYER_ORDER[fromMeta.layer]) {
        violations.push({ file: fromMeta.rel, toLayer: toMeta.layer, spec, reason: 'outward dependency' });
      }
    }
  }

  const currentSigs = new Set(violations.map((v) => violationSignature(v.file, v.toLayer, v.spec)));
  let baselineSigs = new Set();
  try {
    const raw = readFileSync(BASELINE_PATH, 'utf-8');
    const list = JSON.parse(raw);
    if (Array.isArray(list)) baselineSigs = new Set(list);
  } catch {
    // no baseline yet
  }

  const newViolations = violations.filter((v) => !baselineSigs.has(violationSignature(v.file, v.toLayer, v.spec)));
  const removedFromBaseline = [...baselineSigs].filter((s) => !currentSigs.has(s));

  console.log(`DDD check: scanned ${files.length} files`);
  console.log(`  unresolved local imports: ${unresolved}`);
  console.log(`  current violations: ${violations.length}`);
  console.log(`  baseline violations: ${baselineSigs.size}`);
  console.log(`  new violations: ${newViolations.length}`);
  if (removedFromBaseline.length) {
    console.log(`  resolved baseline entries: ${removedFromBaseline.length}`);
  }

  if (updateBaseline) {
    writeFileSync(BASELINE_PATH, JSON.stringify([...currentSigs].sort(), null, 2) + '\n');
    console.log(`Updated baseline at ${relative(process.cwd(), BASELINE_PATH)}`);
    process.exit(0);
  }

  if (newViolations.length) {
    console.error('\nNew DDD violations (first 50):');
    newViolations.slice(0, 50).forEach((v) => {
      console.error(`  - ${v.file}: imports ${v.toLayer} from ${v.spec} (${v.reason})`);
    });
    process.exit(1);
  }

  console.log('DDD architecture check passed.');
}

run();

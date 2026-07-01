#!/usr/bin/env node
/**
 * Feature-Sliced Design (v2.1) architectural check for ./src.
 *
 * Rules enforced:
 * 1. Import direction: a file may only import from layers strictly below it,
 *    unless it is an index/public-api barrel re-exporting its own slice.
 * 2. Cross-slice imports on the same layer are forbidden unless they use the
 *    public API (target slice's index.ts) or the @x cross-import API.
 * 3. Internal imports inside a slice are allowed.
 * 4. Segments inside the Shared layer may import each other.
 * 5. Slices inside the App layer may cross-import internally.
 *
 * The checker supports a baseline file: existing violations recorded in
 * `check-fsd-baseline.json` are reported as accepted legacy debt, but any new
 * violation causes a non-zero exit. Use `--update-baseline` to refresh the
 * baseline after deliberate refactors.
 */

import { readFileSync, statSync, globSync, writeFileSync } from 'node:fs';
import { resolve, dirname, relative, join } from 'node:path';

const SRC = resolve(process.cwd(), 'src');
const BASELINE_PATH = resolve(process.cwd(), 'scripts/check-fsd-baseline.json');

const LAYER_ORDER = {
  app: 60,
  pages: 50,
  widgets: 40,
  features: 30,
  entities: 20,
  shared: 10,
};

function classifyLayer(filePath) {
  const rel = relative(SRC, filePath).replace(/\\/g, '/');
  const parts = rel.split('/');
  const layer = parts[0];
  if (!LAYER_ORDER[layer]) return null;
  const slice = parts[1] || '';
  return { layer, slice, rel };
}

function resolveLocalImport(source, fromFile) {
  if (!source.startsWith('.')) return null;
  const baseDir = dirname(fromFile);
  const withoutQuery = source.split('?')[0];
  let resolved = resolve(baseDir, withoutQuery);
  try {
    const s = statSync(resolved);
    if (s.isDirectory()) {
      resolved = join(resolved, 'index.ts');
      if (!statSync(resolved).isFile()) {
        resolved = resolved.replace(/\.ts$/, '.tsx');
        if (!statSync(resolved).isFile()) return null;
      }
    }
    return resolved;
  } catch {
    const exts = ['.ts', '.tsx', '.js', '.jsx'];
    for (const ext of exts) {
      const candidate = resolved + ext;
      try {
        if (statSync(candidate).isFile()) return candidate;
      } catch {}
    }
    for (const ext of exts) {
      const candidate = join(resolved, 'index' + ext);
      try {
        if (statSync(candidate).isFile()) return candidate;
      } catch {}
    }
  }
  return null;
}

function isAssetImport(source) {
  return /\.(css|scss|less|svg|png|jpg|jpeg|gif|webp|woff2?|ttf|eot|otf|json|md)(\?.*)?$/.test(source);
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

function isPublicApiImport(targetPath, targetLayer, targetSlice) {
  if (!targetPath) return false;
  const rel = relative(join(SRC, targetLayer, targetSlice), targetPath).replace(/\\/g, '/');
  if (rel.startsWith('@x/')) return true;
  return /^index\.(ts|tsx|js|jsx)$/.test(rel);
}

function violationSignature(fileRel, toMeta, spec) {
  return JSON.stringify({
    file: fileRel,
    targetLayer: toMeta.layer,
    targetSlice: toMeta.slice,
    spec,
  });
}

function run() {
  const updateBaseline = process.argv.includes('--update-baseline');
  const files = globSync('src/**/*.{ts,tsx}', { absolute: true, withFileTypes: false });
  const violations = [];
  let unresolved = 0;

  for (const file of files) {
    const fromMeta = classifyLayer(file);
    if (!fromMeta) continue;
    const source = readFileSync(file, 'utf-8');
    const imports = extractImports(source);
    for (const spec of imports) {
      if (!spec.startsWith('.')) continue;
      if (isAssetImport(spec)) continue;
      const target = resolveLocalImport(spec, file);
      if (!target) {
        unresolved++;
        continue;
      }
      const toMeta = classifyLayer(target);
      if (!toMeta) continue;

      // Rule 1: import direction
      if (LAYER_ORDER[toMeta.layer] >= LAYER_ORDER[fromMeta.layer]) {
        if (toMeta.layer === fromMeta.layer && toMeta.slice === fromMeta.slice) continue;
        if (fromMeta.layer === 'shared' && toMeta.layer === 'shared') continue;
        if (fromMeta.layer === 'app' && toMeta.layer === 'app') continue;
        violations.push({ file: fromMeta.rel, toMeta, spec, reason: 'upward/sideways layer' });
        continue;
      }

      // Rule 2: cross-slice same-layer must use public API
      if (toMeta.layer === fromMeta.layer && toMeta.slice !== fromMeta.slice) {
        if (fromMeta.layer === 'shared') continue;
        if (fromMeta.layer === 'app') continue;
        if (!isPublicApiImport(target, toMeta.layer, toMeta.slice)) {
          violations.push({ file: fromMeta.rel, toMeta, spec, reason: 'not via public API' });
        }
      }
    }
  }

  const currentSigs = new Set(violations.map((v) => violationSignature(v.file, v.toMeta, v.spec)));
  let baselineSigs = new Set();
  try {
    const raw = readFileSync(BASELINE_PATH, 'utf-8');
    const list = JSON.parse(raw);
    if (Array.isArray(list)) baselineSigs = new Set(list);
  } catch {
    // no baseline yet
  }

  const newViolations = violations.filter((v) => !baselineSigs.has(violationSignature(v.file, v.toMeta, v.spec)));
  const removedFromBaseline = [...baselineSigs].filter((s) => !currentSigs.has(s));

  console.log(`FSD check: scanned ${files.length} files`);
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
    console.error('\nNew FSD violations (first 50):');
    newViolations.slice(0, 50).forEach((v) => {
      console.error(`  - ${v.file}: imports ${v.toMeta.layer}/${v.toMeta.slice} from ${v.spec} (${v.reason})`);
    });
    process.exit(1);
  }

  console.log('FSD architecture check passed.');
}

run();

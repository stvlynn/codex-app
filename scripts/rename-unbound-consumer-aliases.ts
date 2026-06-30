import * as fs from "node:fs";
import * as path from "node:path";
import * as parser from "@babel/parser";
import babelTraverse from "@babel/traverse";
import * as t from "@babel/types";
import babelGenerator from "@babel/generator";

const traverse = (
  (babelTraverse as unknown as { default?: typeof babelTraverse }).default ??
  babelTraverse
) as typeof babelTraverse;
const generate = (
  (babelGenerator as unknown as { default?: typeof babelGenerator }).default ??
  babelGenerator
) as typeof babelGenerator;

const ROOT = path.resolve(import.meta.dir, "..");
const TARGET = path.join(ROOT, "src");
const MANIFEST = JSON.parse(
  fs.readFileSync(
    path.join(TARGET, "src/.deobfuscate-javascript/_full/manifest.json"),
    "utf-8",
  ),
);
const IM = JSON.parse(fs.readFileSync(path.join(TARGET, "IMPORT_MAP.json"), "utf-8"));

function getClass(b: string): string | undefined {
  return MANIFEST.files[b]?.organization?.classification;
}

function parseSource(source: string): t.File {
  return parser.parse(source, {
    sourceType: "module",
    errorRecovery: true,
    allowImportExportEverywhere: true,
    allowReturnOutsideFunction: true,
    allowAwaitOutsideFunction: true,
    allowUndeclaredExports: true,
    plugins: [
      "jsx",
      "typescript",
      "classProperties",
      "classPrivateProperties",
      "classPrivateMethods",
      "dynamicImport",
      "importMeta",
      "objectRestSpread",
      "topLevelAwait",
    ],
  });
}

const checkpointsDir = path.join(TARGET, ".deobfuscate-javascript/_full/checkpoints");
const files = fs.readdirSync(checkpointsDir).filter((f) => /\.[cm]?[jt]sx?$/.test(f));

let fixedFiles = 0;
let fixedIds = 0;

for (const file of files) {
  const cp = path.join(checkpointsDir, file);
  const source = fs.readFileSync(cp, "utf-8");
  let ast: t.File;
  try {
    ast = parseSource(source);
  } catch {
    continue;
  }

  // Collect app-feature producer imports in this file: source -> imported semantic names set + export map
  const producerImports = new Map<
    string,
    {
      imported: Set<string>;
      exports: Record<string, string>;
      sourceValue: string;
    }
  >();
  try {
    traverse(ast, {
      ImportDeclaration(path) {
        const srcValue = path.node.source.value;
        if (!srcValue.startsWith("./")) return;
        const base = srcValue.slice(2).split("/")[0];
        if (!base.includes("-")) return;
        const cls = getClass(base);
        if (cls !== "app-feature" && cls !== "ui-component") return;
        const entry = IM.chunks?.[base];
        if (!entry || entry.status !== "done" || !entry.exports) return;
        const imported = new Set<string>();
        for (const spec of path.node.specifiers) {
          if (t.isImportSpecifier(spec) && t.isIdentifier(spec.imported)) {
            imported.add(spec.imported.name);
          }
        }
        if (imported.size > 0) {
          producerImports.set(base, {
            imported,
            exports: entry.exports as Record<string, string>,
            sourceValue: srcValue,
          });
        }
      },
    });
  } catch {
    continue;
  }
  if (producerImports.size === 0) continue;

  // Collect unbound identifier references (excluding type-only and property keys)
  const unbound = new Map<string, t.Identifier[]>();
  try {
    traverse(ast, {
      Identifier(path) {
        if (!path.isReferencedIdentifier()) return;
        const name = path.node.name;
        if (!/^[A-Za-z_$][A-Za-z0-9_$]*$/.test(name)) return;
        if (path.scope.hasBinding(name)) return;
        // ignore property keys of member expressions (object.property: property not referenced)
        if (
          t.isMemberExpression(path.parent) &&
          path.parent.property === path.node &&
          !path.parent.computed
        )
          return;
        const list = unbound.get(name) ?? [];
        list.push(path.node);
        unbound.set(name, list);
      },
    });
  } catch {
    continue;
  }
  if (unbound.size === 0) continue;

  // Determine renames: unbound name -> semantic imported name
  const renames = new Map<string, string>();
  for (const [name, nodes] of unbound) {
    for (const [, info] of producerImports) {
      const low = name.toLowerCase();
      for (const [orig, sem] of Object.entries(info.exports)) {
        if (
          low.endsWith(orig.toLowerCase()) &&
          info.imported.has(sem) &&
          sem !== name
        ) {
          renames.set(name, sem);
          break;
        }
      }
      if (renames.has(name)) break;
    }
  }
  if (renames.size === 0) continue;

  // Apply renames via scope.rename when possible, else manual
  try {
    traverse(ast, {
      Identifier(path) {
        const to = renames.get(path.node.name);
        if (!to) return;
        if (!path.scope.hasBinding(path.node.name)) {
          path.scope.rename(path.node.name, to);
        } else {
          path.node.name = to;
        }
      },
    });
  } catch {
    continue;
  }

  let out: string;
  try {
    out = generate(ast, { jsescOption: { minimal: true } }).code;
  } catch {
    continue;
  }
  if (out !== source) {
    fs.writeFileSync(cp, out);
    fixedFiles++;
    fixedIds += renames.size;
  }
}

console.log(`Renamed ${fixedIds} unbound identifiers in ${fixedFiles} checkpoint files.`);

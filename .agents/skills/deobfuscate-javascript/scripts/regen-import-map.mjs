const fs = require("fs");
const path = require("path");
const parser = require("@babel/parser");
const babelTraverse = require("@babel/traverse").default;
const t = require("@babel/types");

const targetArg = process.argv[2] || "restored";
const manifestPath = path.join(targetArg, ".deobfuscate-javascript/_full/manifest.json");
const importMapPath = path.join(targetArg, "IMPORT_MAP.json");

const m = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
let importMap = {};
try {
  importMap = JSON.parse(fs.readFileSync(importMapPath, "utf8"));
} catch {}
if (!importMap.chunks) importMap.chunks = {};

function exportedName(node) {
  return t.isIdentifier(node) ? node.name : node.value;
}

function inferExportMap(code, chunk) {
  const publicExports = [];
  try {
    const ast = parser.parse(code, {
      sourceType: "module",
      errorRecovery: true,
      allowImportExportEverywhere: true,
      allowReturnOutsideFunction: true,
      allowAwaitOutsideFunction: true,
      allowUndeclaredExports: true,
      plugins: ["jsx", "typescript", "classProperties", "classPrivateProperties", "classPrivateMethods", "dynamicImport", "importMeta", "objectRestSpread", "topLevelAwait"],
    });
    babelTraverse(ast, {
      ExportNamedDeclaration(exportPath) {
        if (exportPath.node.source) return;
        const declaration = exportPath.node.declaration;
        if (t.isVariableDeclaration(declaration)) {
          for (const declarator of declaration.declarations) {
            if (t.isIdentifier(declarator.id)) publicExports.push(declarator.id.name);
          }
        } else if ((t.isFunctionDeclaration(declaration) || t.isClassDeclaration(declaration)) && declaration.id) {
          publicExports.push(declaration.id.name);
        }
        for (const spec of exportPath.node.specifiers) {
          if (t.isExportSpecifier(spec)) publicExports.push(exportedName(spec.exported));
        }
      },
      ExportDefaultDeclaration() {
        publicExports.push("default");
      },
    });
  } catch {
    return {};
  }
  const uniqueExports = [...new Set(publicExports)];
  const sourceExports = chunk.exports ?? [];
  const out = {};
  if (sourceExports.length === 1 && uniqueExports.length === 1) {
    out[sourceExports[0].exported] = uniqueExports[0];
    return out;
  }
  if (sourceExports.length === uniqueExports.length) {
    for (let i = 0; i < sourceExports.length; i++) {
      out[sourceExports[i].exported] = uniqueExports[i];
    }
    return out;
  }
  for (const sourceExport of sourceExports) {
    if (uniqueExports.includes(sourceExport.exported)) {
      out[sourceExport.exported] = sourceExport.exported;
    } else if (uniqueExports.includes(sourceExport.local)) {
      out[sourceExport.exported] = sourceExport.local;
    }
  }
  return out;
}

function readEntryCode(absPath) {
  if (fs.existsSync(absPath) && fs.statSync(absPath).isFile()) {
    return fs.readFileSync(absPath, "utf8");
  }
  for (const ext of ["ts", "tsx", "js", "jsx"]) {
    const p = absPath + "/index." + ext;
    if (fs.existsSync(p) && fs.statSync(p).isFile()) return fs.readFileSync(p, "utf8");
  }
  return null;
}

let added = 0, updated = 0, missing = 0;
for (const [basename, f] of Object.entries(m.files)) {
  if (f.kind !== "local") continue;
  if (!f.stages.promoted) continue;
  if (!f.organization?.semanticPath) continue;
  const restoredPath = f.organization.semanticPath;
  const absPath = path.join(targetArg, restoredPath);
  const code = readEntryCode(absPath);
  if (!code) {
    missing++;
    continue;
  }
  const exportMap = inferExportMap(code, f);
  const existing = importMap.chunks[basename];
  if (!existing) {
    importMap.chunks[basename] = { restored: restoredPath, status: "done", exports: exportMap };
    added++;
  } else if (!existing.exports || Object.keys(existing.exports).length === 0) {
    existing.restored = restoredPath;
    existing.status = "done";
    existing.exports = exportMap;
    updated++;
  }
}

fs.writeFileSync(importMapPath, JSON.stringify(importMap, null, 2) + "\n");
console.log("added", added, "updated", updated, "missing files", missing);

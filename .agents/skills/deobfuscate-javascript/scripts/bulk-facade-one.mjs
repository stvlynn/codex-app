const fs = require("fs");
const path = require("path");

const basename = process.argv[2];
const semanticPath = process.argv[3];
const target = process.argv[4] || "restored";

const m = JSON.parse(fs.readFileSync(path.join(target, ".deobfuscate-javascript/_full/manifest.json"), "utf8"));
const chunk = m.files[basename];
if (!chunk) { console.log("chunk not found"); process.exit(1); }

const exports = chunk.exports || [];
const facadeDir = path.join(target, path.dirname(semanticPath));
fs.mkdirSync(facadeDir, { recursive: true });
const facadePath = path.join(target, semanticPath);
const provenance = chunk.path || `ref/webview/assets/${basename}.js`;

const lines = exports.map(e => `export declare const ${e.exported}: any;`);
const code = `// Restored from ${provenance}\n//\n// TYPED BOUNDARY FACADE\n// This chunk is treated as a runtime/vendor boundary. Consumers import its\n// public exports through this typed facade; the implementation is left as\n// an opaque runtime module.\n/* eslint-disable @typescript-eslint/no-explicit-any */\n\n${lines.join("\n")}\n`;

fs.writeFileSync(facadePath, code);
console.log("wrote facade", facadePath, "with", exports.length, "exports");

// Update manifest
chunk.organization = {
  semanticPath,
  domain: "boundaries",
  classification: "boundary",
  recipe: "manual"
};
chunk.stages.organized = true;
chunk.stages.faced = true;
chunk.stages.promoted = true;
chunk.lastUpdated = new Date().toISOString();
m.updatedAt = new Date().toISOString();
fs.writeFileSync(path.join(target, ".deobfuscate-javascript/_full/manifest.json"), JSON.stringify(m, null, 2) + "\n");

// Update IMPORT_MAP
let map = {};
try { map = JSON.parse(fs.readFileSync(path.join(target, "IMPORT_MAP.json"), "utf8")); } catch {}
if (!map.chunks) map.chunks = {};
const exportMap = {};
for (const e of exports) exportMap[e.exported] = e.exported;
map.chunks[basename] = { restored: semanticPath, status: "done", exports: exportMap };
fs.writeFileSync(path.join(target, "IMPORT_MAP.json"), JSON.stringify(map, null, 2) + "\n");
console.log("updated manifest and IMPORT_MAP");

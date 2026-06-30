const fs = require("fs");
const m = JSON.parse(fs.readFileSync("src/.deobfuscate-javascript/_full/manifest.json", "utf8"));
const target = process.argv[2];
const consumers = [];
for (const [basename, f] of Object.entries(m.files)) {
  if (f.kind !== "local") continue;
  for (const imp of f.imports || []) {
    if (imp.target === target) {
      consumers.push({basename, names: imp.names?.map(n=>n.imported || n).join(",") || ""});
    }
  }
}
console.log("consumers of", target, ":", consumers.length);
for (const c of consumers) console.log(c.basename, c.names);

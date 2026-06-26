const fs = require("fs");
const path = require("path");
const parser = require("@babel/parser");

function checkFile(p) {
  const code = fs.readFileSync(p, "utf8");
  try {
    parser.parse(code, {
      sourceType: "module",
      errorRecovery: false,
      plugins: ["jsx", "typescript", "classProperties", "classPrivateProperties", "classPrivateMethods", "dynamicImport", "importMeta", "objectRestSpread", "topLevelAwait"],
    });
  } catch (err) {
    console.log(p, err.message.split("\n")[0]);
  }
}

function walk(dir) {
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name);
    if (fs.statSync(p).isDirectory()) walk(p);
    else if (/\.(tsx?|jsx?)$/i.test(p)) checkFile(p);
  }
}
walk("restored/.deobfuscate-javascript/_full/files/browser-sidebar-manager-DZM0wpKX/candidate");

#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const docsDir = path.join(__dirname, "..", "docs");

let errors = 0;

for (const entry of fs.readdirSync(docsDir, { withFileTypes: true })) {
  if (!entry.isDirectory()) continue;
  const readme = path.join(docsDir, entry.name, "README.md");
  if (!fs.existsSync(readme)) {
    console.error(`ERROR: docs/${entry.name}/ is missing README.md`);
    errors++;
  }
}

if (errors > 0) {
  process.exit(1);
}

console.log("docs/ structure OK");

#!/usr/bin/env node

import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, readdirSync, rmSync, statSync } from "node:fs";
import { homedir } from "node:os";
import path from "node:path";

const DEFAULT_ASAR_PATH = "/Applications/Codex.app/Contents/Resources/app.asar";

function usage() {
  console.log(`Usage: node refresh-codex-ref.mjs [--dry-run] [--skip-format]

Refresh ./ref from the installed Codex.app asar.

Environment:
  CODEX_APP_ASAR  Override the source asar path.
`);
}

function fail(message) {
  console.error(`Error: ${message}`);
  process.exit(1);
}

function run(command, args) {
  const result = spawnSync(command, args, { stdio: "inherit" });
  if (result.error) {
    fail(`${command} failed to start: ${result.error.message}`);
  }
  if (result.status !== 0) {
    fail(`${command} exited with status ${result.status}`);
  }
}

function assertSafeRefDir(refDir, cwd) {
  const root = path.parse(refDir).root;
  const home = path.resolve(homedir());

  if (refDir === root || refDir === home || refDir === cwd) {
    fail(`ref directory is unsafe to replace: ${refDir}`);
  }

  if (path.basename(refDir) !== "ref") {
    fail(`ref directory must be named "ref": ${refDir}`);
  }

  const relative = path.relative(cwd, refDir);
  if (relative !== "ref") {
    fail(`ref directory must resolve to ./ref under the current working directory: ${refDir}`);
  }
}

function walkFormatTargets(dir, targets = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === "node_modules") {
      continue;
    }

    const entryPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walkFormatTargets(entryPath, targets);
      continue;
    }

    if (entry.isFile() && (entry.name.endsWith(".js") || entry.name.endsWith(".css"))) {
      targets.push(entryPath);
    }
  }
  return targets;
}

function formatWithPrettier(files) {
  const batch = [];
  let batchLength = 0;
  const maxBatchLength = 50_000;

  function flush() {
    if (batch.length === 0) {
      return;
    }
    run("npx", ["-y", "prettier", "--write", ...batch]);
    batch.length = 0;
    batchLength = 0;
  }

  for (const file of files) {
    batch.push(file);
    batchLength += file.length + 1;
    if (batchLength >= maxBatchLength) {
      flush();
    }
  }

  flush();
}

const args = process.argv.slice(2);
const dryRun = args.includes("--dry-run");
const skipFormat = args.includes("--skip-format");

if (args.includes("--help") || args.includes("-h")) {
  usage();
  process.exit(0);
}

const unknownArgs = args.filter((arg) => !["--dry-run", "--skip-format"].includes(arg));
if (unknownArgs.length > 0) {
  fail(`unknown argument(s): ${unknownArgs.join(", ")}`);
}

const cwd = path.resolve(process.cwd());
const refDir = path.join(cwd, "ref");
const asarPath = path.resolve(process.env.CODEX_APP_ASAR || DEFAULT_ASAR_PATH);

assertSafeRefDir(refDir, cwd);

console.log(`Workspace: ${cwd}`);
console.log(`Source asar: ${asarPath}`);
console.log(`Target ref: ${refDir}`);

if (dryRun) {
  console.log("Dry run only; no files changed.");
  process.exit(0);
}

if (!existsSync(asarPath) || !statSync(asarPath).isFile()) {
  fail(`asar file not found: ${asarPath}`);
}

console.log("Removing existing ./ref...");
rmSync(refDir, { recursive: true, force: true });
mkdirSync(refDir, { recursive: true });

console.log("Extracting Codex app asar...");
run("npx", ["-y", "@electron/asar", "extract", asarPath, refDir]);

if (skipFormat) {
  console.log("Skipping Prettier formatting.");
  process.exit(0);
}

const files = walkFormatTargets(refDir);
console.log(`Formatting ${files.length} JS/CSS file(s) with Prettier...`);

if (files.length > 0) {
  formatWithPrettier(files);
}

console.log("Codex app ref refresh complete.");

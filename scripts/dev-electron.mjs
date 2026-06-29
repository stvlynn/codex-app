#!/usr/bin/env node

import {
  existsSync,
  lstatSync,
  mkdirSync,
  readFileSync,
  readlinkSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from "node:fs";
import { dirname, join, resolve } from "node:path";
import { spawn, spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const refDir = join(root, "ref");
const packageJsonPath = join(refDir, "package.json");
const tempDir = join(root, ".tmp-electron");
const devAppPath = join(tempDir, "CodexDev.app");
const runtimeMarkerPath = join(tempDir, "runtime.json");
const sourceAppPath = resolve(process.env.CODEX_APP_PATH?.trim() || "/Applications/Codex.app");
const args = new Set(process.argv.slice(2));
const mode = args.has("--doctor") ? "doctor" : args.has("--smoke") ? "smoke" : "dev";

function fail(message) {
  console.error(`electron dev: ${message}`);
  process.exit(1);
}

function readJson(path) {
  try {
    return JSON.parse(readFileSync(path, "utf8"));
  } catch (error) {
    fail(`failed to read ${path}: ${error instanceof Error ? error.message : String(error)}`);
  }
}

function requirePath(path, label) {
  if (!existsSync(path)) {
    fail(`missing ${label}: ${path}`);
  }
}

function run(command, commandArgs, label) {
  const result = spawnSync(command, commandArgs, {
    cwd: root,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  });
  if (result.error) {
    fail(`${label} failed: ${result.error.message}`);
  }
  if (result.status !== 0) {
    const detail =
      result.stderr?.trim() ||
      result.stdout?.trim() ||
      `exit code ${result.status}`;
    fail(`${label} failed: ${detail}`);
  }
  return result.stdout.trim();
}

function validateRefProject() {
  requirePath(packageJsonPath, "Electron package manifest");
  const manifest = readJson(packageJsonPath);
  if (typeof manifest.main !== "string" || manifest.main.length === 0) {
    fail("ref/package.json must define a non-empty main entry");
  }

  requirePath(join(refDir, manifest.main), "Electron main entry");
  const webviewEntry = join(refDir, "webview", "index.html");
  requirePath(webviewEntry, "webview entry");

  const indexHtml = readFileSync(webviewEntry, "utf8");
  const assetMatches = [...indexHtml.matchAll(/\b(?:src|href)="([^"]+)"/g)]
    .map((match) => match[1])
    .filter((value) => value.startsWith("/assets/") || value.startsWith("./assets/") || value.startsWith("assets/"));

  for (const assetPath of assetMatches) {
    requirePath(join(refDir, "webview", assetPath.replace(/^\.?\//, "")), `webview asset ${assetPath}`);
  }

  for (const dependency of ["better-sqlite3", "node-pty", "objc-js"]) {
    requirePath(join(refDir, "node_modules", dependency), `runtime dependency ${dependency}`);
  }

  return { manifest, assetCount: assetMatches.length };
}

function readPlistValue(key) {
  return run(
    "plutil",
    ["-extract", key, "raw", "-o", "-", join(sourceAppPath, "Contents", "Info.plist")],
    `read ${key} from Codex.app`,
  );
}

function validateSourceRuntime() {
  if (process.platform !== "darwin") {
    fail("the extracted Codex Electron runtime can currently be launched only on macOS");
  }

  requirePath(sourceAppPath, "installed Codex.app");
  requirePath(join(sourceAppPath, "Contents", "Resources", "app.asar"), "installed Codex app.asar");

  const executableName = readPlistValue("CFBundleExecutable");
  const buildVersion = readPlistValue("CFBundleVersion");
  const appVersion = readPlistValue("CFBundleShortVersionString");
  requirePath(join(sourceAppPath, "Contents", "MacOS", executableName), "installed Codex executable");
  return { executableName, buildVersion, appVersion };
}

function readRuntimeMarker() {
  if (!existsSync(runtimeMarkerPath)) {
    return null;
  }
  try {
    return JSON.parse(readFileSync(runtimeMarkerPath, "utf8"));
  } catch {
    return null;
  }
}

function ensureRefLink(resourcesPath) {
  const appLinkPath = join(resourcesPath, "app");
  if (existsSync(appLinkPath) || lstatExists(appLinkPath)) {
    if (
      lstatSync(appLinkPath).isSymbolicLink() &&
      resolve(dirname(appLinkPath), readlinkSync(appLinkPath)) === refDir
    ) {
      return false;
    }
    rmSync(appLinkPath, { force: true, recursive: true });
  }
  symlinkSync(refDir, appLinkPath, "dir");
  return true;
}

function lstatExists(path) {
  try {
    lstatSync(path);
    return true;
  } catch {
    return false;
  }
}

function prepareDevRuntime(runtime, refManifest) {
  mkdirSync(tempDir, { recursive: true });
  const marker = readRuntimeMarker();
  const needsClone =
    !existsSync(devAppPath) ||
    marker?.sourceAppPath !== sourceAppPath ||
    marker?.buildVersion !== runtime.buildVersion ||
    marker?.refVersion !== refManifest.version;

  if (needsClone) {
    if (!devAppPath.startsWith(`${tempDir}/`)) {
      fail(`refusing to replace runtime outside ${tempDir}`);
    }
    rmSync(devAppPath, { force: true, recursive: true });
    console.log(`electron dev: cloning runtime from ${sourceAppPath}`);
    run("cp", ["-cR", sourceAppPath, devAppPath], "clone Codex.app runtime");
  }

  const resourcesPath = join(devAppPath, "Contents", "Resources");
  const appAsarPath = join(resourcesPath, "app.asar");
  let runtimeChanged = needsClone;
  if (existsSync(appAsarPath)) {
    rmSync(appAsarPath);
    runtimeChanged = true;
  }
  runtimeChanged = ensureRefLink(resourcesPath) || runtimeChanged;

  if (runtimeChanged) {
    console.log("electron dev: signing local development runtime");
    run("codesign", ["--force", "--deep", "--sign", "-", devAppPath], "sign local Codex runtime");
    writeFileSync(
      runtimeMarkerPath,
      `${JSON.stringify({ sourceAppPath, buildVersion: runtime.buildVersion, refVersion: refManifest.version }, null, 2)}\n`,
    );
  }

  const executablePath = join(devAppPath, "Contents", "MacOS", runtime.executableName);
  requirePath(executablePath, "local Codex development executable");
  return { executablePath, resourcesPath };
}

function buildLaunchConfig(localRuntime) {
  const userDataPath =
    process.env.CODEX_ELECTRON_USER_DATA_PATH?.trim() ||
    join(tempDir, mode === "smoke" ? `smoke-${process.pid}` : "dev-user-data");
  mkdirSync(userDataPath, { recursive: true });

  return {
    args: [refDir, `--user-data-dir=${userDataPath}`],
    env: {
      ...process.env,
      NODE_ENV: "development",
      CODEX_ELECTRON_USER_DATA_PATH: userDataPath,
      CODEX_ELECTRON_RESOURCES_PATH: localRuntime.resourcesPath,
      CODEX_ELECTRON_BUNDLED_PLUGINS_RESOURCES_PATH: localRuntime.resourcesPath,
      CODEX_ELECTRON_SKIP_COMPUTER_USE_CANONICAL_REFRESH: "1",
    },
  };
}

function launchDev(localRuntime) {
  const launch = buildLaunchConfig(localRuntime);
  const child = spawn(localRuntime.executablePath, launch.args, {
    cwd: root,
    env: launch.env,
    stdio: "inherit",
  });

  for (const signal of ["SIGINT", "SIGTERM"]) {
    process.on(signal, () => child.kill(signal));
  }
  child.on("exit", (code, signal) => {
    if (signal != null) {
      process.kill(process.pid, signal);
      return;
    }
    process.exit(code ?? 0);
  });
}

function launchSmoke(localRuntime) {
  const launch = buildLaunchConfig(localRuntime);
  const child = spawn(localRuntime.executablePath, launch.args, {
    cwd: root,
    env: launch.env,
    stdio: ["ignore", "pipe", "pipe"],
  });
  const smokeMs = Number.parseInt(process.env.ELECTRON_SMOKE_MS ?? "12000", 10);
  let startupComplete = false;
  let bootstrapFailed = false;
  let recentOutput = "";

  const inspectOutput = (chunk, output) => {
    output.write(chunk);
    recentOutput = `${recentOutput}${chunk}`.slice(-4096);
    startupComplete ||= recentOutput.includes("startup complete");
    bootstrapFailed ||= recentOutput.includes("Desktop bootstrap failed");
  };
  child.stdout.on("data", (chunk) => inspectOutput(chunk, process.stdout));
  child.stderr.on("data", (chunk) => inspectOutput(chunk, process.stderr));

  const timeout = setTimeout(() => child.kill("SIGTERM"), smokeMs);
  child.on("exit", (code, signal) => {
    clearTimeout(timeout);
    if (signal === "SIGTERM" && startupComplete && !bootstrapFailed) {
      console.log(`electron dev: smoke launch reached startup complete within ${smokeMs}ms`);
      process.exit(0);
    }
    if (!startupComplete || bootstrapFailed) {
      console.error(
        bootstrapFailed
          ? "electron dev: smoke launch reported a desktop bootstrap failure"
          : "electron dev: smoke launch did not reach startup complete",
      );
      process.exit(1);
    }
    process.exit(code ?? 1);
  });
}

const refProject = validateRefProject();
const sourceRuntime = validateSourceRuntime();
if (refProject.manifest.version !== sourceRuntime.appVersion) {
  fail(
    `ref version ${refProject.manifest.version} does not match installed Codex version ${sourceRuntime.appVersion}; refresh ./ref first`,
  );
}
console.log(`electron dev: ref main ${refProject.manifest.main}`);
console.log(`electron dev: verified ${refProject.assetCount} webview asset references`);
console.log(`electron dev: installed Codex ${sourceRuntime.appVersion} (build ${sourceRuntime.buildVersion})`);

if (mode === "doctor") {
  process.exit(0);
}

const localRuntime = prepareDevRuntime(sourceRuntime, refProject.manifest);
if (mode === "smoke") {
  launchSmoke(localRuntime);
} else {
  launchDev(localRuntime);
}

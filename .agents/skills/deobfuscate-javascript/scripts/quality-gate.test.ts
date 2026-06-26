import { afterEach, describe, expect, test } from "bun:test";
import * as fs from "node:fs";
import * as os from "node:os";
import * as path from "node:path";
import { spawnSync } from "node:child_process";
import {
  analyzeFullRestorationCoverage,
  analyzeSource,
  checkFormatting,
  collectBoundaryCheckpointImportFiles,
  DEFAULT_OPTIONS,
} from "./quality-gate.ts";

const tmpRoots: string[] = [];

function makeTmpRoot(): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "quality-gate-"));
  tmpRoots.push(dir);
  return dir;
}

afterEach(() => {
  while (tmpRoots.length > 0) {
    fs.rmSync(tmpRoots.pop()!, { recursive: true, force: true });
  }
});

describe("quality-gate", () => {
  test("passes a small readable TSX module", () => {
    const source = `
      import React from "react";
      export interface ButtonProps { label: string }
      export function Button({ label }: ButtonProps) {
        return <button>{label}</button>;
      }
    `;
    const report = analyzeSource(source, "button.tsx");
    expect(report.issues).toEqual([]);
  });

  test("fails missing provenance headers when required", () => {
    const source = `
      export function Toolbar() {
        return null;
      }
    `;
    const report = analyzeSource(source, "toolbar.tsx", {
      ...DEFAULT_OPTIONS,
      allowFlat: true,
      requireProvenanceHeader: true,
    });
    expect(report.hasProvenanceHeader).toBe(false);
    expect(report.issues.map((issue) => issue.code)).toContain(
      "missing-provenance-header",
    );
  });

  test("passes provenance headers when required", () => {
    const source = `
      // Restored from ref/webview/assets/toolbar-ABC123.js
      export function Toolbar() {
        return null;
      }
    `.trimStart();
    const report = analyzeSource(source, "toolbar.tsx", {
      ...DEFAULT_OPTIONS,
      allowFlat: true,
      requireProvenanceHeader: true,
    });
    expect(report.hasProvenanceHeader).toBe(true);
    expect(report.issues).toEqual([]);
  });

  test("fails repeated provenance headers", () => {
    const source = `// Restored from ref/webview/assets/toolbar-ABC123.js
// Restored from ref/webview/assets/toolbar-ABC123.js
export function Toolbar() {
  return null;
}
`;
    const report = analyzeSource(source, "toolbar.tsx", {
      ...DEFAULT_OPTIONS,
      allowFlat: true,
      requireProvenanceHeader: true,
    });
    expect(report.duplicateProvenanceHeaders).toBe(1);
    expect(report.issues.map((issue) => issue.code)).toContain(
      "duplicate-provenance-headers",
    );
  });

  test("CLI requires provenance unless explicitly allowed", () => {
    const root = makeTmpRoot();
    const targetFile = path.join(root, "toolbar.ts");
    fs.writeFileSync(targetFile, "export const toolbar = true;\n");

    const strict = spawnSync(
      "bun",
      [path.join(import.meta.dir, "quality-gate.ts"), targetFile, "--json"],
      { encoding: "utf8" },
    );
    expect(strict.status).toBe(1);
    expect(JSON.parse(strict.stdout)[0].issues[0].code).toBe(
      "missing-provenance-header",
    );

    const allowed = spawnSync(
      "bun",
      [
        path.join(import.meta.dir, "quality-gate.ts"),
        targetFile,
        "--json",
        "--allow-missing-provenance",
      ],
      { encoding: "utf8" },
    );
    expect(allowed.status).toBe(0);
  });

  test("fails when cryptic params exceed the threshold", () => {
    const source = `
      export function A(e) { return e + 1; }
      export function B(t) { return t + 1; }
    `;
    const report = analyzeSource(source, "many-params.ts", {
      ...DEFAULT_OPTIONS,
      allowFlat: true,
      maxCrypticParams: 1,
      maxCrypticBindings: 100,
    });
    expect(report.issues.map((issue) => issue.code)).toContain(
      "cryptic-params",
    );
  });

  test("fails generated fallback names even when they are not short", () => {
    const source = `
      import { Button as ImportedBinding1 } from "./button";
      const local274 = "legacy";
      const callbackValue1 = () => "label";
      const localValue1 = callbackValue1();
      const restoredHelper1 = (argument8) => <ImportedBinding1 title={local274}>{localValue1}{argument8}</ImportedBinding1>;
      export function Toolbar() {
        return restoredHelper1("ok");
      }
    `;
    const report = analyzeSource(source, "toolbar.tsx", {
      ...DEFAULT_OPTIONS,
      allowFlat: true,
    });
    expect(report.mechanicalNames).toEqual([
      "ImportedBinding1",
      "argument8",
      "callbackValue1",
      "local274",
      "localValue1",
      "restoredHelper1",
    ]);
    expect(report.issues.map((issue) => issue.code)).toContain(
      "mechanical-names",
    );
  });

  test("fails mechanical domain-prefixed data/arg/value placeholders", () => {
    const source = `
      import React from "react";
      const DialogValue7 = React.createContext(null);
      const dialogData123 = "dialog-title";
      export function DialogShell(dialogArg44: { children: React.ReactNode }) {
        return <DialogValue7.Provider value={dialogData123}>{dialogArg44.children}</DialogValue7.Provider>;
      }
    `;
    const report = analyzeSource(source, "DialogLayoutImpl.tsx", {
      ...DEFAULT_OPTIONS,
      allowFlat: true,
    });
    expect(report.mechanicalNames).toEqual([
      "DialogValue7",
      "dialogArg44",
      "dialogData123",
    ]);
    expect(report.issues.map((issue) => issue.code)).toContain(
      "mechanical-names",
    );
  });

  test("allows generated fallback names only for explicit intermediate checks", () => {
    const source = `
      const callbackValue1 = () => "draft";
      export const Toolbar = callbackValue1;
    `;
    const report = analyzeSource(source, "toolbar.tsx", {
      ...DEFAULT_OPTIONS,
      allowFlat: true,
      allowMechanicalNames: true,
    });
    expect(report.mechanicalNames).toEqual(["callbackValue1"]);
    expect(report.issues.map((issue) => issue.code)).not.toContain(
      "mechanical-names",
    );
  });

  test("flags _Array/__Array (a global underscore-prefixed by collision)", () => {
    const source = `// Restored from ref/webview/assets/array-Hq6MvHot.js
export function _Array(__Array) {
  return typeof __Array == "object" ? __Array : Array.from(__Array);
}
`;
    const report = analyzeSource(source, "utils/array.ts");
    expect(report.mechanicalNames).toContain("_Array");
    expect(report.mechanicalNames).toContain("__Array");
    expect(report.issues.map((issue) => issue.code)).toContain(
      "mechanical-names",
    );
  });

  test("does NOT flag real tslib helpers or _React shim bindings", () => {
    const source = `// Restored from ref/webview/assets/helpers-Aa11Bb22.js
export function __assign(target, source) {
  return Object.assign(target, source);
}
export function __rest(value) {
  return value;
}
`;
    const report = analyzeSource(source, "utils/helpers.ts");
    expect(report.mechanicalNames).not.toContain("__assign");
    expect(report.mechanicalNames).not.toContain("__rest");
  });

  test("fails cryptic public export names even when counts are low", () => {
    const source = `
      function commandShortcutLabels(commandId) {
        return [commandId];
      }
      export { commandShortcutLabels as i };
    `;
    const report = analyzeSource(source, "command-keybindings.ts", {
      ...DEFAULT_OPTIONS,
      allowFlat: true,
    });
    expect(report.publicCrypticNames).toEqual(["i"]);
    expect(report.issues.map((issue) => issue.code)).toContain(
      "public-cryptic-names",
    );
  });

  test("passes semantic command-keybinding export names", () => {
    const source = `
      export const commandShortcutLabels = {};
      export function hasCommandShortcut(commandId: string): boolean {
        return commandId.length > 0;
      }
    `;
    const report = analyzeSource(source, "command-keybindings.ts", {
      ...DEFAULT_OPTIONS,
      allowFlat: true,
    });
    expect(report.publicCrypticNames).toEqual([]);
    expect(report.issues).toEqual([]);
  });

  test("fails hook-shaped exports that alias React context values", () => {
    const source = `
      import React from "react";
      const BottomPanelScrollSyncContext = React.createContext(null);
      export const useAppShellBottomPanelScrollSync = BottomPanelScrollSyncContext;
    `;
    const report = analyzeSource(source, "BottomPanelScrollSyncContext.tsx", {
      ...DEFAULT_OPTIONS,
      allowFlat: true,
    });
    expect(report.misleadingHookExports).toEqual([
      "useAppShellBottomPanelScrollSync",
    ]);
    expect(report.issues.map((issue) => issue.code)).toContain(
      "misleading-hook-exports",
    );
  });

  test("fails exported functions with untyped parameters", () => {
    const source = `
      export function formatCommand(commandId) {
        return commandId;
      }
      export const normalizeCommand = (commandId: string): string => commandId;
    `;
    const report = analyzeSource(source, "command-keybindings.ts", {
      ...DEFAULT_OPTIONS,
      allowFlat: true,
    });
    expect(report.untypedPublicFunctionParams).toEqual([
      "formatCommand:commandId",
    ]);
    expect(report.issues.map((issue) => issue.code)).toContain(
      "untyped-public-function-params",
    );
  });

  test("fails suspicious lowercase JSX component tags", () => {
    const source = `
      export function Broken() {
        return <j title="tooltip">content</j>;
      }
    `;
    const report = analyzeSource(source, "Broken.tsx", {
      ...DEFAULT_OPTIONS,
      allowFlat: true,
    });
    expect(report.invalidJsxTags).toEqual(["j"]);
    expect(report.issues.map((issue) => issue.code)).toContain(
      "invalid-jsx-tags",
    );
  });

  test("fails unbound JSX component identifiers", () => {
    const source = `
      export function Broken() {
        return <SettingH id="title" defaultMessage="Title" />;
      }
    `;
    const report = analyzeSource(source, "Broken.tsx", {
      ...DEFAULT_OPTIONS,
      allowFlat: true,
    });
    expect(report.unboundJsxTags).toEqual(["SettingH"]);
    expect(report.issues.map((issue) => issue.code)).toContain(
      "unbound-jsx-tags",
    );
  });

  test("passes bound JSX component identifiers", () => {
    const source = `
      import { FormattedMessage } from "./i18n";
      function Title() {
        return <FormattedMessage id="title" defaultMessage="Title" />;
      }
      export function DialogTitle() {
        return <Title />;
      }
    `;
    const report = analyzeSource(source, "dialog-title.tsx", {
      ...DEFAULT_OPTIONS,
      allowFlat: true,
    });
    expect(report.unboundJsxTags).toEqual([]);
    expect(report.issues).toEqual([]);
  });

  test("fails unbound JSX member roots", () => {
    const source = `
      export function Broken() {
        return <motion.div />;
      }
    `;
    const report = analyzeSource(source, "Broken.tsx", {
      ...DEFAULT_OPTIONS,
      allowFlat: true,
    });
    expect(report.unboundJsxTags).toEqual(["motion"]);
    expect(report.issues.map((issue) => issue.code)).toContain(
      "unbound-jsx-tags",
    );
  });

  test("passes bound JSX member roots", () => {
    const source = `
      import { t as motion } from "./proxy";
      export function Animated() {
        return <motion.div />;
      }
    `;
    const report = analyzeSource(source, "animated.tsx", {
      ...DEFAULT_OPTIONS,
      allowFlat: true,
    });
    expect(report.unboundJsxTags).toEqual([]);
    expect(report.issues).toEqual([]);
  });

  test("fails unbound ordinary identifiers", () => {
    const source = `
      export function Broken(value) {
        return settingX(value);
      }
    `;
    const report = analyzeSource(source, "Broken.ts", {
      ...DEFAULT_OPTIONS,
      allowFlat: true,
    });
    expect(report.unboundIdentifiers).toEqual(["settingX"]);
    expect(report.issues.map((issue) => issue.code)).toContain(
      "unbound-identifiers",
    );
  });

  test("ordinary identifier binding check ignores object keys, member properties, and known globals", () => {
    const source = `
      import { useAtomValue } from "./storeRuntime";
      const value = { h: 1 };
      export function Read(atom: unknown) {
        console.log(window.location.href);
        const escaped = CSS.escape("project/id");
        const nodes = new NodeList();
        const bytes = new TextEncoder().encode("ok");
        return { bytes, escaped, h: value.h, nodes, result: useAtomValue(atom) };
      }
    `;
    const report = analyzeSource(source, "read.ts", {
      ...DEFAULT_OPTIONS,
      allowFlat: true,
    });
    expect(report.unboundIdentifiers).toEqual([]);
    expect(report.issues).toEqual([]);
  });

  test("ordinary identifier binding check ignores type-only export specifiers", () => {
    const source = `
      interface RightPanelWidthConfig {
        width: number;
      }
      type AppShellPanelWidthMode = "full" | "regular";
      export type {
        AppShellPanelWidthMode,
        RightPanelWidthConfig as AppShellRightPanelWidthConfig,
      };
      export function clampWidth(config: RightPanelWidthConfig): number {
        return Math.max(0, config.width);
      }
    `;
    const report = analyzeSource(source, "state.ts", {
      ...DEFAULT_OPTIONS,
      allowFlat: true,
    });
    expect(report.unboundIdentifiers).toEqual([]);
    expect(report.issues).toEqual([]);
  });

  test("ordinary identifier binding check rejects nonstandard helper namespaces", () => {
    const source = `
      export function DraggedTab(transform) {
        return CssTransformHelpers.Translate.toString(transform);
      }
    `;
    const report = analyzeSource(source, "DraggedTab.ts", {
      ...DEFAULT_OPTIONS,
      allowFlat: true,
    });
    expect(report.unboundIdentifiers).toEqual(["CssTransformHelpers"]);
    expect(report.issues.map((issue) => issue.code)).toContain(
      "unbound-identifiers",
    );
  });

  test("fails exported components with untyped props parameters", () => {
    const source = `
      import type { ReactNode } from "react";
      export function AppShellHeader(props) {
        return <div>{props.children}</div>;
      }
      export function HeaderSlotless() {
        return <div />;
      }
      export function TypedHeader(props: { children?: ReactNode }) {
        return <div>{props.children}</div>;
      }
    `;
    const report = analyzeSource(source, "Header.tsx", {
      ...DEFAULT_OPTIONS,
      allowFlat: true,
    });
    expect(report.untypedComponentProps).toEqual(["AppShellHeader"]);
    expect(report.issues.map((issue) => issue.code)).toContain(
      "untyped-component-props",
    );
  });

  test("fails duplicated named imports with different local aliases", () => {
    const source = `
      import { appShellW, appShellW as bottomPanelSlot } from "./app-shell-state";
      export function Broken(store) {
        appShellW(store, "main");
        return store.get(bottomPanelSlot);
      }
    `;
    const report = analyzeSource(source, "duplicate-import.ts", {
      ...DEFAULT_OPTIONS,
      allowFlat: true,
    });
    expect(report.duplicateImportNames).toEqual([
      {
        source: "./app-shell-state",
        imported: "appShellW",
        locals: ["appShellW", "bottomPanelSlot"],
      },
    ]);
    expect(report.issues.map((issue) => issue.code)).toContain(
      "duplicate-imported-names",
    );
  });

  test("fails mechanical facade import bindings", () => {
    const source = `
      import { appServerManagerT as conversationHostId$, appServerManagerK } from "./app-server-manager";
      import { chromeR as resolveChromeTheme } from "./chrome-theme";
      import { singleC as SvgVisualElement, _singleOt as mixNumber } from "./motion-runtime";
      import { srcDi as schemaObject } from "./schema";
      import { distA as composeEventHandlers } from "./vendor/radix/primitives";
      import { libT as fromMarkdown } from "./markdown/runtime";
      import { settingQ as atomFamily } from "./store-runtime";
      import { windowAppActionG as appActionSelectors } from "./window-app-actions";
      export function readThreadHost(routeScope, conversationId) {
        new SvgVisualElement({});
        resolveChromeTheme({}, "dark");
        mixNumber(0, 1, 0.5);
        schemaObject({});
        composeEventHandlers();
        fromMarkdown("");
        atomFamily(routeScope, () => null);
        appActionSelectors.sidebarProjectRow;
        return routeScope.get(routeScope.get(conversationHostId$, conversationId)) ??
          routeScope.get(routeScope.get(appServerManagerK, conversationId));
      }
    `;
    const report = analyzeSource(source, "app-server-consumer.ts", {
      ...DEFAULT_OPTIONS,
      allowFlat: true,
    });
    expect(report.mechanicalImportBindings).toEqual([
      {
        source: "./app-server-manager",
        imported: "appServerManagerK",
        local: "appServerManagerK",
      },
      {
        source: "./app-server-manager",
        imported: "appServerManagerT",
        local: "conversationHostId$",
      },
      {
        source: "./chrome-theme",
        imported: "chromeR",
        local: "resolveChromeTheme",
      },
      {
        source: "./markdown/runtime",
        imported: "libT",
        local: "fromMarkdown",
      },
      {
        source: "./motion-runtime",
        imported: "_singleOt",
        local: "mixNumber",
      },
      {
        source: "./motion-runtime",
        imported: "singleC",
        local: "SvgVisualElement",
      },
      {
        source: "./schema",
        imported: "srcDi",
        local: "schemaObject",
      },
      {
        source: "./store-runtime",
        imported: "settingQ",
        local: "atomFamily",
      },
      {
        source: "./vendor/radix/primitives",
        imported: "distA",
        local: "composeEventHandlers",
      },
      {
        source: "./window-app-actions",
        imported: "windowAppActionG",
        local: "appActionSelectors",
      },
    ]);
    expect(report.issues.map((issue) => issue.code)).toContain(
      "mechanical-import-bindings",
    );
  });

  test("fails mechanical re-export bindings from public facades", () => {
    const source = `
      export {
        _settingF as createSettingQuery,
        __settingT as readSettingValue,
        settingX as useSettingQuery,
      } from "../state/storeRuntime";
      export {
        singleC as SvgVisualElement,
        _singleOt as mixNumber,
      } from "../motion/motionRuntime";
      export {
        chromeR as resolveChromeTheme,
      } from "../lazyAppActions/chromeTheme";
    `;
    const report = analyzeSource(source, "settingsQueries.ts", {
      ...DEFAULT_OPTIONS,
      allowFlat: true,
    });
    expect(report.mechanicalImportBindings).toContainEqual({
      source: "../state/storeRuntime",
      imported: "_settingF",
      local: "createSettingQuery",
    });
    expect(report.mechanicalImportBindings).toContainEqual({
      source: "../state/storeRuntime",
      imported: "__settingT",
      local: "readSettingValue",
    });
    expect(report.mechanicalImportBindings).toContainEqual({
      source: "../state/storeRuntime",
      imported: "settingX",
      local: "useSettingQuery",
    });
    expect(report.mechanicalImportBindings).toContainEqual({
      source: "../motion/motionRuntime",
      imported: "singleC",
      local: "SvgVisualElement",
    });
    expect(report.mechanicalImportBindings).toContainEqual({
      source: "../motion/motionRuntime",
      imported: "_singleOt",
      local: "mixNumber",
    });
    expect(report.mechanicalImportBindings).toContainEqual({
      source: "../lazyAppActions/chromeTheme",
      imported: "chromeR",
      local: "resolveChromeTheme",
    });
    expect(report.issues.map((issue) => issue.code)).toContain(
      "mechanical-import-bindings",
    );
  });

  test("fails relative imports that do not resolve from a real restored file", () => {
    const targetDir = makeTmpRoot();
    const filePath = path.join(targetDir, "consumer.ts");
    fs.writeFileSync(
      filePath,
      `export { missingThing } from "./missing-helper";\n`,
    );
    const report = analyzeSource(fs.readFileSync(filePath, "utf-8"), filePath, {
      ...DEFAULT_OPTIONS,
      allowFlat: true,
    });
    expect(report.unresolvedRelativeImports).toEqual([
      {
        source: "./missing-helper",
        resolvedFrom: targetDir,
      },
    ]);
    expect(report.issues.map((issue) => issue.code)).toContain(
      "unresolved-relative-imports",
    );
  });

  test("passes extensionless relative imports that resolve to index files", () => {
    const targetDir = makeTmpRoot();
    fs.mkdirSync(path.join(targetDir, "helpers"));
    fs.writeFileSync(path.join(targetDir, "helpers", "index.ts"), "\n");
    const filePath = path.join(targetDir, "consumer.ts");
    fs.writeFileSync(filePath, `import { ok } from "./helpers";\n`);
    const report = analyzeSource(fs.readFileSync(filePath, "utf-8"), filePath, {
      ...DEFAULT_OPTIONS,
      allowFlat: true,
    });
    expect(report.unresolvedRelativeImports).toEqual([]);
    expect(report.issues.map((issue) => issue.code)).not.toContain(
      "unresolved-relative-imports",
    );
  });

  test("fails relative named imports that target missing exports", () => {
    const targetDir = makeTmpRoot();
    fs.writeFileSync(
      path.join(targetDir, "helpers.ts"),
      `export const existingHelper = 1;\n`,
    );
    const filePath = path.join(targetDir, "consumer.ts");
    fs.writeFileSync(
      filePath,
      `import { missingHelper } from "./helpers";\nexport const value = missingHelper;\n`,
    );
    const report = analyzeSource(fs.readFileSync(filePath, "utf-8"), filePath, {
      ...DEFAULT_OPTIONS,
      allowFlat: true,
    });
    expect(report.missingRelativeExports).toEqual([
      {
        source: "./helpers",
        imported: "missingHelper",
        resolvedFile: path.join(targetDir, "helpers.ts"),
      },
    ]);
    expect(report.issues.map((issue) => issue.code)).toContain(
      "missing-relative-exports",
    );
  });

  test("checks relative re-export specifiers against the source file", () => {
    const targetDir = makeTmpRoot();
    fs.writeFileSync(
      path.join(targetDir, "helpers.ts"),
      `export const existingHelper = 1;\n`,
    );
    const filePath = path.join(targetDir, "consumer.ts");
    fs.writeFileSync(
      filePath,
      `export { missingHelper as publicHelper } from "./helpers";\n`,
    );
    const report = analyzeSource(fs.readFileSync(filePath, "utf-8"), filePath, {
      ...DEFAULT_OPTIONS,
      allowFlat: true,
    });
    expect(report.missingRelativeExports).toEqual([
      {
        source: "./helpers",
        imported: "missingHelper",
        resolvedFile: path.join(targetDir, "helpers.ts"),
      },
    ]);
    expect(report.issues.map((issue) => issue.code)).toContain(
      "missing-relative-exports",
    );
  });

  test("resolves relative exports through export-star facades", () => {
    const targetDir = makeTmpRoot();
    fs.mkdirSync(path.join(targetDir, "runtime"));
    fs.writeFileSync(
      path.join(targetDir, "runtime", "internal.ts"),
      `export const helper = 1;\n`,
    );
    fs.writeFileSync(
      path.join(targetDir, "runtime", "index.ts"),
      `export * from "./internal";\n`,
    );
    const filePath = path.join(targetDir, "consumer.ts");
    fs.writeFileSync(
      filePath,
      `import { helper } from "./runtime";\nexport const value = helper;\n`,
    );
    const report = analyzeSource(fs.readFileSync(filePath, "utf-8"), filePath, {
      ...DEFAULT_OPTIONS,
      allowFlat: true,
    });
    expect(report.missingRelativeExports).toEqual([]);
    expect(report.issues.map((issue) => issue.code)).not.toContain(
      "missing-relative-exports",
    );
  });

  test("fails public files that re-export hidden mechanical checkpoints", () => {
    const targetDir = makeTmpRoot();
    const hiddenDir = path.join(
      targetDir,
      ".deobfuscate-javascript",
      "_full",
      "checkpoints",
    );
    fs.mkdirSync(hiddenDir, { recursive: true });
    fs.writeFileSync(path.join(hiddenDir, "helper.ts"), "export const ok = 1;");

    const filePath = path.join(targetDir, "publicHelper.ts");
    fs.writeFileSync(
      filePath,
      `export * from "./.deobfuscate-javascript/_full/checkpoints/helper";\n`,
    );

    const report = analyzeSource(fs.readFileSync(filePath, "utf-8"), filePath, {
      ...DEFAULT_OPTIONS,
      allowFlat: true,
    });

    expect(report.unfinalizedCheckpointImports).toEqual([
      "./.deobfuscate-javascript/_full/checkpoints/helper",
    ]);
    expect(report.issues.map((issue) => issue.code)).toContain(
      "unfinalized-checkpoint-imports",
    );
  });

  test("allows hidden checkpoint files to reference hidden checkpoint internals", () => {
    const targetDir = makeTmpRoot();
    const hiddenDir = path.join(
      targetDir,
      ".deobfuscate-javascript",
      "_full",
      "checkpoints",
    );
    fs.mkdirSync(hiddenDir, { recursive: true });
    fs.writeFileSync(path.join(hiddenDir, "helper.ts"), "export const ok = 1;");

    const filePath = path.join(hiddenDir, "publicTrace.ts");
    fs.writeFileSync(filePath, `export * from "../checkpoints/helper";\n`);

    const report = analyzeSource(fs.readFileSync(filePath, "utf-8"), filePath, {
      ...DEFAULT_OPTIONS,
      allowFlat: true,
      allowMechanicalNames: true,
    });

    expect(report.unfinalizedCheckpointImports).toEqual([]);
    expect(report.issues.map((issue) => issue.code)).not.toContain(
      "unfinalized-checkpoint-imports",
    );
  });

  test("allows hidden checkpoint imports only for explicit dependency-boundary public files", () => {
    const targetDir = makeTmpRoot();
    const hiddenDir = path.join(
      targetDir,
      ".deobfuscate-javascript",
      "_full",
      "checkpoints",
    );
    fs.mkdirSync(hiddenDir, { recursive: true });
    fs.writeFileSync(path.join(hiddenDir, "vendor.ts"), "export const ok = 1;");

    const boundaryFile = path.join(targetDir, "vendorBoundary.ts");
    fs.writeFileSync(
      boundaryFile,
      `export * from "./.deobfuscate-javascript/_full/checkpoints/vendor";\n`,
    );

    const report = analyzeSource(
      fs.readFileSync(boundaryFile, "utf-8"),
      boundaryFile,
      {
        ...DEFAULT_OPTIONS,
        allowFlat: true,
        allowedCheckpointImportFiles: new Set([path.resolve(boundaryFile)]),
      },
    );

    expect(report.unfinalizedCheckpointImports).toEqual([]);
    expect(report.issues.map((issue) => issue.code)).not.toContain(
      "unfinalized-checkpoint-imports",
    );
  });

  test("allows dependency-boundary facades without allowing sibling business facades", () => {
    const targetDir = makeTmpRoot();
    const hiddenDir = path.join(
      targetDir,
      ".deobfuscate-javascript",
      "_full",
      "checkpoints",
    );
    fs.mkdirSync(hiddenDir, { recursive: true });
    fs.writeFileSync(path.join(hiddenDir, "mixed.ts"), "export const ok = 1;");

    const vendorFacade = path.join(targetDir, "schema.ts");
    const businessFacade = path.join(targetDir, "routePatterns.ts");
    fs.writeFileSync(
      vendorFacade,
      `export * from "./.deobfuscate-javascript/_full/checkpoints/mixed";\n`,
    );
    fs.writeFileSync(
      businessFacade,
      `export * from "./.deobfuscate-javascript/_full/checkpoints/mixed";\n`,
    );
    fs.writeFileSync(
      path.join(targetDir, "IMPORT_MAP.json"),
      JSON.stringify({
        publicOutputs: {
          "mixed-runtime-AbCdEf12": {
            publicFacades: {
              [vendorFacade]: "./schema",
              [businessFacade]: "./routePatterns",
            },
            dependencyBoundaryFacades: {
              [vendorFacade]: "Zod schema runtime",
            },
          },
        },
      }),
    );

    const allowedCheckpointImportFiles =
      collectBoundaryCheckpointImportFiles(targetDir);
    const vendorReport = analyzeSource(
      fs.readFileSync(vendorFacade, "utf-8"),
      vendorFacade,
      {
        ...DEFAULT_OPTIONS,
        allowFlat: true,
        allowedCheckpointImportFiles,
      },
    );
    const businessReport = analyzeSource(
      fs.readFileSync(businessFacade, "utf-8"),
      businessFacade,
      {
        ...DEFAULT_OPTIONS,
        allowFlat: true,
        allowedCheckpointImportFiles,
      },
    );

    expect(vendorReport.unfinalizedCheckpointImports).toEqual([]);
    expect(businessReport.issues.map((issue) => issue.code)).toContain(
      "unfinalized-checkpoint-imports",
    );
  });

  test("short identifier density ignores object keys and member properties", () => {
    const noisyObject = Array.from(
      { length: 80 },
      (_, index) => `h${index}: value.h`,
    ).join(",\n");
    const source = `
      const value = { h: 1 };
      export const readableRegistry = {
        ${noisyObject}
      };
    `;
    const report = analyzeSource(source, "registry.ts", {
      ...DEFAULT_OPTIONS,
      allowFlat: true,
      maxShortRefCount: 10,
    });
    expect(report.shortIdentifierOffenders).toEqual([]);
  });

  test("bundle residue check ignores dependency-list strings", () => {
    const source = `
      const __vite__mapDeps = () => ["./jsx-runtime-CiQ1k8xo.js"];
      export function runCommand() {
        return __vite__mapDeps();
      }
    `;
    const report = analyzeSource(source, "run-command.ts", {
      ...DEFAULT_OPTIONS,
      allowFlat: true,
    });
    expect(report.residueMatches).toEqual([]);
    expect(report.issues.map((issue) => issue.code)).not.toContain(
      "bundle-residue",
    );
  });

  test("bundle residue check does not treat React loader import as JSX factory residue", () => {
    const source = `
      import { n as loadReact } from "./jsx-runtime-CiQ1k8xo.js";
      export const internals = loadReact().__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;
    `;
    const report = analyzeSource(source, "react-loader.ts", {
      ...DEFAULT_OPTIONS,
      allowFlat: true,
    });
    expect(report.residueMatches).toEqual([]);
  });

  test("requires a split for large flat deliverables", () => {
    const source = [
      `export function Root() { return <div />; }`,
      ...Array(1005).fill(`const readableName = 1;`),
    ].join("\n");
    const report = analyzeSource(source, "app-shell.tsx", {
      ...DEFAULT_OPTIONS,
      maxFlatLines: 1000,
      maxFlatExports: 99,
    });
    expect(report.splitRequired).toBe(true);
    expect(report.issues.map((issue) => issue.code)).toContain(
      "split-required",
    );
  });

  test("requires a split for registry-object deliverables", () => {
    const source = `
      export function Root() { return <div />; }
      export function Header() { return <header />; }
      export function Content() { return <main />; }
      export const AppShell = { Root, Header, Content };
    `;
    const report = analyzeSource(source, "app-shell.tsx", {
      ...DEFAULT_OPTIONS,
      maxFlatLines: 9999,
      maxFlatExports: 99,
    });
    expect(report.registryObjectExport).toBe(true);
    expect(report.splitRequired).toBe(true);
    expect(report.issues.map((issue) => issue.code)).toContain(
      "split-required",
    );
  });

  test("does not treat function-table config objects as registry exports", () => {
    const source = `
      export const productLogger = {
        logProductEvent: () => {},
        trackStructuredEvent: async () => {},
        trackCounter: async () => {},
        flush: async () => {},
        submitCodexAnalyticsEvent: null,
      };
      export const recordProductEvent = atom(productLogger);
      export function logProductEvent(store, event) {
        store.get(recordProductEvent).logProductEvent(event);
      }
    `;
    const report = analyzeSource(source, "productLogger.ts", {
      ...DEFAULT_OPTIONS,
    });
    expect(report.registryObjectExport).toBe(false);
    expect(report.issues.map((issue) => issue.code)).not.toContain(
      "split-required",
    );
  });

  test("allows small cohesive utility modules with several public exports", () => {
    const source = `
      export const altKeyPressedAtom = atom(false);
      export const ctrlKeyPressedAtom = atom(false);
      export const metaKeyPressedAtom = atom(false);
      export const shiftKeyPressedAtom = atom(false);
      export function clearKeyboardModifierState(store) {
        store.set(altKeyPressedAtom, false);
        store.set(ctrlKeyPressedAtom, false);
        store.set(metaKeyPressedAtom, false);
        store.set(shiftKeyPressedAtom, false);
      }
      export function updateKeyboardModifierState(store, event) {
        store.set(altKeyPressedAtom, event.altKey);
        store.set(ctrlKeyPressedAtom, event.ctrlKey);
        store.set(metaKeyPressedAtom, event.metaKey);
        store.set(shiftKeyPressedAtom, event.shiftKey);
      }
    `;
    const report = analyzeSource(source, "keyboardModifierState.ts", {
      ...DEFAULT_OPTIONS,
      maxFlatExports: 2,
    });
    expect(report.exportCount).toBeGreaterThan(2);
    expect(report.lineCount).toBeLessThan(200);
    expect(report.splitRequired).toBe(false);
  });

  test("allows formatted cohesive utility modules slightly over 200 lines", () => {
    const source = [
      `export const connectionStateRank = { connected: 0, disconnected: 1 } as const;`,
      `export function sortRemoteConnectionsByStatus(connections, statusByHostId) {`,
      `  return [...connections].sort((left, right) => connectionStateRank[statusByHostId[left.hostId] ?? "disconnected"] - connectionStateRank[statusByHostId[right.hostId] ?? "disconnected"]);`,
      `}`,
      `export function reconcileSelectedRemoteConnection(selection) {`,
      `  return selection.persistedSelectedRemoteHostId ?? selection.remoteConnections[0]?.hostId ?? null;`,
      `}`,
      `export function resolveWebviewExecutionTarget({ activeWorkspaceRoot, conversationCwd, conversationHostId, selectedRemoteProject }) {`,
      `  return conversationCwd ? { cwd: conversationCwd, hostId: conversationHostId } : selectedRemoteProject ?? { cwd: activeWorkspaceRoot, hostId: "local" };`,
      `}`,
      ...Array(205).fill(
        `// Keeps prettier-expanded cohesive modules below the split threshold.`,
      ),
    ].join("\n");
    const report = analyzeSource(source, "useWebviewExecutionTarget.ts", {
      ...DEFAULT_OPTIONS,
      maxFlatExports: 2,
    });
    expect(report.exportCount).toBeGreaterThan(2);
    expect(report.lineCount).toBeGreaterThan(200);
    expect(report.lineCount).toBeLessThan(300);
    expect(report.splitRequired).toBe(false);
  });

  test("allows cohesive semantic Impl modules to expose named runtime exports", () => {
    const source = [
      `// Restored from ref/webview/assets/app-shell-tab-controller-ABC123.js.`,
      `// Semantic implementation promoted from the mechanical checkpoint.`,
      `const appShellTabKinds = { browser: "browser" } as const;`,
      `function createTabController() { return { panelId: "right" }; }`,
      `function trackSidePanelOpened() {}`,
      `function trackSidePanelClosed() {}`,
      `const bottomPanelTabController = createTabController();`,
      `const rightPanelTabController = createTabController();`,
      `export {`,
      `  appShellTabKinds,`,
      `  bottomPanelTabController,`,
      `  rightPanelTabController,`,
      `  trackSidePanelClosed,`,
      `  trackSidePanelOpened,`,
      `};`,
      ...Array(320).fill(`// cohesive controller implementation detail`),
    ].join("\n");
    const report = analyzeSource(source, "tabControllersImpl.tsx", {
      ...DEFAULT_OPTIONS,
      maxFlatExports: 2,
    });
    expect(report.exportCount).toBeGreaterThan(2);
    expect(report.lineCount).toBeGreaterThan(300);
    expect(report.splitRequired).toBe(false);
    expect(report.issues.map((issue) => issue.code)).not.toContain(
      "split-required",
    );
  });

  test("still splits oversized semantic Impl modules", () => {
    const source = [
      `// Restored from ref/webview/assets/app-shell-tab-controller-ABC123.js.`,
      `// Semantic implementation promoted from the mechanical checkpoint.`,
      `function trackSidePanelOpened() {}`,
      `function trackSidePanelClosed() {}`,
      `export { trackSidePanelClosed, trackSidePanelOpened };`,
      ...Array(1005).fill(`// oversized controller implementation detail`),
    ].join("\n");
    const report = analyzeSource(source, "tabControllersImpl.tsx", {
      ...DEFAULT_OPTIONS,
      maxFlatLines: 1000,
      maxFlatExports: 2,
    });
    expect(report.lineCount).toBeGreaterThan(DEFAULT_OPTIONS.maxFlatLines);
    expect(report.splitRequired).toBe(true);
  });

  test("allows semantic Button recipe modules with variant-table exports", () => {
    const source = `
      import type { ButtonHTMLAttributes, ForwardedRef } from "react";
      import { forwardRef } from "react";
      import clsx from "clsx";
      import { Spinner } from "./Spinner";

      export const buttonRadiusClassNames = { default: "rounded-full", icon: "rounded-full" } as const;
      export const buttonColorClassNames = { primary: "bg-token-foreground", secondary: "text-token-foreground" } as const;
      export const buttonSizeClassNames = { default: "px-2", icon: "p-0.5" } as const;

      export type ButtonColor = keyof typeof buttonColorClassNames;
      export type ButtonSize = keyof typeof buttonSizeClassNames;

      export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
        color?: ButtonColor;
        loading?: boolean;
        size?: ButtonSize;
      }

      function ButtonRender(
        { children, className, color = "primary", loading = false, size = "default", ...buttonProps }: ButtonProps,
        ref: ForwardedRef<HTMLButtonElement>,
      ) {
        return (
          <button ref={ref} className={clsx(buttonRadiusClassNames[size], buttonColorClassNames[color], buttonSizeClassNames[size], className)} {...buttonProps}>
            {loading ? <Spinner className="icon-xxs" /> : null}
            {children}
          </button>
        );
      }

      export const Button = forwardRef<HTMLButtonElement, ButtonProps>(ButtonRender);
      Button.displayName = "Button";

      export default Button;
    `;
    const report = analyzeSource(source, "Button.tsx", {
      ...DEFAULT_OPTIONS,
      maxFlatExports: 2,
    });
    expect(report.exportCount).toBeGreaterThan(2);
    expect(report.splitRequired).toBe(false);
    expect(report.issues.map((issue) => issue.code)).not.toContain(
      "split-required",
    );
  });

  test("allows semantic theme data modules with registry-shaped objects", () => {
    const source = `
      const codexName = "Codex Dark";
      const codexType = "dark";
      const codexColors = { foreground: "#fff", background: "#111" };
      const codexTokenColors = [{ scope: "comment", settings: { foreground: "#999" } }];
      const codexSemanticTokenColors = { comment: "#999" };

      export const codexDarkTheme = {
        name: codexName,
        type: codexType,
        colors: codexColors,
        tokenColors: codexTokenColors,
        semanticTokenColors: codexSemanticTokenColors,
      };

      export default codexDarkTheme;
    `;
    const report = analyzeSource(
      source,
      path.join("restored", "themes", "codexDark.ts"),
      {
        ...DEFAULT_OPTIONS,
        maxFlatExports: 1,
      },
    );
    expect(report.registryObjectExport).toBe(true);
    expect(report.splitRequired).toBe(false);
    expect(report.issues.map((issue) => issue.code)).not.toContain(
      "split-required",
    );
  });

  test("allows large semantic command metadata modules", () => {
    const commandRows = Array.from(
      { length: 1100 },
      (_, index) =>
        `{ id: "command${index}", electron: { defaultKeybindings: [{ key: "CmdOrCtrl+${index % 10}" }] } }`,
    ).join(",\n");
    const source = `
      const defaultKeymapStaleTimeMs = 1000;
      const commandDefinitions = [${commandRows}];
      function formatAcceleratorLabel(accelerator) {
        return accelerator;
      }
      export default {
        commandDefinitions,
        defaultKeymapStaleTimeMs,
        formatAcceleratorLabel,
      };
    `;
    const report = analyzeSource(
      source,
      path.join("restored", "commands", "electronMenuShortcutsImpl.ts"),
      {
        ...DEFAULT_OPTIONS,
      },
    );
    expect(report.lineCount).toBeGreaterThan(DEFAULT_OPTIONS.maxFlatLines);
    expect(report.splitRequired).toBe(false);
    expect(report.issues.map((issue) => issue.code)).not.toContain(
      "split-required",
    );
  });

  test("allows a large flat file only when explicitly requested", () => {
    const source = [
      `export function Root() { return <div />; }`,
      ...Array(1005).fill(`const readableName = 1;`),
    ].join("\n");
    const report = analyzeSource(source, "app-shell.tsx", {
      ...DEFAULT_OPTIONS,
      allowFlat: true,
      maxFlatLines: 1000,
      maxFlatExports: 99,
    });
    expect(report.issues.map((issue) => issue.code)).not.toContain(
      "split-required",
    );
  });

  test("full-restoration coverage fails when a local chunk is not mapped publicly", () => {
    const targetDir = makeTmpRoot();
    fs.mkdirSync(path.join(targetDir, ".deobfuscate-javascript", "_full"), {
      recursive: true,
    });
    fs.writeFileSync(
      path.join(targetDir, ".deobfuscate-javascript", "_full", "manifest.json"),
      JSON.stringify({
        files: {
          "entry-AbCdEf12": {
            basename: "entry-AbCdEf12",
            kind: "local",
          },
          "react-CiQ1k8xo": {
            basename: "react-CiQ1k8xo",
            kind: "npm-leaf",
          },
        },
      }),
    );
    fs.writeFileSync(
      path.join(targetDir, "IMPORT_MAP.json"),
      JSON.stringify({ publicOutputs: {} }),
    );

    const reports = analyzeFullRestorationCoverage(targetDir);
    expect(reports).toHaveLength(1);
    expect(reports[0]!.issues.map((issue) => issue.code)).toContain(
      "full-restoration-missing-public-output",
    );
    expect(reports[0]!.issues[0]!.detail).toEqual(["entry-AbCdEf12"]);
  });

  test("full-restoration coverage reads legacy chunks entries", () => {
    const targetDir = makeTmpRoot();
    fs.mkdirSync(path.join(targetDir, ".deobfuscate-javascript", "_full"), {
      recursive: true,
    });
    fs.mkdirSync(path.join(targetDir, "utils"), { recursive: true });
    fs.writeFileSync(
      path.join(targetDir, "utils", "copyToClipboard.ts"),
      "export function copyToClipboard(text: string) { return text; }\n",
    );
    fs.writeFileSync(
      path.join(targetDir, ".deobfuscate-javascript", "_full", "manifest.json"),
      JSON.stringify({
        files: {
          "copy-to-clipboard-C9EKP1fU": {
            basename: "copy-to-clipboard-C9EKP1fU",
            kind: "local",
            stages: {},
          },
        },
      }),
    );
    fs.writeFileSync(
      path.join(targetDir, "IMPORT_MAP.json"),
      JSON.stringify({
        chunks: {
          "copy-to-clipboard-C9EKP1fU": {
            restored: "utils/copyToClipboard.ts",
            status: "done",
          },
        },
      }),
    );

    expect(analyzeFullRestorationCoverage(targetDir)).toEqual([]);
  });

  function writeFullManifest(
    targetDir: string,
    files: Record<string, unknown>,
  ): void {
    fs.mkdirSync(path.join(targetDir, ".deobfuscate-javascript", "_full"), {
      recursive: true,
    });
    fs.writeFileSync(
      path.join(targetDir, ".deobfuscate-javascript", "_full", "manifest.json"),
      JSON.stringify({ files }),
    );
  }

  function writeCheckpoints(targetDir: string, basenames: string[]): void {
    const dir = path.join(
      targetDir,
      ".deobfuscate-javascript",
      "_full",
      "checkpoints",
    );
    fs.mkdirSync(dir, { recursive: true });
    for (const b of basenames) {
      fs.writeFileSync(path.join(dir, `${b}.tsx`), "export const x = 1;\n");
    }
  }

  test("anti-stall: checkpoints-not-drained fires when checkpoints exist but nothing is promoted", () => {
    const targetDir = makeTmpRoot();
    writeFullManifest(targetDir, {
      "foo-AbCdEf12": { basename: "foo-AbCdEf12", kind: "local", stages: {} },
      "bar-Gh1jKl34": { basename: "bar-Gh1jKl34", kind: "local", stages: {} },
    });
    writeCheckpoints(targetDir, ["foo-AbCdEf12", "bar-Gh1jKl34"]);
    // No IMPORT_MAP.json — the exact state a stalled restore is left in.
    const reports = analyzeFullRestorationCoverage(targetDir);
    expect(reports).toHaveLength(1);
    const codes = reports[0]!.issues.map((i) => i.code);
    expect(codes).toContain("full-restoration-checkpoints-not-drained");
  });

  test("anti-stall: organize-incomplete fires when a chunk is finalized but not promoted", () => {
    const targetDir = makeTmpRoot();
    writeFullManifest(targetDir, {
      "foo-AbCdEf12": {
        basename: "foo-AbCdEf12",
        kind: "local",
        stages: { finalized: true },
      },
    });
    writeCheckpoints(targetDir, ["foo-AbCdEf12"]);
    const reports = analyzeFullRestorationCoverage(targetDir);
    const codes = reports[0]!.issues.map((i) => i.code);
    expect(codes).toContain("full-restoration-organize-incomplete");
  });

  test("anti-stall: --allow-organize-incomplete suppresses the drain checks", () => {
    const targetDir = makeTmpRoot();
    writeFullManifest(targetDir, {
      "foo-AbCdEf12": {
        basename: "foo-AbCdEf12",
        kind: "local",
        stages: { finalized: true },
      },
    });
    writeCheckpoints(targetDir, ["foo-AbCdEf12"]);
    const reports = analyzeFullRestorationCoverage(targetDir, {
      allowOrganizeIncomplete: true,
    });
    const codes = reports.flatMap((r) => r.issues.map((i) => i.code));
    expect(codes).not.toContain("full-restoration-checkpoints-not-drained");
    expect(codes).not.toContain("full-restoration-organize-incomplete");
  });

  test("anti-stall: public-file-in-hash-dir flags a promoted file in a hash-named dir", () => {
    const targetDir = makeTmpRoot();
    writeFullManifest(targetDir, {
      "button-bq66r8jD": {
        basename: "button-bq66r8jD",
        kind: "local",
        stages: { promoted: true },
      },
    });
    fs.mkdirSync(path.join(targetDir, "button-bq66r8jD"), { recursive: true });
    fs.writeFileSync(
      path.join(targetDir, "button-bq66r8jD", "button.tsx"),
      "export const Button = () => null;\n",
    );
    const reports = analyzeFullRestorationCoverage(targetDir);
    const codes = reports.flatMap((r) => r.issues.map((i) => i.code));
    expect(codes).toContain("full-restoration-public-file-in-hash-dir");
  });

  test("anti-stall: a fully promoted tree passes the drain checks", () => {
    const targetDir = makeTmpRoot();
    fs.mkdirSync(path.join(targetDir, "ui"), { recursive: true });
    fs.writeFileSync(
      path.join(targetDir, "ui", "button.tsx"),
      "// Restored from ref/webview/assets/button-bq66r8jD.js\nexport const Button = () => null;\n",
    );
    writeFullManifest(targetDir, {
      "button-bq66r8jD": {
        basename: "button-bq66r8jD",
        kind: "local",
        stages: { promoted: true },
      },
    });
    writeCheckpoints(targetDir, ["button-bq66r8jD"]);
    fs.writeFileSync(
      path.join(targetDir, "IMPORT_MAP.json"),
      JSON.stringify({
        chunks: {
          "button-bq66r8jD": { restored: "ui/button.tsx", status: "done" },
        },
      }),
    );
    const reports = analyzeFullRestorationCoverage(targetDir);
    const codes = reports.flatMap((r) => r.issues.map((i) => i.code));
    expect(codes).not.toContain("full-restoration-checkpoints-not-drained");
    expect(codes).not.toContain("full-restoration-organize-incomplete");
    expect(codes).not.toContain("full-restoration-public-file-in-hash-dir");
  });

  test("generated barrel/types files are exempt from the provenance-header requirement", () => {
    const opts = { ...DEFAULT_OPTIONS, requireProvenanceHeader: true };
    const barrel = analyzeSource(
      `export { SpeakerIcon } from "./speaker-icon";\n`,
      "icons/speaker/index.ts",
      opts,
    );
    expect(barrel.issues.map((i) => i.code)).not.toContain(
      "missing-provenance-header",
    );
    const types = analyzeSource(
      `import type { SVGProps } from "react";\nexport type IconProps = SVGProps<SVGSVGElement>;\n`,
      "icons/speaker/types.ts",
      opts,
    );
    expect(types.issues.map((i) => i.code)).not.toContain(
      "missing-provenance-header",
    );
    // A real restored file with no header still fails.
    const real = analyzeSource(
      `export function speakerIcon() {}\n`,
      "icons/speaker/speaker-icon.tsx",
      opts,
    );
    expect(real.issues.map((i) => i.code)).toContain("missing-provenance-header");
  });

  test("allowUntyped suppresses the typing checks (readable tier)", () => {
    const src =
      "// Restored from ref/webview/assets/widget-AbCdEf12.js\nexport function Widget(props) {\n  return props.label;\n}\n";
    const deep = analyzeSource(src, "widget.tsx", DEFAULT_OPTIONS);
    expect(deep.issues.map((i) => i.code)).toContain("untyped-component-props");
    const readable = analyzeSource(src, "widget.tsx", {
      ...DEFAULT_OPTIONS,
      allowUntyped: true,
    });
    expect(readable.issues.map((i) => i.code)).not.toContain(
      "untyped-component-props",
    );
  });

  test("full-restoration coverage rejects mechanical app feature checkpoints", () => {
    const targetDir = makeTmpRoot();
    fs.mkdirSync(path.join(targetDir, ".deobfuscate-javascript", "_full"), {
      recursive: true,
    });
    fs.mkdirSync(path.join(targetDir, "boundaries"), { recursive: true });
    fs.writeFileSync(
      path.join(targetDir, "boundaries", "composer.tsx"),
      "// @ts-nocheck\nexport function Composer() { return null; }\n",
    );
    fs.writeFileSync(
      path.join(targetDir, ".deobfuscate-javascript", "_full", "manifest.json"),
      JSON.stringify({
        files: {
          "composer-CCuv6v-2": {
            basename: "composer-CCuv6v-2",
            kind: "local",
            stages: { finalized: false },
          },
        },
      }),
    );
    fs.writeFileSync(
      path.join(targetDir, "IMPORT_MAP.json"),
      JSON.stringify({
        boundaries: {
          "composer-CCuv6v-2": {
            restored: "boundaries/composer.tsx",
            boundary: false,
            status: "mechanical-readable-restored",
          },
        },
      }),
    );

    const reports = analyzeFullRestorationCoverage(targetDir);
    const codes = reports[0]!.issues.map((issue) => issue.code);
    expect(codes).toContain("full-restoration-mechanical-app-feature");
    expect(codes).toContain("full-restoration-app-feature-not-accepted");
    expect(codes).toContain("full-restoration-app-feature-ts-nocheck");
  });

  test("full-restoration coverage rejects app panel empty boundary placeholders", () => {
    const targetDir = makeTmpRoot();
    fs.mkdirSync(path.join(targetDir, ".deobfuscate-javascript", "_full"), {
      recursive: true,
    });
    fs.mkdirSync(path.join(targetDir, "boundaries"), { recursive: true });
    fs.writeFileSync(
      path.join(targetDir, "boundaries", "pdf-preview-panel.ts"),
      "// Restored from ref/webview/assets/pdf-preview-panel-Bo4vARUp.js\nexport {};\n",
    );
    fs.writeFileSync(
      path.join(targetDir, ".deobfuscate-javascript", "_full", "manifest.json"),
      JSON.stringify({
        files: {
          "pdf-preview-panel-Bo4vARUp": {
            basename: "pdf-preview-panel-Bo4vARUp",
            kind: "local",
            stages: { finalized: false },
          },
        },
      }),
    );
    fs.writeFileSync(
      path.join(targetDir, "IMPORT_MAP.json"),
      JSON.stringify({
        boundaries: {
          "pdf-preview-panel-Bo4vARUp": {
            restored: "boundaries/pdf-preview-panel.ts",
            boundary: true,
            vendor: "diagram/doc",
          },
        },
      }),
    );

    const reports = analyzeFullRestorationCoverage(targetDir);
    const codes = reports[0]!.issues.map((issue) => issue.code);
    expect(codes).toContain("full-restoration-app-feature-boundary");
    expect(codes).toContain("full-restoration-app-feature-empty-placeholder");
    expect(codes).toContain("full-restoration-app-feature-not-accepted");
  });

  test("full-restoration coverage rejects app feature typed facades", () => {
    const targetDir = makeTmpRoot();
    fs.mkdirSync(path.join(targetDir, ".deobfuscate-javascript", "_full"), {
      recursive: true,
    });
    fs.mkdirSync(path.join(targetDir, "review"), { recursive: true });
    fs.writeFileSync(
      path.join(targetDir, "review", "ReviewFileSourceTab.tsx"),
      [
        "// Restored from ref/webview/assets/review-file-source-tab-C96M0tZ-.js",
        "// TYPED BOUNDARY FACADE (generated by scripts/make-facade.ts).",
        "export declare const ReviewFileSourceTab: any;",
        "",
      ].join("\n"),
    );
    fs.writeFileSync(
      path.join(targetDir, ".deobfuscate-javascript", "_full", "manifest.json"),
      JSON.stringify({
        files: {
          "review-file-source-tab-C96M0tZ-": {
            basename: "review-file-source-tab-C96M0tZ-",
            kind: "local",
            stages: { finalized: true },
          },
        },
      }),
    );
    fs.writeFileSync(
      path.join(targetDir, "IMPORT_MAP.json"),
      JSON.stringify({
        chunks: {
          "review-file-source-tab-C96M0tZ-": {
            restored: "review/ReviewFileSourceTab.tsx",
            status: "accepted",
          },
        },
      }),
    );

    const reports = analyzeFullRestorationCoverage(targetDir);
    expect(reports[0]!.issues.map((issue) => issue.code)).toContain(
      "full-restoration-app-feature-facade",
    );
  });

  test("full-restoration coverage permits explicit vendor boundaries", () => {
    const targetDir = makeTmpRoot();
    fs.mkdirSync(path.join(targetDir, ".deobfuscate-javascript", "_full"), {
      recursive: true,
    });
    fs.mkdirSync(path.join(targetDir, "assets"), { recursive: true });
    fs.writeFileSync(
      path.join(targetDir, "assets", "browser.ts"),
      "export declare const DotLottieWorkerReact: any;\n",
    );
    fs.writeFileSync(
      path.join(targetDir, ".deobfuscate-javascript", "_full", "manifest.json"),
      JSON.stringify({
        files: {
          "browser-BQH2qCja": {
            basename: "browser-BQH2qCja",
            kind: "local",
            stages: { finalized: false },
          },
        },
      }),
    );
    fs.writeFileSync(
      path.join(targetDir, "IMPORT_MAP.json"),
      JSON.stringify({
        boundaries: {
          "browser-BQH2qCja": {
            restored: "assets/browser.ts",
            boundary: true,
            vendor: "npm",
            note: "@lottiefiles/dotlottie-web",
          },
        },
      }),
    );

    expect(analyzeFullRestorationCoverage(targetDir)).toEqual([]);
  });

  test("full-restoration coverage accepts public facades and dependency boundaries", () => {
    const targetDir = makeTmpRoot();
    fs.mkdirSync(path.join(targetDir, ".deobfuscate-javascript", "_full"), {
      recursive: true,
    });
    fs.mkdirSync(path.join(targetDir, "state"));
    fs.writeFileSync(path.join(targetDir, "state", "storeRuntime.ts"), "\n");
    fs.writeFileSync(
      path.join(targetDir, ".deobfuscate-javascript", "_full", "manifest.json"),
      JSON.stringify({
        files: {
          "setting-storage-EK1Te68s": {
            basename: "setting-storage-EK1Te68s",
            kind: "local",
          },
          "bundler-runtime-AbCdEf12": {
            basename: "bundler-runtime-AbCdEf12",
            kind: "local",
          },
        },
      }),
    );
    fs.writeFileSync(
      path.join(targetDir, "IMPORT_MAP.json"),
      JSON.stringify({
        publicOutputs: {
          "setting-storage-EK1Te68s": {
            publicFacades: {
              [path.join(targetDir, "state", "storeRuntime.ts")]:
                "./state/storeRuntime",
            },
          },
          "bundler-runtime-AbCdEf12": {
            dependencyBoundary: "Vite bundler helper runtime",
          },
        },
      }),
    );

    expect(analyzeFullRestorationCoverage(targetDir)).toEqual([]);
  });
});

describe("vendored / facade relaxation", () => {
  const codes = (r: { issues: Array<{ code: string }> }) =>
    r.issues.map((i) => i.code);

  test("lodash canonical short names are allowlisted", () => {
    const src =
      `// Restored from ref/webview/assets/cmp-XXXXXXXX.js\n` +
      `export const eq = (a, b) => a === b;\n` +
      `export const gt = (a, b) => a > b;\n` +
      `export const lt = (a, b) => a < b;\n`;
    const r = analyzeSource(src, "compare.ts", {
      ...DEFAULT_OPTIONS,
      allowFlat: true,
    });
    expect(codes(r)).not.toContain("public-cryptic-names");
  });

  test("--vendored suppresses public-cryptic-names and split-required", () => {
    const src =
      `// Restored from ref/webview/assets/lib-XXXXXXXX.js\n` +
      `export const z1 = 1;\n` +
      `export const z2 = 2;\n` +
      `export const z3 = 3;\n` +
      Array.from({ length: 8 }, (_, i) => `const v${i} = ${i};`).join("\n") +
      "\n";
    const ctrl = analyzeSource(src, "lib.ts", {
      ...DEFAULT_OPTIONS,
      maxFlatLines: 3,
    });
    expect(codes(ctrl)).toContain("public-cryptic-names");
    expect(codes(ctrl)).toContain("split-required");

    const vend = analyzeSource(src, "lib.ts", {
      ...DEFAULT_OPTIONS,
      maxFlatLines: 3,
      vendored: true,
    });
    expect(codes(vend)).not.toContain("public-cryptic-names");
    expect(codes(vend)).not.toContain("split-required");
  });

  test("a generated facade is auto-relaxed by its marker (no --vendored)", () => {
    const facade =
      `// Restored from ref/webview/assets/zod-XXXXXXXX.js\n` +
      `//\n` +
      `// TYPED BOUNDARY FACADE (generated by scripts/make-facade.ts).\n` +
      `/* eslint-disable @typescript-eslint/no-explicit-any */\n` +
      `export declare const a: any;\n` +
      `export declare const i: any;\n` +
      `export declare const n: any;\n`;
    const r = analyzeSource(facade, "zod.facade.ts", {
      ...DEFAULT_OPTIONS,
      maxFlatLines: 1,
    });
    expect(codes(r)).not.toContain("public-cryptic-names");
    expect(codes(r)).not.toContain("split-required");
  });

  test("legacy vendored flat boundary facades are auto-relaxed", () => {
    const cases = [
      {
        file: "restored/app-main/boundaries/react.ts",
        header:
          "// Restored from ref/webview/assets/react-XXXXXXXX.js — vendored npm package (bundled). Flat boundary facade.",
      },
      {
        file: "restored/app-main/boundaries/chunk-5FUZZQ4R.ts",
        header:
          "// Restored from ref/webview/assets/chunk-5FUZZQ4R.js — diagram/doc vendor chunk. Flat boundary.",
      },
      {
        file: "restored/app-main/boundaries/jotaiReact.ts",
        header:
          "// Restored from ref/webview/assets/jotai-react-XXXXXXXX.js — Bare Jotai React re-export boundary split out of the app-scope bundle.",
      },
      {
        file: "restored/app-main/boundaries/request.ts",
        header:
          "// Restored from ref/webview/assets/request-XXXXXXXX.js — i18n/locale request; boundary.",
      },
    ];

    for (const testCase of cases) {
      const facade =
        `${testCase.header}\n` +
        `/* eslint-disable @typescript-eslint/no-explicit-any */\n` +
        `export declare const t: any;\n` +
        `export declare const n: any;\n`;
      const r = analyzeSource(facade, testCase.file, {
        ...DEFAULT_OPTIONS,
      });
      expect(codes(r)).not.toContain("public-cryptic-names");
    }
  });

  test("unfinished app flat boundary facades are not auto-relaxed", () => {
    const facade =
      `// Restored from ref/webview/assets/composer-XXXXXXXX.js — composer chunk (not yet semantically restored). Flat boundary facade.\n` +
      `/* eslint-disable @typescript-eslint/no-explicit-any */\n` +
      `export declare const t: any;\n`;
    const r = analyzeSource(
      facade,
      "restored/app-main/boundaries/composer.ts",
      {
        ...DEFAULT_OPTIONS,
      },
    );
    expect(codes(r)).toContain("public-cryptic-names");
  });

  test("restored bundler interop runtime modules are auto-relaxed", () => {
    const runtime =
      `// Restored from ref/webview/assets/chunk-Cq_f4orQ.js\n` +
      `const create = Object.create;\n` +
      `const commonJsFactory = (fn: any, mod?: any) => () => mod || fn;\n` +
      `const toESM = (mod: any) => create(mod);\n` +
      `export { toESM as s, commonJsFactory as t };\n`;
    const r = analyzeSource(runtime, "restored/app-main/utils/cjsInterop.ts", {
      ...DEFAULT_OPTIONS,
    });
    expect(codes(r)).not.toContain("public-cryptic-names");
  });

  test("restored Lottie animation data modules are auto-relaxed", () => {
    const lottieData =
      `// Restored from ref/webview/assets/automation-DUugu_pi.js\n` +
      `/* eslint-disable @typescript-eslint/no-explicit-any */\n` +
      `const animationData: any = {\n` +
      `  v: "5.7.0",\n` +
      `  ip: 0,\n` +
      `  op: 90,\n` +
      `  fr: 60,\n` +
      `  w: 500,\n` +
      `  h: 500,\n` +
      `  assets: [],\n` +
      `  layers: [],\n` +
      Array.from({ length: 8 }, (_, i) => `  frame${i}: ${i},`).join("\n") +
      `\n};\n` +
      `export default animationData;\n`;

    const ordinary = analyzeSource(lottieData, "widgets/LargeAnimation.ts", {
      ...DEFAULT_OPTIONS,
      maxFlatLines: 5,
    });
    expect(codes(ordinary)).toContain("split-required");

    const asset = analyzeSource(
      lottieData,
      "restored/app-main/assets/automationAnimation.ts",
      {
        ...DEFAULT_OPTIONS,
        maxFlatLines: 5,
      },
    );
    expect(codes(asset)).not.toContain("split-required");
  });
});

describe("kebab filename gate", () => {
  const codes = (file: string): string[] =>
    analyzeSource("export const x = 1;\n", file, {
      ...DEFAULT_OPTIONS,
      allowFlat: true,
    }).issues.map((issue) => issue.code);

  test("flags PascalCase and camelCase public file names", () => {
    for (const file of [
      "Button.tsx",
      "DownloadIcon.tsx",
      "settingsQueries.ts",
    ]) {
      expect(codes(file)).toContain("non-kebab-filename");
    }
  });

  test("accepts kebab, index, types, *.d.ts, *.facade.ts", () => {
    for (const file of [
      "button.tsx",
      "download-icon.tsx",
      "app-shell.tsx",
      "index.ts",
      "types.ts",
      "globals.d.ts",
      "zod.facade.ts",
    ]) {
      expect(codes(file)).not.toContain("non-kebab-filename");
    }
  });

  test("suppressed for vendored modules", () => {
    const issues = analyzeSource("export const x = 1;\n", "Button.tsx", {
      ...DEFAULT_OPTIONS,
      allowFlat: true,
      vendored: true,
    }).issues.map((issue) => issue.code);
    expect(issues).not.toContain("non-kebab-filename");
  });
});

describe("checkFormatting", () => {
  test("flags each file prettier --check reports as unformatted", () => {
    const fakeRun = () => ({
      ok: false,
      stdout:
        "Checking formatting...\n[warn] restored/ui/button.tsx\n[warn] restored/ui/badge.tsx\n[warn] Code style issues found in 2 files. Run Prettier with --write to fix.\n",
      stderr: "",
    });
    const reports = checkFormatting("restored", fakeRun);
    expect(reports.map((r) => r.file)).toEqual([
      "restored/ui/button.tsx",
      "restored/ui/badge.tsx",
    ]);
    expect(reports.every((r) => r.issues[0]!.code === "unformatted")).toBe(true);
  });

  test("returns no issues when everything is prettier-clean", () => {
    const reports = checkFormatting("restored", () => ({
      ok: true,
      stdout: "All matched files use Prettier code style!\n",
      stderr: "",
    }));
    expect(reports).toEqual([]);
  });

  test("soft-skips (no failures) when prettier is unavailable", () => {
    const reports = checkFormatting("restored", () => ({
      ok: false,
      stdout: "",
      stderr: "bunx: prettier: command not found\n",
    }));
    expect(reports).toEqual([]);
  });
});

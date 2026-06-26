import { describe, expect, test } from "bun:test";
import { planSplit } from "./plan-split.ts";
import { splitBundle, type SplitPlan } from "./split-bundle.ts";
import { analyzeSource, DEFAULT_OPTIONS } from "./quality-gate.ts";

describe("split-bundle", () => {
  test("splits an app-shell-style registry bundle into files and a barrel", () => {
    const source = `
      import React from "react";
      import { dep } from "./dep.js";
      const sharedLabel = "Shell";
      export function Root() { return <div>{sharedLabel}{dep}</div>; }
      export function Header() { return <header>{sharedLabel}</header>; }
      export function Content() { return <main>{sharedLabel}</main>; }
      export const AppShell = { Root, Header, Content };
    `;
    const plan: SplitPlan = {
      sections: [
        {
          dir: "layout",
          files: [
            { name: "root.tsx", exports: ["Root"], bindings: ["Root"] },
            {
              name: "content.tsx",
              exports: ["Content"],
              bindings: ["Content"],
            },
          ],
        },
        {
          dir: "header",
          files: [
            { name: "header.tsx", exports: ["Header"], bindings: ["Header"] },
          ],
        },
      ],
      shared: { name: "shared.ts", bindings: ["sharedLabel"] },
      barrel: {
        reExports: [
          { from: "./layout/root", names: ["Root"] },
          { from: "./header/header", names: ["Header"] },
          { from: "./layout/content", names: ["Content"] },
        ],
        registry: {
          name: "AppShell",
          entries: [
            { name: "Root", from: "./layout/root" },
            { name: "Header", from: "./header/header" },
            { name: "Content", from: "./layout/content" },
          ],
        },
      },
    };

    const result = splitBundle(source, plan);
    const byPath = new Map(result.files.map((file) => [file.path, file.code]));

    expect([...byPath.keys()].sort()).toEqual([
      "header/header.tsx",
      "index.ts",
      "layout/content.tsx",
      "layout/root.tsx",
      "shared.ts",
    ]);
    expect(byPath.get("layout/root.tsx")).toContain(
      'import { sharedLabel } from "../shared";',
    );
    expect(byPath.get("layout/root.tsx")).toContain(
      'import { dep } from "../dep.js";',
    );
    expect(byPath.get("header/header.tsx")).not.toContain(
      'import { dep } from "../dep.js";',
    );
    expect(byPath.get("layout/root.tsx")).toContain("export function Root()");
    expect(byPath.get("index.ts")).toContain("export const AppShell = {");
    expect(byPath.get("index.ts")).toContain(
      'export { Header } from "./header/header";',
    );
    for (const file of result.files) {
      const report = analyzeSource(file.code, file.path, {
        ...DEFAULT_OPTIONS,
        maxFlatExports: 99,
      });
      expect(report.issues).toEqual([]);
    }
  });

  test("creates a deterministic split plan for command-keybinding-style exports", () => {
    const source = `
      export const commandKeymapState = {};
      export const commandShortcutLabels = {};
      export function hasCommandShortcut(commandId) {
        return Boolean(commandId);
      }
      export const commandKeybindings = {
        commandKeymapState,
        commandShortcutLabels,
        hasCommandShortcut,
      };
    `;
    const plan = planSplit(source, {
      inputPath: "command-keybindings-CvjN6DDf.tsx",
      outDir: "restored/command-keybindings-CvjN6DDf",
      extension: ".ts",
    });

    expect(plan.outDir).toBe("restored/command-keybindings-CvjN6DDf");
    expect(plan.sections[0]?.files.map((file) => file.name)).toEqual([
      "command-keymap-state.ts",
      "command-shortcut-labels.ts",
      "has-command-shortcut.ts",
    ]);
    expect(plan.barrel?.registry?.name).toBe("commandKeybindings");
  });

  test("plans registry object entries instead of unrelated public exports", () => {
    const source = `
      import React from "react";
      const privateLabel = "Shell";
      function rootRender() { return <div>{privateLabel}</div>; }
      function headerRender() { return <header>{privateLabel}</header>; }
      function contentRender() { return <main>{privateLabel}</main>; }
      export const canNavigateBack$ = {};
      export const AppShell = {
        Root: React.memo(rootRender),
        Header: React.memo(headerRender),
        Content: React.memo(contentRender),
      };
    `;
    const plan = planSplit(source, {
      inputPath: "app-shell-Bh-lgoQk.tsx",
      outDir: "restored/app-shell",
      extension: ".tsx",
    });

    expect(plan.sections[0]?.files.map((file) => file.name)).toEqual([
      "root.tsx",
      "header.tsx",
      "content.tsx",
      "can-navigate-back.tsx",
    ]);
    expect(plan.sections[0]?.files.map((file) => file.bindings)).toEqual([
      ["rootRender"],
      ["headerRender"],
      ["contentRender"],
      ["canNavigateBack$"],
    ]);
    expect(plan.shared?.bindings).toEqual(["privateLabel"]);
    expect(plan.barrel?.registry).toEqual({
      name: "AppShell",
      entries: [
        { key: "Root", name: "rootRender", from: "./root" },
        { key: "Header", name: "headerRender", from: "./header" },
        { key: "Content", name: "contentRender", from: "./content" },
      ],
    });
  });

  test("materializes aliased export specifiers in split files", () => {
    const source = `
      function AppUpdateButton() { return <button />; }
      export { AppUpdateButton as appC };
    `;
    const plan = planSplit(source, {
      inputPath: "app-shell-Bh-lgoQk.tsx",
      outDir: "restored/app-shell",
      extension: ".tsx",
    });
    const result = splitBundle(source, plan);
    const byPath = new Map(result.files.map((file) => [file.path, file.code]));

    expect(byPath.get("app-c.tsx")).toContain("function AppUpdateButton()");
    expect(byPath.get("app-c.tsx")).toContain(
      "export { AppUpdateButton as appC };",
    );
    expect(byPath.get("index.ts")).toContain('export { appC } from "./app-c";');
  });

  test("can rebase original imports from a parent import root", () => {
    const source = `
      import { dep } from "./dep.js";
      export function SharedThing() { return dep; }
    `;
    const plan: SplitPlan = {
      importRoot: "..",
      sections: [
        {
          files: [
            {
              name: "SharedThing.ts",
              exports: ["SharedThing"],
              bindings: ["SharedThing"],
            },
          ],
        },
      ],
    };
    const result = splitBundle(source, plan);
    expect(result.files[0]?.code).toContain('import { dep } from "../dep.js";');
  });

  test("preserves a source provenance header in split files", () => {
    const source = [
      "// Restored from ref/webview/assets/app-shell.js",
      "// App shell restored from the bundle.",
      'import { dep } from "./dep.js";',
      "export function Root() { return dep; }",
    ].join("\n");
    const plan: SplitPlan = {
      sections: [
        {
          files: [{ name: "Root.tsx", exports: ["Root"], bindings: ["Root"] }],
        },
      ],
    };

    const result = splitBundle(source, plan);
    expect(result.files[0]?.code.startsWith("// Restored from")).toBe(true);
    expect(result.files[0]?.code.match(/Restored from/g)?.length).toBe(1);
    expect(result.files[0]?.code).toContain(
      "// App shell restored from the bundle.",
    );
    expect(result.files.at(-1)?.code.startsWith("// Restored from")).toBe(true);
    expect(result.files.at(-1)?.code.match(/Restored from/g)?.length).toBe(1);
  });

  test("carries TypeScript declarations and imports type references across split files", () => {
    const source = `
      import React from "react";
      type ClickHandler = () => void;
      interface ButtonProps {
        label: React.ReactNode;
        onClick: ClickHandler;
      }
      export function Button(props: ButtonProps) {
        return <button onClick={props.onClick}>{props.label}</button>;
      }
    `;
    const plan: SplitPlan = {
      sections: [
        {
          files: [
            {
              name: "types.ts",
              exports: ["ClickHandler", "ButtonProps"],
              bindings: ["ClickHandler", "ButtonProps"],
            },
            {
              name: "Button.tsx",
              exports: ["Button"],
              bindings: ["Button"],
            },
          ],
        },
      ],
      barrel: {
        reExports: [{ from: "./Button", names: ["Button"] }],
      },
    };

    const result = splitBundle(source, plan);
    const byPath = new Map(result.files.map((file) => [file.path, file.code]));

    expect(byPath.get("types.ts")).toContain("export type ClickHandler");
    expect(byPath.get("types.ts")).toContain("export interface ButtonProps");
    expect(byPath.get("Button.tsx")).toContain(
      'import { ButtonProps } from "./types";',
    );
    expect(byPath.get("Button.tsx")).toContain("export function Button");
  });
});

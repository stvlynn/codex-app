import { afterAll, beforeAll, describe, expect, test } from "bun:test";
import * as fs from "node:fs";
import * as os from "node:os";
import * as path from "node:path";
import * as parser from "@babel/parser";
import {
  rewriteSemanticImports,
  semanticFinalize,
  type SemanticFile,
} from "./semantic-finalize.ts";

const PARSER_PLUGINS: parser.ParserPlugin[] = [
  "jsx",
  "typescript",
  "classProperties",
  "classPrivateProperties",
  "classPrivateMethods",
  "dynamicImport",
  "importMeta",
  "objectRestSpread",
  "topLevelAwait",
];

const DOWNLOAD_SOURCE_PATH = "ref/webview/assets/download-Cf0FyA1Y.js";
const EXPAND_SOURCE_PATH = "ref/webview/assets/expand-BVUB1pRY.js";
const BUTTON_SOURCE_PATH = "ref/webview/assets/button-bq66r8jD.js";

const DOWNLOAD_SOURCE = `// Restored from ${DOWNLOAD_SOURCE_PATH}
export const t = (props) => (
  <svg width={20} height={20} viewBox="0 0 20 20" {...props}>
    <path d="M10 14l-5-5h3V4h4v5h3l-5 5z" fill="currentColor" />
  </svg>
);
`;

const EXPAND_SOURCE = `// Restored from ${EXPAND_SOURCE_PATH}
export const t = (props) => (
  <svg width={20} height={20} viewBox="0 0 20 20" {...props}>
    <path d="M0" fill="currentColor" />
  </svg>
);
`;

const BUTTON_SOURCE = `// Restored from ${BUTTON_SOURCE_PATH}
import { Spinner } from "./spinner";

const buttonRadiusClassNames = {
  default: "rounded-md",
  composer: "rounded-full",
};

const buttonColorClassNames = {
  danger: "bg-red-500",
  primary: "bg-blue-500",
  secondary: "bg-gray-500",
};

const buttonSizeClassNames = {
  composer: "px-4 h-token-6",
  toolbar: "px-2 h-token-5",
};

const buttonClassName = clsx(
  "border-token-border user-select-none no-drag cursor-interaction flex items-center gap-1 border whitespace-nowrap focus:outline-none disabled:cursor-not-allowed disabled:opacity-40",
  buttonRadiusClassNames.default,
  buttonColorClassNames.primary,
  buttonSizeClassNames.composer,
);

export function ButtonRender(props) {
  return <button className={buttonClassName}>{props.children}</button>;
}
`;

let tempFixtureDir: string | null = null;

beforeAll(() => {
  tempFixtureDir = fs.mkdtempSync(path.join(os.tmpdir(), "semantic-finalize-"));
});

afterAll(() => {
  if (tempFixtureDir) {
    fs.rmSync(tempFixtureDir, { recursive: true, force: true });
  }
});

function parseModule(code: string): void {
  parser.parse(code, {
    sourceType: "module",
    plugins: PARSER_PLUGINS,
  });
}

function expectNoRuntimeResidue(files: SemanticFile[]): void {
  const joined = files.map((file) => file.code).join("\n");
  expect(joined).not.toMatch(/jsx-runtime|__toESM|\$\.c\(|cache\[/);
}

describe("semantic-finalize", () => {
  test("a download icon bundle becomes a typed semantic module", () => {
    const sourcePath = DOWNLOAD_SOURCE_PATH;
    const result = semanticFinalize(DOWNLOAD_SOURCE, {
      recipe: "icon",
      sourcePath,
    });
    expect(result.layout).toBe("single");
    expect(result.exportMap.t).toBe("DownloadIcon");
    expect(result.files).toHaveLength(1);
    const code = result.files[0]!.code;
    expect(code).toContain(`// Restored from ${sourcePath}`);
    expect(code).toContain('import type { SVGProps } from "react"');
    expect(code).toContain("export type IconProps = SVGProps<SVGSVGElement>");
    expect(code).toContain("export function DownloadIcon(props: IconProps)");
    expect(code).toContain("export default DownloadIcon");
    expect(code).toContain("{...props}");
    expectNoRuntimeResidue(result.files);
    parseModule(code);
  });

  test("a download icon with a generic fallback name maps its original alias", () => {
    const fixtureName = "download-Cf0FyA1Y.js";
    const sourcePath = path.join(tempFixtureDir!, fixtureName);
    fs.writeFileSync(
      sourcePath,
      `export { elementNode1 as t };\n`,
      "utf-8",
    );
    const polished = [
      `// Restored from ${sourcePath}`,
      `export const elementNode1 = props => <svg width={20} height={20} viewBox="0 0 20 20" {...props}><path d="M0" fill="currentColor" /></svg>;`,
    ].join("\n");
    const result = semanticFinalize(polished, {
      recipe: "icon",
      sourcePath,
      basename: path.basename(sourcePath, ".js"),
    });

    expect(result.exportMap.t).toBe("DownloadIcon");
  });

  test("expand-BVUB1pRY.js multi icon chunk splits to directory plus barrel", () => {
    const sourcePath = "ref/webview/assets/expand-BVUB1pRY.js";
    const polished = [
      `// Restored from ${sourcePath}`,
      `export const ExpandIcon = props => <svg width={20} height={20} viewBox="0 0 20 20" {...props}><path d="M0" fill="currentColor" /></svg>;`,
      `export const CollapseIcon = props => <svg width={20} height={20} viewBox="0 0 20 20" {...props}><path d="M1" fill="currentColor" /></svg>;`,
    ].join("\n");
    const result = semanticFinalize(polished, {
      recipe: "icon",
      sourcePath,
      basename: "expand-BVUB1pRY",
    });
    expect(result.layout).toBe("directory");
    expect(result.exportMap.ExpandIcon).toBe("ExpandIcon");
    expect(result.exportMap.CollapseIcon).toBe("CollapseIcon");
    expect(result.files.map((file) => file.path).sort()).toEqual([
      "expand/collapse-icon.tsx",
      "expand/expand-icon.tsx",
      "expand/index.ts",
      "expand/types.ts",
    ]);
    expect(result.files.some((file) => file.path === "expand.tsx")).toBe(false);
    const expand = result.files.find((file) =>
      file.path.endsWith("expand-icon.tsx"),
    )!;
    const collapse = result.files.find((file) =>
      file.path.endsWith("collapse-icon.tsx"),
    )!;
    const barrel = result.files.find((file) => file.path.endsWith("index.ts"))!;
    expect(expand.code).toContain('import type { IconProps } from "./types"');
    expect(expand.code).toContain(
      "export function ExpandIcon(props: IconProps)",
    );
    expect(collapse.code).toContain(
      "export function CollapseIcon(props: IconProps)",
    );
    expect(barrel.code).toContain('export { ExpandIcon } from "./expand-icon"');
    expect(barrel.code).toContain(
      'export { CollapseIcon } from "./collapse-icon"',
    );
    expectNoRuntimeResidue(result.files);
    for (const file of result.files) parseModule(file.code);
  });

  test("an expand icon bundle maps its original alias", () => {
    const sourcePath = EXPAND_SOURCE_PATH;
    const result = semanticFinalize(EXPAND_SOURCE, {
      recipe: "icon",
      sourcePath,
      basename: path.basename(sourcePath, ".js"),
    });

    expect(result.exportMap.t).toBe("ExpandIcon");
    expect(result.layout).toBe("single");
    expect(result.files.map((file) => file.path)).toEqual(["expand-icon.tsx"]);
  });

  test("expand-BVUB1pRY.js keeps Expand/Collapse names after generic fallback renames", () => {
    const sourcePath = "ref/webview/assets/expand-BVUB1pRY.js";
    const polished = [
      `// Restored from ${sourcePath}`,
      `export const elementNode2 = props => <svg width={20} height={20} viewBox="0 0 20 20" {...props}><path d="M0" fill="currentColor" /></svg>;`,
      `export const elementNode1 = props => <svg width={20} height={20} viewBox="0 0 20 20" {...props}><path d="M1" fill="currentColor" /></svg>;`,
    ].join("\n");
    const result = semanticFinalize(polished, {
      recipe: "icon",
      sourcePath,
      basename: "expand-BVUB1pRY",
    });

    expect(result.exportMap.t).toBe("ExpandIcon");
    expect(result.exportMap.n).toBe("CollapseIcon");
    expect(result.files.map((file) => file.path).sort()).toEqual([
      "expand/collapse-icon.tsx",
      "expand/expand-icon.tsx",
      "expand/index.ts",
      "expand/types.ts",
    ]);
  });

  test("a button bundle becomes a typed semantic Button component", () => {
    const sourcePath = BUTTON_SOURCE_PATH;
    const result = semanticFinalize(BUTTON_SOURCE, {
      recipe: "button",
      sourcePath,
    });
    expect(result.layout).toBe("single");
    const code = result.files[0]!.code;
    expect(code).toContain(
      "// Semantic button component: named variants, typed props, and direct JSX.",
    );
    expect(code).toContain("export const buttonRadiusClassNames");
    expect(code).toContain("export const buttonColorClassNames");
    expect(code).toContain("export const buttonSizeClassNames");
    expect(code).toContain("as const");
    expect(code).toContain(
      "export type ButtonColor = keyof typeof buttonColorClassNames",
    );
    expect(code).toContain(
      "export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>",
    );
    expect(code).toContain('import { Spinner } from "./spinner"');
    expect(code).toContain("function ButtonRender(");
    expect(code).toContain("const buttonClassName = clsx(");
    expect(code).toContain(
      'const loadingIndicator = loading ? <Spinner className="icon-xxs" /> : null',
    );
    expect(code).toContain(
      "export const Button = forwardRef<HTMLButtonElement, ButtonProps>(ButtonRender)",
    );
    expect(code).toContain('Button.displayName = "Button"');
    expect(code).toContain("export default Button");
    expect(code).not.toContain("<spinnerT");
    expect(code).not.toMatch(/\bvar\s+[a-z]\b/);
    expectNoRuntimeResidue(result.files);
    parseModule(code);
  });

  test("rewrites consumer imports to semantic producer exports and split barrel path", () => {
    const source = [
      `import { t as DownloadIcon } from "./download-Cf0FyA1Y.js";`,
      `import { n as CollapseIcon, t as ExpandIcon } from "./expand-BVUB1pRY.js";`,
      `export function Toolbar() { return <><DownloadIcon /><CollapseIcon /><ExpandIcon /></>; }`,
    ].join("\n");
    const out = rewriteSemanticImports(source, [
      { source: "./download-Cf0FyA1Y.js", exports: { t: "DownloadIcon" } },
      {
        source: "./expand-BVUB1pRY.js",
        to: "./expand-BVUB1pRY/index.js",
        exports: { n: "CollapseIcon", t: "ExpandIcon" },
      },
    ]);
    expect(out).toContain(
      'import { DownloadIcon } from "./download-Cf0FyA1Y.js"',
    );
    expect(out).toContain(
      'import { CollapseIcon, ExpandIcon } from "./expand-BVUB1pRY/index.js"',
    );
    parseModule(out);
  });

  test("rewrites cryptic consumer aliases and their references", () => {
    const source = [
      `import { t as Ke } from "./download-Cf0FyA1Y.js";`,
      `export function Toolbar() { return <Ke />; }`,
    ].join("\n");
    const out = rewriteSemanticImports(source, [
      { source: "./download-Cf0FyA1Y.js", exports: { t: "DownloadIcon" } },
    ]);

    expect(out).toContain(
      'import { DownloadIcon } from "./download-Cf0FyA1Y.js"',
    );
    expect(out).toContain("return <DownloadIcon />");
    expect(out).not.toContain("Ke");
    parseModule(out);
  });

  test("rewrites generated fallback aliases and their references", () => {
    const source = [
      `import { t as ImportedBinding34 } from "./button-bq66r8jD.js";`,
      `export function Toolbar() { return <ImportedBinding34 />; }`,
    ].join("\n");
    const out = rewriteSemanticImports(source, [
      { source: "./button-bq66r8jD.js", exports: { t: "Button" } },
    ]);

    expect(out).toContain('import { Button } from "./button-bq66r8jD.js"');
    expect(out).toContain("return <Button />");
    expect(out).not.toContain("ImportedBinding34");
    parseModule(out);
  });
});

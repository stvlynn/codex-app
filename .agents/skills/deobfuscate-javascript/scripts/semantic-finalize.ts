import * as fs from "node:fs";
import * as path from "node:path";
import { parseArgs } from "node:util";
import * as parser from "@babel/parser";
import babelTraverse from "@babel/traverse";
import babelGenerator from "@babel/generator";
import * as t from "@babel/types";
import { formatPath } from "./format.ts";

const traverse = ((
  babelTraverse as unknown as { default?: typeof babelTraverse }
).default ?? babelTraverse) as typeof babelTraverse;
const generate = ((
  babelGenerator as unknown as { default?: typeof babelGenerator }
).default ?? babelGenerator) as typeof babelGenerator;

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

export type SemanticRecipe = "auto" | "icon" | "button";
export type AppliedSemanticRecipe = "icon" | "button";
export type SemanticLayout = "single" | "directory";

export type SemanticFile = {
  path: string;
  code: string;
};

export type SemanticFinalizeOptions = {
  recipe?: SemanticRecipe;
  sourcePath?: string;
  basename?: string;
};

export type SemanticFinalizeResult = {
  recipe: AppliedSemanticRecipe;
  layout: SemanticLayout;
  files: SemanticFile[];
  exportMap: Record<string, string>;
};

export type SemanticImportMapping = {
  source: string;
  to?: string;
  exports: Record<string, string>;
};

type SvgComponent = {
  exportedName: string;
  name: string;
  paramName: string | null;
  jsx: t.JSXElement;
};

type ButtonModel = {
  radiusClasses: t.ObjectExpression;
  colorClasses: t.ObjectExpression;
  sizeClasses: t.ObjectExpression;
  baseClassName: string;
};

function parseSource(source: string): t.File {
  return parser.parse(source, {
    sourceType: "module",
    errorRecovery: true,
    allowImportExportEverywhere: true,
    allowReturnOutsideFunction: true,
    allowAwaitOutsideFunction: true,
    allowUndeclaredExports: true,
    plugins: PARSER_PLUGINS,
  });
}

function printNode(node: t.Node): string {
  return generate(node, { jsescOption: { minimal: true } }).code;
}

function inferSourcePath(
  source: string,
  explicit?: string,
): string | undefined {
  if (explicit) return explicit;
  const match = source.match(/^\/\/ Restored from (.+)$/m);
  return match?.[1]?.trim();
}

function inferBasename(
  sourcePath: string | undefined,
  explicit?: string,
): string {
  if (explicit) return explicit;
  if (!sourcePath) return "restored-module";
  return path.basename(sourcePath).replace(/\.[cm]?[jt]sx?$/, "");
}

function resolveExistingPath(maybePath: string | undefined): string | null {
  if (!maybePath) return null;
  if (path.isAbsolute(maybePath))
    return fs.existsSync(maybePath) ? maybePath : null;
  let dir = process.cwd();
  for (let i = 0; i < 8; i++) {
    const candidate = path.join(dir, maybePath);
    if (fs.existsSync(candidate)) return candidate;
    const parent = path.dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }
  return null;
}

function originalExportAliasMap(
  sourcePath: string | undefined,
): Map<string, string> {
  const resolved = resolveExistingPath(sourcePath);
  if (!resolved) return new Map();
  let ast: t.File;
  try {
    ast = parseSource(fs.readFileSync(resolved, "utf-8"));
  } catch {
    return new Map();
  }
  const out = new Map<string, string>();
  traverse(ast, {
    ExportNamedDeclaration(path) {
      if (path.node.source) return;
      for (const spec of path.node.specifiers) {
        if (!t.isExportSpecifier(spec)) continue;
        const local = t.isIdentifier(spec.local)
          ? spec.local.name
          : spec.local.value;
        const exported = t.isIdentifier(spec.exported)
          ? spec.exported.name
          : spec.exported.value;
        out.set(local, exported);
      }
      const declaration = path.node.declaration;
      if (t.isVariableDeclaration(declaration)) {
        for (const declarator of declaration.declarations) {
          if (t.isIdentifier(declarator.id))
            out.set(declarator.id.name, declarator.id.name);
        }
      } else if (
        (t.isFunctionDeclaration(declaration) ||
          t.isClassDeclaration(declaration)) &&
        declaration.id
      ) {
        out.set(declaration.id.name, declaration.id.name);
      }
    },
  });
  return out;
}

function stripHashSuffix(name: string): string {
  return name.replace(/-[A-Za-z0-9_-]{6,12}$/, "");
}

function pascalCase(value: string): string {
  const words = value
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .split(/[^A-Za-z0-9]+/)
    .filter(Boolean);
  return words
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join("");
}

/**
 * Kebab-case for FILE and DIRECTORY names. React component identifiers stay
 * PascalCase (JSX requires it); only the filename is kebab — `DownloadIcon` →
 * `download-icon`, `Button` → `button`, `BottomPanelCtx` → `bottom-panel-ctx`.
 */
export function kebabCase(value: string): string {
  return value
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2") // camel/Pascal boundary
    .replace(/([A-Z]+)([A-Z][a-z])/g, "$1-$2") // ACRONYMWord → ACRONYM-Word
    .replace(/[^A-Za-z0-9]+/g, "-") // separators (incl. $) → dash
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase();
}

function semanticIconName(
  name: string,
  basename: string,
  index: number,
): string {
  if (/^[A-Z][A-Za-z0-9]*Icon$/.test(name)) return name;
  const fromBase = `${pascalCase(stripHashSuffix(basename)) || "Restored"}Icon`;
  return index === 0 ? fromBase : `${fromBase}${index + 1}`;
}

function isSvgElement(node: t.Node | null | undefined): node is t.JSXElement {
  if (!t.isJSXElement(node)) return false;
  const name = node.openingElement.name;
  return t.isJSXIdentifier(name) && name.name === "svg";
}

function returnedJsxFromFunction(
  fn: t.ArrowFunctionExpression | t.FunctionExpression | t.FunctionDeclaration,
): t.JSXElement | null {
  if (t.isArrowFunctionExpression(fn) && isSvgElement(fn.body)) return fn.body;
  const body = fn.body;
  if (!t.isBlockStatement(body)) return null;
  for (const stmt of body.body) {
    if (t.isReturnStatement(stmt) && isSvgElement(stmt.argument))
      return stmt.argument;
  }
  return null;
}

function firstParamName(
  fn: t.ArrowFunctionExpression | t.FunctionExpression | t.FunctionDeclaration,
): string | null {
  const param = fn.params[0];
  return t.isIdentifier(param) ? param.name : null;
}

function collectSvgComponents(ast: t.File, basename: string): SvgComponent[] {
  const components: SvgComponent[] = [];
  traverse(ast, {
    ExportNamedDeclaration(path) {
      const declaration = path.node.declaration;
      if (t.isVariableDeclaration(declaration)) {
        for (const declarator of declaration.declarations) {
          if (!t.isIdentifier(declarator.id)) continue;
          const init = declarator.init;
          if (
            !init ||
            (!t.isArrowFunctionExpression(init) &&
              !t.isFunctionExpression(init))
          ) {
            continue;
          }
          const jsx = returnedJsxFromFunction(init);
          if (!jsx) continue;
          const exportedName = declarator.id.name;
          components.push({
            exportedName,
            name: semanticIconName(exportedName, basename, components.length),
            paramName: firstParamName(init),
            jsx,
          });
        }
        return;
      }
      if (t.isFunctionDeclaration(declaration) && declaration.id) {
        const jsx = returnedJsxFromFunction(declaration);
        if (!jsx) return;
        const exportedName = declaration.id.name;
        components.push({
          exportedName,
          name: semanticIconName(exportedName, basename, components.length),
          paramName: firstParamName(declaration),
          jsx,
        });
      }
    },
  });
  return components;
}

function cloneSvgForProps(component: SvgComponent): t.JSXElement {
  const jsx = t.cloneNode(component.jsx, true);
  const oldName = component.paramName;
  if (!oldName || oldName === "props") return jsx;

  function visit(node: unknown): void {
    if (!node || typeof node !== "object") return;
    if (Array.isArray(node)) {
      for (const item of node) visit(item);
      return;
    }
    const maybeNode = node as t.Node;
    if (t.isIdentifier(maybeNode) && maybeNode.name === oldName) {
      maybeNode.name = "props";
      return;
    }
    const keys = (t.VISITOR_KEYS as Record<string, string[]>)[maybeNode.type];
    if (!keys) return;
    for (const key of keys)
      visit((maybeNode as unknown as Record<string, unknown>)[key]);
  }

  visit(jsx);
  return jsx;
}

function header(sourcePath: string | undefined, description: string): string {
  const lines = sourcePath ? [`// Restored from ${sourcePath}`] : [];
  lines.push(`// ${description}`);
  return `${lines.join("\n")}\n\n`;
}

function indent(code: string, spaces: number): string {
  const pad = " ".repeat(spaces);
  return code
    .split("\n")
    .map((line) => (line.trim() ? pad + line : line))
    .join("\n");
}

function renderIconFunction(component: SvgComponent): string {
  const jsx = printNode(cloneSvgForProps(component));
  return `export function ${component.name}(props: IconProps) {\n  return (\n${indent(jsx, 4)}\n  );\n}\n\nexport default ${component.name};\n`;
}

function applyIconNameOverrides(
  components: SvgComponent[],
  basename: string,
  originalAliases: Map<string, string>,
): void {
  const base = stripHashSuffix(basename);
  if (base === "expand" && components.length === 2) {
    let matchedAlias = false;
    for (const component of components) {
      const alias = originalAliases.get(component.exportedName);
      if (alias === "t") {
        component.name = "ExpandIcon";
        matchedAlias = true;
      }
      if (alias === "n") {
        component.name = "CollapseIcon";
        matchedAlias = true;
      }
    }
    if (!matchedAlias) {
      components[0]!.name = "ExpandIcon";
      components[1]!.name = "CollapseIcon";
    }
  }
}

function finalizeIcons(
  source: string,
  opts: SemanticFinalizeOptions,
): SemanticFinalizeResult {
  const sourcePath = inferSourcePath(source, opts.sourcePath);
  const basename = inferBasename(sourcePath, opts.basename);
  const ast = parseSource(source);
  const components = collectSvgComponents(ast, basename);
  if (components.length === 0) {
    throw new Error("icon recipe expected at least one exported SVG component");
  }

  const originalAliases = originalExportAliasMap(sourcePath);
  applyIconNameOverrides(components, basename, originalAliases);
  const originalExportAliases = [...originalAliases.values()];
  const exportMap: Record<string, string> = {};
  for (const [index, component] of components.entries()) {
    const originalAlias = originalAliases.get(component.exportedName);
    if (originalAlias) exportMap[originalAlias] = component.name;
    else if (originalExportAliases.length === components.length) {
      const aliasByPosition = originalExportAliases[index];
      if (aliasByPosition) exportMap[aliasByPosition] = component.name;
    }
    exportMap[component.exportedName] = component.name;
    exportMap[component.name] = component.name;
  }
  if (stripHashSuffix(basename) === "expand" && components.length === 2) {
    exportMap.t = "ExpandIcon";
    exportMap.n = "CollapseIcon";
  }

  if (components.length === 1) {
    const component = components[0]!;
    const code =
      header(
        sourcePath,
        "Semantic icon module: named React component with JSX return value.",
      ) +
      `import type { SVGProps } from "react";\n\n` +
      `export type IconProps = SVGProps<SVGSVGElement>;\n\n` +
      renderIconFunction(component);
    return {
      recipe: "icon",
      layout: "single",
      files: [{ path: `${kebabCase(component.name)}.tsx`, code }],
      exportMap,
    };
  }

  const dir = kebabCase(stripHashSuffix(basename));
  const files: SemanticFile[] = [
    {
      path: `${dir}/types.ts`,
      code:
        `import type { SVGProps } from "react";\n\n` +
        `export type IconProps = SVGProps<SVGSVGElement>;\n`,
    },
  ];
  for (const component of components) {
    files.push({
      path: `${dir}/${kebabCase(component.name)}.tsx`,
      code:
        header(
          sourcePath,
          "Semantic icon module: named React component with JSX return value.",
        ) +
        `import type { IconProps } from "./types";\n\n` +
        renderIconFunction(component),
    });
  }
  files.push({
    path: `${dir}/index.ts`,
    code:
      `export type { IconProps } from "./types";\n` +
      components
        .map(
          (component) =>
            `export { ${component.name} } from "./${kebabCase(component.name)}";`,
        )
        .join("\n") +
      "\n",
  });
  return { recipe: "icon", layout: "directory", files, exportMap };
}

function objectKeyName(prop: t.ObjectProperty): string | null {
  if (prop.computed) return null;
  if (t.isIdentifier(prop.key)) return prop.key.name;
  if (t.isStringLiteral(prop.key)) return prop.key.value;
  return null;
}

function stringValues(node: t.ObjectExpression): string[] {
  const values: string[] = [];
  for (const prop of node.properties) {
    if (!t.isObjectProperty(prop)) continue;
    if (t.isStringLiteral(prop.value)) values.push(prop.value.value);
    if (
      t.isTemplateLiteral(prop.value) &&
      prop.value.expressions.length === 0
    ) {
      values.push(prop.value.quasis[0]?.value.cooked ?? "");
    }
  }
  return values;
}

function objectKeys(node: t.ObjectExpression): Set<string> {
  const keys = new Set<string>();
  for (const prop of node.properties) {
    if (!t.isObjectProperty(prop)) continue;
    const key = objectKeyName(prop);
    if (key) keys.add(key);
  }
  return keys;
}

function findButtonModel(ast: t.File): ButtonModel {
  const objects: t.ObjectExpression[] = [];
  let baseClassName: string | null = null;

  traverse(ast, {
    VariableDeclarator(path) {
      if (t.isObjectExpression(path.node.init)) objects.push(path.node.init);
    },
    CallExpression(path) {
      if (!t.isIdentifier(path.node.callee, { name: "clsx" })) return;
      const firstArg = path.node.arguments[0];
      if (!t.isStringLiteral(firstArg)) return;
      if (!firstArg.value.includes("border-token-border")) return;
      baseClassName = firstArg.value;
    },
  });

  const radiusClasses = objects.find((node) => {
    const values = stringValues(node);
    return (
      values.length > 0 && values.every((value) => value.includes("rounded"))
    );
  });
  const colorClasses = objects.find((node) => {
    const keys = objectKeys(node);
    return keys.has("danger") && keys.has("primary") && keys.has("secondary");
  });
  const sizeClasses = objects.find((node) => {
    const keys = objectKeys(node);
    const values = stringValues(node);
    return (
      keys.has("composer") &&
      keys.has("toolbar") &&
      values.some((value) => value.includes("px-") || value.includes("h-token"))
    );
  });

  if (!radiusClasses || !colorClasses || !sizeClasses) {
    throw new Error(
      "button recipe could not find radius/color/size class tables",
    );
  }

  return {
    radiusClasses,
    colorClasses,
    sizeClasses,
    baseClassName:
      baseClassName ??
      "border-token-border user-select-none no-drag cursor-interaction flex items-center gap-1 border whitespace-nowrap focus:outline-none disabled:cursor-not-allowed disabled:opacity-40",
  };
}

function renderConstObject(name: string, node: t.ObjectExpression): string {
  return `export const ${name} = ${printNode(node)} as const;\n`;
}

function finalizeButton(
  source: string,
  opts: SemanticFinalizeOptions,
): SemanticFinalizeResult {
  const sourcePath = inferSourcePath(source, opts.sourcePath);
  const model = findButtonModel(parseSource(source));
  const code =
    header(
      sourcePath,
      "Semantic button component: named variants, typed props, and direct JSX.",
    ) +
    `import type { ButtonHTMLAttributes, ForwardedRef } from "react";\n` +
    `import { forwardRef } from "react";\n` +
    `import clsx from "clsx";\n` +
    `import { Spinner } from "./spinner";\n\n` +
    renderConstObject("buttonRadiusClassNames", model.radiusClasses) +
    `\n` +
    renderConstObject("buttonColorClassNames", model.colorClasses) +
    `\n` +
    renderConstObject("buttonSizeClassNames", model.sizeClasses) +
    `\n` +
    `export type ButtonColor = keyof typeof buttonColorClassNames;\n` +
    `export type ButtonSize = keyof typeof buttonSizeClassNames;\n\n` +
    `export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {\n` +
    `  color?: ButtonColor;\n` +
    `  loading?: boolean;\n` +
    `  size?: ButtonSize;\n` +
    `  uniform?: boolean;\n` +
    `}\n\n` +
    `function ButtonRender(\n` +
    `  {\n` +
    `    children,\n` +
    `    className,\n` +
    `    color = "primary",\n` +
    `    disabled = false,\n` +
    `    loading = false,\n` +
    `    size = "default",\n` +
    `    type = "button",\n` +
    `    uniform = false,\n` +
    `    ...buttonProps\n` +
    `  }: ButtonProps,\n` +
    `  ref: ForwardedRef<HTMLButtonElement>,\n` +
    `) {\n` +
    `  const buttonClassName = clsx(\n` +
    `    ${JSON.stringify(model.baseClassName)},\n` +
    `    buttonRadiusClassNames[size],\n` +
    `    buttonColorClassNames[color],\n` +
    `    buttonSizeClassNames[size],\n` +
    `    uniform && "aspect-square items-center justify-center !px-0",\n` +
    `    className,\n` +
    `  );\n` +
    `  const isDisabled = disabled || loading;\n` +
    `  const loadingIndicator = loading ? <Spinner className="icon-xxs" /> : null;\n\n` +
    `  return (\n` +
    `    <button ref={ref} type={type} className={buttonClassName} disabled={isDisabled} {...buttonProps}>\n` +
    `      {loadingIndicator}\n` +
    `      {children}\n` +
    `    </button>\n` +
    `  );\n` +
    `}\n\n` +
    `export const Button = forwardRef<HTMLButtonElement, ButtonProps>(ButtonRender);\n` +
    `Button.displayName = "Button";\n\n` +
    `export default Button;\n`;

  return {
    recipe: "button",
    layout: "single",
    files: [{ path: `${kebabCase("Button")}.tsx`, code }],
    exportMap: { t: "Button", n: "buttonRadiusClassNames" },
  };
}

function detectRecipe(
  source: string,
  opts: SemanticFinalizeOptions,
): AppliedSemanticRecipe {
  if (opts.recipe === "button") return "button";
  if (opts.recipe === "icon") return "icon";
  const basename = inferBasename(
    inferSourcePath(source, opts.sourcePath),
    opts.basename,
  );
  const ast = parseSource(source);
  if (collectSvgComponents(ast, basename).length > 0) return "icon";
  if (/function\s+Button|export\s+function\s+Button|Button\s*=/.test(source))
    return "button";
  throw new Error("auto recipe could not classify module as icon or button");
}

export function semanticFinalize(
  source: string,
  opts: SemanticFinalizeOptions = {},
): SemanticFinalizeResult {
  const recipe = detectRecipe(source, opts);
  if (recipe === "icon") return finalizeIcons(source, opts);
  return finalizeButton(source, opts);
}

function specifierName(node: t.ImportSpecifier["imported"]): string {
  return t.isIdentifier(node) ? node.name : node.value;
}

function sourceMatches(actual: string, expected: string): boolean {
  if (actual === expected) return true;
  // Bundlers often drop the extension in import sources; normalize both
  // sides so `./foo.js` matches `./foo` and vice-versa.
  const normalize = (s: string) =>
    s.replace(/\.[mc]?[jt]sx?$/i, "").replace(/^\.\//, "");
  return normalize(actual) === normalize(expected);
}

function isCrypticAlias(name: string): boolean {
  return /^_?[A-Za-z]{1,2}$/.test(name);
}

function isGeneratedAlias(name: string): boolean {
  return /^ImportedBinding\d+$/.test(name);
}

export function rewriteSemanticImports(
  source: string,
  mappings: SemanticImportMapping[],
): string {
  const ast = parseSource(source);
  traverse(ast, {
    ImportDeclaration(path) {
      const sourceValue = path.node.source.value;
      const mapping = mappings.find((item) =>
        sourceMatches(sourceValue, item.source),
      );
      if (!mapping) return;
      if (mapping.to) path.node.source = t.stringLiteral(mapping.to);
      for (const spec of path.node.specifiers) {
        if (!t.isImportSpecifier(spec)) continue;
        const importedName = specifierName(spec.imported);
        const replacement = mapping.exports[importedName];
        if (!replacement) continue;
        const oldLocalName = spec.local.name;
        spec.imported = t.identifier(replacement);
        if (
          oldLocalName === importedName ||
          oldLocalName === replacement ||
          isCrypticAlias(oldLocalName) ||
          isGeneratedAlias(oldLocalName)
        ) {
          if (
            oldLocalName !== replacement &&
            !path.scope.hasBinding(replacement)
          ) {
            path.scope.rename(oldLocalName, replacement);
          }
          spec.local = t.identifier(replacement);
        }
      }
    },
  });
  return printNode(ast);
}

async function readInput(inputPath: string): Promise<string> {
  if (inputPath === "-") return await Bun.stdin.text();
  return fs.readFileSync(inputPath, "utf-8");
}

function outputPathFor(
  outPath: string,
  file: SemanticFile,
  result: SemanticFinalizeResult,
): string {
  if (result.layout === "single" && /\.[cm]?[jt]sx?$/.test(outPath))
    return outPath;
  return path.join(outPath, file.path);
}

function writeResult(
  outPath: string,
  result: SemanticFinalizeResult,
): string[] {
  const written: string[] = [];
  for (const file of result.files) {
    const targetPath = outputPathFor(outPath, file, result);
    fs.mkdirSync(path.dirname(targetPath), { recursive: true });
    fs.writeFileSync(targetPath, file.code);
    written.push(targetPath);
  }
  return written;
}

function listSourceFiles(target: string): string[] {
  const stat = fs.statSync(target);
  if (stat.isFile()) return [target];
  const out: string[] = [];
  for (const entry of fs.readdirSync(target, { withFileTypes: true })) {
    const p = path.join(target, entry.name);
    if (entry.isDirectory()) out.push(...listSourceFiles(p));
    else if (/\.[cm]?[jt]sx?$/.test(entry.name)) out.push(p);
  }
  return out;
}

function rewriteImportTarget(
  target: string,
  mappings: SemanticImportMapping[],
  outDir?: string,
): string[] {
  const files = listSourceFiles(target);
  const written: string[] = [];
  for (const file of files) {
    const code = fs.readFileSync(file, "utf-8");
    const next = rewriteSemanticImports(code, mappings);
    const outPath = outDir
      ? path.join(outDir, path.relative(target, file))
      : file;
    fs.mkdirSync(path.dirname(outPath), { recursive: true });
    fs.writeFileSync(outPath, next);
    written.push(outPath);
  }
  return written;
}

const USAGE =
  "Usage: bun scripts/semantic-finalize.ts <input.tsx|-> [--out file-or-dir] " +
  "[--recipe auto|icon|button] [--source original.js] [--basename name] [--format]\n" +
  "   or: bun scripts/semantic-finalize.ts --rewrite-imports file-or-dir --import-map map.json [--out dir]";

async function main(): Promise<void> {
  let parsed;
  try {
    parsed = parseArgs({
      args: process.argv.slice(2),
      options: {
        out: { type: "string", short: "o" },
        recipe: { type: "string", default: "auto" },
        source: { type: "string" },
        basename: { type: "string" },
        format: { type: "boolean", default: false },
        "rewrite-imports": { type: "string" },
        "import-map": { type: "string" },
      },
      allowPositionals: true,
    });
  } catch (err) {
    console.error(USAGE);
    console.error((err as Error).message);
    process.exit(64);
  }

  const { values, positionals } = parsed;
  if (values["rewrite-imports"]) {
    if (!values["import-map"]) {
      console.error(USAGE);
      console.error("--rewrite-imports requires --import-map");
      process.exit(64);
    }
    const mappings = JSON.parse(
      fs.readFileSync(values["import-map"], "utf-8"),
    ) as SemanticImportMapping[];
    const written = rewriteImportTarget(
      values["rewrite-imports"],
      mappings,
      values.out,
    );
    for (const file of written) console.error(`rewrote imports: ${file}`);
    return;
  }

  if (positionals.length === 0) {
    console.error(USAGE);
    process.exit(64);
  }
  if (
    values.recipe !== "auto" &&
    values.recipe !== "icon" &&
    values.recipe !== "button"
  ) {
    console.error(USAGE);
    console.error(`unknown recipe: ${values.recipe}`);
    process.exit(64);
  }

  const source = await readInput(positionals[0]!);
  const result = semanticFinalize(source, {
    recipe: values.recipe,
    sourcePath: values.source,
    basename: values.basename,
  });

  if (values.out) {
    const written = writeResult(values.out, result);
    if (values.format) {
      const formatTarget =
        result.layout === "directory" ? values.out : written[0]!;
      const formatted = formatPath(formatTarget);
      if (!formatted.ok) {
        if (formatted.stderr) process.stderr.write(formatted.stderr);
        process.exit(formatted.code);
      }
    }
    for (const file of written) console.error(`semantic-finalize: ${file}`);
    return;
  }

  if (result.files.length === 1) {
    process.stdout.write(result.files[0]!.code);
  } else {
    process.stdout.write(JSON.stringify(result, null, 2) + "\n");
  }
}

if (import.meta.main) {
  await main();
}

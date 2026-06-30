#!/usr/bin/env bun
import * as fs from "node:fs";
import * as path from "node:path";
import { execSync } from "node:child_process";
import * as parser from "@babel/parser";
import babelTraverse, { type NodePath } from "@babel/traverse";
import babelGenerator from "@babel/generator";
import * as t from "@babel/types";
import { convertJsxRuntime } from "../infrastructure/jsx-runtime.ts";
import { splitBundle, type SplitPlan, type SplitPlanReExport } from "../infrastructure/split-bundle.ts";

const traverse = ((babelTraverse as unknown as { default?: typeof babelTraverse }).default ?? babelTraverse) as typeof babelTraverse;
const generate = ((babelGenerator as unknown as { default?: typeof babelGenerator }).default ?? babelGenerator) as typeof babelGenerator;
const RESTORED_ROOT = "src";

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

const SRC_ROOT = "./src";
const MANIFEST_PATH = "./.deobfuscate-javascript/_full/manifest.json";
const IMPORT_MAP_PATH = "./src/IMPORT_MAP.json";

const ALIASES: Record<string, string> = {
  "chunk-Cq_f4orQ": "esbuildRuntime",
  "Combination-BEpM7Dzg": "radixCombination",
  "presentation-iV9gDfl9": "presentationProtobuf",
  "spreadsheet-ByOidEXS": "protobufjs",
  "workbook-DDjets34": "workbook",
  "document-BvkTVHtx": "document",
  "remote-text-edit-session-DjCWscO4": "remoteTextEditSession",
  "feature-catalog-BEkS6jMH": "featureCatalog",
  "PopcornPageNumberNavigation-VRpKM1l8": "pageNumberNavigation",
  "Tableau10-BYZHCNVA": "tableau10",
  "ordinal-jw163_Ud": "ordinalScale",
  "dist-hw5CqF55": "dist",
  "core.esm-DUuOY93A": "dndCore",
  "modifiers.esm-BFjb-QXg": "dndModifiers",
  "floating-ui.react-dom-DjnbnSLo": "floatingUi",
  "address-utils-D9uhGifl": "addressUtils",
  "popcorn-electron-surface-style-jyyIi7EC": "surfaceStyle",
  "defaultLocale-gPb_B8uX": "d3FormatDefaultLocale",
};

const SIDE_EFFECT_TARGETS = new Set([
  "react-dom-D83Ueduu",
  "spreadsheet-ByOidEXS",
]);

const DEFAULT_TARGETS = new Set(["clsx-DF17mjDp"]);

const NPM_PACKAGES: Record<string, string> = {
  "react-dom-D83Ueduu": "react-dom",
  "clsx-DF17mjDp": "clsx",
  "core.esm-DUuOY93A": "@dnd-kit/core",
  "floating-ui.react-dom-DjnbnSLo": "@floating-ui/react-dom",
};

const JSX_RUNTIME_TARGETS = new Set(["jsx-runtime-DXKlqYIQ"]);

type ImportRewrite = {
  source: string;
  target: string;
  newSource: string;
  mode: "namespace" | "default" | "side-effect";
  alias?: string;
};

type ChunkConfig = {
  basename: string;
  semanticDir: string;
  publicExport: string;
  prefix: string;
  shortPrefix: string;
  functionName?: string; // if different from publicExport
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

function printAst(ast: t.Node): string {
  return generate(ast, { jsescOption: { minimal: true } }).code;
}

function normalizeSource(source: string): string {
  return source.replace(/^\.\//, "").replace(/\.js$/, "");
}

function loadJson<T>(filePath: string): T {
  return JSON.parse(fs.readFileSync(filePath, "utf-8")) as T;
}

function getManifestChunkImports(basename: string): Array<{ source: string; target: string; kind: string; npmPackage?: string; vendorSpecifier?: string }> {
  const out = execSync(
    `jq -r '.files["${basename}"].imports[]? | "\\(.source)\\t\\(.target)\\t\\(.kind)\\t\\(.npmPackage // "")\\t\\(.vendorSpecifier // "")"' "${MANIFEST_PATH}"`,
    { encoding: "utf-8", maxBuffer: 10 * 1024 * 1024 },
  );
  return out
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [source, target, kind, npmPackage, vendorSpecifier] = line.split("\t");
      return { source: source!, target: target!, kind: kind!, npmPackage, vendorSpecifier };
    });
}

function getManifestExports(basename: string): string[] {
  const out = execSync(
    `jq -r '.files["${basename}"].exports[]? | "\\(.exported)\\t\\(.local)"' "${MANIFEST_PATH}"`,
    { encoding: "utf-8", maxBuffer: 10 * 1024 * 1024 },
  );
  return out
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => line.split("\t")[0]!);
}

function computeNewSource(target: string, semanticDir: string): string | null {
  if (JSX_RUNTIME_TARGETS.has(target)) return null; // handled separately
  if (NPM_PACKAGES[target]) return NPM_PACKAGES[target]!;
  const importMap = loadJson<any>(IMPORT_MAP_PATH);
  const producer = importMap.chunks?.[target] ?? importMap[target];
  if (producer?.path) {
    const rel = path.posix.relative(semanticDir, producer.path).replace(/\.[cm]?[jt]sx?$/i, "");
    return rel.startsWith(".") ? rel : `./${rel}`;
  }
  return null;
}

function buildRewrites(basename: string, semanticDir: string): Map<string, ImportRewrite> {
  const imports = getManifestChunkImports(basename);
  const rewrites = new Map<string, ImportRewrite>();
  for (const imp of imports) {
    const norm = normalizeSource(imp.source);
    const newSource = computeNewSource(imp.target, semanticDir);
    if (!newSource) continue;
    if (SIDE_EFFECT_TARGETS.has(imp.target)) {
      rewrites.set(norm, { source: imp.source, target: imp.target, newSource, mode: "side-effect" });
    } else if (DEFAULT_TARGETS.has(imp.target)) {
      rewrites.set(norm, { source: imp.source, target: imp.target, newSource, mode: "default" });
    } else {
      rewrites.set(norm, {
        source: imp.source,
        target: imp.target,
        newSource,
        mode: "namespace",
        alias: ALIASES[imp.target] ?? camelCase(imp.target.replace(/-[A-Za-z0-9]+$/, "")),
      });
    }
  }
  return rewrites;
}

function camelCase(input: string): string {
  return input
    .replace(/[^a-zA-Z0-9]+(.)/g, (_, c) => (c ? c.toUpperCase() : ""))
    .replace(/^[^a-zA-Z]+/, "")
    .replace(/^[A-Z]/, (c) => c.toLowerCase());
}

function jsxRuntimeLocalName(ast: t.File): string | null {
  let local: string | null = null;
  traverse(ast, {
    ImportDeclaration(path) {
      const src = path.node.source.value;
      if (JSX_RUNTIME_TARGETS.has(normalizeSource(src))) {
        for (const spec of path.node.specifiers) {
          if (t.isImportSpecifier(spec) && t.isIdentifier(spec.imported) && spec.imported.name === "t") {
            local = spec.local.name;
          }
        }
      }
    },
  });
  return local;
}

function rewriteImports(ast: t.File, rewrites: Map<string, ImportRewrite>): void {
  const replacements: Array<{ path: NodePath<t.ImportDeclaration>; rewrite: ImportRewrite; specifiers: t.ImportDeclaration["specifiers"] }> = [];
  traverse(ast, {
    ImportDeclaration(path) {
      const src = path.node.source.value;
      const norm = normalizeSource(src);
      const rewrite = rewrites.get(norm);
      if (!rewrite) return;
      replacements.push({ path, rewrite, specifiers: path.node.specifiers });
    },
  });

  // Build namespace replacements and identifier mapping
  const identifierMap = new Map<string, { alias: string; imported: string }>();
  for (const { path, rewrite, specifiers } of replacements) {
    if (rewrite.mode === "side-effect") {
      path.node.source.value = rewrite.newSource;
      path.node.specifiers = [];
      continue;
    }
    if (rewrite.mode === "default") {
      path.node.source.value = rewrite.newSource;
      // keep default specifier as-is
      continue;
    }
    // namespace mode: collect imported->local
    for (const spec of specifiers) {
      if (t.isImportSpecifier(spec) && t.isIdentifier(spec.imported)) {
        identifierMap.set(spec.local.name, { alias: rewrite.alias!, imported: spec.imported.name });
      }
    }
    path.remove();
  }

  if (identifierMap.size === 0) return;

  // Replace identifier references with member expressions
  traverse(ast, {
    Identifier(path) {
      if (!path.isReferencedIdentifier()) return;
      const replacement = identifierMap.get(path.node.name);
      if (!replacement) return;
      // Don't replace the imported binding declarations themselves (already removed)
      if (t.isImportSpecifier(path.parent) || t.isImportDefaultSpecifier(path.parent) || t.isImportNamespaceSpecifier(path.parent)) return;
      path.replaceWith(t.memberExpression(t.identifier(replacement.alias), t.identifier(replacement.imported)));
      path.skip();
    },
  });

  // Insert namespace imports at top
  const usedAliases = new Set<string>();
  traverse(ast, {
    Identifier(path) {
      const info = identifierMap.get(path.node.name);
      if (info) usedAliases.add(info.alias);
    },
    MemberExpression(path) {
      if (t.isIdentifier(path.node.object)) usedAliases.add(path.node.object.name);
    },
  });

  const newImports: t.ImportDeclaration[] = [];
  for (const { rewrite } of replacements) {
    if (rewrite.mode !== "namespace") continue;
    if (!usedAliases.has(rewrite.alias!)) continue;
    newImports.push(t.importDeclaration([t.importNamespaceSpecifier(t.identifier(rewrite.alias!))], t.stringLiteral(rewrite.newSource)));
  }
  ast.program.body.unshift(...newImports);
}

function convertJsxRuntimeCalls(source: string): { code: string; factoryLocal: string | null } {
  // Preprocess: point jsx-runtime import to bare specifier
  const ast = parseSource(source);
  let factoryLocal: string | null = null;
  traverse(ast, {
    ImportDeclaration(path) {
      const norm = normalizeSource(path.node.source.value);
      if (JSX_RUNTIME_TARGETS.has(norm)) {
        path.node.source.value = "react/jsx-runtime";
        for (const spec of path.node.specifiers) {
          if (t.isImportSpecifier(spec) && t.isIdentifier(spec.imported) && spec.imported.name === "t") {
            factoryLocal = spec.local.name;
          }
        }
      }
    },
  });
  const preprocessed = printAst(ast);
  const result = convertJsxRuntime(preprocessed);
  return { code: result.code, factoryLocal };
}

function removeUnusedRuntimeFactory(ast: t.File, factoryLocal: string | null): void {
  traverse(ast, {
    Program(programPath) {
      programPath.scope.crawl();
    },
  });
  const toRemove: NodePath<t.Node>[] = [];
  traverse(ast, {
    VariableDeclaration(path) {
      if (!t.isProgram(path.parent) && !t.isExportNamedDeclaration(path.parent)) return;
      for (const decl of path.node.declarations) {
        if (!t.isIdentifier(decl.id)) continue;
        const name = decl.id.name;
        if (name !== "$" && name !== factoryLocal) continue;
        const binding = path.scope.getBinding(name);
        if (binding && !binding.referenced) {
          toRemove.push(path);
        }
      }
    },
  });
  for (const p of toRemove) p.remove();
}

function renameMechanicalIdentifiers(source: string, prefix: string, shortPrefix: string): string {
  const ast = parseSource(source);
  const paramRe = new RegExp(`^${prefix}Param(\\d+)$`);
  const valueRe = new RegExp(`^${prefix}Value(\\d+)$`);
  const helperRe = new RegExp(`^${prefix}Helper(\\d+)$`);
  const importRe = new RegExp(`^${prefix}Import(\\d+)$`);

  traverse(ast, {
    Identifier(path) {
      const name = path.node.name;
      let newName: string | null = null;
      const paramMatch = name.match(paramRe);
      if (paramMatch) newName = `${shortPrefix}Input${paramMatch[1]}`;
      else {
        const valueMatch = name.match(valueRe);
        if (valueMatch) newName = `${shortPrefix}State${valueMatch[1]}`;
        else {
          const helperMatch = name.match(helperRe);
          if (helperMatch) newName = `${shortPrefix}Helper${helperMatch[1]}`;
          else {
            const importMatch = name.match(importRe);
            if (importMatch) newName = `${shortPrefix}Import${importMatch[1]}`;
          }
        }
      }
      if (!newName) return;
      // Avoid renaming the imported binding declarations (already rewritten)
      if (t.isImportSpecifier(path.parent) || t.isImportDefaultSpecifier(path.parent) || t.isImportNamespaceSpecifier(path.parent)) return;
      path.scope.rename(name, newName);
    },
  });
  return printAst(ast);
}

function injectComponentProps(source: string, componentName: string): string {
  const ast = parseSource(source);
  let injected = false;
  traverse(ast, {
    FunctionDeclaration(path) {
      if (injected) return;
      if (path.node.id?.name !== componentName) return;
      if (path.parentPath?.node.type !== "ExportNamedDeclaration") return;
      const firstParam = path.node.params[0];
      if (!firstParam || !t.isObjectPattern(firstParam)) return;
      const propsInterfaceName = `${componentName}Props`;
      const propsMembers: t.TSPropertySignature[] = [];
      for (const prop of firstParam.properties) {
        if (t.isRestElement(prop)) continue;
        if (!t.isObjectProperty(prop)) continue;
        let propName: string | null = null;
        if (t.isIdentifier(prop.key) && !prop.computed) propName = prop.key.name;
        else if (t.isStringLiteral(prop.key)) propName = prop.key.value;
        if (!propName) continue;
        let optional = false;
        let type: t.TSType = t.tsUnknownKeyword();
        if (t.isAssignmentPattern(prop.value)) {
          optional = true;
          const d = prop.value.right;
          if (t.isStringLiteral(d)) type = t.tsStringKeyword();
          else if (t.isNumericLiteral(d)) type = t.tsNumberKeyword();
          else if (t.isBooleanLiteral(d)) type = t.tsBooleanKeyword();
          else if (t.isArrayExpression(d)) type = t.tsArrayType(t.tsUnknownKeyword());
        }
        const sig = t.tsPropertySignature(t.identifier(propName), t.tsTypeAnnotation(type));
        sig.optional = optional;
        propsMembers.push(sig);
      }
      const interfaceDecl = t.tsInterfaceDeclaration(t.identifier(propsInterfaceName), null, null, t.tsInterfaceBody(propsMembers));
      // Insert interface before the function declaration
      const exportDecl = path.parentPath as NodePath<t.ExportNamedDeclaration>;
      exportDecl.insertBefore(interfaceDecl);
      // Annotate the destructured param
      firstParam.typeAnnotation = t.tsTypeAnnotation(t.tsTypeReference(t.identifier(propsInterfaceName)));
      injected = true;
    },
  });
  return printAst(ast);
}

function renameWorkbookExport(source: string): string {
  // Rename internal PopcornElectronWorkbookPanelIcon -> PopcornElectronWorkbookPanel
  return source.replace(/\bPopcornElectronWorkbookPanelIcon\b/g, "PopcornElectronWorkbookPanel");
}

function leadingCommentHeader(source: string): string {
  const lines: string[] = [];
  for (const line of source.split(/\r?\n/)) {
    if(/^\s*$/.test(line)) {
      if (lines.length === 0) continue;
      break;
    }
    if (!line.trimStart().startsWith("//")) break;
    lines.push(line);
  }
  return lines.length > 0 ? `${lines.join("\n")}\n` : "";
}

function customSplitPlan(source: string, publicExport: string): SplitPlan {
  const ast = parseSource(source);
  const files: SplitPlan["sections"][number]["files"] = [];
  const reExports: SplitPlanReExport[] = [];

  let order = 0;
  for (const stmt of ast.program.body) {
    if (t.isImportDeclaration(stmt)) continue;
    const names = statementBindingNames(stmt);
    if (names.length === 0) continue;
    const isPublic = statementExportsName(stmt, publicExport);
    const fileName = `${safeFileName(names[0]!)}.tsx`;
    files.push({
      name: fileName,
      bindings: names,
      exports: isPublic ? names : undefined,
    });
    if (isPublic) {
      reExports.push({ from: `./${fileName.replace(/\.[cm]?[jt]sx?$/i, "")}`, names });
    }
    order++;
  }

  return {
    outDir: "candidate",
    extension: ".tsx",
    sections: [{ files }],
    barrel: {
      name: "index.ts",
      reExports,
    },
  };
}

function statementBindingNames(stmt: t.Statement): string[] {
  const node = t.isExportNamedDeclaration(stmt) && stmt.declaration ? stmt.declaration : stmt;
  if (t.isVariableDeclaration(node)) {
    return node.declarations.flatMap((d) => bindingNameFromPattern(d.id));
  }
  if ((t.isFunctionDeclaration(node) || t.isClassDeclaration(node)) && node.id) return [node.id.name];
  if (t.isTSInterfaceDeclaration(node) && node.id) return [node.id.name];
  if (t.isTSTypeAliasDeclaration(node) && node.id) return [node.id.name];
  if (t.isTSEnumDeclaration(node) && node.id) return [node.id.name];
  return [];
}

function statementExportsName(stmt: t.Statement, name: string): boolean {
  if (!t.isExportNamedDeclaration(stmt)) return false;
  if (stmt.declaration) {
    const decl = stmt.declaration;
    if (t.isVariableDeclaration(decl)) {
      return decl.declarations.some((d) => t.isIdentifier(d.id) && d.id.name === name);
    }
    if ((t.isFunctionDeclaration(decl) || t.isClassDeclaration(decl)) && decl.id) return decl.id.name === name;
  }
  return stmt.specifiers.some((s) => t.isExportSpecifier(s) && t.isIdentifier(s.exported) && s.exported.name === name);
}

function bindingNameFromPattern(pattern: t.LVal | t.PatternLike): string[] {
  if (t.isIdentifier(pattern)) return [pattern.name];
  if (t.isObjectPattern(pattern)) {
    return pattern.properties.flatMap((prop) => {
      if (t.isObjectProperty(prop)) return bindingNameFromPattern(prop.value as t.PatternLike);
      if (t.isRestElement(prop)) return bindingNameFromPattern(prop.argument as t.PatternLike);
      return [];
    });
  }
  if (t.isArrayPattern(pattern)) {
    return pattern.elements.flatMap((el) => (el ? bindingNameFromPattern(el as t.PatternLike) : []));
  }
  if (t.isAssignmentPattern(pattern)) return bindingNameFromPattern(pattern.left as t.PatternLike);
  if (t.isRestElement(pattern)) return bindingNameFromPattern(pattern.argument as t.PatternLike);
  return [];
}

function safeFileName(name: string): string {
  return name
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase() || "binding";
}

async function buildChunk(config: ChunkConfig): Promise<void> {
  const workspace = path.join(RESTORED_ROOT, ".deobfuscate-javascript", "_full", "files", config.basename);
  const inputPath = path.join(workspace, "auto-polished.tsx");
  const candidateDir = path.join(workspace, "candidate");
  let source = fs.readFileSync(inputPath, "utf-8");
  const header = leadingCommentHeader(source);

  // 1. rewrite imports to namespaces / bare / boundary / local
  const rewrites = buildRewrites(config.basename, config.semanticDir);
  const ast0 = parseSource(source);
  rewriteImports(ast0, rewrites);
  source = printAst(ast0);

  // 2. convert JSX runtime calls
  const { code: jsxCode, factoryLocal } = convertJsxRuntimeCalls(source);
  source = jsxCode;

  // 3. remove unused runtime factory variable
  const ast1 = parseSource(source);
  removeUnusedRuntimeFactory(ast1, factoryLocal);
  source = printAst(ast1);

  // 4. rename mechanical identifiers
  source = renameMechanicalIdentifiers(source, config.prefix, config.shortPrefix);

  // 5. rename workbook export if needed
  if (config.functionName && config.functionName !== config.publicExport) {
    source = renameWorkbookExport(source);
  }

  // 6. inject props interface and type component param
  source = injectComponentProps(source, config.publicExport);

  // Ensure provenance header
  if (!source.trimStart().startsWith("// Restored from ")) {
    const sourceAsset = `ref/webview/assets/${config.basename}.js`;
    source = `${header}// Restored from ${sourceAsset}\n// ${config.basename} chunk restored from the Codex webview bundle.\n${source}`;
  }

  // 7. split into directory
  const plan = customSplitPlan(source, config.publicExport);
  const result = splitBundle(source, plan);

  fs.rmSync(candidateDir, { recursive: true, force: true });
  for (const file of result.files) {
    const outPath = path.join(candidateDir, file.path);
    fs.mkdirSync(path.dirname(outPath), { recursive: true });
    fs.writeFileSync(outPath, file.code.endsWith("\n") ? file.code : `${file.code}\n`);
  }
  console.log(`${config.basename}: wrote ${result.files.length} file(s) to ${candidateDir}`);
}

async function main(): Promise<void> {
  const configs: ChunkConfig[] = [
    {
      basename: "PopcornElectronPresentationPanel-DyLT7PAB",
      semanticDir: "app/popcorn-electron-presentation-panel",
      publicExport: "PopcornElectronPresentationPanel",
      prefix: "popcornElectronPresentationPanel",
      shortPrefix: "presentationPanel",
    },
    {
      basename: "PopcornElectronDocumentPanel-LEVj37uj",
      semanticDir: "app/popcorn-electron-document-panel",
      publicExport: "PopcornElectronDocumentPanel",
      prefix: "popcornElectronDocumentPanel",
      shortPrefix: "documentPanel",
    },
    {
      basename: "PopcornElectronWorkbookPanel-Drl2YYRf",
      semanticDir: "app/popcorn-electron-workbook-panel",
      publicExport: "PopcornElectronWorkbookPanel",
      prefix: "popcornElectronWorkbookPanel",
      shortPrefix: "workbookPanel",
      functionName: "PopcornElectronWorkbookPanel",
    },
  ];

  for (const config of configs) {
    await buildChunk(config);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

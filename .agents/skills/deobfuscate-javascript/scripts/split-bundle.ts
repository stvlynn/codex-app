import * as fs from "node:fs";
import * as path from "node:path";
import { parseArgs } from "node:util";
import * as parser from "@babel/parser";
import babelTraverse, { type NodePath } from "@babel/traverse";
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

export type SplitPlanFile = {
  name: string;
  exports?: string[];
  exportAliases?: Array<{ local: string; exported: string }>;
  bindings: string[];
};

export type SplitPlanSection = {
  dir?: string;
  files: SplitPlanFile[];
};

export type SplitPlanRegistry = {
  name: string;
  entries?: Array<{ key?: string; name: string; from?: string }>;
};

export type SplitPlanReExport = {
  from: string;
  names: string[];
};

export type SplitPlan = {
  outDir?: string;
  importRoot?: string;
  extension?: string;
  sections: SplitPlanSection[];
  shared?: { name: string; bindings: string[]; exports?: string[] };
  barrel?: {
    name?: string;
    reExports?: SplitPlanReExport[];
    registry?: SplitPlanRegistry;
  };
};

export type SplitOutputFile = {
  path: string;
  code: string;
};

export type SplitBundleResult = {
  files: SplitOutputFile[];
};

type OwnedStatement = {
  order: number;
  names: string[];
  statement: t.Statement;
};

type TargetFile = {
  relativePath: string;
  bindings: string[];
  exports: string[];
  exportAliases: Array<{ local: string; exported: string }>;
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

function stripLeadingComments<T extends t.Node>(node: T): T {
  node.leadingComments = undefined;
  return node;
}

function leadingCommentHeader(source: string): string {
  const lines: string[] = [];
  for (const line of source.split(/\r?\n/)) {
    if (/^\s*$/.test(line)) {
      if (lines.length === 0) continue;
      break;
    }
    if (!line.trimStart().startsWith("//")) break;
    lines.push(line);
  }
  return lines.length > 0 ? `${lines.join("\n")}\n` : "";
}

function bindingNameFromPattern(pattern: t.LVal | t.PatternLike): string[] {
  if (t.isIdentifier(pattern)) return [pattern.name];
  if (t.isObjectPattern(pattern)) {
    return pattern.properties.flatMap((prop) => {
      if (t.isObjectProperty(prop))
        return bindingNameFromPattern(prop.value as t.PatternLike);
      if (t.isRestElement(prop))
        return bindingNameFromPattern(prop.argument as t.PatternLike);
      return [];
    });
  }
  if (t.isArrayPattern(pattern)) {
    return pattern.elements.flatMap((element) =>
      element ? bindingNameFromPattern(element as t.PatternLike) : [],
    );
  }
  if (t.isAssignmentPattern(pattern)) {
    return bindingNameFromPattern(pattern.left as t.PatternLike);
  }
  if (t.isRestElement(pattern)) {
    return bindingNameFromPattern(pattern.argument as t.PatternLike);
  }
  return [];
}

function statementBindingNames(statement: t.Statement): string[] {
  const node =
    t.isExportNamedDeclaration(statement) && statement.declaration
      ? statement.declaration
      : statement;
  if (t.isVariableDeclaration(node)) {
    return node.declarations.flatMap((declarator) =>
      bindingNameFromPattern(declarator.id),
    );
  }
  if (
    (t.isFunctionDeclaration(node) || t.isClassDeclaration(node)) &&
    node.id
  ) {
    return [node.id.name];
  }
  if (t.isTSTypeAliasDeclaration(node) || t.isTSInterfaceDeclaration(node)) {
    return [node.id.name];
  }
  if (t.isTSEnumDeclaration(node)) {
    return [node.id.name];
  }
  return [];
}

function collectOwnedStatements(ast: t.File): OwnedStatement[] {
  const owned: OwnedStatement[] = [];
  ast.program.body.forEach((statement, order) => {
    if (t.isImportDeclaration(statement)) return;
    if (t.isExportNamedDeclaration(statement) && !statement.declaration) return;
    if (t.isExportAllDeclaration(statement)) return;
    if (t.isExportDefaultDeclaration(statement)) return;
    const names = statementBindingNames(statement);
    if (names.length === 0) return;
    owned.push({ order, names, statement });
  });
  return owned;
}

function collectImportDeclarations(ast: t.File): t.ImportDeclaration[] {
  return ast.program.body.filter(
    (statement): statement is t.ImportDeclaration =>
      t.isImportDeclaration(statement),
  );
}

function normalizeRelativeImport(filePath: string): string {
  const withoutExt = filePath.replace(/\.[cm]?[jt]sx?$/i, "");
  return withoutExt.startsWith(".") ? withoutExt : `./${withoutExt}`;
}

function relativeImport(fromFile: string, toFile: string): string {
  const fromDir = path.posix.dirname(fromFile);
  const rel = path.posix
    .relative(fromDir, toFile)
    .replace(/\.[cm]?[jt]sx?$/i, "");
  return rel.startsWith(".") ? rel : `./${rel}`;
}

function targetFilesFromPlan(plan: SplitPlan): TargetFile[] {
  const targets: TargetFile[] = [];
  if (plan.shared) {
    targets.push({
      relativePath: plan.shared.name,
      bindings: plan.shared.bindings,
      exports: plan.shared.exports ?? plan.shared.bindings,
      exportAliases: [],
    });
  }
  for (const section of plan.sections) {
    for (const file of section.files) {
      targets.push({
        relativePath: section.dir
          ? path.posix.join(section.dir, file.name)
          : file.name,
        bindings: file.bindings,
        exports: file.exports ?? [],
        exportAliases: file.exportAliases ?? [],
      });
    }
  }
  return targets;
}

function splitVariableDeclaration(
  declaration: t.VariableDeclaration,
  selected: Set<string>,
  exportNames: Set<string>,
): t.Statement[] {
  const statements: t.Statement[] = [];
  for (const declarator of declaration.declarations) {
    const declaratorNames = bindingNameFromPattern(declarator.id);
    if (!declaratorNames.some((name) => selected.has(name))) continue;
    const clonedDecl = t.variableDeclaration(declaration.kind, [
      t.cloneNode(declarator, true),
    ]);
    if (declaratorNames.some((name) => exportNames.has(name))) {
      statements.push(t.exportNamedDeclaration(clonedDecl, []));
    } else {
      statements.push(clonedDecl);
    }
  }
  return statements;
}

function materializeStatement(
  owned: OwnedStatement,
  selected: Set<string>,
  exportNames: Set<string>,
): t.Statement[] {
  const raw =
    t.isExportNamedDeclaration(owned.statement) && owned.statement.declaration
      ? owned.statement.declaration
      : owned.statement;
  if (t.isVariableDeclaration(raw)) {
    return splitVariableDeclaration(raw, selected, exportNames);
  }
  if (t.isFunctionDeclaration(raw) || t.isClassDeclaration(raw)) {
    const name = raw.id?.name;
    if (!name || !selected.has(name)) return [];
    const clone = t.cloneNode(raw, true);
    return exportNames.has(name)
      ? [t.exportNamedDeclaration(clone, [])]
      : [clone];
  }
  if (
    t.isTSTypeAliasDeclaration(raw) ||
    t.isTSInterfaceDeclaration(raw) ||
    t.isTSEnumDeclaration(raw)
  ) {
    const name = raw.id?.name;
    if (!name || !selected.has(name)) return [];
    const clone = t.cloneNode(raw, true);
    return exportNames.has(name)
      ? [t.exportNamedDeclaration(clone, [])]
      : [clone];
  }
  return selectedHasAny(owned.names, selected) ? [t.cloneNode(raw, true)] : [];
}

function selectedHasAny(names: string[], selected: Set<string>): boolean {
  return names.some((name) => selected.has(name));
}

function referencedBindingNames(
  statements: t.Statement[],
  ownedNames: Set<string>,
  knownTopLevelNames: Set<string>,
): string[] {
  const refs = new Set<string>();
  const ast = t.file(
    t.program(statements.map((stmt) => t.cloneNode(stmt, true))),
  );
  traverse(ast, {
    Identifier(identifierPath) {
      if (!identifierPath.isReferencedIdentifier()) return;
      const name = identifierPath.node.name;
      if (ownedNames.has(name)) return;
      if (knownTopLevelNames.has(name)) refs.add(name);
    },
    JSXIdentifier(identifierPath) {
      const name = identifierPath.node.name;
      if (!/^[A-Z]/.test(name)) return;
      if (ownedNames.has(name)) return;
      if (knownTopLevelNames.has(name)) refs.add(name);
    },
    TSTypeReference(typePath) {
      const typeName = typePath.node.typeName;
      if (t.isIdentifier(typeName)) {
        const name = typeName.name;
        if (!ownedNames.has(name) && knownTopLevelNames.has(name)) {
          refs.add(name);
        }
      }
    },
    TSTypeQuery(typePath) {
      const exprName = typePath.node.exprName;
      if (t.isIdentifier(exprName)) {
        const name = exprName.name;
        if (!ownedNames.has(name) && knownTopLevelNames.has(name)) {
          refs.add(name);
        }
      }
    },
  });
  return [...refs].sort();
}

function importLocalNames(imports: t.ImportDeclaration[]): Set<string> {
  const names = new Set<string>();
  for (const importDecl of imports) {
    for (const specifier of importDecl.specifiers) {
      names.add(specifier.local.name);
    }
  }
  return names;
}

function referencedImportNames(
  statements: t.Statement[],
  importedNames: Set<string>,
): Set<string> {
  const refs = new Set<string>();
  const ast = t.file(
    t.program(statements.map((stmt) => t.cloneNode(stmt, true))),
  );
  traverse(ast, {
    Identifier(identifierPath) {
      if (!identifierPath.isReferencedIdentifier()) return;
      const name = identifierPath.node.name;
      if (importedNames.has(name)) refs.add(name);
    },
    JSXIdentifier(identifierPath) {
      const name = identifierPath.node.name;
      if (!/^[A-Z]/.test(name)) return;
      if (importedNames.has(name)) refs.add(name);
    },
    TSTypeReference(typePath) {
      const typeName = typePath.node.typeName;
      if (t.isIdentifier(typeName) && importedNames.has(typeName.name)) {
        refs.add(typeName.name);
      }
    },
    TSTypeQuery(typePath) {
      const exprName = typePath.node.exprName;
      if (t.isIdentifier(exprName) && importedNames.has(exprName.name)) {
        refs.add(exprName.name);
      }
    },
  });
  return refs;
}

function rebaseOriginalImportSource(
  fromFile: string,
  source: string,
  importRoot = ".",
): string {
  if (!source.startsWith(".")) return source;
  const fromDir = path.posix.dirname(fromFile);
  const targetFromSplitRoot = path.posix.normalize(
    path.posix.join(importRoot, source),
  );
  const rel = path.posix.relative(fromDir, targetFromSplitRoot);
  return rel.startsWith(".") ? rel : `./${rel}`;
}

function buildOriginalImportCode(
  imports: t.ImportDeclaration[],
  targetFile: string,
  usedImportedNames: Set<string>,
  importRoot?: string,
): string[] {
  const out: string[] = [];
  for (const importDecl of imports) {
    const clone = stripLeadingComments(t.cloneNode(importDecl, true));
    if (clone.specifiers.length > 0) {
      clone.specifiers = clone.specifiers.filter((specifier) =>
        usedImportedNames.has(specifier.local.name),
      );
      if (clone.specifiers.length === 0) continue;
    }
    clone.source = t.stringLiteral(
      rebaseOriginalImportSource(targetFile, clone.source.value, importRoot),
    );
    out.push(printNode(clone));
  }
  return out;
}

function makeCrossFileImports(
  currentFile: string,
  refs: string[],
  bindingToFile: Map<string, string>,
): string[] {
  const byFile = new Map<string, string[]>();
  for (const ref of refs) {
    const sourceFile = bindingToFile.get(ref);
    if (!sourceFile || sourceFile === currentFile) continue;
    const list = byFile.get(sourceFile) ?? [];
    list.push(ref);
    byFile.set(sourceFile, list);
  }
  return [...byFile.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([sourceFile, names]) => {
      const source = relativeImport(currentFile, sourceFile);
      return `import { ${names.sort().join(", ")} } from "${source}";`;
    });
}

function renderTargetFile(
  target: TargetFile,
  ownedStatements: OwnedStatement[],
  originalImports: t.ImportDeclaration[],
  knownTopLevelNames: Set<string>,
  bindingToFile: Map<string, string>,
  header: string,
  importRoot?: string,
): SplitOutputFile {
  const selected = new Set(target.bindings);
  const exportNames = new Set(target.exports);
  const statements = ownedStatements.flatMap((owned) =>
    materializeStatement(owned, selected, exportNames),
  );
  const presentNames = new Set(
    statements.flatMap((statement) => statementBindingNames(statement)),
  );
  const missing = target.bindings.filter(
    (binding) => !presentNames.has(binding),
  );
  if (missing.length > 0) {
    throw new Error(
      `${target.relativePath} references missing binding(s): ${missing.join(", ")}`,
    );
  }
  const refs = referencedBindingNames(statements, selected, knownTopLevelNames);
  const usedImportedNames = referencedImportNames(
    statements,
    importLocalNames(originalImports),
  );
  const crossFileImports = makeCrossFileImports(
    target.relativePath,
    refs,
    bindingToFile,
  );
  const aliasExportCode = target.exportAliases.map(({ local, exported }) =>
    local === exported
      ? `export { ${local} };`
      : `export { ${local} as ${exported} };`,
  );
  const codeParts = [
    header.trimEnd(),
    ...buildOriginalImportCode(
      originalImports,
      target.relativePath,
      usedImportedNames,
      importRoot,
    ),
    ...crossFileImports,
    ...statements.map((statement) => printNode(statement)),
    ...aliasExportCode,
  ].filter(Boolean);
  return {
    path: target.relativePath,
    code: `${codeParts.join("\n\n")}\n`,
  };
}

function buildDefaultReExports(targets: TargetFile[]): SplitPlanReExport[] {
  return targets
    .filter(
      (target) => target.exports.length > 0 || target.exportAliases.length > 0,
    )
    .map((target) => ({
      from: normalizeRelativeImport(target.relativePath),
      names: [
        ...target.exports,
        ...target.exportAliases.map((alias) => alias.exported),
      ],
    }));
}

function renderBarrel(
  plan: SplitPlan,
  targets: TargetFile[],
  header: string,
): SplitOutputFile {
  const barrel = plan.barrel ?? {};
  const reExports = barrel.reExports ?? buildDefaultReExports(targets);
  const lines: string[] = header ? [header.trimEnd(), ""] : [];
  for (const reExport of reExports) {
    if (reExport.names.length === 0) continue;
    lines.push(
      `export { ${reExport.names.join(", ")} } from "${reExport.from}";`,
    );
  }
  if (barrel.registry) {
    const registryEntries =
      barrel.registry.entries ??
      reExports.flatMap((reExport) =>
        reExport.names.map((name) => ({
          key: name,
          name,
          from: reExport.from,
        })),
      );
    const importGroups = new Map<string, string[]>();
    for (const entry of registryEntries) {
      const from = entry.from;
      if (!from) continue;
      const names = importGroups.get(from) ?? [];
      names.push(entry.name);
      importGroups.set(from, names);
    }
    if (lines.length > 0) lines.push("");
    for (const [from, names] of [...importGroups.entries()].sort(([a], [b]) =>
      a.localeCompare(b),
    )) {
      lines.push(
        `import { ${[...new Set(names)].sort().join(", ")} } from "${from}";`,
      );
    }
    const props = registryEntries.map((entry) =>
      entry.key && entry.key !== entry.name
        ? `${entry.key}: ${entry.name}`
        : entry.name,
    );
    if (importGroups.size > 0) lines.push("");
    lines.push(`export const ${barrel.registry.name} = {`);
    for (const prop of props) lines.push(`  ${prop},`);
    lines.push(`} as const;`);
  }
  return {
    path: barrel.name ?? "index.ts",
    code: `${lines.join("\n")}\n`,
  };
}

export function splitBundle(
  source: string,
  plan: SplitPlan,
  options: { importRoot?: string } = {},
): SplitBundleResult {
  const ast = parseSource(source);
  const header = leadingCommentHeader(source);
  const ownedStatements = collectOwnedStatements(ast);
  const originalImports = collectImportDeclarations(ast);
  const targets = targetFilesFromPlan(plan);
  const knownTopLevelNames = new Set(
    ownedStatements.flatMap((owned) => owned.names),
  );
  const bindingToFile = new Map<string, string>();
  for (const target of targets) {
    for (const binding of target.bindings) {
      if (bindingToFile.has(binding)) {
        throw new Error(`binding assigned to multiple files: ${binding}`);
      }
      bindingToFile.set(binding, target.relativePath);
    }
  }
  const files = targets.map((target) =>
    renderTargetFile(
      target,
      ownedStatements,
      originalImports,
      knownTopLevelNames,
      bindingToFile,
      header,
      options.importRoot ?? plan.importRoot,
    ),
  );
  files.push(renderBarrel(plan, targets, header));
  return { files };
}

function writeSplitResult(result: SplitBundleResult, outDir: string): void {
  fs.rmSync(outDir, { recursive: true, force: true });
  for (const file of result.files) {
    const outPath = path.join(outDir, file.path);
    fs.mkdirSync(path.dirname(outPath), { recursive: true });
    fs.writeFileSync(
      outPath,
      file.code.endsWith("\n") ? file.code : `${file.code}\n`,
    );
  }
}

const USAGE =
  "Usage: bun scripts/split-bundle.ts <polished.tsx> <split-plan.json> " +
  "[--out-dir target/module] [--import-root relative/path] [--format]";

async function main(): Promise<void> {
  let parsed;
  try {
    parsed = parseArgs({
      args: process.argv.slice(2),
      options: {
        "out-dir": { type: "string" },
        "import-root": { type: "string" },
        format: { type: "boolean", default: false },
      },
      allowPositionals: true,
    });
  } catch (err) {
    console.error(USAGE);
    console.error((err as Error).message);
    process.exit(64);
  }
  const { values, positionals } = parsed;
  if (positionals.length < 2) {
    console.error(USAGE);
    process.exit(64);
  }
  const input = positionals[0]!;
  const planPath = positionals[1]!;
  if (!fs.existsSync(input)) {
    console.error(`input not found: ${input}`);
    process.exit(1);
  }
  if (!fs.existsSync(planPath)) {
    console.error(`split plan not found: ${planPath}`);
    process.exit(1);
  }
  const plan = JSON.parse(fs.readFileSync(planPath, "utf-8")) as SplitPlan;
  const outDir = values["out-dir"] ?? plan.outDir;
  if (!outDir) {
    console.error("missing --out-dir and plan.outDir");
    process.exit(64);
  }
  try {
    const result = splitBundle(fs.readFileSync(input, "utf-8"), plan, {
      importRoot: values["import-root"],
    });
    writeSplitResult(result, outDir);
    if (values.format) formatPath(outDir);
  } catch (err) {
    console.error((err as Error).message);
    process.exit(1);
  }
}

if (import.meta.main) {
  await main();
}

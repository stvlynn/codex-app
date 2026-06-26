import * as fs from "node:fs";
import * as path from "node:path";
import { parseArgs } from "node:util";
import * as parser from "@babel/parser";
import babelTraverse from "@babel/traverse";
import * as t from "@babel/types";
import type { SplitPlan, SplitPlanReExport } from "./split-bundle.ts";
import { kebabCase } from "./semantic-finalize.ts";

const traverse = ((
  babelTraverse as unknown as { default?: typeof babelTraverse }
).default ?? babelTraverse) as typeof babelTraverse;

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

type ExportInfo = {
  local: string;
  exported: string;
  isRegistry: boolean;
};

type RegistryEntryInfo = {
  key: string;
  local: string;
};

type ModuleFacts = {
  exports: ExportInfo[];
  registryEntries: Map<string, RegistryEntryInfo[]>;
  topLevelBindings: string[];
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

function stripExtension(filePath: string): string {
  return path.basename(filePath).replace(/\.[cm]?[jt]sx?$/i, "");
}

function safeFileName(name: string, extension: string): string {
  const cleaned = kebabCase(name);
  return `${cleaned || "restored-export"}${extension}`;
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

function objectPropCount(init: t.Expression | null | undefined): number {
  return t.isObjectExpression(init) ? init.properties.length : 0;
}

function isTopLevelDeclarationPath(path: {
  parentPath: { parentPath?: { node: t.Node } | null } | null;
}): boolean {
  const parent = path.parentPath?.parentPath?.node;
  return t.isProgram(parent) || t.isExportNamedDeclaration(parent);
}

function propNameToString(key: t.ObjectProperty["key"]): string | null {
  if (t.isIdentifier(key)) return key.name;
  if (t.isStringLiteral(key) || t.isNumericLiteral(key))
    return String(key.value);
  return null;
}

function unwrapRegistryValue(
  value: t.Expression | t.PatternLike,
): t.Expression | t.PatternLike {
  if (
    t.isTSAsExpression(value) ||
    t.isTSSatisfiesExpression(value) ||
    t.isTypeCastExpression(value)
  ) {
    return unwrapRegistryValue(value.expression);
  }
  return value;
}

function registryBindingFromValue(
  value: t.Expression | t.PatternLike,
): string | null {
  const unwrapped = unwrapRegistryValue(value);
  if (t.isIdentifier(unwrapped)) return unwrapped.name;
  if (t.isCallExpression(unwrapped)) {
    const firstArg = unwrapped.arguments[0];
    if (firstArg && t.isIdentifier(firstArg)) return firstArg.name;
  }
  return null;
}

function registryEntriesFromObject(
  init: t.Expression | null | undefined,
): RegistryEntryInfo[] {
  if (!t.isObjectExpression(init)) return [];
  const entries: RegistryEntryInfo[] = [];
  for (const prop of init.properties) {
    if (!t.isObjectProperty(prop)) continue;
    const key = propNameToString(prop.key);
    if (!key) continue;
    const local = registryBindingFromValue(
      prop.value as t.Expression | t.PatternLike,
    );
    if (!local) continue;
    entries.push({ key, local });
  }
  return entries;
}

function collectModuleFacts(source: string): ModuleFacts {
  const ast = parseSource(source);
  const objectBindingPropCounts = new Map<string, number>();
  const registryEntries = new Map<string, RegistryEntryInfo[]>();
  const topLevelBindings = new Set<string>();
  const exports: ExportInfo[] = [];

  traverse(ast, {
    VariableDeclarator(path) {
      if (!isTopLevelDeclarationPath(path)) return;
      if (!t.isIdentifier(path.node.id)) return;
      topLevelBindings.add(path.node.id.name);
      const propCount = objectPropCount(path.node.init);
      if (propCount >= 3) {
        objectBindingPropCounts.set(path.node.id.name, propCount);
        registryEntries.set(
          path.node.id.name,
          registryEntriesFromObject(path.node.init),
        );
      }
    },
    FunctionDeclaration(path) {
      if (!t.isProgram(path.parent) && !t.isExportNamedDeclaration(path.parent))
        return;
      if (path.node.id) topLevelBindings.add(path.node.id.name);
    },
    ClassDeclaration(path) {
      if (!t.isProgram(path.parent) && !t.isExportNamedDeclaration(path.parent))
        return;
      if (path.node.id) topLevelBindings.add(path.node.id.name);
    },
    ExportNamedDeclaration(path) {
      const declaration = path.node.declaration;
      if (t.isVariableDeclaration(declaration)) {
        for (const declarator of declaration.declarations) {
          const isRegistry = objectPropCount(declarator.init) >= 3;
          for (const name of bindingNameFromPattern(declarator.id)) {
            exports.push({
              local: name,
              exported: name,
              isRegistry,
            });
            if (isRegistry) {
              registryEntries.set(
                name,
                registryEntriesFromObject(declarator.init),
              );
            }
          }
        }
      } else if (
        (t.isFunctionDeclaration(declaration) ||
          t.isClassDeclaration(declaration)) &&
        declaration.id
      ) {
        exports.push({
          local: declaration.id.name,
          exported: declaration.id.name,
          isRegistry: false,
        });
      }
      for (const spec of path.node.specifiers) {
        if (!t.isExportSpecifier(spec)) continue;
        const local = t.isIdentifier(spec.local)
          ? spec.local.name
          : spec.local.value;
        const exported = t.isIdentifier(spec.exported)
          ? spec.exported.name
          : spec.exported.value;
        exports.push({
          local,
          exported,
          isRegistry: (objectBindingPropCounts.get(local) ?? 0) >= 3,
        });
      }
    },
  });
  return {
    exports,
    registryEntries,
    topLevelBindings: [...topLevelBindings].sort(),
  };
}

export function planSplit(
  source: string,
  options: { inputPath?: string; outDir?: string; extension?: string } = {},
): SplitPlan {
  const extension = options.extension ?? ".tsx";
  const basename = options.inputPath
    ? stripExtension(options.inputPath)
    : "restored-module";
  const outDir = options.outDir ?? basename;
  const facts = collectModuleFacts(source);
  const exports = facts.exports;
  const registry = exports.find((item) => item.isRegistry);
  const publicExports = exports.filter((item) => item !== registry);
  const registryObjectEntries = registry
    ? (facts.registryEntries.get(registry.local) ?? [])
    : [];
  const plannedLocals = new Set<string>();
  const files = [
    ...registryObjectEntries.map((entry) => {
      plannedLocals.add(entry.local);
      return {
        name: safeFileName(entry.key, extension),
        exports: [entry.local],
        bindings: [entry.local],
      };
    }),
    ...publicExports
      .filter((item) => !plannedLocals.has(item.local))
      .map((item) => {
        plannedLocals.add(item.local);
        return {
          name: safeFileName(item.exported, extension),
          exports: item.local === item.exported ? [item.exported] : [],
          exportAliases:
            item.local === item.exported
              ? undefined
              : [{ local: item.local, exported: item.exported }],
          bindings: [item.local],
        };
      }),
  ];
  const reExports: SplitPlanReExport[] = files.map((file) => ({
    from: `./${file.name.replace(/\.[cm]?[jt]sx?$/i, "")}`,
    names: [
      ...(file.exports ?? []),
      ...(file.exportAliases?.map((alias) => alias.exported) ?? []),
    ],
  }));
  const sharedBindings = facts.topLevelBindings.filter(
    (name) => name !== registry?.local && !plannedLocals.has(name),
  );
  return {
    outDir,
    extension,
    sections: [{ files }],
    shared: sharedBindings.length
      ? { name: `shared${extension}`, bindings: sharedBindings }
      : undefined,
    barrel: {
      name: "index.ts",
      reExports,
      registry: registry
        ? {
            name: registry.exported,
            entries:
              registryObjectEntries.length > 0
                ? registryObjectEntries.map((entry) => ({
                    key: entry.key,
                    name: entry.local,
                    from: `./${safeFileName(entry.key, extension).replace(/\.[cm]?[jt]sx?$/i, "")}`,
                  }))
                : publicExports.map((item) => ({
                    key: item.exported,
                    name: item.exported,
                    from: `./${safeFileName(item.exported, extension).replace(/\.[cm]?[jt]sx?$/i, "")}`,
                  })),
          }
        : undefined,
    },
  };
}

const USAGE =
  "Usage: bun scripts/plan-split.ts <polished.tsx> [--out split-plan.json] " +
  "[--out-dir target/module] [--extension .tsx]";

async function main(): Promise<void> {
  let parsed;
  try {
    parsed = parseArgs({
      args: process.argv.slice(2),
      options: {
        out: { type: "string", short: "o" },
        "out-dir": { type: "string" },
        extension: { type: "string", default: ".tsx" },
      },
      allowPositionals: true,
    });
  } catch (err) {
    console.error(USAGE);
    console.error((err as Error).message);
    process.exit(64);
  }
  const { values, positionals } = parsed;
  if (positionals.length === 0) {
    console.error(USAGE);
    process.exit(64);
  }
  const input = positionals[0]!;
  if (!fs.existsSync(input)) {
    console.error(`input not found: ${input}`);
    process.exit(1);
  }
  const plan = planSplit(fs.readFileSync(input, "utf-8"), {
    inputPath: input,
    outDir: values["out-dir"],
    extension: values.extension,
  });
  const json = `${JSON.stringify(plan, null, 2)}\n`;
  if (values.out) fs.writeFileSync(values.out, json);
  else process.stdout.write(json);
}

if (import.meta.main) {
  await main();
}

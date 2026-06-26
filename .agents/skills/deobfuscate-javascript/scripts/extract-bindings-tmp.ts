import * as fs from "node:fs";
import * as parser from "@babel/parser";
import * as t from "@babel/types";

const source = fs.readFileSync(
  "../../../../restored/.deobfuscate-javascript/_full/files/thread-context-inputs-B6tQCr7t/auto-polished.tsx",
  "utf-8",
);

function lineOf(pos: number): number {
  let line = 1;
  for (let i = 0; i < pos; i++) {
    if (source.charCodeAt(i) === 10) line++;
  }
  return line;
}

const ast = parser.parse(source, {
  sourceType: "module",
  errorRecovery: true,
  allowImportExportEverywhere: true,
  allowReturnOutsideFunction: true,
  allowAwaitOutsideFunction: true,
  allowUndeclaredExports: true,
  plugins: [
    "jsx",
    "typescript",
    "classProperties",
    "classPrivateProperties",
    "classPrivateMethods",
    "dynamicImport",
    "importMeta",
    "objectRestSpread",
    "topLevelAwait",
  ],
});

function bindingNames(node: any): string[] {
  if (t.isVariableDeclaration(node)) {
    return node.declarations.flatMap((d: any) => {
      if (t.isIdentifier(d.id)) return [d.id.name];
      return [];
    });
  }
  if ((t.isFunctionDeclaration(node) || t.isClassDeclaration(node)) && node.id)
    return [node.id.name];
  if (
    t.isTSTypeAliasDeclaration(node) ||
    t.isTSInterfaceDeclaration(node) ||
    t.isTSEnumDeclaration(node)
  )
    return [node.id.name];
  return [];
}

const bindings: Array<{
  order: number;
  names: string[];
  start: number;
  line: number;
  end: number;
  endLine: number;
}> = [];
ast.program.body.forEach((stmt, i) => {
  if (t.isImportDeclaration(stmt)) return;
  if (t.isExportNamedDeclaration(stmt) && !stmt.declaration) return;
  if (t.isExportAllDeclaration(stmt) || t.isExportDefaultDeclaration(stmt))
    return;
  let node: any = stmt;
  if (t.isExportNamedDeclaration(stmt) && stmt.declaration) node = stmt.declaration;
  const names = bindingNames(node);
  if (names.length)
    bindings.push({
      order: i,
      names,
      start: stmt.start ?? 0,
      line: lineOf(stmt.start ?? 0),
      end: stmt.end ?? 0,
      endLine: lineOf(stmt.end ?? 0),
    });
});

fs.writeFileSync(
  "/tmp/thread-context-bindings.json",
  JSON.stringify(bindings, null, 2),
);
console.log("Saved to /tmp/thread-context-bindings.json");
console.log("Total:", bindings.length);

// Print line ranges for major sections
console.log("\nLine ranges:");
for (let i = 0; i < bindings.length; i += 20) {
  const b = bindings[i];
  console.log(
    `order ${b.order} line ${b.line}: ${b.names[0]}`,
  );
}

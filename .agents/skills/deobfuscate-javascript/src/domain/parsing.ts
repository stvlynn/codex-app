import * as parser from "@babel/parser";
import babelTraverse, { type Scope } from "@babel/traverse";
import type * as t from "@babel/types";

const traverse = ((
  babelTraverse as unknown as { default?: typeof babelTraverse }
).default ?? babelTraverse) as typeof babelTraverse;

export const DEFAULT_CONTEXT_SIZE = 500;

export const PARSER_PLUGINS: parser.ParserPlugin[] = [
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

export type SymbolEntry = {
  id: string;
  name: string;
  kind: string;
  bindingPathType: string;
  scopeKind: string;
  scopeSize: number;
  declStart: number;
  declEnd: number;
  referenceCount: number;
  constant: boolean;
  sameScopeBindings: string[];
  context: string;
};

export type FilterOptions = {
  minRefs?: number;
  scopeKind?: string;
  kinds?: Set<string>;
  namePattern?: RegExp;
  onlyCryptic?: boolean;
  top?: number;
  noContext?: boolean;
  maxSameScope?: number;
};

function computeContext(
  source: string,
  scopeStart: number,
  scopeEnd: number,
  symStart: number,
  symEnd: number,
  contextSize: number,
): string {
  const ctxLen = scopeEnd - scopeStart;
  if (ctxLen <= contextSize) {
    return source.slice(scopeStart, scopeEnd);
  }
  const isProgram = scopeStart === 0 && scopeEnd === source.length;
  if (isProgram) {
    const half = Math.floor(contextSize / 2);
    if (symEnd < half) {
      return source.slice(0, Math.min(contextSize, source.length));
    }
    if (symStart > source.length - half) {
      return source.slice(Math.max(0, source.length - contextSize));
    }
    return source.slice(
      Math.max(0, symStart - half),
      Math.min(source.length, symEnd + half),
    );
  }
  return source.slice(scopeStart, Math.min(scopeEnd, scopeStart + contextSize));
}

export function parseSource(source: string): t.File {
  return parser.parse(source, {
    sourceType: "unambiguous",
    errorRecovery: true,
    allowReturnOutsideFunction: true,
    allowAwaitOutsideFunction: true,
    allowImportExportEverywhere: true,
    allowUndeclaredExports: true,
    plugins: PARSER_PLUGINS,
  });
}

const CRYPTIC_NAME_RE = /^(?:[a-zA-Z_]\d*|_0x[0-9a-fA-F]+|[a-zA-Z]{1,2})$/;

export function filterSymbols(
  symbols: SymbolEntry[],
  opts: FilterOptions,
): SymbolEntry[] {
  let out = symbols;
  if (opts.minRefs !== undefined && opts.minRefs > 0) {
    out = out.filter((s) => s.referenceCount >= opts.minRefs!);
  }
  if (opts.scopeKind) {
    out = out.filter((s) => s.scopeKind === opts.scopeKind);
  }
  if (opts.kinds && opts.kinds.size > 0) {
    out = out.filter((s) => opts.kinds!.has(s.kind));
  }
  if (opts.namePattern) {
    out = out.filter((s) => opts.namePattern!.test(s.name));
  }
  if (opts.onlyCryptic) {
    out = out.filter((s) => CRYPTIC_NAME_RE.test(s.name));
  }
  if (opts.top !== undefined && opts.top > 0) {
    out = out.slice(0, opts.top);
  }
  if (opts.noContext || opts.maxSameScope !== undefined) {
    out = out.map((s) => {
      const next = { ...s };
      if (opts.noContext) next.context = "";
      if (opts.maxSameScope !== undefined && opts.maxSameScope >= 0) {
        next.sameScopeBindings = s.sameScopeBindings.slice(
          0,
          opts.maxSameScope,
        );
      }
      return next;
    });
  }
  return out;
}

export function extractSymbols(
  source: string,
  contextSize: number = DEFAULT_CONTEXT_SIZE,
): SymbolEntry[] {
  if (!source) return [];
  const ast = parseSource(source);
  const symbols: SymbolEntry[] = [];
  const seenScopes = new WeakSet<Scope>();
  const seenIds = new Set<string>();

  traverse(ast, {
    Scopable(path) {
      const scope = path.scope;
      if (seenScopes.has(scope)) return;
      seenScopes.add(scope);

      const block = scope.block as t.Node;
      const scopeStart = block.start ?? 0;
      const scopeEnd = block.end ?? source.length;
      const scopeSize = scopeEnd - scopeStart;
      const sameScopeBindings = Object.keys(scope.bindings).sort();

      for (const [name, binding] of Object.entries(scope.bindings)) {
        if (!binding?.identifier || !binding.path) continue;
        const idNode = binding.identifier;
        const declStart = idNode.start ?? 0;
        const declEnd = idNode.end ?? declStart + name.length;
        const id = `${name}@${declStart}`;
        if (seenIds.has(id)) continue;
        seenIds.add(id);

        const context = computeContext(
          source,
          scopeStart,
          scopeEnd,
          declStart,
          declEnd,
          contextSize,
        );

        symbols.push({
          id,
          name,
          kind: binding.kind,
          bindingPathType: binding.path.type,
          scopeKind: block.type,
          scopeSize,
          declStart,
          declEnd,
          referenceCount: binding.referencePaths.length,
          constant: binding.constant,
          sameScopeBindings,
          context,
        });
      }
    },
  });

  symbols.sort(
    (a, b) => b.scopeSize - a.scopeSize || a.declStart - b.declStart,
  );
  return symbols;
}

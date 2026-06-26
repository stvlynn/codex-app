import * as fs from "node:fs";
import { parseArgs } from "node:util";
import * as parser from "@babel/parser";
import babelTraverse, { type Binding, type NodePath, type Scope } from "@babel/traverse";
import type * as t from "@babel/types";

const traverse = ((babelTraverse as unknown as { default?: typeof babelTraverse })
  .default ?? babelTraverse) as typeof babelTraverse;

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

// Property names that strongly imply a value is a DOM/React event.
const EVENT_ACCESSORS = new Set([
  "preventDefault", "stopPropagation", "stopImmediatePropagation",
  "target", "currentTarget", "relatedTarget", "nativeEvent",
  "clientX", "clientY", "pageX", "pageY", "screenX", "screenY", "offsetX", "offsetY",
  "movementX", "movementY",
  "key", "keyCode", "code", "which", "button", "buttons",
  "deltaX", "deltaY", "deltaZ", "deltaMode",
  "touches", "changedTouches", "targetTouches",
  "altKey", "ctrlKey", "shiftKey", "metaKey",
  "dataTransfer", "clipboardData", "detail", "isTrusted",
  "pointerId", "pointerType", "isPrimary",
  "persist",
]);

const ITERATEE_METHODS = new Set([
  "map", "forEach", "filter", "find", "some", "every",
  "findIndex", "flatMap", "findLast", "findLastIndex",
]);
const REDUCE_METHODS = new Set(["reduce", "reduceRight"]);
const SORT_METHODS = new Set(["sort", "toSorted"]);

// Hook return aliases — RHS init call → renamed local. Applied when the local
// is a single-letter `let` or `const` declared by a destructure-free declarator.
const HOOK_TO_NAME: Record<string, string> = {
  useIntl: "intl",
  useRouter: "router",
  useLocation: "location",
  useParams: "params",
  useNavigate: "navigate",
  useTheme: "theme",
  useTranslation: "translation",
  useSearchParams: "searchParams",
  useMatch: "match",
  useColorMode: "colorMode",
  useToast: "toast",
  useMediaQuery: "mediaQuery",
};

const RESERVED = new Set([
  "break", "case", "catch", "class", "const", "continue", "debugger", "default",
  "delete", "do", "else", "enum", "export", "extends", "false", "finally",
  "for", "function", "if", "import", "in", "instanceof", "new", "null",
  "return", "super", "switch", "this", "throw", "true", "try", "typeof",
  "var", "void", "while", "with", "yield", "let", "static",
  "implements", "interface", "package", "private", "protected", "public", "await",
]);

function isCryptic(name: string): boolean {
  return /^_?[a-zA-Z]{1,2}$/.test(name);
}

function isPascalCase(name: string): boolean {
  return /^[A-Z][a-zA-Z0-9_$]*$/.test(name) && !/^[A-Z_$]+$/.test(name);
}

export type Rename = { id: string; newName: string; reason: string };

function functionDisplayName(fnPath: NodePath): string | null {
  const node = fnPath.node as t.Function;
  if ("id" in node && node.id && node.id.name) return node.id.name;
  const parent = fnPath.parent as t.Node;
  if (parent.type === "VariableDeclarator" && parent.id.type === "Identifier") {
    return parent.id.name;
  }
  if (parent.type === "AssignmentExpression" && parent.left.type === "Identifier") {
    return parent.left.name;
  }
  if (parent.type === "ObjectProperty" && parent.key.type === "Identifier" && !parent.computed) {
    return parent.key.name;
  }
  if (parent.type === "ClassMethod" || parent.type === "ObjectMethod") {
    const m = parent as t.ClassMethod | t.ObjectMethod;
    if (m.key.type === "Identifier" && !m.computed) return m.key.name;
  }
  return null;
}

function isJsxRuntimeCall(node: t.Node | null | undefined): boolean {
  if (!node || node.type !== "CallExpression") return false;
  const callee = node.callee;
  if (callee.type === "Identifier") {
    return callee.name === "jsx" || callee.name === "jsxs" || callee.name === "jsxDEV";
  }
  if (
    callee.type === "MemberExpression" &&
    !callee.computed &&
    callee.property.type === "Identifier"
  ) {
    const prop = callee.property.name;
    return prop === "jsx" || prop === "jsxs" || prop === "jsxDEV";
  }
  return false;
}

function functionLooksLikeComponent(fnPath: NodePath): boolean {
  const name = functionDisplayName(fnPath);
  // Minified bundles commonly produce two-letter PascalCase helper names
  // (`Nt`, `Pt`, ...). Treating those names alone as component evidence
  // mislabels event helpers like `function Nt(e) { e.preventDefault(); }`.
  if (name && isPascalCase(name) && !isCryptic(name)) return true;

  // Wrapped in (_)React.memo(...) / React.forwardRef(...)
  const parent = fnPath.parent as t.Node;
  if (parent.type === "CallExpression") {
    const callee = parent.callee;
    if (callee.type === "MemberExpression" && callee.property.type === "Identifier") {
      const m = callee.property.name;
      if (m === "memo" || m === "forwardRef") return true;
    }
    if (callee.type === "Identifier" && (callee.name === "memo" || callee.name === "forwardRef")) {
      return true;
    }
  }

  // Returns JSX (top-level only — don't peer inside nested functions)
  if (fnPath.isArrowFunctionExpression()) {
    const body = (fnPath.node as t.ArrowFunctionExpression).body;
    if (
      body.type === "JSXElement" ||
      body.type === "JSXFragment" ||
      isJsxRuntimeCall(body)
    ) return true;
  }
  let returnsJsx = false;
  fnPath.traverse({
    Function(p) {
      p.skip();
    },
    ReturnStatement(p) {
      const arg = p.node.argument;
      if (
        arg &&
        (arg.type === "JSXElement" ||
          arg.type === "JSXFragment" ||
          isJsxRuntimeCall(arg))
      ) {
        returnsJsx = true;
      }
    },
  });
  return returnsJsx;
}

function paramIsDestructuredOrAccessed(binding: Binding): boolean {
  for (const ref of binding.referencePaths) {
    const parent = ref.parent;
    if (
      parent.type === "VariableDeclarator" &&
      parent.init === ref.node &&
      (parent.id.type === "ObjectPattern" || parent.id.type === "ArrayPattern")
    ) {
      return true;
    }
    if (parent.type === "MemberExpression" && parent.object === ref.node) {
      return true;
    }
    if (parent.type === "AssignmentExpression" && parent.right === ref.node &&
        (parent.left.type === "ObjectPattern" || parent.left.type === "ArrayPattern")) {
      return true;
    }
    // JSX spread: <El {...p}/> — p is the component props
    if (parent.type === "JSXSpreadAttribute" && parent.argument === ref.node) {
      return true;
    }
    // Plain spread inside an object literal: { ...p, extra: 1 } when returned from a component
    if (parent.type === "SpreadElement" && parent.argument === ref.node) {
      return true;
    }
  }
  return false;
}

function paramLooksLikeEvent(binding: Binding): boolean {
  if (binding.referencePaths.length === 0) return false;
  for (const ref of binding.referencePaths) {
    const parent = ref.parent;
    if (parent.type === "MemberExpression" && parent.object === ref.node && !parent.computed) {
      const prop = parent.property;
      if (prop.type === "Identifier" && EVENT_ACCESSORS.has(prop.name)) return true;
    }
  }
  return false;
}

type IterateeKind = "iteratee" | "reduce" | "sort" | "then" | "catch" | null;

function classifyCallback(fnPath: NodePath): IterateeKind {
  const parent = fnPath.parent;
  if (parent.type !== "CallExpression") return null;
  const call = parent;
  if (call.arguments[0] !== fnPath.node) return null;
  const callee = call.callee;
  if (callee.type !== "MemberExpression" || callee.computed) return null;
  if (callee.property.type !== "Identifier") return null;
  const m = callee.property.name;
  if (ITERATEE_METHODS.has(m)) return "iteratee";
  if (REDUCE_METHODS.has(m)) return "reduce";
  if (SORT_METHODS.has(m)) return "sort";
  if (m === "then") return "then";
  if (m === "catch") return "catch";
  return null;
}

function hookRenameForDeclarator(decl: t.VariableDeclarator): string | null {
  if (!decl.init || decl.init.type !== "CallExpression") return null;
  let calleeName: string | null = null;
  const callee = decl.init.callee;
  if (callee.type === "Identifier") calleeName = callee.name;
  else if (callee.type === "MemberExpression" && callee.property.type === "Identifier" && !callee.computed) {
    calleeName = callee.property.name;
  }
  if (!calleeName) return null;
  // `useStoreValue(fooStore$)` / `useStore(fooStore$)` / `useSignal(foo$)` → strip
  // trailing `$` from the first argument's name. Common in this codebase for
  // signal/store hooks that take a `$`-suffixed reactive value.
  if (calleeName === "useStoreValue" || calleeName === "useSignal" || calleeName === "useAtomValue") {
    const arg = decl.init.arguments[0];
    if (arg && arg.type === "Identifier" && arg.name.endsWith("$") && arg.name.length > 1) {
      return arg.name.slice(0, -1);
    }
    // Member expression like `useStoreValue(foo.bar$)` → take the property name minus `$`.
    if (arg && arg.type === "MemberExpression" && !arg.computed && arg.property.type === "Identifier") {
      const propName = arg.property.name;
      if (propName.endsWith("$") && propName.length > 1) return propName.slice(0, -1);
    }
  }
  return HOOK_TO_NAME[calleeName] ?? null;
}

export function findRenames(source: string): Rename[] {
  const ast = parser.parse(source, {
    sourceType: "unambiguous",
    errorRecovery: true,
    allowReturnOutsideFunction: true,
    allowAwaitOutsideFunction: true,
    allowImportExportEverywhere: true,
    allowUndeclaredExports: true,
    plugins: PARSER_PLUGINS,
  });

  const out: Rename[] = [];
  const seen = new Set<string>();

  function push(node: t.Node | null | undefined, name: string, newName: string, reason: string) {
    if (!node || node.type !== "Identifier") return;
    if (!isCryptic(name)) return;
    if (RESERVED.has(newName)) newName = "_" + newName;
    const id = `${name}@${node.start ?? 0}`;
    if (seen.has(id)) return;
    seen.add(id);
    out.push({ id, newName, reason });
  }

  function pushPatternIdentifier(
    node: t.Identifier,
    newName: string,
    reason: string,
    scope?: Scope,
  ) {
    const binding = scope?.getBinding(node.name);
    push(binding?.identifier ?? node, node.name, newName, reason);
  }

  function processObjectPatternAliases(pattern: t.ObjectPattern, scope?: Scope) {
    for (const prop of pattern.properties) {
      // `{ ...r }` — RestElement with cryptic Identifier; rename to `rest`.
      if (prop.type === "RestElement") {
        if (prop.argument.type === "Identifier" && isCryptic(prop.argument.name)) {
          pushPatternIdentifier(prop.argument, "rest", "rest-element", scope);
        }
        continue;
      }
      if (prop.type !== "ObjectProperty") continue;
      if (prop.computed) continue;
      if (prop.key.type !== "Identifier") continue;
      const keyName = prop.key.name;
      const valueNode = prop.value;
      // `{ foo: e }` — value is a cryptic Identifier alias for the prop name.
      if (valueNode.type === "Identifier" && isCryptic(valueNode.name) && valueNode.name !== keyName) {
        pushPatternIdentifier(valueNode, keyName, "destructure-prop-alias", scope);
      }
      // `{ foo: e = default }` — value is AssignmentPattern with cryptic LHS.
      if (
        valueNode.type === "AssignmentPattern" &&
        valueNode.left.type === "Identifier" &&
        isCryptic(valueNode.left.name) &&
        valueNode.left.name !== keyName
      ) {
        pushPatternIdentifier(valueNode.left, keyName, "destructure-prop-alias", scope);
      }
      // `{ foo: { ... } }` — recurse into nested ObjectPattern.
      if (valueNode.type === "ObjectPattern") processObjectPatternAliases(valueNode, scope);
    }
  }

  traverse(ast, {
    Function(path) {
      // Walk *every* param looking for ObjectPattern destructure aliases
      // (this catches `function Foo({ propName: e }) { … }` where the local
      // alias `e` should become `propName`).
      for (const p of path.node.params) {
        let target: t.Node = p;
        if (p.type === "AssignmentPattern") target = p.left;
        if (target.type === "ObjectPattern") {
          processObjectPatternAliases(target as t.ObjectPattern, path.scope);
        }
      }

      const iterateeKind = classifyCallback(path);
      const isComponent = iterateeKind === null && functionLooksLikeComponent(path);

      const params = path.node.params;
      for (let i = 0; i < params.length; i++) {
        const p = params[i];
        if (p.type !== "Identifier") continue;
        if (!isCryptic(p.name)) continue;
        const binding = path.scope.bindings[p.name];
        if (!binding) continue;

        // Callback-shape priorities (most specific first)
        if (iterateeKind === "iteratee") {
          const name = i === 0 ? "item" : i === 1 ? "index" : i === 2 ? "array" : null;
          if (name) push(p, p.name, name, `iteratee-${name}`);
          continue;
        }
        if (iterateeKind === "reduce") {
          const name = i === 0 ? "accumulator" : i === 1 ? "current" : i === 2 ? "index" : i === 3 ? "array" : null;
          if (name) push(p, p.name, name, `reduce-${name}`);
          continue;
        }
        if (iterateeKind === "sort") {
          // Skip — (a, b) is the canonical comparator signature.
          continue;
        }
        if (iterateeKind === "then" && i === 0) {
          push(p, p.name, "value", "then-value");
          continue;
        }
        if (iterateeKind === "catch" && i === 0) {
          push(p, p.name, "error", "catch-error");
          continue;
        }

        // Event handler (works for any function — JSX prop callbacks, addEventListener, etc.)
        if (paramLooksLikeEvent(binding)) {
          push(p, p.name, "event", "dom-event");
          continue;
        }

        // React component props (single param, destructured/accessed)
        if (isComponent && params.length === 1 && paramIsDestructuredOrAccessed(binding)) {
          push(p, p.name, "props", "react-props");
          continue;
        }
      }
    },

    VariableDeclarator(path) {
      const node = path.node;
      // `let { propName: e } = something` — local alias `e` should become `propName`.
      if (node.id.type === "ObjectPattern") {
        processObjectPatternAliases(node.id, path.scope);
        return;
      }
      if (node.id.type !== "Identifier") return;
      if (!isCryptic(node.id.name)) return;
      const hookName = hookRenameForDeclarator(node);
      if (hookName) {
        push(node.id, node.id.name, hookName, "hook-return");
        return;
      }
      // `let X = clsx(...)` → name X `className` (per-scope dedup is the user's problem;
      // collisions just stay cryptic).
      if (
        node.init?.type === "CallExpression" &&
        node.init.callee.type === "Identifier" &&
        (node.init.callee.name === "clsx" || node.init.callee.name === "classNames" || node.init.callee.name === "cn")
      ) {
        push(node.id, node.id.name, "className", "clsx-call");
        return;
      }
    },

    AssignmentExpression(path) {
      if (path.node.left.type !== "ObjectPattern") return;
      processObjectPatternAliases(path.node.left, path.scope);
    },
  });

  return out;
}

function summarize(renames: Rename[]): Record<string, number> {
  const tally: Record<string, number> = {};
  for (const r of renames) tally[r.reason] = (tally[r.reason] ?? 0) + 1;
  return tally;
}

const USAGE =
  "Usage: bun scripts/smart-rename.ts <input.js|-> [--out renames.json] [--merge existing.json]";

async function readInput(p: string): Promise<string> {
  if (p === "-") return await Bun.stdin.text();
  return fs.readFileSync(p, "utf-8");
}

async function main(): Promise<void> {
  let parsed;
  try {
    parsed = parseArgs({
      args: process.argv.slice(2),
      options: {
        out: { type: "string", short: "o" },
        merge: { type: "string" },
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

  let source: string;
  try {
    source = await readInput(positionals[0]!);
  } catch (err) {
    console.error(`failed to read input: ${(err as Error).message}`);
    process.exit(1);
  }

  let renames: Rename[];
  try {
    renames = findRenames(source);
  } catch (err) {
    console.error(`parse error: ${(err as Error).message}`);
    process.exit(2);
  }

  const map: Record<string, string> = {};
  if (values.merge) {
    try {
      Object.assign(map, JSON.parse(fs.readFileSync(values.merge, "utf-8")));
    } catch (err) {
      console.error(`failed to read --merge file: ${(err as Error).message}`);
      process.exit(1);
    }
  }
  let added = 0;
  for (const r of renames) {
    if (map[r.id] !== undefined) continue; // existing wins
    map[r.id] = r.newName;
    added++;
  }

  const json = JSON.stringify(map, null, 2) + "\n";
  if (values.out) {
    fs.writeFileSync(values.out, json);
    const tally = summarize(renames);
    console.error(
      `smart-rename: ${added} new + ${Object.keys(map).length - added} existing = ${Object.keys(map).length} → ${values.out}`,
    );
    for (const [reason, count] of Object.entries(tally).sort((a, b) => b[1] - a[1])) {
      console.error(`  ${reason.padEnd(22)} ${count}`);
    }
  } else {
    process.stdout.write(json);
  }
}

if (import.meta.main) {
  await main();
}

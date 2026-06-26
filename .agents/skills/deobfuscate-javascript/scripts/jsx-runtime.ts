import * as fs from "node:fs";
import { parseArgs } from "node:util";
import * as parser from "@babel/parser";
import babelTraverse, { type NodePath } from "@babel/traverse";
import babelGenerator from "@babel/generator";
import * as t from "@babel/types";

const traverse = ((
  babelTraverse as unknown as { default?: typeof babelTraverse }
).default ?? babelTraverse) as typeof babelTraverse;
const generate = ((
  babelGenerator as unknown as { default?: typeof babelGenerator }
).default ?? babelGenerator) as typeof babelGenerator;

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

const JSX_FNS = new Set(["jsx", "jsxs", "jsxDEV"]);
const FRAGMENT_NAMES = new Set(["Fragment"]);
const IDENT_RE = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/;

export type JsxRuntimeStats = {
  callsConverted: number;
  fragmentsConverted: number;
  unconvertible: number;
  importsRemoved: number;
};

export type JsxRuntimeResult = {
  code: string;
  stats: JsxRuntimeStats;
};

function emptyStats(): JsxRuntimeStats {
  return {
    callsConverted: 0,
    fragmentsConverted: 0,
    unconvertible: 0,
    importsRemoved: 0,
  };
}

function unwrapSequenceCallee(
  node: t.Node,
): t.Identifier | t.MemberExpression | null {
  if (t.isIdentifier(node) || t.isMemberExpression(node)) return node;
  if (t.isSequenceExpression(node)) {
    const last = node.expressions.at(-1);
    if (last) return unwrapSequenceCallee(last);
  }
  return null;
}

function isJsxFnCallee(
  node: t.Node,
  runtimeFunctionNames: Set<string>,
): boolean {
  const callee = unwrapSequenceCallee(node);
  if (!callee) return false;
  if (
    t.isIdentifier(callee) &&
    (JSX_FNS.has(callee.name) || runtimeFunctionNames.has(callee.name))
  )
    return true;
  if (
    t.isMemberExpression(callee) &&
    !callee.computed &&
    t.isIdentifier(callee.property) &&
    JSX_FNS.has(callee.property.name)
  ) {
    return true;
  }
  return false;
}

function isFragmentRef(node: t.Node, fragmentNames = FRAGMENT_NAMES): boolean {
  if (t.isIdentifier(node) && fragmentNames.has(node.name)) return true;
  if (
    t.isMemberExpression(node) &&
    !node.computed &&
    t.isIdentifier(node.property) &&
    FRAGMENT_NAMES.has(node.property.name)
  ) {
    return true;
  }
  return false;
}

function toJsxName(
  node: t.Expression,
): t.JSXIdentifier | t.JSXMemberExpression | null {
  if (t.isIdentifier(node)) {
    if (!/^[A-Z]/.test(node.name)) return null;
    return t.jsxIdentifier(node.name);
  }
  if (
    t.isMemberExpression(node) &&
    !node.computed &&
    t.isIdentifier(node.property)
  ) {
    const object = toJsxName(node.object as t.Expression);
    if (
      !object ||
      (t.isJSXIdentifier(object) === false &&
        t.isJSXMemberExpression(object) === false)
    ) {
      return null;
    }
    return t.jsxMemberExpression(
      object as t.JSXIdentifier | t.JSXMemberExpression,
      t.jsxIdentifier(node.property.name),
    );
  }
  return null;
}

function typeArgToJsxName(
  node: t.Node,
  fragmentNames = FRAGMENT_NAMES,
): {
  name: t.JSXIdentifier | t.JSXMemberExpression;
  isFragment: boolean;
} | null {
  if (isFragmentRef(node, fragmentNames))
    return { name: t.jsxIdentifier("Fragment"), isFragment: true };
  if (t.isStringLiteral(node)) {
    if (!IDENT_RE.test(node.value)) return null;
    return { name: t.jsxIdentifier(node.value), isFragment: false };
  }
  if (t.isTemplateLiteral(node) && node.expressions.length === 0) {
    const value = node.quasis[0]?.value.cooked ?? node.quasis[0]?.value.raw;
    if (!value || !IDENT_RE.test(value)) return null;
    return { name: t.jsxIdentifier(value), isFragment: false };
  }
  if (t.isExpression(node)) {
    const name = toJsxName(node);
    if (!name) return null;
    return { name, isFragment: false };
  }
  return null;
}

function valueToJsxAttrValue(
  value: t.Expression,
): t.JSXAttribute["value"] | null {
  if (t.isStringLiteral(value)) {
    if (/["<>{}\r\n]/.test(value.value)) {
      return t.jsxExpressionContainer(t.stringLiteral(value.value));
    }
    return t.stringLiteral(value.value);
  }
  return t.jsxExpressionContainer(value);
}

function expressionToJsxChild(
  expr: t.Expression,
): t.JSXElement | t.JSXFragment | t.JSXExpressionContainer | t.JSXText {
  if (t.isJSXElement(expr) || t.isJSXFragment(expr)) return expr;
  if (t.isStringLiteral(expr)) {
    return t.jsxExpressionContainer(t.stringLiteral(expr.value));
  }
  return t.jsxExpressionContainer(expr);
}

function flattenChildren(
  value: t.Expression,
): Array<t.JSXElement | t.JSXFragment | t.JSXExpressionContainer | t.JSXText> {
  if (t.isArrayExpression(value)) {
    const out: Array<
      t.JSXElement | t.JSXFragment | t.JSXExpressionContainer | t.JSXText
    > = [];
    for (const el of value.elements) {
      if (el === null) continue;
      if (t.isSpreadElement(el)) {
        out.push(t.jsxExpressionContainer(t.spreadElement(el.argument)));
        continue;
      }
      out.push(expressionToJsxChild(el as t.Expression));
    }
    return out;
  }
  return [expressionToJsxChild(value)];
}

function attrName(name: string): t.JSXIdentifier | t.JSXNamespacedName {
  if (name.includes(":")) {
    const [ns, local] = name.split(":");
    return t.jsxNamespacedName(t.jsxIdentifier(ns!), t.jsxIdentifier(local!));
  }
  return t.jsxIdentifier(name);
}

function propsToAttributes(
  props: t.ObjectExpression,
  extraKey?: t.Expression | null,
): {
  attrs: t.JSXAttribute[] | null;
  spreads: t.JSXSpreadAttribute[];
  children: t.Expression | null;
} {
  const attrs: Array<t.JSXAttribute | t.JSXSpreadAttribute> = [];
  let children: t.Expression | null = null;
  let ok = true;

  for (const prop of props.properties) {
    if (t.isObjectMethod(prop)) {
      ok = false;
      break;
    }
    if (t.isSpreadElement(prop)) {
      attrs.push(t.jsxSpreadAttribute(prop.argument));
      continue;
    }
    if (t.isObjectProperty(prop)) {
      const key = prop.key;
      let name: string | null = null;
      if (!prop.computed && t.isIdentifier(key)) name = key.name;
      else if (t.isStringLiteral(key)) name = key.value;
      if (name === null) {
        ok = false;
        break;
      }
      const value = prop.value;
      if (!t.isExpression(value)) {
        ok = false;
        break;
      }
      if (name === "children") {
        children = value;
        continue;
      }
      const av = valueToJsxAttrValue(value);
      if (!av) {
        ok = false;
        break;
      }
      attrs.push(t.jsxAttribute(attrName(name), av));
      continue;
    }
    ok = false;
    break;
  }

  if (!ok) return { attrs: null, spreads: [], children: null };

  if (extraKey) {
    const keyValue = valueToJsxAttrValue(extraKey);
    if (keyValue)
      attrs.unshift(t.jsxAttribute(t.jsxIdentifier("key"), keyValue));
  }

  const onlyAttrs = attrs.filter((a): a is t.JSXAttribute =>
    t.isJSXAttribute(a),
  );
  const onlySpreads = attrs.filter((a): a is t.JSXSpreadAttribute =>
    t.isJSXSpreadAttribute(a),
  );

  return {
    attrs: [...attrs].filter(
      (a): a is t.JSXAttribute | t.JSXSpreadAttribute => true,
    ) as never,
    spreads: onlySpreads,
    children,
  };
}

function buildJsxElement(
  call: t.CallExpression,
  fragmentNames = FRAGMENT_NAMES,
): {
  node: t.JSXElement | t.JSXFragment | null;
  converted: boolean;
} {
  const args = call.arguments;
  if (args.length < 2) return { node: null, converted: false };
  const typeArg = args[0]!;
  const propsArg = args[1]!;
  const keyArg = args.length >= 3 ? args[2] : null;

  if (!t.isExpression(typeArg) || !t.isObjectExpression(propsArg)) {
    return { node: null, converted: false };
  }
  if (keyArg !== null && keyArg !== undefined && !t.isExpression(keyArg)) {
    return { node: null, converted: false };
  }

  const named = typeArgToJsxName(typeArg, fragmentNames);
  if (!named) return { node: null, converted: false };

  const collected = propsToAttributes(propsArg, keyArg ?? null);
  if (collected.attrs === null) return { node: null, converted: false };

  const childArray =
    collected.children === null ? [] : flattenChildren(collected.children);

  if (named.isFragment) {
    return {
      node: t.jsxFragment(
        t.jsxOpeningFragment(),
        t.jsxClosingFragment(),
        childArray,
      ),
      converted: true,
    };
  }

  const attrs = collected.attrs as Array<t.JSXAttribute | t.JSXSpreadAttribute>;
  const selfClosing = childArray.length === 0;
  const opening = t.jsxOpeningElement(named.name, attrs, selfClosing);
  const closing = selfClosing ? null : t.jsxClosingElement(named.name);
  return {
    node: t.jsxElement(opening, closing, childArray, selfClosing),
    converted: true,
  };
}

function isJsxNameRef(
  node: t.JSXElement["openingElement"]["name"],
  names: Set<string>,
): boolean {
  if (t.isJSXIdentifier(node)) return names.has(node.name);
  if (
    t.isJSXMemberExpression(node) &&
    t.isJSXIdentifier(node.object) &&
    t.isJSXIdentifier(node.property) &&
    node.property.name === "Fragment"
  ) {
    return names.has(node.object.name);
  }
  return false;
}

export function convertJsxRuntime(source: string): JsxRuntimeResult {
  if (!source) return { code: "", stats: emptyStats() };
  const ast = parseSource(source);
  const stats = emptyStats();
  const runtimeFunctionRefs = new Set<string>();
  const runtimeFragmentRefs = new Set<string>();

  traverse(ast, {
    ImportDeclaration(path) {
      if (path.node.source.value !== "react/jsx-runtime") return;
      for (const specifier of path.node.specifiers) {
        if (
          t.isImportSpecifier(specifier) &&
          t.isIdentifier(specifier.imported)
        ) {
          if (JSX_FNS.has(specifier.imported.name)) {
            runtimeFunctionRefs.add(specifier.local.name);
          }
          if (specifier.imported.name === "Fragment") {
            runtimeFragmentRefs.add(specifier.local.name);
          }
        } else if (t.isImportNamespaceSpecifier(specifier)) {
          runtimeFragmentRefs.add(specifier.local.name);
        }
      }
    },
  });

  let changed = true;
  let guard = 0;
  while (changed && guard++ < 5) {
    changed = false;
    traverse(ast, {
      JSXElement: {
        exit(path) {
          if (!isJsxNameRef(path.node.openingElement.name, runtimeFragmentRefs))
            return;
          path.replaceWith(
            t.jsxFragment(
              t.jsxOpeningFragment(),
              t.jsxClosingFragment(),
              path.node.children,
            ),
          );
          stats.fragmentsConverted++;
          changed = true;
        },
      },
      CallExpression: {
        exit(path) {
          if (!isJsxFnCallee(path.node.callee, runtimeFunctionRefs)) return;
          const built = buildJsxElement(path.node, runtimeFragmentRefs);
          if (built.converted && built.node) {
            const parent = path.parent;
            let replacement: t.Node = built.node;
            if (
              t.isExpressionStatement(parent) ||
              t.isReturnStatement(parent) ||
              t.isArrowFunctionExpression(parent)
            ) {
              replacement = built.node;
            }
            path.replaceWith(replacement);
            if (t.isJSXFragment(built.node)) stats.fragmentsConverted++;
            else stats.callsConverted++;
            changed = true;
          } else {
            stats.unconvertible++;
          }
        },
      },
    });
  }

  traverse(ast, {
    Program(path) {
      path.scope.crawl();
    },
    ImportDeclaration(path) {
      if (path.node.source.value !== "react/jsx-runtime") return;

      const retained = path.node.specifiers.filter((specifier) => {
        const binding = path.scope.getBinding(specifier.local.name);
        return binding?.referenced === true;
      });

      stats.importsRemoved += path.node.specifiers.length - retained.length;
      if (retained.length === 0) {
        path.remove();
      } else {
        path.node.specifiers = retained;
      }
    },
  });

  const { code } = generate(ast, {
    retainLines: false,
    compact: false,
    concise: false,
    jsescOption: { minimal: true },
  });

  return {
    code: code.endsWith("\n") ? code : code + "\n",
    stats,
  };
}

const USAGE =
  "Usage: bun scripts/jsx-runtime.ts <input.js|-> [--out output.js]";

async function readInput(inputPath: string): Promise<string> {
  if (inputPath === "-") {
    return await Bun.stdin.text();
  }
  return fs.readFileSync(inputPath, "utf-8");
}

async function main(): Promise<void> {
  let parsed;
  try {
    parsed = parseArgs({
      args: process.argv.slice(2),
      options: { out: { type: "string", short: "o" } },
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

  const inputPath = positionals[0]!;

  let source: string;
  try {
    source = await readInput(inputPath);
  } catch (err) {
    console.error(`failed to read input: ${(err as Error).message}`);
    process.exit(1);
  }

  let result: JsxRuntimeResult;
  try {
    result = convertJsxRuntime(source);
  } catch (err) {
    console.error(`parse error: ${(err as Error).message}`);
    process.exit(2);
  }

  if (values.out) {
    try {
      fs.writeFileSync(values.out, result.code);
    } catch (err) {
      console.error(`failed to write output: ${(err as Error).message}`);
      process.exit(1);
    }
  } else {
    process.stdout.write(result.code);
  }

  console.error(
    `jsx-runtime: ${result.stats.callsConverted} call(s) converted, ` +
      `${result.stats.fragmentsConverted} fragment(s), ` +
      `${result.stats.unconvertible} unconvertible, ` +
      `${result.stats.importsRemoved} import(s) removed`,
  );
}

if (import.meta.main) {
  await main();
}

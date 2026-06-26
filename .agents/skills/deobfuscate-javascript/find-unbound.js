const fs = require('fs');
const source = fs.readFileSync(process.argv[2], 'utf-8');

const parser = require('@babel/parser');
const t = require('@babel/types');

const ast = parser.parse(source, {
  sourceType: 'module',
  plugins: ['typescript'],
});

const globals = new Set([
  'AbortController','AbortSignal','AggregateError','AnimationEvent','Audio','AudioContext','Array','ArrayBuffer','Atomics','BigInt','Boolean','Buffer','CSS','CharacterData','ClipboardEvent','CloseEvent','Comment','CompositionEvent','CustomEvent','DOMException','DataView','Date','Document','DocumentFragment','DragEvent','Element','Error','EvalError','Event','EventSource','EventTarget','File','FileList','FileReader','Float32Array','Float64Array','FocusEvent','FormData','Function','Generator','HTMLElement','HTMLInputElement','HTMLTextAreaElement','HashChangeEvent','Headers','IDBFactory','IDBKeyRange','ImageData','Infinity','InputEvent','Int16Array','Int32Array','Int8Array','Intl','JSON','KeyboardEvent','Map','Math','MessageChannel','MessageEvent','MessagePort','MouseEvent','MutationEvent','MutationObserver','NaN','NamedNodeMap','Node','NodeList','Number','Object','OfflineAudioContext','Option','PageTransitionEvent','Path2D','PointerEvent','PopStateEvent','ProgressEvent','Promise','Proxy','Range','RangeError','ReadableStream','ReferenceError','Reflect','RegExp','Request','Response','SVGDocument','SVGElement','Set','ShadowRoot','SharedArrayBuffer','Storage','String','StyleSheet','Symbol','SyntaxError','Text','TextDecoder','TextEncoder','TouchEvent','TrackEvent','TransformStream','TransitionEvent','TypeError','UIEvent','URIError','URL','URLSearchParams','Uint16Array','Uint32Array','Uint8Array','Uint8ClampedArray','WebAssembly','WebSocket','WheelEvent','Window','Worker','XMLDocument','XMLHttpRequest','XMLSerializer','XSLTProcessor','ZodType','addEventListener','atob','blur','btoa','cancelAnimationFrame','clearImmediate','clearInterval','clearTimeout','console','decodeURI','decodeURIComponent','document','encodeURI','encodeURIComponent','escape','eval','fetch','fetchImpl','getComputedStyle','global','globalThis','isFinite','isNaN','localStorage','location','navigator','parseFloat','parseInt','performance','process','prompt','queueMicrotask','removeEventListener','requestAnimationFrame','require','screen','sessionStorage','setImmediate','setInterval','setTimeout','undefined','unescape','window'
]);

const unbound = new Set();

function isTypeOnlyPath(path) {
  // Check if this identifier is in a type-only context
  let node = path.node;
  let parent = path.parent;

  if (!parent) return false;

  // Type annotations
  if (t.isTSTypeAnnotation(parent)) return true;
  if (t.isTSTypeReference(parent)) return true;
  if (t.isTSPropertySignature(parent)) return true;
  if (t.isTSMethodSignature(parent)) return true;
  if (t.isTSInterfaceDeclaration(parent)) return true;
  if (t.isTSTypeAliasDeclaration(parent)) return true;
  if (t.isTSModuleDeclaration(parent)) return true;
  if (t.isTSTypeParameterInstantiation(parent)) return true;
  if (t.isTSTypeParameterDeclaration(parent)) return true;
  if (t.isTSQualifiedName(parent)) return true;
  if (t.isTSTypeLiteral(parent)) return true;
  if (t.isTSTypeElement(parent)) return true;
  if (t.isTSTypeQuery(parent)) return true;
  if (t.isTSIndexedAccessType(parent)) return true;
  if (t.isTSTypeOperator(parent)) return true;
  if (t.isTSConditionalType(parent)) return true;
  if (t.isTSMappedType(parent)) return true;
  if (t.isTSFunctionType(parent)) return true;
  if (t.isTSConstructorType(parent)) return true;
  if (t.isTSTypePredicate(parent)) return true;
  if (t.isTSParenthesizedType(parent)) return true;
  if (t.isTSUnionType(parent)) return true;
  if (t.isTSIntersectionType(parent)) return true;
  if (t.isTSArrayType(parent)) return true;
  if (t.isTSTupleType(parent)) return true;
  if (t.isTSLiteralType(parent)) return true;
  if (t.isTSImportType(parent)) return true;
  if (t.isTSExportAssignment(parent)) return true;
  if (t.isTSNamespaceExportDeclaration(parent)) return true;
  if (t.isTSModuleBlock(parent)) return true;
  if (t.isTSDeclareMethod(parent)) return true;
  if (t.isTSDeclareFunction(parent)) return true;
  if (t.isTSEnumDeclaration(parent)) return true;
  if (t.isTSEnumMember(parent)) return true;
  if (t.isTSExternalModuleReference(parent)) return true;
  if (t.isTSExpressionWithTypeArguments(parent)) return true;
  if (t.isTSInterfaceBody(parent)) return true;
  if (t.isTSParameterProperty(parent)) return true;
  if (t.isTSSatisfiesExpression(parent)) return true;
  if (t.isTSSignatureDeclaration(parent)) return true;
  if (t.isTSTypeAssertion(parent)) return true;
  if (t.isTSTypeCastExpression(parent)) return true;

  // Property keys are not references
  if (t.isObjectProperty(parent) && parent.key === node) return true;
  if (t.isObjectMethod(parent) && parent.key === node) return true;
  if (t.isClassProperty(parent) && parent.key === node) return true;
  if (t.isClassMethod(parent) && parent.key === node) return true;
  if (t.isTSPropertySignature(parent) && parent.key === node) return true;
  if (t.isTSMethodSignature(parent) && parent.key === node) return true;
  if (t.isMemberExpression(parent) && parent.property === node && !parent.computed) return true;

  // Function parameters
  if (t.isFunction(parent)) {
    for (const param of parent.params) {
      if (param === node) return true;
    }
  }

  return false;
}

const traverse = require('@babel/traverse').default;

traverse(ast, {
  Identifier(path) {
    const name = path.node.name;

    // Skip if not a reference
    if (!path.isReferencedIdentifier()) return;

    // Skip type-only contexts
    if (isTypeOnlyPath(path)) return;

    // Skip known globals
    if (globals.has(name)) return;

    // Skip if has binding in scope
    if (path.scope.hasBinding(name)) return;

    // Skip CSS global
    if (name === 'CSS') return;

    unbound.add(name);
  }
});

console.log('Unbound identifiers:', [...unbound].sort().join(', '));
console.log('Count:', unbound.size);

# Naming heuristics

The mechanical rename rules that catch ~80 % of cryptic identifiers in a typical React/Vite/Rollup bundle without any agent judgment. These are what `scripts/smart-rename.ts` automates; this doc is the spec the script implements (so you can extend it, override it, or apply it by hand when the script can't reach a case).

← Back to [SKILL.md](../SKILL.md). Used by [Stage 2 Pass 3](../stages/stage-2-restore.md#step-25--dont-stop-at-program-scope).

---

## When to use

After Pass 1 (Program scope) and Pass 2 (function-body let/const/var) are done, run the smart renamer **before** asking the agent to make judgment calls. The smart renamer covers the boring cases (React component props, event handlers, iteratee callbacks, hook returns) deterministically; what's left is the genuinely judgment-driven naming (domain nouns, state-machine fields, helper-function semantics).

```bash
bun <skill-dir>/scripts/smart-rename.ts "$WS/pass2.js" --out "$WS/renames-smart.json"
# Optional: merge with an existing rename map (preserves your manual decisions on overlap)
bun <skill-dir>/scripts/smart-rename.ts "$WS/pass2.js" --merge "$WS/renames-manual.json" --out "$WS/renames-smart.json"
```

Output is the same id-keyed JSON shape `apply.ts` expects:

```json
{
  "e@1234": "props",
  "t@2056": "event",
  "n@3401": "item",
  "k@3404": "index"
}
```

## The heuristics

### 1. React component props

A param whose function is a React component and is destructured immediately → `props`.

**Triggers when all of:**
- Function name (or assigned binding name) is PascalCase.
- Function is `React.memo(…)`/`memo(…)`/`forwardRef(…)`-wrapped, OR its body returns a JSX element / a `_React.createElement` / `jsxRuntime.jsx` call.
- The function takes exactly one parameter (forwardRef may have a second `ref` param — that becomes `ref`).
- The body destructures the parameter in its first statement (`let { onClose, isOpen } = e`) or accesses members of it (`e.children`, `e.className`).

**Example input:**
```js
export function InstallUpdateConfirmationDialog(e) {
  let { onClose: isOpen } = e, …
}
```

**After:**
```ts
export function InstallUpdateConfirmationDialog(props) {
  const { onClose: isOpen } = props, …
}
```

### 2. forwardRef refs

The second parameter of `forwardRef((props, ref) => …)` → `ref` if the param is currently one letter.

### 3. DOM / React event handlers

A function param whose access pattern matches event accessors → `event`.

**Triggers when:** the param's reference set contains at least two of:

```
preventDefault, stopPropagation, stopImmediatePropagation
target, currentTarget, relatedTarget, nativeEvent
clientX, clientY, pageX, pageY, screenX, screenY, offsetX, offsetY, movementX, movementY
key, keyCode, code, which, button, buttons
deltaX, deltaY, deltaMode
touches, changedTouches, targetTouches
altKey, ctrlKey, shiftKey, metaKey
dataTransfer, clipboardData, detail, isTrusted
pointerId, pointerType, isPrimary
persist
```

A single access also triggers if it's `.preventDefault()` (unambiguous on its own).

**Example:**
```js
onClick: t => { t.preventDefault(); fire(t.target.value); }
```
→
```js
onClick: event => { event.preventDefault(); fire(event.target.value); }
```

### 4. Array iteratee callbacks

Callback to `.map`, `.forEach`, `.filter`, `.find`, `.some`, `.every`, `.findIndex`, `.flatMap`, `.findLast`, `.findLastIndex` → `(item, index, array)`.

The renamer takes the first three params (skipping any that aren't single-letter cryptic) and assigns these names. If only two params are present, they become `(item, index)`.

**Example:**
```js
items.map((n, k) => n.id + k)
```
→
```js
items.map((item, index) => item.id + index)
```

### 5. Reduce callbacks

Callback to `.reduce` / `.reduceRight` → `(accumulator, current, index, array)`.

**Example:**
```js
totals.reduce((a, c) => a + c.value, 0)
```
→
```js
totals.reduce((accumulator, current) => accumulator + current.value, 0)
```

### 6. Sort comparators

Callback to `.sort` / `.toSorted` → `(a, b)` if the params are something other than `a`/`b`. Sort comparators are the one place where one-letter `a`/`b` is idiomatic JS; the renamer normalises to this convention rather than picking something noisier.

### 7. Promise chains

`.then(p => …)` → `value`. `.catch(p => …)` → `error`. `.finally` takes no param.

### 8. Hook return aliases

A `let`/`const` declarator initialised by a `useXxx()` call where the LHS is one letter → rename the LHS after the hook:

| Hook | Local name |
|---|---|
| `useIntl()` | `intl` |
| `useRouter()` | `router` |
| `useLocation()` | `location` |
| `useParams()` | `params` |
| `useNavigate()` | `navigate` |
| `useTheme()` | `theme` |
| `useTranslation()` | `translation` |
| `useMediaQuery()` | `matches` |
| `useRef()` | `ref` (suffix `Ref` if you can detect the noun from context — `useRef<HTMLButtonElement>()` → `buttonRef`) |
| `useId()` | `id` |
| `useTransition()` | `[isPending, startTransition]` — destructure handled by Pass 2 |
| `useDeferredValue(v)` | `deferred<noun>` if `v`'s name is known |

`useState`, `useReducer`, `useMemo`, `useCallback`, `useEffect` are skipped because their result is almost always either destructured (handled by Pass 2's destructure-alias rule) or unused.

### 9. Try/catch error binding

`catch (e) { … }` where `e` is one letter and is used at all → `error`.

### 10. Class method `this` aliases

`let s = this` / `var that = this` patterns: leave alone. These are idioms; renaming `s` to `self` doesn't add clarity.

## What the renamer does NOT do (intentionally)

- **Naming JSX intermediates** (`let H = <span ref={…}>…</span>` → ???). The right name depends on what the JSX represents; this is judgment work.
- **Naming state setters from `useState`**. `[count, setCount]` destructuring already gives you the names; the script doesn't try to invent `count` from the surrounding context.
- **Renaming module-level helpers**. Pass 1 handles those.
- **Cross-file consistency**. The script runs per file; if you want the same name across files, use Pass 1 (which sees imports/exports).
- **Touching identifiers that aren't one-letter or `_0x` style.** A param already called `event` stays `event`; the script will not rename `evt` → `event` (that's a different judgment).

## Conflict resolution

The renamer never produces a rename that would collide with an existing binding in the same scope. If `props` is already used as a name in the enclosing scope, the React-component param will get `_props` (single underscore prefix) to disambiguate. This matches `apply.ts`'s collision-safety guarantees.

## Override mechanism

If a heuristic gets the wrong name on a specific binding, override it manually after the smart pass:

```bash
bun scripts/smart-rename.ts "$WS/pass2.js" --out "$WS/renames-smart.json"
# Edit renames-smart.json: change the bad entry. Then:
bun scripts/apply.ts "$WS/pass2.js" "$WS/renames-smart.json" --out "$WS/renamed.js"
```

Or, more durably, merge your own decisions in with `--merge`:

```bash
echo '{"e@1234": "kontext"}' > "$WS/manual-overrides.json"
bun scripts/smart-rename.ts "$WS/pass2.js" --merge "$WS/manual-overrides.json" --out "$WS/renames-smart.json"
```

`--merge` precedence: the existing map wins on conflict, so your manual decisions are preserved.

## Why these and not "all of humanify's heuristics"

The humanify project leans on an LLM to invent names from full context. Here we lean on Claude (you) to do that judgment work for the *hard* cases. The smart renamer is the deterministic short-circuit for the *easy* cases — the ones where you'd otherwise type the same name a hundred times. The rule of thumb: if the right name is mechanically derivable from a fixed property-access pattern or a fixed callee name, it belongs in the smart renamer. If the right name depends on what the surrounding code *means*, it belongs in your Pass 1 / Pass 2 judgment work.

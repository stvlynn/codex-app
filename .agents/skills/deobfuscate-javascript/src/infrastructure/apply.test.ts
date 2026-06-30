import { describe, expect, test } from "bun:test";
import { applyRenames, toIdentifier } from "./apply.ts";
import { extractSymbols } from "./extract.ts";

function renameByOriginal(source: string, mapping: Record<string, string>): Record<string, string> {
  const symbols = extractSymbols(source);
  const out: Record<string, string> = {};
  for (const [original, newName] of Object.entries(mapping)) {
    const entry = symbols.find((s) => s.name === original);
    if (!entry) throw new Error(`missing identifier ${original}`);
    out[entry.id] = newName;
  }
  return out;
}

describe("toIdentifier", () => {
  test("normalizes like humanify safe_name", () => {
    expect(toIdentifier("this.kLength")).toBe("thisKLength");
    expect(toIdentifier("foo bar-baz")).toBe("fooBarBaz");
    expect(toIdentifier("foo!?bar")).toBe("foobar");
    expect(toIdentifier("")).toBe("_");
    expect(toIdentifier("!!??")).toBe("_");
    expect(toIdentifier("123abc")).toBe("_123abc");
    expect(toIdentifier("static")).toBe("_static");
    expect(toIdentifier("$dollar")).toBe("$dollar");
    expect(toIdentifier("café")).toBe("café");
  });
});

describe("applyRenames", () => {
  test("returns empty for empty source", () => {
    const result = applyRenames("", { "a@0": "foo" });
    expect(result.code).toBe("");
    expect(result.stats.ignored).toBe(1);
  });

  test("renames shadowed bindings independently", () => {
    const source = "const a = 1; function f() { const a = 2; return a; }";
    const symbols = extractSymbols(source);
    const outer = symbols.find((s) => s.name === "a" && s.scopeKind === "Program")!;
    const inner = symbols.find((s) => s.name === "a" && s.scopeKind !== "Program")!;
    const result = applyRenames(source, {
      [outer.id]: "outerValue",
      [inner.id]: "innerValue",
    });
    expect(result.code).toContain("const outerValue = 1");
    expect(result.code).toContain("const innerValue = 2");
    expect(result.code).toContain("return innerValue");
  });

  test("does not rename object properties", () => {
    const source = "const c = 2; const a = { b: c }; a.b;";
    const result = applyRenames(
      source,
      renameByOriginal(source, { c: "value", a: "objectValue" }),
    );
    expect(result.code).toContain("b: value");
    expect(result.code).toContain("objectValue.b");
    expect(result.code).not.toContain("objectValue.value");
  });

  test("does not rename class methods", () => {
    const source = "class A { bar() { return 1; } }";
    const result = applyRenames(source, renameByOriginal(source, { A: "Thing" }));
    expect(result.code).toContain("class Thing");
    expect(result.code).toContain("bar()");
  });

  test("prefixes reserved words", () => {
    const source = "const a = 1;";
    const result = applyRenames(source, renameByOriginal(source, { a: "static" }));
    expect(result.code).toContain("const _static = 1");
  });

  test("prefixes target-name collisions", () => {
    const source = "const a = 1; const b = 2;";
    const result = applyRenames(
      source,
      renameByOriginal(source, { a: "value", b: "value" }),
    );
    expect(result.code).toContain("const value = 1");
    expect(result.code).toContain("const _value = 2");
  });

  test("renames unicode identifiers and emits them as-is (jsesc minimal)", () => {
    const source = "const café = 1; café;";
    const result = applyRenames(source, renameByOriginal(source, { café: "drink" }));
    expect(result.code).toContain("const drink = 1");
    expect(result.code).not.toContain("caf\\u00e9");
  });

  test("preserves unicode names when not renamed (jsesc minimal)", () => {
    const source = "const café = 1; café;";
    const result = applyRenames(source, {});
    expect(result.code).toContain("café");
    expect(result.code).not.toContain("\\u00e9");
  });

  test("skip count when normalized name equals original", () => {
    const source = "const a = 1;";
    const symbols = extractSymbols(source);
    const result = applyRenames(source, { [symbols[0]!.id]: "a" });
    expect(result.stats.renamed).toBe(0);
  });

  test("ignored count when id has no matching binding", () => {
    const source = "const a = 1;";
    const result = applyRenames(source, { "nonexistent@999": "foo" });
    expect(result.stats.ignored).toBe(1);
    expect(result.stats.renamed).toBe(0);
  });

  test("ignores inherited or non-string rename entries", () => {
    const source = "var a = 1; a;";
    const symbols = extractSymbols(source);
    const id = symbols.find((symbol) => symbol.name === "a")!.id;

    const inherited = Object.create({ [id]: "fromPrototype" });
    const inheritedResult = applyRenames(source, inherited);
    expect(inheritedResult.code).toContain("var a = 1");
    expect(inheritedResult.stats.renamed).toBe(0);

    const nonString = { [id]: {} as unknown as string };
    const nonStringResult = applyRenames(source, nonString);
    expect(nonStringResult.code).toContain("var a = 1");
    expect(nonStringResult.stats.renamed).toBe(0);
  });
});

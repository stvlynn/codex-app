import { describe, expect, test } from "bun:test";
import { extractSymbols } from "./extract.ts";

describe("extract", () => {
  test("returns empty array for empty input", () => {
    expect(extractSymbols("")).toEqual([]);
  });

  test("sorts bindings largest-scope-first, then by declStart", () => {
    const source = "const a = 1; function f() { const b = 2; return b + a; }";
    const names = extractSymbols(source).map((s) => s.name);
    expect(names).toEqual(["a", "f", "b"]);
  });

  test("populates referenceCount and constant", () => {
    const source = "const a = 1; const b = a + a; b;";
    const symbols = extractSymbols(source);
    const a = symbols.find((s) => s.name === "a")!;
    const b = symbols.find((s) => s.name === "b")!;
    expect(a.referenceCount).toBe(2);
    expect(a.constant).toBe(true);
    expect(b.referenceCount).toBe(1);
  });

  test("includes sameScopeBindings (sorted)", () => {
    const source = "const a = 1; const b = 2; const c = 3;";
    const symbols = extractSymbols(source);
    expect(symbols[0]!.sameScopeBindings).toEqual(["a", "b", "c"]);
  });

  test("records bindingPathType", () => {
    const source = "function foo(x) { return x; }";
    const symbols = extractSymbols(source);
    const foo = symbols.find((s) => s.name === "foo")!;
    const x = symbols.find((s) => s.name === "x")!;
    expect(foo.bindingPathType).toBe("FunctionDeclaration");
    expect(x.bindingPathType).toBe("Identifier");
  });

  test("each binding has a stable id name@declStart", () => {
    const source = "var a = 1; function f() { var a = 2; }";
    const symbols = extractSymbols(source);
    const outerA = symbols.find((s) => s.name === "a" && s.scopeKind === "Program")!;
    const innerA = symbols.find((s) => s.name === "a" && s.scopeKind !== "Program")!;
    expect(outerA.id).toBe(`a@${outerA.declStart}`);
    expect(innerA.id).toBe(`a@${innerA.declStart}`);
    expect(outerA.id).not.toBe(innerA.id);
  });

  test("parses class private fields (wider plugin set)", () => {
    const source = "class A { #x = 1; static y = 2; foo() { return this.#x; } }";
    expect(() => extractSymbols(source)).not.toThrow();
  });

  test("parses top-level await", () => {
    const source = "const x = await Promise.resolve(1);";
    const symbols = extractSymbols(source);
    expect(symbols.map((s) => s.name)).toContain("x");
  });

  test("parses TypeScript and type-only imports in restored TSX", () => {
    const source = `
      import type { ReactNode } from "react";

      interface RowProps {
        children?: ReactNode;
      }

      export function Row({ children }: RowProps) {
        return <div>{children}</div>;
      }
    `;

    const symbols = extractSymbols(source);
    expect(symbols.map((s) => s.name)).toContain("Row");
    expect(symbols.some((s) => s.name === "children" && s.kind === "param")).toBe(
      true,
    );
  });

  test("includes context window per symbol", () => {
    const source = "function chunk(input, size) { return input.length; }";
    const symbols = extractSymbols(source);
    const input = symbols.find((s) => s.name === "input")!;
    expect(input.context).toContain("input.length");
  });

  test("respects contextSize argument", () => {
    // Wrap in a block so the function isn't the whole source (else Program window applies).
    const source = "{ function chunk(input, size) { return input.length; } }";
    const symbols = extractSymbols(source, 12);
    const input = symbols.find((s) => s.name === "input")!;
    expect(input.context.length).toBeLessThanOrEqual(12);
  });
});

import { describe, expect, test } from "bun:test";
import { applyRenames } from "./apply.ts";
import { findRenames } from "./smart-rename.ts";

function renameMap(source: string): Record<string, string> {
  const out: Record<string, string> = {};
  for (const rename of findRenames(source)) out[rename.id] = rename.newName;
  return out;
}

describe("smart-rename", () => {
  test("does not treat cryptic PascalCase helpers as React components by name alone", () => {
    const renames = renameMap(`
      function Nt(e) {
        e.preventDefault();
        e.stopPropagation();
      }
    `);

    expect(Object.values(renames)).toContain("event");
    expect(Object.values(renames)).not.toContain("props");
  });

  test("still detects cryptic React components by JSX return", () => {
    const renames = renameMap(`
      function Mt(e) {
        return <div {...e} />;
      }
    `);

    expect(Object.values(renames)).toContain("props");
  });

  test("detects React components before jsx-runtime has been polished", () => {
    const renames = renameMap(`
      function Mt(e) {
        let n;
        ({ title: n } = e);
        return jsxRuntime.jsx("button", { children: n });
      }
    `);

    expect(Object.values(renames)).toContain("props");
    expect(Object.values(renames)).toContain("title");
  });

  test("renames aliases from React Compiler split destructure assignments", () => {
    const source = `
      function Mt(e) {
        let n, r;
        ({ activatorRef: n, title: r } = e);
        return <button ref={n}>{r}</button>;
      }
    `;
    const renames = renameMap(source);
    const { code } = applyRenames(source, renames);

    expect(Object.values(renames)).toContain("props");
    expect(Object.values(renames)).toContain("activatorRef");
    expect(Object.values(renames)).toContain("title");
    expect(code).toContain("let activatorRef, title;");
    expect(code).toContain("activatorRef");
  });
});

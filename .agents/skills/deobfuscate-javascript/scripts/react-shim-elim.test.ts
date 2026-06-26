import { describe, expect, test } from "bun:test";
import { eliminateReactShim } from "./react-shim-elim.ts";
import { polish } from "./polish.ts";

describe("react-shim-elim", () => {
  test("collapses CJS React namespace shim to a React import", () => {
    const source = `
      import { s as toESModule } from "./chunk-Bj-mKKzh.js";
      import { n as loadReact } from "./jsx-runtime-CiQ1k8xo.js";
      var localValue1 = toESModule(loadReact(), 1),
        contextValue = localValue1.createContext(null);
      export function useContextValue() {
        return localValue1.useContext(contextValue);
      }
    `;

    const result = eliminateReactShim(source);

    expect(result.stats.reactNamespacesCollapsed).toBe(1);
    expect(result.code).toContain('import React from "react";');
    expect(result.code).toContain("React.createContext(null)");
    expect(result.code).toContain("React.useContext(contextValue)");
    expect(result.code).not.toContain("jsx-runtime");
    expect(result.code).not.toContain("toESModule");
    expect(result.code).not.toContain("loadReact");
    expect(result.code).not.toContain("localValue1");
  });

  test("runs before npm import resolution inside polish", () => {
    const source = `
      import { s as toESModule } from "./chunk-Bj-mKKzh.js";
      import { n as loadReact } from "./jsx-runtime-CiQ1k8xo.js";
      var ReactNamespace = toESModule(loadReact(), 1);
      export const ShellContext = ReactNamespace.createContext(null);
    `;

    const result = polish(source).code;

    expect(result).toContain('import React from "react";');
    expect(result).toContain("React.createContext(null)");
    expect(result).not.toContain("jsx-runtime");
  });

  test("collapses direct shim member calls", () => {
    const source = `
      import { s as toESModule } from "./chunk-Bj-mKKzh.js";
      import { n as loadReact } from "./jsx-runtime-CiQ1k8xo.js";
      export const ShellContext = toESModule(loadReact(), 1).createContext(null);
    `;

    const result = eliminateReactShim(source);

    expect(result.stats.directMemberShimsCollapsed).toBe(1);
    expect(result.code).toContain('import React from "react";');
    expect(result.code).toContain("React.createContext(null)");
    expect(result.code).not.toContain("toESModule");
    expect(result.code).not.toContain("jsx-runtime");
  });
});

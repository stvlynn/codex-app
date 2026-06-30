import { describe, expect, test } from "bun:test";
import { inferSingleExportName } from "./auto-restore-full.ts";

describe("inferSingleExportName", () => {
  test("a plain utility does NOT pascal-case onto a JS global (no _Array)", () => {
    // `array-XXXX` previously became `Array` → underscore-prefixed to `_Array`.
    const name = inferSingleExportName(
      "array-hqvMvHot",
      `export default function (o){return typeof o=="object"&&"length"in o?o:[...o];}`,
    );
    expect(name).toBe("array");
    expect(JS_GLOBAL_LIKE.test(name)).toBe(false);
  });

  test("a component chunk keeps PascalCase", () => {
    const name = inferSingleExportName(
      "tooltip-Ab12Cd34",
      `import {jsx} from "react/jsx-runtime";export default function(props){return jsx("div",{});}`,
    );
    expect(name).toBe("Tooltip");
  });

  test("a class chunk keeps PascalCase", () => {
    const name = inferSingleExportName(
      "event-bus-Ef56Gh78",
      `export default class { on(){} emit(){} }`,
    );
    expect(name).toBe("EventBus");
  });

  test("an icon chunk gets an *Icon name", () => {
    const name = inferSingleExportName(
      "download-Ij90Kl12",
      `export default (p)=>jsx("svg",{viewBox:"0 0 16 16"});`,
    );
    expect(name).toBe("DownloadIcon");
  });

  test("a hook chunk stays camelCase", () => {
    const name = inferSingleExportName("use-resize-Mn34Op56", `export default function(){}`);
    expect(name).toBe("useResize");
  });

  test("a component whose stem collides with a global is suffixed, not prefixed", () => {
    const name = inferSingleExportName(
      "map-Qr78St90",
      `export default function(props){return jsx("div",{});}`,
    );
    expect(name).toBe("MapComponent");
  });
});

const JS_GLOBAL_LIKE = /^_{1,2}[A-Z]/;

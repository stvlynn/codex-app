import { describe, expect, test } from "bun:test";
import { Progress } from "./progress.ts";

function harness() {
  const lines: string[] = [];
  let clock = 0;
  return {
    lines,
    advance: (ms: number) => {
      clock += ms;
    },
    make: (total?: number) =>
      new Progress({
        label: "test",
        total,
        throttleMs: 1000,
        everyN: 25,
        write: (l) => lines.push(l),
        now: () => clock,
      }),
  };
}

describe("Progress", () => {
  test("throttles by step + time, always emits the final line", () => {
    const h = harness();
    const p = h.make(100);
    // 24 quick ticks within the same instant: below everyN, below throttleMs.
    for (let i = 0; i < 24; i++) p.tick();
    expect(h.lines).toHaveLength(0);
    p.tick(); // 25th → everyN boundary
    expect(h.lines).toHaveLength(1);
    expect(h.lines[0]).toContain("[25/100]");
    expect(h.lines[0]).toContain("(25%)");
    p.done("finished");
    expect(h.lines.at(-1)).toContain("finished");
  });

  test("time-based emit fires even when step delta is small", () => {
    const h = harness();
    const p = h.make();
    p.tick();
    expect(h.lines).toHaveLength(0);
    h.advance(1500);
    p.tick();
    expect(h.lines).toHaveLength(1);
    expect(h.lines[0]).toContain("[2]"); // open-ended counter, no percentage
    expect(h.lines[0]).not.toContain("%");
  });
});

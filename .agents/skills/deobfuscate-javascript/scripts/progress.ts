/**
 * progress.ts — a tiny, dependency-free progress reporter for the long-running
 * batch scripts (build-import-graph, build-symbol-ledger, auto-restore-full,
 * promote-organized). Prints throttled `[i/n] (pct%) elapsed — label` lines to
 * stderr so a whole-tree restore shows where it is instead of going silent for
 * minutes. Throttled by time + step so a 1400-chunk run emits ~tens of lines,
 * not thousands.
 *
 * Pure-ish: time comes from an injectable clock so tests stay deterministic
 * (scripts must not call Date.now() in the skill's pure modules, but a CLI
 * runner may; the default clock is only used when running as a CLI).
 */

export type ProgressOptions = {
  /** Total number of steps, when known. Omit/0 for an open-ended counter. */
  total?: number;
  /** Human label for the work ("graph", "checkpoint", "promote"). */
  label: string;
  /** Minimum ms between emitted lines (default 1000). */
  throttleMs?: number;
  /** Minimum step delta between emitted lines (default 25). */
  everyN?: number;
  /** Sink for lines (default process.stderr). */
  write?: (line: string) => void;
  /** Injectable clock returning ms (default Date.now via process.hrtime). */
  now?: () => number;
};

export class Progress {
  private readonly total: number;
  private readonly label: string;
  private readonly throttleMs: number;
  private readonly everyN: number;
  private readonly write: (line: string) => void;
  private readonly now: () => number;
  private readonly startedAt: number;
  private current = 0;
  private lastEmitAt: number;
  private lastEmitN = 0;

  constructor(opts: ProgressOptions) {
    this.total = opts.total && opts.total > 0 ? opts.total : 0;
    this.label = opts.label;
    this.throttleMs = opts.throttleMs ?? 1000;
    this.everyN = opts.everyN ?? 25;
    this.write =
      opts.write ?? ((line: string) => process.stderr.write(`${line}\n`));
    this.now = opts.now ?? defaultClock();
    this.startedAt = this.now();
    // Seed the throttle so the first line appears after everyN steps or
    // throttleMs (not on tick #1) — keeps a 1400-chunk run to tens of lines.
    this.lastEmitAt = this.startedAt;
  }

  /** Advance by `delta` (default 1) and maybe emit. `note` annotates the line. */
  tick(delta = 1, note?: string): void {
    this.current += delta;
    const t = this.now();
    const dueByTime = t - this.lastEmitAt >= this.throttleMs;
    const dueByStep = this.current - this.lastEmitN >= this.everyN;
    const atEnd = this.total > 0 && this.current >= this.total;
    if (dueByTime || dueByStep || atEnd) this.emit(note);
  }

  /** Force a final line (e.g. at the end of a loop). */
  done(note?: string): void {
    this.emit(note, true);
  }

  private emit(note?: string, force = false): void {
    if (!force && this.current === this.lastEmitN) return;
    this.lastEmitAt = this.now();
    this.lastEmitN = this.current;
    this.write(this.format(note));
  }

  format(note?: string): string {
    const elapsed = formatElapsed(this.now() - this.startedAt);
    const count =
      this.total > 0
        ? `[${this.current}/${this.total}] (${pct(this.current, this.total)})`
        : `[${this.current}]`;
    const suffix = note ? ` — ${note}` : "";
    return `${this.label}: ${count} ${elapsed}${suffix}`;
  }
}

function pct(n: number, total: number): string {
  return `${Math.floor((n / total) * 100)}%`;
}

function formatElapsed(ms: number): string {
  const s = Math.floor(ms / 1000);
  if (s < 60) return `${s}s`;
  const m = Math.floor(s / 60);
  const rem = s % 60;
  return `${m}m${rem.toString().padStart(2, "0")}s`;
}

function defaultClock(): () => number {
  // hrtime is monotonic and not Date.now() — safe in CLI runners.
  const origin = process.hrtime.bigint();
  return () => Number((process.hrtime.bigint() - origin) / 1_000_000n);
}

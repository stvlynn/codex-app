// Restored from ref/webview/assets/band-DVYrpIoC.js
// D3 band scale restored from the Codex webview bundle.

import { Ordinal } from "./d3-scale-ordinal";
import { init } from "./d3-scale-init";
function range(start: number, stop: number, step: number): number[] {
  start = +start;
  stop = +stop;
  step =
    (arguments.length as number) < 2
      ? ((stop = start), (start = 0), 1)
      : (arguments.length as number) < 3
        ? 1
        : +step;
  const count = Math.max(0, Math.ceil((stop - start) / step)) | 0;
  const values = Array(count);
  for (let i = -1; ++i < count; ) {
    values[i] = start + i * step;
  }
  return values;
}
export function bandScale(): BandScale {
  const ordinal = Ordinal().unknown(undefined);
  const domainFn = ordinal.domain;
  const rangeFn = ordinal.range;
  let rangeMin = 0;
  let rangeMax = 1;
  let step: number;
  let bandwidth: number;
  let round = false;
  let paddingInner = 0;
  let paddingOuter = 0;
  let alignRatio = 0.5;
  delete (ordinal as Record<string, unknown>).unknown;
  function rescale() {
    const domainLength = domainFn().length;
    const reverse = rangeMax < rangeMin;
    const min = reverse ? rangeMax : rangeMin;
    const max = reverse ? rangeMin : rangeMax;
    step =
      (max - min) / Math.max(1, domainLength - paddingInner + paddingOuter * 2);
    if (round) step = Math.floor(step);
    let start =
      min + (max - min - step * (domainLength - paddingInner)) * alignRatio;
    bandwidth = step * (1 - paddingInner);
    if (round) {
      start = Math.round(start);
      bandwidth = Math.round(bandwidth);
    }
    const indices = range(domainLength).map((i) => start + step * i);
    return rangeFn(reverse ? indices.reverse() : indices);
  }
  const scale = ordinal as unknown as BandScale;
  scale.domain = function (domain?: unknown[]) {
    if (arguments.length) {
      domainFn(domain);
      return rescale();
    }
    return domainFn();
  };
  scale.range = function (range?: [number, number]) {
    if (arguments.length) {
      [rangeMin, rangeMax] = range!;
      rangeMin = +rangeMin;
      rangeMax = +rangeMax;
      return rescale();
    }
    return [rangeMin, rangeMax];
  };
  scale.rangeRound = function (range: [number, number]) {
    [rangeMin, rangeMax] = range;
    rangeMin = +rangeMin;
    rangeMax = +rangeMax;
    round = true;
    return rescale();
  };
  scale.bandwidth = function () {
    return bandwidth;
  };
  scale.step = function () {
    return step;
  };
  scale.round = function (value?: boolean) {
    if (arguments.length) {
      round = !!value;
      return rescale();
    }
    return round;
  };
  scale.padding = function (value?: number) {
    if (arguments.length) {
      paddingInner = Math.min(1, (paddingOuter = +value!));
      return rescale();
    }
    return paddingInner;
  };
  scale.paddingInner = function (value?: number) {
    if (arguments.length) {
      paddingInner = Math.min(1, value!);
      return rescale();
    }
    return paddingInner;
  };
  scale.paddingOuter = function (value?: number) {
    if (arguments.length) {
      paddingOuter = +value!;
      return rescale();
    }
    return paddingOuter;
  };
  scale.align = function (value?: number) {
    if (arguments.length) {
      alignRatio = Math.max(0, Math.min(1, value!));
      return rescale();
    }
    return alignRatio;
  };
  scale.copy = function () {
    return bandScale()
      .domain(domainFn())
      .range([rangeMin, rangeMax])
      .round(round)
      .paddingInner(paddingInner)
      .paddingOuter(paddingOuter)
      .align(alignRatio);
  };
  init.apply(rescale(), arguments);
  return scale;
}
function pointScaleWrapper(scale: BandScale): PointScale {
  const originalCopy = scale.copy;
  scale.padding = scale.paddingOuter;
  delete (scale as Record<string, unknown>).paddingInner;
  delete (scale as Record<string, unknown>).paddingOuter;
  scale.copy = function () {
    return pointScaleWrapper(originalCopy());
  };
  return scale as PointScale;
}
export function pointScale(): PointScale {
  return pointScaleWrapper(
    bandScale.apply(null, arguments as unknown as []).paddingInner(1),
  );
}
export { range as bandRange };
export interface BandScale {
  (value: unknown): number | undefined;
  domain(): unknown[];
  domain(domain: unknown[]): BandScale;
  range(): [number, number];
  range(range: [number, number]): BandScale;
  rangeRound(range: [number, number]): BandScale;
  bandwidth(): number;
  step(): number;
  round(): boolean;
  round(value: boolean): BandScale;
  padding(): number;
  padding(value: number): BandScale;
  paddingInner(): number;
  paddingInner(value: number): BandScale;
  paddingOuter(): number;
  paddingOuter(value: number): BandScale;
  align(): number;
  align(value: number): BandScale;
  copy(): BandScale;
}
export interface PointScale {
  (value: unknown): number | undefined;
  domain(): unknown[];
  domain(domain: unknown[]): PointScale;
  range(): [number, number];
  range(range: [number, number]): PointScale;
  bandwidth(): number;
  step(): number;
  round(): boolean;
  round(value: boolean): PointScale;
  padding(): number;
  padding(value: number): PointScale;
  align(): number;
  align(value: number): PointScale;
  copy(): PointScale;
}

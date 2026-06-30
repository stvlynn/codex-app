// Restored from ref/webview/assets/axis-BWiM9Kg7.js
// D3 axis / color utilities restored from the Codex webview bundle.

import { linearI, linearL, linearR, linearS } from "./d3-scale-linear";
import {
  stringA,
  stringC,
  stringD,
  stringF,
  stringI,
  stringS,
  stringU,
} from "./d3-color-string";
import { init } from "./d3-scale-init";
const DEG_TO_RAD = Math.PI / 180;
const RAD_TO_DEG = 180 / Math.PI;
function labColor(input: unknown): LabColor {
  if (input instanceof LabColor) {
    return new LabColor(input.l, input.a, input.b, input.opacity);
  }
  if (input instanceof HclColor) return hclToLab(input);
  const rgb = input instanceof RgbColor ? input : stringU(input);
  const r = gammaToLinear(rgb.r);
  const g = gammaToLinear(rgb.g);
  const b = gammaToLinear(rgb.b);
  const y = linearToLab((0.2225045 * r + 0.7168786 * g + 0.0606169 * b) / 1);
  let x: number;
  let z: number;
  if (r === g && g === b) {
    x = z = y;
  } else {
    x = linearToLab((0.4360747 * r + 0.3850649 * g + 0.1430804 * b) / 0.96422);
    z = linearToLab((0.0139322 * r + 0.0971045 * g + 0.7141733 * b) / 0.82521);
  }
  return new LabColor(116 * y - 16, 500 * (x - y), 200 * (y - z), rgb.opacity);
}
function lab(l: number, a: number, b: number, opacity?: number): LabColor {
  return arguments.length === 1
    ? labColor(l)
    : new LabColor(l, a, b, opacity ?? 1);
}
function LabColor(
  this: LabColor,
  l: number,
  a: number,
  b: number,
  opacity: number,
) {
  this.l = +l;
  this.a = +a;
  this.b = +b;
  this.opacity = +opacity;
}
stringD(
  LabColor,
  lab,
  stringF(stringS, {
    brighter(k?: number) {
      return new LabColor(this.l + 18 * (k ?? 1), this.a, this.b, this.opacity);
    },
    darker(k?: number) {
      return new LabColor(this.l - 18 * (k ?? 1), this.a, this.b, this.opacity);
    },
    rgb() {
      let y = (this.l + 16) / 116;
      let x = isNaN(this.a) ? y : y + this.a / 500;
      let z = isNaN(this.b) ? y : y - this.b / 200;
      return new RgbColor(
        labToGamma(0.96422 * linearToGamma(x)),
        labToGamma(1 * linearToGamma(y)),
        labToGamma(0.82521 * linearToGamma(z)),
        this.opacity,
      );
    },
  }),
);
function hcl(h: number, c: number, l: number, opacity?: number): HclColor {
  return arguments.length === 1
    ? hclColor(h)
    : new HclColor(h, c, l, opacity ?? 1);
}
function hclColor(input: unknown): HclColor {
  if (input instanceof HclColor)
    return new HclColor(input.h, input.c, input.l, input.opacity);
  if (input instanceof LabColor) return labToHcl(input);
  const labVal = labColor(input);
  return labToHcl(labVal);
}
function HclColor(
  this: HclColor,
  h: number,
  c: number,
  l: number,
  opacity: number,
) {
  this.h = +h;
  this.c = +c;
  this.l = +l;
  this.opacity = +opacity;
}
function labToHcl(labVal: LabColor): HclColor {
  const h = Math.atan2(labVal.b, labVal.a) * RAD_TO_DEG;
  return new HclColor(
    h < 0 ? h + 360 : h,
    Math.sqrt(labVal.a * labVal.a + labVal.b * labVal.b),
    labVal.l,
    labVal.opacity,
  );
}
function hclToLab(hclVal: HclColor): LabColor {
  return isNaN(hclVal.h)
    ? new LabColor(hclVal.l, 0, 0, hclVal.opacity)
    : new LabColor(
        hclVal.l,
        hclVal.c * Math.cos(hclVal.h * DEG_TO_RAD),
        hclVal.c * Math.sin(hclVal.h * DEG_TO_RAD),
        hclVal.opacity,
      );
}
stringD(
  HclColor,
  hcl,
  stringF(stringS, {
    brighter(k?: number) {
      return new HclColor(this.h, this.c, this.l + 18 * (k ?? 1), this.opacity);
    },
    darker(k?: number) {
      return new HclColor(this.h, this.c, this.l - 18 * (k ?? 1), this.opacity);
    },
    rgb() {
      return hclToLab(this).rgb();
    },
  }),
);
function RgbColor(
  this: RgbColor,
  r: number,
  g: number,
  b: number,
  opacity: number,
) {
  this.r = +r;
  this.g = +g;
  this.b = +b;
  this.opacity = +opacity;
}
function gammaToLinear(value: number): number {
  return (value /= 255) <= 0.04045
    ? value / 12.92
    : Math.pow((value + 0.055) / 1.055, 2.4);
}
function linearToGamma(value: number): number {
  return (
    255 *
    (value <= 0.0031308
      ? 12.92 * value
      : 1.055 * Math.pow(value, 1 / 2.4) - 0.055)
  );
}
function linearToLab(value: number): number {
  return value > 0.008856
    ? Math.pow(value, 1 / 3)
    : value / 0.128418 + 16 / 116;
}
function labToGamma(value: number): number {
  return value > 0.206893
    ? value * value * value
    : 0.128418 * (value - 16 / 116);
}
export const labColorSpace = stringI(lab);
export function hclColorSpace() {
  return stringA(hcl);
}
export function interpolateLab(start: string, end: string) {
  return stringC(labColorSpace, start, end);
}
export function interpolateHcl(start: string, end: string) {
  return stringC(hclColorSpace, start, end);
}
export function interpolateHclLong(start: string, end: string) {
  return stringC(hclColorSpace, start, end);
}
export {
  labColorSpace as lab,
  hclColorSpace as hcl,
  interpolateLab,
  interpolateHcl,
  interpolateHclLong,
  LabColor,
  HclColor,
  RgbColor,
};
export interface LabColor {
  l: number;
  a: number;
  b: number;
  opacity: number;
  brighter(k?: number): LabColor;
  darker(k?: number): LabColor;
  rgb(): RgbColor;
}
export interface HclColor {
  h: number;
  c: number;
  l: number;
  opacity: number;
  brighter(k?: number): HclColor;
  darker(k?: number): HclColor;
  rgb(): RgbColor;
}
export interface RgbColor {
  r: number;
  g: number;
  b: number;
  opacity: number;
}

// Restored from ref/webview/assets/use-transform-Cjp4fIKs.js
// use-transform-Cjp4fIKs chunk restored from the Codex webview bundle.
import React from "react";
import { useMotionValue, useContext as useMotionContext } from "framer-motion";
import { J, dt, q, tt, ut } from "../boundaries/single-value.ts";
export type SingleValue = {
  get(): number;
  set(v: number | ((prev: number) => void)): void;
  on(event: string, callback: (v: number) => void): () => void;
};
function createTransform(
  ...args: [number, number, number, number] | [string, number, number, number]
): (value: number) => number | string {
  const isSingleValue = !Array.isArray(args[0]);
  const offset = isSingleValue ? 0 : -1;
  const inputValue = args[0 + offset] as number | string;
  const min = args[1 + offset] as number;
  const max = args[2 + offset] as number;
  const transformValue = args[3 + offset] as number;
  const transformer = tt(min, max, transformValue);
  return isSingleValue
    ? transformer(inputValue as number)
    : (transformer as (v: number) => number | string);
}
function useMotionValueFromValue(initialValue: number): SingleValue {
  const motionValue = useMotionValue(() => J(initialValue));
  const { isStatic } = useMotionContext();
  if (isStatic) {
    const [, setState] = React.useState(initialValue);
    React.useEffect(() => motionValue.on("change", setState), []);
  }
  return motionValue as SingleValue;
}
function useDerivedMotionValue(
  dependencies: SingleValue[],
  computeValue: () => number,
): SingleValue {
  const motionValue = useMotionValueFromValue(computeValue());
  const updateValue = () => motionValue.set(computeValue());
  updateValue();
  React.useEffect(() => {
    const scheduleUpdate = () => dt.preRender(updateValue, false, true);
    const unsubscribers = dependencies.map((dep) =>
      dep.on("change", scheduleUpdate),
    );
    return () => {
      unsubscribers.forEach((unsubscribe) => unsubscribe());
      ut(updateValue);
    };
  }, [dependencies, computeValue, motionValue]);
  return motionValue;
}
function useTransformFromFunction(computeFn: () => number): SingleValue {
  q.current = [];
  computeFn();
  const dependencies = q.current;
  q.current = undefined;
  return useDerivedMotionValue(dependencies, computeFn);
}
export function useTransform(
  input: SingleValue | SingleValue[],
  outputMin?: number | ((value: number) => number | string),
  outputMax?: number,
  transformValue?: number,
): SingleValue {
  if (typeof input === "function") {
    return useTransformFromFunction(input);
  }
  const transformFn =
    typeof outputMin === "function"
      ? outputMin
      : createTransform(outputMin, outputMax, transformValue);
  const inputArray = Array.isArray(input) ? input : [input];
  return useTransformArray(inputArray, ([firstValue]) =>
    transformFn(firstValue),
  );
}
function useTransformArray(
  inputs: SingleValue[],
  transform: (values: number[]) => number | string,
): SingleValue {
  const resultValues = useMotionValueFromValue(0);
  return useDerivedMotionValue(inputs, () => {
    const values: number[] = [];
    const length = inputs.length;
    for (let i = 0; i < length; i++) {
      values[i] = inputs[i].get();
    }
    return transform(values) as number;
  });
}
export { useDerivedMotionValue as useTransformValue, useMotionValueFromValue };

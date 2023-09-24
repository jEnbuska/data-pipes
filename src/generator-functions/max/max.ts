import { type OperatorGenerator } from "../../types.ts";

export function* max<T>(
  generator: OperatorGenerator<T>,
  callback: (next: T) => number,
) {
  let currentMax: undefined | number;
  let current: undefined | T;
  for (const next of generator) {
    const value = callback(next);
    if (currentMax === undefined || value > currentMax) {
      current = next;
      currentMax = value;
    }
  }
  if (currentMax === undefined) return;
  yield current as T;
}

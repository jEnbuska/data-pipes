import { type OperatorGenerator } from "../../types.ts";

export function* min<T>(
  generator: OperatorGenerator<T>,
  callback: (next: T) => number,
) {
  let currentMin: undefined | number;
  let current: undefined | T;
  for (const next of generator) {
    const value = callback(next);
    if (currentMin === undefined || value < currentMin) {
      current = next;
      currentMin = value;
    }
  }
  if (currentMin === undefined) return;
  yield current as T;
}

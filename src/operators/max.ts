import { type OperatorGenerator } from "../types.ts";
import { chainable } from "../chainable.ts";

export function max<T>(generator: OperatorGenerator<T>) {
  return (callback: (next: T) => number) =>
    chainable(function* (isDone) {
      let currentMax: undefined | number = undefined;
      let current: undefined | T = undefined;
      for (const next of generator(isDone)) {
        if (isDone()) return;
        const value = callback(next);
        if (currentMax === undefined || value > currentMax) {
          current = next;
          currentMax = value;
        }
      }
      if (currentMax === undefined) return;
      yield current as T;
    });
}

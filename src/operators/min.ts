import { type OperatorGenerator } from "../types.ts";
import { chainable } from "../chainable.ts";

export function min<T>(generator: OperatorGenerator<T>) {
  return (callback: (next: T) => number) =>
    chainable(function* () {
      let currentMin: undefined | number = undefined;
      let current: undefined | T = undefined;
      for (const next of generator()) {
        const value = callback(next);

        if (currentMin === undefined || value < currentMin) {
          current = next;
          currentMin = value;
        }
      }
      if (currentMin === undefined) return;
      yield current as T;
    });
}

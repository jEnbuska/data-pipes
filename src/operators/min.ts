import { type OperatorGenerator } from "./types.ts";
import { yieldMin } from "./utils.ts";
import { toArray } from "../consumers/toArray.ts";
import { chainable } from "../chainable.ts";

export const min =
  <T>(generator: OperatorGenerator<T>) => (fn: (next: T) => number) =>
    chainable(function* () {
      yield* yieldMin(toArray(generator), (item) => fn(item));
    });

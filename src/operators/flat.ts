import { type OperatorGenerator } from "./types.ts";
import { chainable } from "../chainable.ts";

export function flat<T>(generator: OperatorGenerator<T>) {
  return <D extends number = 1>(depth?: D) =>
    chainable(function* () {
      for (const next of generator()) {
        if (Array.isArray(next)) {
          yield* next.flat(depth);
          continue;
        }
        yield next as FlatArray<T, D>;
      }
    });
}

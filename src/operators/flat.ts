import { type OperatorGenerator } from "../types.ts";
import { chainable } from "../chainable.ts";

export function flat<T>(generator: OperatorGenerator<T>) {
  return <D extends number = 1>(depth?: D) => {
    return chainable(function* () {
      depth = depth ?? (1 as D);
      for (const next of generator()) {
        if (!Array.isArray(next) || depth! <= 0) {
          yield next as FlatArray<T, D>;
          continue;
        }
        yield* next.flat(depth! - 1) as any;
      }
    });
  };
}

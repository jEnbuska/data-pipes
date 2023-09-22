import { type OperatorGenerator } from "../types.ts";
import { chainable } from "../chainable.ts";

export function flat<T>(generator: OperatorGenerator<T>) {
  return <D extends number = 1>(depth?: D) => {
    return chainable(function* (isDone) {
      depth = depth ?? (1 as D);
      for (const next of generator(isDone)) {
        if (isDone()) return;
        if (!Array.isArray(next) || depth! <= 0) {
          yield next as FlatArray<T, D>;
          continue;
        }
        yield* next.flat(depth! - 1) as any;
      }
    });
  };
}

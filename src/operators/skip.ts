import { type OperatorGenerator } from "../types.ts";
import { chainable } from "../chainable.ts";

export function skip<T>(generator: OperatorGenerator<T>) {
  return (count: number) =>
    chainable(function* (isDone) {
      let skipped = 0;
      for (const next of generator(isDone)) {
        if (isDone()) return;
        if (skipped < count) {
          skipped++;
          continue;
        }
        yield next;
      }
    });
}

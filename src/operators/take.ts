import { type OperatorGenerator } from "../types.ts";
import { chainable } from "../chainable.ts";

export function take<T>(generator: OperatorGenerator<T>) {
  return (count: number) =>
    chainable(function* () {
      for (const next of generator()) {
        if (count <= 0) {
          break;
        }
        count--;
        yield next;
      }
    });
}

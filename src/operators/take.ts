import { type OperatorGenerator } from "./types.ts";
import { chainable } from "../chainable.ts";

export function take<T>(generator: OperatorGenerator<T>) {
  return (count: number) =>
    chainable(function* (isDone) {
      let done = false;
      for (const next of generator(() => done || isDone())) {
        if (isDone()) return;
        if (count <= 0) {
          done = true;
          break;
        }
        count--;
        yield next;
      }
    });
}

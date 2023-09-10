import {
  type AsyncOperatorGenerator,
  type OperatorGenerator,
} from "./types.ts";
import { chainable } from "../chainable.ts";

export function defaultIfEmpty<T>(generator: OperatorGenerator<T>) {
  return <R = T>(defaultValue: R) =>
    chainable(function* () {
      let empty = true;
      for (const next of generator()) {
        yield next;
        empty = false;
      }
      if (empty) {
        yield defaultValue;
      }
    });
}

export function defaultIfEmptyAsync<T>(generator: AsyncOperatorGenerator<T>) {
  return <R = T>(defaultValue: R) =>
    chainable(async function* () {
      let empty = true;
      for await (const next of generator()) {
        yield next;
        empty = false;
      }
      if (empty) {
        yield defaultValue;
      }
    });
}

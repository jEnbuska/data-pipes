import {
  type AsyncOperatorGenerator,
  type OperatorGenerator,
} from "./types.ts";
import { chainable } from "../chainable.ts";

export const some =
  <T>(generator: OperatorGenerator<T>) => (fn: (next: T) => boolean) => {
    return chainable(function* () {
      for (const next of generator()) {
        if (fn(next)) {
          yield true;
          return;
        }
      }
      yield false;
    });
  };

export const someAsync =
  <T>(generator: AsyncOperatorGenerator<T>) => (fn: (next: T) => boolean) => {
    return chainable(async function* () {
      for await (const next of generator()) {
        if (fn(next)) {
          yield true;
          return;
        }
      }
      yield false;
    });
  };

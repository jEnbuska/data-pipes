import { type OperatorGenerator } from "./types.ts";
import { reduce } from "./reduce.ts";

export function unflat<T>(generator: OperatorGenerator<T>) {
  return () =>
    reduce<T>(generator)(function (acc: T[], next) {
      acc.push(next);
      return acc;
    }, []);
}

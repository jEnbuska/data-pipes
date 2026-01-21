import { type YieldedProvider } from "../../types.ts";
import { $next } from "../actions.ts";

const defaultCompare = <In>(a: In, b: In) => a === b;

export function distinctUntilChanged<In>(
  compare: (
    previous: In,
    current: In,
    index: number,
  ) => boolean = defaultCompare,
): YieldedProvider<In> {
  return () => ({
    *onNext(first) {
      let previous = first;
      yield $next(first);
      let index = 1;
      return {
        *onNext(next) {
          if (!compare(previous, next, index++)) return;
          previous = next;
          yield $next(next);
        },
      };
    },
  });
}

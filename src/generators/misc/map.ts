import { type YieldedProvider } from "../../types.ts";
import { $next } from "../actions.ts";

export function map<In, Out>(
  mapper: (next: In, index: number) => Out,
): YieldedProvider<In, Out> {
  return () => {
    let index = 0;
    return {
      *onNext(next) {
        yield $next(mapper(next, index++));
      },
    };
  };
}

export function mapPairwise<In, Out>(
  mapper: (previous: In, next: In) => Out,
): YieldedProvider<In, Out, never> {
  return () => ({
    *onNext(previous) {
      return {
        *onNext(next) {
          yield $next(mapper(previous, next));
          previous = next;
        },
      };
    },
  });
}

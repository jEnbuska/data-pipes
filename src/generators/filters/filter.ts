import { type YieldedProvider } from "../../types.ts";
import { $next } from "../actions.ts";

export function filter<In, Out extends In = In>(
  predicate: (next: In, index: number) => next is Out,
): YieldedProvider<In, Out>;
export function filter<In>(
  predicate: (next: In, index: number) => any,
): YieldedProvider<In>;
export function filter(
  predicate: (next: unknown, index: number) => unknown,
): YieldedProvider<unknown, unknown> {
  return () => {
    let index = 0;
    return {
      *onNext(next) {
        if (!predicate(next, index++)) return;
        yield $next(next);
      },
    };
  };
}

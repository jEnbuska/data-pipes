import { type YieldedProvider } from "../../types.ts";
import { $done, $next, $return } from "../actions.ts";

export function find<In, Out extends In>(
  predicate: (next: In) => next is Out,
): YieldedProvider<Out | undefined, Out | undefined, Out | undefined>;
export function find<In>(
  predicate: (next: In, index: number) => unknown,
): YieldedProvider<In | undefined, In | undefined, In | undefined>;
export function find(
  predicate: (next: unknown, index: number) => unknown,
): YieldedProvider<unknown, unknown, unknown> {
  return () => {
    let found: { item: unknown };
    let index = 0;
    return {
      *onNext(next) {
        if (!predicate(next, index++)) return;
        found = { item: next };
        yield $done();
      },
      *onDone() {
        if (found) yield $next(found.item);
        yield $return(found?.item);
      },
    };
  };
}

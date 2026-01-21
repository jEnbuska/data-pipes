import { type YieldedProvider } from "../../types.ts";
import { $done, $next } from "../actions.ts";

export function takeWhile<In>(
  predicate: (next: In, index: number) => boolean,
): YieldedProvider<In> {
  return () => {
    let index = 0;
    return {
      *onNext(next) {
        if (predicate(next, index++)) {
          yield $next(next);
          return;
        }
        yield $done();
      },
    };
  };
}

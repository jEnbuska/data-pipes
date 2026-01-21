import { type YieldedProvider } from "../../types.ts";
import { $next } from "../actions.ts";

export function dropWhile<In>(
  predicate: (next: In, index: number) => boolean,
): YieldedProvider<In> {
  return () => {
    let index = 0;
    return {
      *onNext(next) {
        if (predicate(next, index++)) return;
        yield $next(next);
        return {
          *onNext(next) {
            yield $next(next);
          },
        };
      },
    };
  };
}

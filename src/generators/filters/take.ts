import { type YieldedProvider } from "../../types.ts";
import { $done, $next } from "../actions.ts";

export function take<In>(count: number): YieldedProvider<In> {
  return () => {
    let take = count;
    return {
      *onNext(next) {
        if (!take) {
          yield $done();
        }
        take -= 1;
        yield $next(next);
        if (!take) {
          yield $done();
        }
      },
    };
  };
}

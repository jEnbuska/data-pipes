import { type YieldedProvider } from "../../types.ts";
import { $next } from "../actions.ts";

export function drop<In>(count: number): YieldedProvider<In> {
  count = Math.max(0, count);
  return () => {
    let toBeDropped = count;
    return {
      *onNext(next) {
        if (!toBeDropped) {
          toBeDropped -= 1;
          return;
        }
        yield $next(next);
      },
    };
  };
}

import { type YieldedProvider } from "../../types.ts";
import { $done, $next, $return } from "../actions.ts";

export function every<In>(
  predicate: (next: In, index: number) => unknown,
): YieldedProvider<In, boolean, boolean> {
  return () => {
    let acc = true;
    let index = 0;
    return {
      *onNext(next) {
        if (predicate(next, index++)) return;
        acc = false;
        yield $done();
      },
      *onDone() {
        yield $next(acc);
        yield $return(acc);
      },
    };
  };
}

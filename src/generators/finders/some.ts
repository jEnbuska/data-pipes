import { type YieldedProvider } from "../../types.ts";
import { $done, $next, $return } from "../actions.ts";

export function someSync<In>(
  predicate: (next: In, index: number) => unknown,
): YieldedProvider<In, boolean, boolean> {
  return () => {
    let acc = false;
    let index = 0;
    return {
      *onNext(next) {
        if (!predicate(next, index++)) return;
        acc = true;
        yield $done();
      },
      *onDone() {
        yield $next(acc);
        yield $return(acc);
      },
    };
  };
}

import { type YieldedProvider } from "../../types.ts";
import { $next } from "../actions.ts";

export function batch<In>(
  predicate: (acc: In[]) => boolean,
): YieldedProvider<In, In[]> {
  return () => {
    let acc: In[] = [];
    return {
      *onNext(next) {
        acc.push(next);
        if (!predicate(acc)) return;
        yield $next(acc);
        acc = [];
      },
      *onDone() {
        if (!acc.length) return;
        yield $next(acc);
        acc = [];
      },
    };
  };
}

import { type YieldedProvider } from "../../types.ts";
import { $next, $nextFlat } from "../actions.ts";

export function flatMap<In, Out>(
  flatMapper: (next: In) => Out | readonly Out[],
): YieldedProvider<In, Out> {
  return () => ({
    *onNext(next: In) {
      const out = flatMapper(next);
      if (Array.isArray(out)) {
        yield $nextFlat(out as Out[]);
      } else {
        yield $next(out as Out);
      }
    },
  });
}

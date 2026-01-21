import { type YieldedProvider } from "../../types.ts";
import { $next, $nextFlat } from "../actions.ts";

export function flat<In, const Depth extends number = 1>(
  depth?: Depth,
): YieldedProvider<In, FlatArray<In[], Depth>> {
  depth = depth ?? (1 as Depth);
  return () => ({
    *onNext(next) {
      if (!Array.isArray(next) || depth <= 0) {
        yield $next(next as FlatArray<In[], Depth>);
      } else {
        yield $nextFlat(next.flat(depth - 1) as Array<FlatArray<In[], Depth>>);
      }
    },
  });
}

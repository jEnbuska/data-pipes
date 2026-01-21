import { _yielded } from "../../_internal.ts";
import { type YieldedProvider } from "../../types.ts";
import { optimumBy } from "./optimumBy.ts";

export function minBy<In>(
  callback: (next: In) => number,
): YieldedProvider<In, In, In | undefined> {
  return () => {
    const getNumeric = _yielded.createMemoize1<In, number>(callback);
    const invokeOptimumBy = optimumBy<In>(
      (acc, next) => getNumeric(acc) > getNumeric(next),
    );
    return {
      ...invokeOptimumBy(),
      onDispose: getNumeric.dispose,
    };
  };
}

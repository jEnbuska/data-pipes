import { type YieldedProvider } from "../../types.ts";
import { $nextFlat, $returnFlat } from "../actions.ts";

export function chunkBy<In, TIdentifier = any>(
  keySelector: (next: In) => TIdentifier,
): YieldedProvider<In, In[], In[]> {
  return () => {
    const arr: In[][] = [];
    const map = new Map<TIdentifier, number>();
    return {
      *onNext(next) {
        const key = keySelector(next);
        if (!map.has(key)) {
          const index = arr.length;
          map.set(key, arr.length);
          arr[index] = [];
        }
        arr[map.get(key)!].push(next);
      },
      *onDone() {
        yield $nextFlat(arr);
        yield $returnFlat(arr);
      },
    };
  };
}

import { type YieldedProvider } from "../../types.ts";
import { $nextFlat, $return } from "../actions.ts";

export function toSorted<In>(
  compareFn: (a: In, b: In) => number,
): YieldedProvider<In, In, In[]> {
  return () => {
    const acc: In[] = [];
    const findIndex = createIndexFinder(acc, compareFn);
    return {
      *onNext(next) {
        acc.splice(findIndex(next), 0, next);
      },
      *onDone() {
        yield $nextFlat(acc);
        yield $return(acc);
      },
    };
  };
}

function createIndexFinder<In>(
  arr: In[],
  comparator: (a: In, b: In) => number,
) {
  return function findIndex(next: In, low = 0, high = arr.length - 1) {
    if (low > high) {
      return low;
    }
    const mid = Math.floor((low + high) / 2);
    const diff = comparator(next, arr[mid]);
    if (diff < 0) {
      return findIndex(next, low, mid - 1);
    }
    return findIndex(next, mid + 1, high);
  };
}

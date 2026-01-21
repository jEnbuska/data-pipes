import { type YieldedProvider } from "../../types.ts";
import { $nextFlat, $returnFlat } from "../actions.ts";

export function takeLast<In>(count: number): YieldedProvider<In, In, In[]> {
  return () => {
    const acc: In[] = [];
    return {
      *onNext(next) {
        acc.push(next);
      },
      *onDone() {
        const lastItems = acc.slice(Math.max(acc.length - count, 0));
        yield $nextFlat(lastItems);
        yield $returnFlat(lastItems);
      },
    };
  };
}

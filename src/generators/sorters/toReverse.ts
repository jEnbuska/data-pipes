import { type YieldedProvider } from "../../types.ts";
import { $nextFlat, $return } from "../actions.ts";

export function toReverse<In>(): YieldedProvider<In, In, In[]> {
  return () => {
    const acc: In[] = [];
    return {
      *onNext(next) {
        acc.unshift(next);
      },
      *onDone() {
        yield $nextFlat(acc);
        yield $return(acc);
      },
    };
  };
}

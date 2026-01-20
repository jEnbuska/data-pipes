import { getCommands } from "../../commands/Commands.ts";
import { defineOperator } from "../../defineOperator.ts";
import type { MaybePromise } from "../../types.ts";

const defaultCompare = <TData>(a: TData, b: TData) => a === b;

function distinctUntilChanged<TAsync extends boolean, TIn>(
  toAwaited: TAsync,
  compare: (
    previous: TIn,
    current: TIn,
  ) => MaybePromise<TAsync, boolean> = defaultCompare,
) {
  const { $next, $resolve } = getCommands<TIn>(toAwaited);
  return function* distinctUntilChangedResolver() {
    let previous = yield* $next();
    yield previous;
    while (true) {
      const value = yield* $next();
      const same = yield* $resolve(compare(previous, value));
      if (!same) {
        previous = value;
        yield value;
      }
    }
  };
}

export default defineOperator({
  name: "distinctUntilChanged",
  distinctUntilChangedSync,
  distinctUntilChangedAsync,
});

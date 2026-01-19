import type {
  AsyncOperatorResolver,
  SyncOperatorResolver,
} from "../../create/createYielded.ts";
import { defineOperator } from "../../create/createYielded.ts";
import { startGenerator } from "../../startGenerator.ts";

const defaultCompare = <TData>(a: TData, b: TData) => a === b;

function distinctUntilChangedSync<TArgs extends any[], TIn>(
  compare: (previous: TIn, current: TIn) => boolean = defaultCompare,
): SyncOperatorResolver<TArgs, TIn> {
  return function* distinctUntilChangedSyncResolver(...args) {
    using generator = startGenerator(...args);
    const initial = generator.next();
    if (initial.done) return;
    let previous = initial.value;
    for (const value of generator) {
      if (!compare(previous, value)) {
        previous = value;
        yield value;
      }
    }
  };
}

function distinctUntilChangedAsync<TArgs extends any[], TIn>(
  compare: (
    previous: TIn,
    current: TIn,
  ) => boolean | Promise<boolean> = defaultCompare,
): AsyncOperatorResolver<TArgs, TIn> {
  return async function* distinctUntilChangedAsyncResolver(...args) {
    using generator = startGenerator(...args);
    const initial = await generator.next();
    if (initial.done) return;
    let previous = initial.value;
    for await (const value of generator) {
      if (!(await compare(previous, value))) {
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

import { startGenerator } from "../../startGenerator.ts";
import type { AsyncOperator, SyncOperator } from "../../types.ts";

export function* someSync<TArgs extends any[], TIn>(
  predicate: (next: TIn) => boolean,
): SyncOperator<TArgs, TIn, boolean, boolean> {
  yield false;
  return function* someSyncResolver(...args) {
    using generator = startGenerator(...args);
    for (const next of generator) {
      if (predicate(next)) {
        yield true;
        return;
      }
    }
    yield false;
  };
}
export function* someAsync<TArgs extends any[], TIn>(
  predicate: (next: TIn) => boolean | Promise<boolean>,
): AsyncOperator<TArgs, TIn, boolean, boolean> {
  yield false;
  return async function* someAsyncResolver(...args) {
    using generator = startGenerator(...args);
    for await (const next of generator) {
      if (await predicate(next)) {
        yield true;
        return;
      }
    }
    yield false;
  };
}

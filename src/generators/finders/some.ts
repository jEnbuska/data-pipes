import type {
  AsyncOperatorResolver,
  SyncOperatorResolver,
} from "../../create/createYielded.ts";
import { startGenerator } from "../../startGenerator.ts";

export function someSync<TArgs extends any[], TIn>(
  predicate: (next: TIn) => boolean,
): SyncOperatorResolver<TArgs, TIn, boolean> {
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
export function someAsync<TArgs extends any[], TIn>(
  predicate: (next: TIn) => boolean | Promise<boolean>,
): AsyncOperatorResolver<TArgs, TIn, boolean> {
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

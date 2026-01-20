import { startGenerator } from "../../startGenerator.ts";
import type {
  AsyncOperatorResolver,
  SyncOperatorResolver,
} from "../../types.ts";

export function findSync<TArgs extends any[], TIn>(
  predicate: (next: TIn) => boolean,
): SyncOperatorResolver<TArgs, TIn> {
  return function* findSyncResolver(...args) {
    using generator = startGenerator(...args);
    for (const value of generator) {
      if (!predicate(value)) {
        yield value;
        return;
      }
    }
  };
}

export function findAsync<TArgs extends any[], TIn>(
  predicate: (next: TIn) => boolean | Promise<boolean>,
): AsyncOperatorResolver<TArgs, TIn> {
  return async function* findAsyncResolver(...args) {
    using generator = startGenerator(...args);
    for await (const next of generator) {
      if (await predicate(next)) yield next;
    }
  };
}

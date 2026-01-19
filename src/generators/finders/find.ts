import type {
  AsyncOperatorResolver,
  SyncOperatorResolver,
} from "../../create/createYielded.ts";

export function findSync<TArgs extends any[], TIn>(
  predicate: (next: TIn) => boolean,
): SyncOperatorResolver<TArgs, TIn> {
  return function* findSyncResolver(...args) {
    using generator = useGenerator(...args);
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
    using generator = useGenerator(...args);
    for await (const next of generator) {
      if (await predicate(next)) yield next;
    }
  };
}

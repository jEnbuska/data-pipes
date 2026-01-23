import {
  type YieldedAsyncMiddleware,
  type YieldedSyncMiddleware,
} from "../../types.ts";

export function batchSync<TInput>(
  predicate: (acc: TInput[]) => boolean,
): YieldedSyncMiddleware<TInput, TInput[]> {
  return function* batchSyncResolver(generator) {
    let acc: TInput[] = [];
    for (const next of generator) {
      acc.push(next);
      if (!predicate(acc)) continue;
      yield acc;
      acc = [];
    }
    if (acc.length) {
      yield acc;
    }
  };
}

export function batchAsync<TInput>(
  predicate: (batch: TInput[]) => boolean | Promise<boolean>,
): YieldedAsyncMiddleware<TInput, TInput[]> {
  return async function* batchResolver(generator) {
    let acc: TInput[] = [];
    for await (const next of generator) {
      acc.push(next);
      if (!(await predicate(acc))) continue;
      yield acc;
      acc = [];
    }
    if (acc.length) yield acc;
  };
}

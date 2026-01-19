import type {
  AsyncOperatorResolver,
  SyncOperatorResolver,
} from "../../create/createYielded.ts";
import { startGenerator } from "../../startGenerator.ts";

export function batchSync<TArgs extends any[], TIn>(
  predicate: (acc: TIn[]) => boolean,
): SyncOperatorResolver<TArgs, TIn, TIn[]> {
  return function* batchSyncResolver(...args) {
    using generator = startGenerator(...args);
    let acc: TIn[] = [];
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

export function batchAsync<TArgs extends any[], TIn>(
  predicate: (batch: TIn[]) => boolean | Promise<boolean>,
): AsyncOperatorResolver<TArgs, TIn, TIn[]> {
  return async function* batchAsyncResolver(...args) {
    using generator = startGenerator(...args);
    let acc: TIn[] = [];
    for await (const next of generator) {
      acc.push(next);
      if (!(await predicate(acc))) continue;
      yield acc;
      acc = [];
    }
    if (acc.length) yield acc;
  };
}

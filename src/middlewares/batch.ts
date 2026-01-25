import type {
  PromiseOrNot,
  YieldedAsyncGenerator,
  YieldedIterator,
} from "../shared.types.ts";

export function* batchSync<T>(
  generator: YieldedIterator<T>,
  predicate: (acc: T[]) => boolean,
): YieldedIterator<T[]> {
  let acc: T[] = [];
  for (const next of generator) {
    acc.push(next);
    if (!predicate(acc)) continue;
    yield acc;
    acc = [];
  }
  if (acc.length) yield acc;
}

export async function* batchAsync<T>(
  generator: YieldedAsyncGenerator<T>,
  predicate: (batch: T[]) => PromiseOrNot<boolean>,
): YieldedAsyncGenerator<T[]> {
  let acc: T[] = [];
  for await (const next of generator) {
    acc.push(next);
    if (!(await predicate(acc))) continue;
    yield acc;
    acc = [];
  }
  if (acc.length) yield acc;
}

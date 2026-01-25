import type { YieldedAsyncGenerator, YieldedIterator } from "../../types.ts";

export function* batchSync<TInput>(
  generator: YieldedIterator<TInput>,
  predicate: (acc: TInput[]) => boolean,
): YieldedIterator<TInput[]> {
  let acc: TInput[] = [];
  for (const next of generator) {
    acc.push(next);
    if (!predicate(acc)) continue;
    yield acc;
    acc = [];
  }
  if (acc.length) yield acc;
}

export async function* batchAsync<TInput>(
  generator: YieldedAsyncGenerator<TInput>,
  predicate: (batch: TInput[]) => Promise<boolean> | boolean,
): YieldedAsyncGenerator<TInput[]> {
  let acc: TInput[] = [];
  for await (const next of generator) {
    acc.push(next);
    if (!(await predicate(acc))) continue;
    yield acc;
    acc = [];
  }
  if (acc.length) yield acc;
}

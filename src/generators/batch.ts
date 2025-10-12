import type { PipeSource, AsyncPipeSource } from "../types.ts";

export function batch<TInput>(
  source: PipeSource<TInput>,
  predicate: (acc: TInput[]) => boolean,
): PipeSource<TInput[]> {
  return function* batchGenerator(signal) {
    let acc: TInput[] = [];
    for (const next of source(signal)) {
      acc.push(next);
      if (!predicate(acc)) {
        continue;
      }
      yield acc;
      acc = [];
    }
    if (acc.length) {
      yield acc;
    }
  };
}

export function batchAsync<TInput>(
  source: AsyncPipeSource<TInput>,
  predicate: (batch: TInput[]) => boolean,
): AsyncPipeSource<TInput[]> {
  return async function* batchGenerator(signal) {
    let acc: TInput[] = [];
    for await (const next of source(signal)) {
      if (signal.aborted) return;
      acc.push(next);
      if (!predicate(acc)) continue;
      yield acc;
      acc = [];
    }
    if (acc.length) yield acc;
  };
}

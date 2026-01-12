import type { StreamlessProvider, AsyncStreamlessProvider } from "../../types";
import { InternalStreamless } from "../../utils";

export function batch<TInput>(
  source: StreamlessProvider<TInput>,
  predicate: (acc: TInput[]) => boolean,
): StreamlessProvider<TInput[]> {
  return function* batchGenerator() {
    let acc: TInput[] = [];
    using generator = InternalStreamless.disposable(source);
    for (const next of generator) {
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
  source: AsyncStreamlessProvider<TInput>,
  predicate: (batch: TInput[]) => boolean,
): AsyncStreamlessProvider<TInput[]> {
  return async function* batchGenerator() {
    let acc: TInput[] = [];
    using generator = InternalStreamless.disposable(source);
    for await (const next of generator) {
      acc.push(next);
      if (!predicate(acc)) continue;
      yield acc;
      acc = [];
    }
    if (acc.length) yield acc;
  };
}

import type {
  SyncStreamlessProvider,
  AsyncStreamlessProvider,
} from "../../types";
import { _internalStreamless } from "../../utils";

export function batch<TInput>(
  source: SyncStreamlessProvider<TInput>,
  predicate: (acc: TInput[]) => boolean,
): SyncStreamlessProvider<TInput[]> {
  return function* batchGenerator() {
    let acc: TInput[] = [];
    using generator = _internalStreamless.disposable(source);
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
    using generator = _internalStreamless.disposable(source);
    for await (const next of generator) {
      acc.push(next);
      if (!predicate(acc)) continue;
      yield acc;
      acc = [];
    }
    if (acc.length) yield acc;
  };
}

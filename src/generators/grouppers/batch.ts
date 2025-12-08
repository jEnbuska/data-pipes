import type { ProviderFunction, AsyncProviderFunction } from "../../types.ts";
import { disposable } from "../../utils.ts";

export function batch<TInput>(
  source: ProviderFunction<TInput>,
  predicate: (acc: TInput[]) => boolean,
): ProviderFunction<TInput[]> {
  return function* batchGenerator() {
    let acc: TInput[] = [];
    using generator = disposable(source);
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
  source: AsyncProviderFunction<TInput>,
  predicate: (batch: TInput[]) => boolean,
): AsyncProviderFunction<TInput[]> {
  return async function* batchGenerator() {
    let acc: TInput[] = [];
    using generator = disposable(source);
    for await (const next of generator) {
      acc.push(next);
      if (!predicate(acc)) continue;
      yield acc;
      acc = [];
    }
    if (acc.length) yield acc;
  };
}

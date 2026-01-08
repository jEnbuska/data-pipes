import { type ProviderFunction, type AsyncProviderFunction } from "../../types";
import { InternalStreamless } from "../../utils";

export function skip<TInput>(
  source: ProviderFunction<TInput>,
  count: number,
): ProviderFunction<TInput> {
  return function* skipGenerator() {
    let skipped = 0;
    using generator = InternalStreamless.disposable(source);
    for (const next of generator) {
      if (skipped < count) {
        skipped++;
        continue;
      }
      yield next;
    }
  };
}
export function skipAsync<TInput>(
  source: AsyncProviderFunction<TInput>,
  count: number,
): AsyncProviderFunction<TInput> {
  return async function* skipAsyncGenerator() {
    let skipped = 0;
    using generator = InternalStreamless.disposable(source);
    for await (const next of generator) {
      if (skipped < count) {
        skipped++;
        continue;
      }
      yield next;
    }
  };
}

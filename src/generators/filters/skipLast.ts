import {
  type ProviderFunction,
  type AsyncProviderFunction,
} from "../../types.ts";
import { disposable } from "../../utils.ts";

export function skipLast<TInput>(
  source: ProviderFunction<TInput>,
  count: number,
): ProviderFunction<TInput> {
  return function* skipLastGenerator() {
    const buffer: TInput[] = [];
    let skipped = 0;
    using generator = disposable(source);
    for (const next of generator) {
      buffer.push(next);
      if (skipped < count) {
        skipped++;
        continue;
      }
      yield buffer.shift()!;
    }
  };
}

export function skipLastAsync<TInput>(
  source: AsyncProviderFunction<TInput>,
  count: number,
): AsyncProviderFunction<TInput> {
  return async function* skipLastAsyncGenerator() {
    const buffer: TInput[] = [];
    let skipped = 0;
    using generator = disposable(source);
    for await (const next of generator) {
      buffer.push(next);
      if (skipped < count) {
        skipped++;
        continue;
      }
      yield buffer.shift()!;
    }
  };
}

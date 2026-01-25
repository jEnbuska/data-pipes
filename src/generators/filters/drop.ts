import type {
  YieldedAsyncGenerator,
  YieldedSyncGenerator,
} from "../../types.ts";

export function* dropSync<TInput>(
  generator: YieldedSyncGenerator<TInput>,
  count: number,
): YieldedSyncGenerator<TInput> {
  yield* generator.drop(count);
}
export async function* dropAsync<TInput>(
  generator: YieldedAsyncGenerator<TInput>,
  count: number,
): YieldedAsyncGenerator<TInput> {
  let skipped = 0;
  for await (const next of generator) {
    if (skipped < count) {
      skipped++;
      continue;
    }
    yield next;
  }
}

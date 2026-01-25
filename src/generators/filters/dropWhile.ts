import type {
  YieldedAsyncGenerator,
  YieldedSyncGenerator,
} from "../../types.ts";

export function* dropWhileSync<TInput>(
  generator: YieldedSyncGenerator<TInput>,
  predicate: (next: TInput) => boolean,
): YieldedSyncGenerator<TInput> {
  for (const next of generator) {
    if (predicate(next)) continue;
    yield next;
    break;
  }
  for (const next of generator) {
    yield next;
  }
}

export async function* dropWhileAsync<TInput>(
  generator: YieldedAsyncGenerator<TInput>,
  predicate: (next: TInput) => Promise<boolean> | boolean,
): YieldedAsyncGenerator<TInput> {
  for await (const next of generator) {
    if (await predicate(next)) continue;
    yield next;
    break;
  }
  for await (const next of generator) {
    yield next;
  }
}

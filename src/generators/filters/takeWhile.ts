import type {
  YieldedAsyncGenerator,
  YieldedSyncGenerator,
} from "../../types.ts";

export function* takeWhileSync<TInput>(
  generator: YieldedSyncGenerator<TInput>,
  predicate: (next: TInput) => boolean,
): YieldedSyncGenerator<TInput> {
  for (const next of generator) {
    if (!predicate(next)) return;
    yield next;
  }
}

export async function* takeWhileAsync<TInput>(
  generator: YieldedAsyncGenerator<TInput>,
  predicate: (next: TInput) => Promise<boolean> | boolean,
): YieldedAsyncGenerator<TInput> {
  for await (const next of generator) {
    if (!(await predicate(next))) return;
    yield next;
  }
}

import type {
  YieldedAsyncGenerator,
  YieldedSyncGenerator,
} from "../../types.ts";

export function* reversedSync<TInput>(
  generator: YieldedSyncGenerator<TInput>,
): YieldedSyncGenerator<TInput> {
  const acc: TInput[] = [];
  for (const next of generator) {
    yield next;
    acc.unshift(next);
  }
  yield* acc;
}

export async function* reversedAsync<TInput>(
  generator: YieldedAsyncGenerator<TInput>,
): YieldedAsyncGenerator<TInput> {
  const acc: TInput[] = [];
  for await (const next of generator) {
    acc.unshift(next);
  }
  yield* acc;
}

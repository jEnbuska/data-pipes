import type { YieldedAsyncGenerator, YieldedIterator } from "../../types.ts";

export function* reversedSync<TInput>(
  generator: YieldedIterator<TInput>,
): YieldedIterator<TInput> {
  const acc: TInput[] = [];
  for (const next of generator) {
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

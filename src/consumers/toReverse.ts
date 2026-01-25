import type { YieldedAsyncGenerator, YieldedIterator } from "../types.ts";

export function toReversedSync<TInput>(
  generator: YieldedIterator<TInput>,
): TInput[] {
  const acc: TInput[] = [];
  for (const next of generator) {
    acc.unshift(next);
  }
  return acc;
}

export async function toReversedAsync<TInput>(
  generator: YieldedAsyncGenerator<TInput>,
): Promise<TInput[]> {
  const acc: TInput[] = [];

  for await (const next of generator) {
    acc.unshift(next);
  }
  return acc;
}

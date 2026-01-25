import type { YieldedAsyncGenerator, YieldedIterator } from "../types.ts";

export function firstSync<TInput>(generator: YieldedIterator<TInput>) {
  return generator.next().value;
}

export async function firstAsync<TInput>(
  generator: YieldedAsyncGenerator<TInput>,
) {
  const next = await generator.next();
  return next.value;
}

import type { YieldedAsyncGenerator, YieldedIterator } from "../../types.ts";

export function* mapSync<TInput, TOutput>(
  generator: YieldedIterator<TInput>,
  mapper: (next: TInput) => TOutput,
): YieldedIterator<TOutput> {
  yield* generator.map(mapper);
}

export async function* mapAsync<TInput, TOutput>(
  generator: YieldedAsyncGenerator<TInput>,
  mapper: (next: TInput) => Promise<TOutput> | TOutput,
): YieldedAsyncGenerator<TOutput> {
  for await (const next of generator) {
    yield mapper(next);
  }
}

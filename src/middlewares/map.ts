import type { PromiseOrNot, YieldedAsyncGenerator } from "../types.ts";

export async function* mapAsync<T, TOut>(
  generator: YieldedAsyncGenerator<T>,
  mapper: (next: T) => PromiseOrNot<TOut>,
): YieldedAsyncGenerator<TOut> {
  for await (const next of generator) {
    yield mapper(next);
  }
}

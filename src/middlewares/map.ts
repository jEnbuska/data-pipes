import type {
  PromiseOrNot,
  YieldedAsyncGenerator,
  YieldedIterator,
} from "../types.ts";

export function* mapSync<T, TOut>(
  generator: YieldedIterator<T>,
  mapper: (next: T) => TOut,
): YieldedIterator<TOut> {
  yield* generator.map(mapper);
}

export async function* mapAsync<T, TOut>(
  generator: YieldedAsyncGenerator<T>,
  mapper: (next: T) => PromiseOrNot<TOut>,
): YieldedAsyncGenerator<TOut> {
  for await (const next of generator) {
    yield mapper(next);
  }
}

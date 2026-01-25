import type { YieldedAsyncGenerator, YieldedIterator } from "../types.ts";

export function* liftSync<T, TOut>(
  generator: YieldedIterator<T>,
  middleware: (generator: YieldedIterator<T>) => YieldedIterator<TOut>,
): YieldedIterator<TOut> {
  yield* middleware(generator);
}

export async function* liftAsync<T, TOut>(
  generator: YieldedAsyncGenerator<T>,
  middleware: (generator: YieldedAsyncGenerator<T>) => AsyncGenerator<TOut>,
): YieldedAsyncGenerator<TOut> {
  for await (const next of middleware(generator)) {
    yield next;
  }
}

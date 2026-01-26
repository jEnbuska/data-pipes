import type {
  YieldedAsyncGenerator,
  YieldedIterator,
} from "../shared.types.ts";

export interface IYieldedLift<T, TAsync extends boolean> {}

export function liftSync<T, TOut>(
  generator: YieldedIterator<T>,
  middleware: (generator: YieldedIterator<T>) => YieldedIterator<TOut>,
): YieldedIterator<TOut> {
  return middleware(generator);
}

export async function* liftAsync<T, TOut>(
  generator: YieldedAsyncGenerator<T>,
  middleware: (generator: YieldedAsyncGenerator<T>) => AsyncGenerator<TOut>,
): YieldedAsyncGenerator<TOut> {
  for await (const next of middleware(generator)) {
    yield next;
  }
}

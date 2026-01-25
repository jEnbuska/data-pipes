import type { YieldedAsyncGenerator, YieldedIterator } from "../../types.ts";

export function* liftSync<TInput, TOutput>(
  generator: YieldedIterator<TInput>,
  middleware: (generator: YieldedIterator<TInput>) => YieldedIterator<TOutput>,
): YieldedIterator<TOutput> {
  yield* middleware(generator);
}

export async function* liftAsync<TInput, TOutput>(
  generator: YieldedAsyncGenerator<TInput>,
  middleware: (
    generator: YieldedAsyncGenerator<TInput>,
  ) => YieldedAsyncGenerator<TOutput>,
): YieldedAsyncGenerator<TOutput> {
  for await (const next of middleware(generator)) {
    yield next;
  }
}

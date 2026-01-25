import type {
  YieldedAsyncGenerator,
  YieldedSyncGenerator,
} from "../../types.ts";

export function* liftSync<TInput, TOutput>(
  generator: YieldedSyncGenerator<TInput>,
  middleware: (
    generator: YieldedSyncGenerator<TInput>,
  ) => YieldedSyncGenerator<TOutput>,
): YieldedSyncGenerator<TOutput> {
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

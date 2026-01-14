import { _yielded } from "../../_internal.ts";
import {
  type YieldedAsyncProvider,
  type YieldedLiftMiddleware,
  type YieldedSyncProvider,
} from "../../types.ts";

export function liftSync<TInput, TOutput>(
  provider: YieldedSyncProvider<TInput>,
  middleware: YieldedLiftMiddleware<false, TInput, TOutput>,
): YieldedSyncProvider<TOutput> {
  return function* liftSyncGenerator(signal) {
    using generator = _yielded.getDisposableGenerator(provider, signal);
    const arg = generator as any as Parameters<
      YieldedLiftMiddleware<false, TInput, TOutput>
    >[0];
    yield* middleware(arg);
  };
}

export function liftAsync<TInput, TOutput>(
  provider: YieldedAsyncProvider<TInput>,
  middleware: YieldedLiftMiddleware<true, TInput, TOutput>,
): YieldedAsyncProvider<Awaited<TOutput>> {
  return async function* liftAsyncGenerator(signal) {
    using generator = _yielded.getDisposableAsyncGenerator(provider, signal);
    const arg = generator as any as Parameters<
      YieldedLiftMiddleware<true, TInput, TOutput>
    >[0];
    const asyncGenerator = middleware(arg);
    for await (const next of asyncGenerator) {
      yield next;
    }
  };
}

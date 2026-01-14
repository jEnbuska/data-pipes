import {
  type SyncYieldedProvider,
  type AsyncYieldedProvider,
  type YieldedLiftMiddleware,
} from "../../types";
import { _internalY } from "../../utils";

export function liftSync<TInput, TOutput>(
  provider: SyncYieldedProvider<TInput>,
  middleware: YieldedLiftMiddleware<false, TInput, TOutput>,
): SyncYieldedProvider<TOutput> {
  return function* liftSyncGenerator(signal) {
    using generator = _internalY.getDisposableGenerator(provider, signal);
    const arg = generator as any as Parameters<
      YieldedLiftMiddleware<false, TInput, TOutput>
    >[0];
    yield* middleware(arg);
  };
}

export function liftAsync<TInput, TOutput>(
  provider: AsyncYieldedProvider<TInput>,
  middleware: YieldedLiftMiddleware<true, TInput, TOutput>,
): AsyncYieldedProvider<Awaited<TOutput>> {
  return async function* liftAsyncGenerator(signal) {
    using generator = _internalY.getDisposableAsyncGenerator(provider, signal);
    const arg = generator as any as Parameters<
      YieldedLiftMiddleware<true, TInput, TOutput>
    >[0];
    const asyncGenerator = middleware(arg);
    for await (const next of asyncGenerator) {
      yield next;
    }
  };
}

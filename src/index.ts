import {
  type SyncYieldedProvider,
  type AsyncYieldedProvider,
} from "./types.ts";

export { default } from "./create";

export function getDisposableGenerator<TInput>(
  provider: SyncYieldedProvider<TInput>,
  signal: AbortSignal,
) {
  const generator = provider(signal);
  return Object.assign(generator, {
    [Symbol.dispose]() {
      void generator.return(undefined);
    },
  });
}
export function getDisposableAsyncGenerator<TInput>(
  provider: AsyncYieldedProvider<TInput>,
  signal: AbortSignal,
) {
  const generator = provider(signal);
  return Object.assign(generator, {
    [Symbol.dispose]() {
      void generator.return(undefined);
    },
  });
}

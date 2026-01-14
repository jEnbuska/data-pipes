import { type YieldedSyncProvider } from "./types";

export { default } from "./create";

export function getDisposableGenerator<TInput>(
  provider: YieldedSyncProvider<TInput>,
  signal: AbortSignal,
) {
  const generator = provider(signal);
  return Object.assign(generator, {
    [Symbol.dispose]() {
      void generator.return(undefined);
    },
  });
}

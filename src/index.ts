import { type SyncYieldedProvider } from "./types";

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

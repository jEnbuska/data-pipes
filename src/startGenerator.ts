import type {
  AsyncOperatorProvider,
  SyncOperatorGenerator,
  SyncOperatorProvider,
} from "./types.ts";

export function startGenerator<TArgs extends any[], TIn>(
  provider: AsyncOperatorProvider<, TIn>,
  ...args: TArgs
): SyncOperatorGenerator<TIn> & {
  [Symbol.dispose](): void;
};
export function startGenerator<TArgs extends any[], TIn>(
  provider: SyncOperatorProvider< TIn>,
  ...args: TArgs
): SyncOperatorGenerator<TIn> & {
  [Symbol.dispose](): void;
};
export function startGenerator(
  provider:
    | SyncOperatorProvider<unknown[], unknown>
    | AsyncOperatorProvider<unknown[], unknown>,
  ...args: unknown[]
) {
  const generator = provider(...args);
  return Object.assign(generator, {
    [Symbol.dispose]() {
      void (generator as any).return(undefined as any);
    },
  }) as any;
}

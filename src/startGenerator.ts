import type {
  AsyncOperatorProvider,
  SyncOperatorGenerator,
  SyncOperatorProvider,
} from "./create/createYielded.ts";

export function startGenerator<TArgs extends any[], TIn>(
  provider: AsyncOperatorProvider<TArgs, TIn>,
  ...args: TArgs
): SyncOperatorGenerator<TIn> & {
  [Symbol.dispose](): void;
};
export function startGenerator<TArgs extends any[], TIn>(
  provider: SyncOperatorProvider<TArgs, TIn>,
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

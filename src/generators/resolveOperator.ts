import { SyncOperatorResolver } from "../types.ts";
import { startGenerator } from "../startGenerator.ts";

export function resolveSyncOperator<
  TArgs extends any[],
  TIn,
  TOut = TIn,
  TDefault = never,
>(
  getProvider: (...args: TArgs) => SyncOperatorResolver<TIn>,
  consumer: SyncOperatorResolver<TIn, TOut, TDefault>,
) {
  return (...args: TArgs) => {
    const provider = getProvider(...args);
    using generator = startGenerator(provider);
    const initial = generator.next();

    while()
    consumer(generator)
  };
}
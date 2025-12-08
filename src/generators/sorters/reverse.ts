import {
  type AsyncProviderFunction,
  type ProviderFunction,
} from "../../types.ts";
import { disposable } from "../../utils.ts";

export function reverse<TInput>(
  source: ProviderFunction<TInput>,
): ProviderFunction<TInput, TInput[]> {
  return function* reverseGenerator() {
    const acc: TInput[] = [];
    using generator = disposable(source);
    for (const next of generator) {
      acc.unshift(next);
    }
    yield* acc;
    return acc;
  };
}

export function reverseAsync<TInput>(
  source: AsyncProviderFunction<TInput>,
): AsyncProviderFunction<TInput, TInput[]> {
  return async function* reverseAsyncGenerator(): AsyncGenerator<
    TInput,
    TInput[],
    undefined & void
  > {
    const acc: TInput[] = [];
    using generator = disposable(source);
    for await (const next of generator) {
      acc.unshift(next);
    }
    yield* acc;
    return acc;
  };
}

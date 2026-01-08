import { type ProviderFunction, type AsyncProviderFunction } from "../../types";
import { InternalStreamless } from "../../utils";

export function filter<TInput, TOutput extends TInput = TInput>(
  source: ProviderFunction<TInput>,
  predicate: (next: TInput) => next is TOutput,
): ProviderFunction<TOutput>;
export function filter<TInput>(
  source: ProviderFunction<TInput>,
  predicate: (next: TInput) => any,
): ProviderFunction<TInput>;
export function filter(
  source: ProviderFunction<unknown>,
  predicate: (next: unknown) => unknown,
): ProviderFunction<unknown> {
  return function* filterGenerator() {
    using generator = InternalStreamless.disposable(source);
    for (const next of generator) {
      if (predicate(next)) yield next;
    }
  };
}

export function filterAsync<TInput, TOutput extends TInput = TInput>(
  source: AsyncProviderFunction<TInput>,
  predicate: (next: TInput) => next is TOutput,
): AsyncProviderFunction<TOutput>;
export function filterAsync<TInput>(
  source: AsyncProviderFunction<TInput>,
  predicate: (next: TInput) => any,
): AsyncProviderFunction<TInput>;
export function filterAsync(
  source: AsyncProviderFunction<unknown>,
  predicate: (next: unknown) => any,
): AsyncProviderFunction<unknown> {
  return async function* filterAsyncGenerator() {
    using generator = InternalStreamless.disposable(source);
    for await (const next of generator) {
      if (predicate(next)) yield next;
    }
  };
}

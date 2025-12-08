import {
  type ProviderFunction,
  type AsyncProviderFunction,
} from "../../types.ts";
import { disposable } from "../../utils.ts";

export function flatMap<TInput, TOutput>(
  source: ProviderFunction<TInput>,
  flatMapper: (next: TInput) => TOutput | readonly TOutput[],
): ProviderFunction<TOutput> {
  return function* flatMapGenerator() {
    using generator = disposable(source);
    for (const next of generator) {
      const out = flatMapper(next);
      if (Array.isArray(out)) {
        yield* out as any;
      } else {
        yield out as TOutput;
      }
    }
  };
}

export function flatMapAsync<TInput, TOutput>(
  source: AsyncProviderFunction<TInput>,
  flatMapper: (next: TInput) => TOutput | readonly TOutput[],
): AsyncProviderFunction<Awaited<TOutput>> {
  return async function* flatMapAsyncGenerator() {
    using generator = disposable(source);
    for await (const next of generator) {
      const out = flatMapper(next);
      if (Array.isArray(out)) {
        yield* out as any;
      } else {
        yield out as TOutput;
      }
    }
  };
}

import {
  type ProviderFunction,
  type AsyncProviderFunction,
} from "../../types.ts";
import { disposable } from "../../utils.ts";

export function reduce<TInput, TOutput>(
  source: ProviderFunction<TInput>,
  reducer: (acc: TOutput, next: TInput, index: number) => TOutput,
  initialValue: TOutput,
): ProviderFunction<TOutput> {
  return function* reduceGenerator() {
    let acc = initialValue;
    let index = 0;
    using generator = disposable(source);
    for (const next of generator) {
      acc = reducer(acc, next, index++);
    }
    yield acc;
  };
}

export function reduceAsync<TInput, TOutput>(
  source: AsyncProviderFunction<TInput>,
  reducer: (acc: TOutput, next: TInput, index: number) => TOutput,
  initialValue: TOutput,
): AsyncProviderFunction<TOutput> {
  return async function* reduceAsyncGenerator() {
    let acc = initialValue;
    using generator = disposable(source);
    let index = 0;
    for await (const next of generator) {
      acc = reducer(acc, next, index++);
    }
    yield acc;
  };
}

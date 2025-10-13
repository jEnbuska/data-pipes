import { type PipeSource, type AsyncPipeSource } from "../../types.ts";
import { disposable } from "../../utils.ts";

export function reduce<TInput, TOutput>(
  source: PipeSource<TInput>,
  reducer: (acc: TOutput, next: TInput) => TOutput,
  initialValue: TOutput,
): PipeSource<TOutput> {
  return function* reduceGenerator() {
    let acc = initialValue;
    using generator = disposable(source);
    for (const next of generator) {
      acc = reducer(acc, next);
    }
    yield acc;
  };
}

export function reduceAsync<TInput, TOutput>(
  source: AsyncPipeSource<TInput>,
  reducer: (acc: TOutput, next: TInput) => TOutput,
  initialValue: TOutput,
): AsyncPipeSource<TOutput> {
  return async function* reduceAsyncGenerator() {
    let acc = initialValue;
    using generator = disposable(source);
    for await (const next of generator) {
      acc = reducer(acc, next);
    }
    yield acc;
  };
}

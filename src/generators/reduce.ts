import { type PipeSource, type AsyncPipeSource } from "../types.ts";

export function reduce<TInput, TOutput>(
  source: PipeSource<TInput>,
  reducer: (acc: TOutput, next: TInput) => TOutput,
  initialValue: TOutput,
): PipeSource<TOutput> {
  return function* reduceGenerator(signal) {
    let acc = initialValue;
    for (const next of source(signal)) {
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
  return async function* reduceAsyncGenerator(signal) {
    let acc = initialValue;
    for await (const next of source(signal)) {
      acc = reducer(acc, next);
    }
    yield acc;
  };
}

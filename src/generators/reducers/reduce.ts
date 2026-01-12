import {
  type StreamlessProvider,
  type AsyncStreamlessProvider,
} from "../../types";
import { InternalStreamless } from "../../utils";

export function reduce<TInput, TOutput>(
  source: StreamlessProvider<TInput>,
  reducer: (acc: TOutput, next: TInput, index: number) => TOutput,
  initialValue: TOutput,
): StreamlessProvider<TOutput> {
  return function* reduceGenerator() {
    let acc = initialValue;
    let index = 0;
    using generator = InternalStreamless.disposable(source);
    for (const next of generator) {
      acc = reducer(acc, next, index++);
    }
    yield acc;
  };
}

export function reduceAsync<TInput, TOutput>(
  source: AsyncStreamlessProvider<TInput>,
  reducer: (acc: TOutput, next: TInput, index: number) => TOutput,
  initialValue: TOutput,
): AsyncStreamlessProvider<TOutput> {
  return async function* reduceAsyncGenerator() {
    let acc = initialValue;
    using generator = InternalStreamless.disposable(source);
    let index = 0;
    for await (const next of generator) {
      acc = reducer(acc, next, index++);
    }
    yield acc;
  };
}

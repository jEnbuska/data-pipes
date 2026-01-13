import {
  type SyncStreamlessProvider,
  type AsyncStreamlessProvider,
} from "../../types";
import { _internalStreamless } from "../../utils";

export function reduce<TInput, TOutput>(
  source: SyncStreamlessProvider<TInput>,
  reducer: (acc: TOutput, next: TInput, index: number) => TOutput,
  initialValue: TOutput,
): SyncStreamlessProvider<TOutput> {
  return function* reduceGenerator() {
    let acc = initialValue;
    let index = 0;
    using generator = _internalStreamless.disposable(source);
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
    using generator = _internalStreamless.disposable(source);
    let index = 0;
    for await (const next of generator) {
      acc = reducer(acc, next, index++);
    }
    yield acc;
  };
}

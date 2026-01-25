import type { PromiseOrNot, YieldedAsyncGenerator } from "../shared.types.ts";

export async function reduceAsync<T>(
  generator: YieldedAsyncGenerator<T>,
  reducer: (acc: T, next: T, index: number) => PromiseOrNot<T>,
): Promise<T>;
export async function reduceAsync<T, TOut>(
  generator: YieldedAsyncGenerator<T>,
  reducer: (acc: TOut, next: T, index: number) => PromiseOrNot<TOut>,
  initialValue: PromiseOrNot<TOut>,
): Promise<TOut>;
export async function reduceAsync(
  generator: YieldedAsyncGenerator,
  reducer: (acc: unknown, next: unknown, index: number) => unknown,
  ...rest: [unknown] | []
): Promise<unknown> {
  let acc: Promise<unknown>;
  if (rest.length) {
    acc = Promise.resolve(rest[0]);
  } else {
    const first = await generator.next();
    if (first.done) return undefined;
    acc = Promise.resolve(first.value);
  }
  let index = 0;
  for await (const next of generator) {
    acc = acc.then((acc) => reducer(acc, next, index++));
  }
  return acc;
}

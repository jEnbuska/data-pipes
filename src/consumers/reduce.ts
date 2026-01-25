import type { YieldedAsyncGenerator } from "../types.ts";

export async function reduceAsync<TInput>(
  generator: YieldedAsyncGenerator<TInput>,
  reducer: (
    acc: TInput,
    next: TInput,
    index: number,
  ) => Promise<TInput> | TInput,
): Promise<TInput>;
export async function reduceAsync<TInput, TOutput>(
  generator: YieldedAsyncGenerator<TInput>,
  reducer: (
    acc: TOutput,
    next: TInput,
    index: number,
  ) => Promise<TOutput> | TOutput,
  initialValue: TOutput,
): Promise<TOutput>;
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

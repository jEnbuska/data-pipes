import type {
  YieldedAsyncProvider,
  YieldedSyncMiddleware,
  YieldedSyncProvider,
} from "../types.ts";

export function reduceSync<TInput>(
  invoke: YieldedSyncProvider<TInput>,
  reducer: (acc: TInput, next: TInput, index: number) => TInput,
): TInput;
export function reduceSync<TInput, Output>(
  invoke: YieldedSyncProvider<TInput>,
  reducer: (acc: Output, next: TInput, index: number) => TInput,
  initialValue: Output,
): YieldedSyncMiddleware<TInput, Output>;
export function reduceSync(
  invoke: YieldedSyncProvider<unknown, unknown>,
  reducer: (acc: unknown, next: unknown, index: number) => unknown,
  ...rest: [] | [unknown]
): unknown {
  const generator = invoke();
  if (!rest.length) return generator.reduce(reducer);
  return generator.reduce(reducer, rest[0]);
}

export async function reduceAsync<TInput>(
  invoke: YieldedAsyncProvider<TInput>,
  reducer: (acc: TInput, next: TInput, index: number) => TInput,
): Promise<TInput>;
export async function reduceAsync<TInput, TOutput>(
  invoke: YieldedAsyncProvider<TInput>,
  reducer: (acc: TOutput, next: TInput, index: number) => TOutput,
  initialValue: TOutput,
): Promise<TOutput>;
export async function reduceAsync<TInput, TOutput>(
  invoke: YieldedAsyncProvider<TInput>,
  reducer: (
    acc: Promise<TOutput> | TOutput,
    next: TInput,
    index: number,
  ) => Promise<TOutput>,
  initialValue: TOutput,
): Promise<TOutput>;
export async function reduceAsync(
  invoke: YieldedAsyncProvider,
  reducer: (acc: unknown, next: unknown, index: number) => unknown,
  ...rest: [unknown] | []
): Promise<unknown> {
  const generator = invoke();
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

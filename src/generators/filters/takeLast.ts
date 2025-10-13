import { type PipeSource, type AsyncPipeSource } from "../../types.ts";
import { disposable } from "../../utils.ts";

export function takeLast<TInput>(
  source: PipeSource<TInput>,
  count: number,
): PipeSource<TInput> {
  return function* takeLastGenerator() {
    const generator = disposable(source);
    const array = [...generator];
    yield* array.slice(Math.max(array.length - count, 0));
  };
}

export function takeLastAsync<TInput>(
  source: AsyncPipeSource<TInput>,
  count: number,
): AsyncPipeSource<TInput> {
  return async function* takeLastAsyncGenerator() {
    const acc: TInput[] = [];
    using generator = disposable(source);
    for await (const next of generator) {
      acc.push(next);
    }
    yield* acc.slice(Math.max(acc.length - count, 0));
  };
}

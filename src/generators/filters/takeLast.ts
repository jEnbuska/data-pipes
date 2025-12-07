import { type PipeSource, type AsyncPipeSource } from "../../types.ts";
import { disposable } from "../../utils.ts";

export function takeLast<TInput>(
  source: PipeSource<TInput>,
  count: number,
): PipeSource<TInput, TInput[]> {
  return function* takeLastGenerator() {
    const generator = disposable(source);
    const array = [...generator];
    const list = array.slice(Math.max(array.length - count, 0));
    yield* list;
    return list;
  };
}

export function takeLastAsync<TInput>(
  source: AsyncPipeSource<TInput>,
  count: number,
): AsyncPipeSource<TInput, TInput[]> {
  return async function* takeLastAsyncGenerator() {
    const acc: TInput[] = [];
    using generator = disposable(source);
    for await (const next of generator) {
      acc.push(next);
    }
    const list = acc.slice(Math.max(acc.length - count, 0));
    yield* list;
    return list;
  };
}

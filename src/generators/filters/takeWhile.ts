import { type AsyncPipeSource, type PipeSource } from "../../types.ts";
import { disposable } from "../../utils.ts";

export function takeWhile<TInput>(
  source: PipeSource<TInput>,
  predicate: (next: TInput) => boolean,
): PipeSource<TInput> {
  return function* takeWhileAsyncGenerator() {
    using generator = disposable(source);
    for (const next of generator) {
      if (!predicate(next)) return;
      yield next;
    }
  };
}
export function takeWhileAsync<TInput>(
  source: AsyncPipeSource<TInput>,
  predicate: (next: TInput) => boolean,
): AsyncPipeSource<TInput> {
  return async function* takeWhileAsyncGenerator() {
    using generator = disposable(source);
    for await (const next of generator) {
      if (!predicate(next)) return;
      yield next;
    }
  };
}

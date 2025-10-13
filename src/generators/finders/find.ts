import { type PipeSource, type AsyncPipeSource } from "../../types.ts";
import { disposable } from "../../utils.ts";

export function find<TInput>(
  source: PipeSource<TInput>,
  predicate: (next: TInput) => boolean,
): PipeSource<TInput> {
  return function* findGenerator() {
    using generator = disposable(source);
    for (const next of generator) {
      if (predicate(next)) return yield next;
    }
  };
}

export function findAsync<TInput>(
  source: AsyncPipeSource<TInput>,
  predicate: (next: TInput) => boolean,
): AsyncPipeSource<TInput> {
  return async function* findAsyncGenerator() {
    using generator = disposable(source);
    for await (const next of generator) {
      if (predicate(next)) return yield next;
    }
  };
}

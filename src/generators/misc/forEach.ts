import { type PipeSource, type AsyncPipeSource } from "../../types.ts";
import { disposable } from "../../utils.ts";

export function forEach<TInput>(
  source: PipeSource<TInput>,
  consumer: (next: TInput) => unknown,
): PipeSource<TInput> {
  return function* forEachGenerator() {
    using generator = disposable(source);
    for (const next of generator) {
      consumer(next);
      yield next;
    }
  };
}

export function forEachAsync<TInput>(
  source: AsyncPipeSource<TInput>,
  consumer: (next: TInput) => unknown,
): AsyncPipeSource<TInput> {
  return async function* forEachAsyncGenerator() {
    using generator = disposable(source);
    for await (const next of generator) {
      consumer(next);
      yield next;
    }
  };
}

import {
  type AsyncGeneratorMiddlewareReturn,
  type PipeSource,
  type AsyncPipeSource,
} from "../../types.ts";
import { disposable } from "../../utils.ts";

export function take<TInput>(
  source: PipeSource<TInput>,
  count: number,
): PipeSource<TInput> {
  return function* takeGenerator() {
    if (count <= 0) {
      return;
    }
    using generator = disposable(source);
    for (const next of generator) {
      yield next;
      if (!--count) return;
    }
  };
}

export function takeAsync<TInput>(
  source: AsyncPipeSource<TInput>,
  count: number,
): AsyncPipeSource<TInput> {
  return async function* takeAsyncGenerator(): AsyncGeneratorMiddlewareReturn<TInput> {
    if (count <= 0) {
      return;
    }
    using generator = disposable(source);
    for await (const next of generator) {
      yield next;
      if (!--count) return;
    }
  };
}

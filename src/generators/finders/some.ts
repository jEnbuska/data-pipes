import { type PipeSource, type AsyncPipeSource } from "../../types.ts";
import { disposable } from "../../utils.ts";

export function some<TInput>(
  source: PipeSource<TInput>,
  predicate: (next: TInput) => boolean,
): PipeSource<boolean> {
  return function* someGenerator() {
    using generator = disposable(source);
    for (const next of generator) {
      if (predicate(next)) return yield true;
    }
    yield false;
  };
}
export function someAsync<TInput>(
  source: AsyncPipeSource<TInput>,
  predicate: (next: TInput) => boolean,
): AsyncPipeSource<boolean> {
  return async function* someAsyncGenerator() {
    using generator = disposable(source);
    for await (const next of generator) {
      if (predicate(next)) return yield true;
    }
    yield false;
  };
}

import { type PipeSource, type AsyncPipeSource } from "../../types.ts";
import { disposable } from "../../utils.ts";

export function every<TInput>(
  source: PipeSource<TInput>,
  predicate: (next: TInput) => boolean,
): PipeSource<boolean> {
  return function* everyGenerator() {
    using generator = disposable(source);
    for (const next of generator) {
      if (!predicate(next)) return yield false;
    }

    yield true;
  };
}
export function everyAsync<TInput>(
  source: AsyncPipeSource<TInput>,
  predicate: (next: TInput) => boolean,
): AsyncPipeSource<boolean> {
  return async function* everyAsyncGenerator() {
    using generator = disposable(source);
    for await (const next of generator) {
      if (!predicate(next)) return yield false;
    }

    yield true;
  };
}

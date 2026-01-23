import {
  type YieldedAsyncMiddleware,
  type YieldedSyncMiddleware,
} from "../../types.ts";

const defaultCompare = <TInput>(a: TInput, b: TInput) => a === b;

export function distinctUntilChangedSync<TInput>(
  compare: (previous: TInput, current: TInput) => boolean = defaultCompare,
): YieldedSyncMiddleware<TInput> {
  return function* distinctUntilChangedSyncResolver(generator) {
    const first = generator.next();
    if (first.done) return;
    let previous = first.value;
    for (const next of generator) {
      if (compare(previous, next)) {
        previous = next;
        yield next;
      }
    }
  };
}

export function distinctUntilChangedAsync<TInput>(
  compare: (
    previous: TInput,
    current: TInput,
  ) => Promise<boolean> | boolean = defaultCompare,
): YieldedAsyncMiddleware<TInput> {
  return async function* distinctUntilChangedAsyncResolver(generator) {
    const first = await generator.next();
    if (first.done) return;
    let previous = first.value;
    for await (const next of generator) {
      if (await compare(previous, next)) {
        previous = next;
        yield next;
      }
    }
  };
}

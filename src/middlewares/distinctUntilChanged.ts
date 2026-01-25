import type {
  PromiseOrNot,
  YieldedAsyncGenerator,
  YieldedIterator,
} from "../shared.types.ts";

const defaultCompare = <T>(a: T, b: T) => a === b;

export function* distinctUntilChangedSync<T>(
  generator: YieldedIterator<T>,
  compare: (previous: T, current: T) => boolean = defaultCompare,
): YieldedIterator<T> {
  const first = generator.next();
  if (first.done) return;
  let previous = first.value;
  yield previous;
  for (const next of generator) {
    if (!compare(previous, next)) {
      previous = next;
      yield next;
    }
  }
}

export async function* distinctUntilChangedAsync<T>(
  generator: YieldedAsyncGenerator<T>,
  compare: (previous: T, current: T) => PromiseOrNot<boolean> = defaultCompare,
): YieldedAsyncGenerator<T> {
  const first = await generator.next();
  if (first.done) return;
  let previous = first.value;
  yield previous;
  for await (const next of generator) {
    if (!(await compare(previous, next))) {
      previous = next;
      yield next;
    }
  }
}

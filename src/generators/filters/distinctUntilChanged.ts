import type {
  YieldedAsyncGenerator,
  YieldedSyncGenerator,
} from "../../types.ts";

const defaultCompare = <TInput>(a: TInput, b: TInput) => a === b;

export function* distinctUntilChangedSync<TInput>(
  generator: YieldedSyncGenerator<TInput>,
  compare: (previous: TInput, current: TInput) => boolean = defaultCompare,
): YieldedSyncGenerator<TInput> {
  const first = generator.next();
  if (first.done) return;
  let previous = first.value;
  for (const next of generator) {
    if (compare(previous, next)) {
      previous = next;
      yield next;
    }
  }
}

export async function* distinctUntilChangedAsync<TInput>(
  generator: YieldedAsyncGenerator<TInput>,
  compare: (
    previous: TInput,
    current: TInput,
  ) => Promise<boolean> | boolean = defaultCompare,
): YieldedAsyncGenerator<TInput> {
  const first = await generator.next();
  if (first.done) return;
  let previous = first.value;
  for await (const next of generator) {
    if (await compare(previous, next)) {
      previous = next;
      yield next;
    }
  }
}

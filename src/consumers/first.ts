import type {
  YieldedAsyncGenerator,
  YieldedIterator,
} from "../shared.types.ts";

export function firstSync<T>(generator: YieldedIterator<T>) {
  return generator.next().value;
}

export async function firstAsync<T>(generator: YieldedAsyncGenerator<T>) {
  const next = await generator.next();
  return next.value;
}

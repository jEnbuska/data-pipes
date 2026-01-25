import type {
  PromiseOrNot,
  YieldedAsyncGenerator,
  YieldedIterator,
} from "../shared.types.ts";

export function* flatMapSync<T, TOut>(
  generator: YieldedIterator<T>,
  flatMapper: (
    next: T,
    index: number,
  ) => readonly TOut[] | Iterable<TOut> | TOut,
): YieldedIterator<TOut> {
  let index = 0;
  for (const next of generator) {
    const out: any = flatMapper(next, index++);
    if (out?.[Symbol.iterator]) {
      yield* out as TOut[];
    } else {
      yield out as TOut;
    }
  }
}

export async function* flatMapAsync<T, TOut>(
  generator: YieldedAsyncGenerator<T>,
  flatMapper: (
    next: T,
    index: number,
  ) => PromiseOrNot<readonly TOut[] | Iterable<TOut> | TOut>,
): YieldedAsyncGenerator<TOut> {
  let index = 0;
  for await (const next of generator) {
    const out: any = await flatMapper(next, index++);
    if (out?.[Symbol.iterator]) {
      yield* out as TOut[];
    } else if (out?.[Symbol.asyncIterator]) {
      for await (const child of out) yield child;
    } else {
      yield out as TOut;
    }
  }
}

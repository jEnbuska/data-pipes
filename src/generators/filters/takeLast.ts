import { type ProviderFunction, type AsyncProviderFunction } from "../../types";
import { InternalStreamless } from "../../utils";

export function takeLast<TInput>(
  source: ProviderFunction<TInput>,
  count: number,
): ProviderFunction<TInput, TInput[]> {
  return function* takeLastGenerator() {
    const generator = InternalStreamless.disposable(source);
    const array = [...generator];
    const list = array.slice(Math.max(array.length - count, 0));
    yield* list;
    return list;
  };
}

export function takeLastAsync<TInput>(
  source: AsyncProviderFunction<TInput>,
  count: number,
): AsyncProviderFunction<TInput, TInput[]> {
  return async function* takeLastAsyncGenerator() {
    const acc: TInput[] = [];
    using generator = InternalStreamless.disposable(source);
    for await (const next of generator) {
      acc.push(next);
    }
    const list = acc.slice(Math.max(acc.length - count, 0));
    yield* list;
    return list;
  };
}

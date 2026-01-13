import {
  type SyncStreamlessProvider,
  type AsyncStreamlessProvider,
} from "../../types";
import { _internalStreamless } from "../../utils";

export function takeLast<TInput>(
  source: SyncStreamlessProvider<TInput>,
  count: number,
): SyncStreamlessProvider<TInput, TInput[]> {
  return function* takeLastGenerator() {
    const generator = _internalStreamless.disposable(source);
    const array = [...generator];
    const list = array.slice(Math.max(array.length - count, 0));
    yield* list;
    return list;
  };
}

export function takeLastAsync<TInput>(
  source: AsyncStreamlessProvider<TInput>,
  count: number,
): AsyncStreamlessProvider<Awaited<TInput>, TInput[]> {
  return async function* takeLastAsyncGenerator() {
    const acc: TInput[] = [];
    using generator = _internalStreamless.disposable(source);
    for await (const next of generator) {
      acc.push(next);
    }
    const list = acc.slice(Math.max(acc.length - count, 0));
    yield* list;
    return list;
  };
}

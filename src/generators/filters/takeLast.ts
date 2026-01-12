import {
  type StreamlessProvider,
  type AsyncStreamlessProvider,
} from "../../types";
import { InternalStreamless } from "../../utils";

export function takeLast<TInput>(
  source: StreamlessProvider<TInput>,
  count: number,
): StreamlessProvider<TInput, TInput[]> {
  return function* takeLastGenerator() {
    const generator = InternalStreamless.disposable(source);
    const array = [...generator];
    const list = array.slice(Math.max(array.length - count, 0));
    yield* list;
    return list;
  };
}

export function takeLastAsync<TInput>(
  source: AsyncStreamlessProvider<TInput>,
  count: number,
): AsyncStreamlessProvider<TInput, TInput[]> {
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

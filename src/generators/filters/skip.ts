import {
  type StreamlessProvider,
  type AsyncStreamlessProvider,
} from "../../types";
import { _internalStreamless } from "../../utils";

export function skip<TInput>(
  source: StreamlessProvider<TInput>,
  count: number,
): StreamlessProvider<TInput> {
  return function* skipGenerator() {
    let skipped = 0;
    using generator = _internalStreamless.disposable(source);
    for (const next of generator) {
      if (skipped < count) {
        skipped++;
        continue;
      }
      yield next;
    }
  };
}
export function skipAsync<TInput>(
  source: AsyncStreamlessProvider<TInput>,
  count: number,
): AsyncStreamlessProvider<TInput> {
  return async function* skipAsyncGenerator() {
    let skipped = 0;
    using generator = _internalStreamless.disposable(source);
    for await (const next of generator) {
      if (skipped < count) {
        skipped++;
        continue;
      }
      yield next;
    }
  };
}

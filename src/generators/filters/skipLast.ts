import {
  type StreamlessProvider,
  type AsyncStreamlessProvider,
} from "../../types";
import { _internalStreamless } from "../../utils";

export function skipLast<TInput>(
  source: StreamlessProvider<TInput>,
  count: number,
): StreamlessProvider<TInput> {
  return function* skipLastGenerator() {
    const buffer: TInput[] = [];
    let skipped = 0;
    using generator = _internalStreamless.disposable(source);
    for (const next of generator) {
      buffer.push(next);
      if (skipped < count) {
        skipped++;
        continue;
      }
      yield buffer.shift()!;
    }
  };
}

export function skipLastAsync<TInput>(
  source: AsyncStreamlessProvider<TInput>,
  count: number,
): AsyncStreamlessProvider<TInput> {
  return async function* skipLastAsyncGenerator() {
    const buffer: TInput[] = [];
    let skipped = 0;
    using generator = _internalStreamless.disposable(source);
    for await (const next of generator) {
      buffer.push(next);
      if (skipped < count) {
        skipped++;
        continue;
      }
      yield buffer.shift()!;
    }
  };
}

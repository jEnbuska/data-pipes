import {
  type SyncStreamlessProvider,
  type AsyncStreamlessProvider,
} from "../../types";
import { _internalStreamless } from "../../utils";

export function skip<TInput>(
  source: SyncStreamlessProvider<TInput>,
  count: number,
): SyncStreamlessProvider<TInput> {
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
): AsyncStreamlessProvider<Awaited<TInput>> {
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

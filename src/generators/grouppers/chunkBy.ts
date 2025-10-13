import { type PipeSource, type AsyncPipeSource } from "../../types.ts";
import { disposable } from "../../utils.ts";

export function chunkBy<TInput, TIdentifier = any>(
  source: PipeSource<TInput>,
  keySelector: (next: TInput) => TIdentifier,
): PipeSource<TInput[]> {
  return function* chunkByGenerator() {
    const map = new Map<any, TInput[]>();
    using generator = disposable(source);
    for (const next of generator) {
      const key = keySelector(next);
      if (!map.has(next)) map.set(next, []);
      map.get(key)!.push(next);
    }
    yield* map.values();
  };
}

export function chunkByAsync<TInput, TIdentifier = any>(
  source: AsyncPipeSource<TInput>,
  keySelector: (next: TInput) => TIdentifier,
): AsyncPipeSource<TInput[]> {
  return async function* chunkByAsyncGenerator() {
    const map = new Map<any, TInput[]>();
    using generator = disposable(source);
    for await (const next of generator) {
      const key = keySelector(next);
      if (!map.has(next)) map.set(next, []);
      map.get(key)!.push(next);
    }
    yield* map.values();
  };
}

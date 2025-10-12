import type { PipeSource, AsyncPipeSource } from "../types.ts";

export function chunkBy<TInput, TIdentifier = any>(
  source: PipeSource<TInput>,
  keySelector: (next: TInput) => TIdentifier,
): PipeSource<TInput[]> {
  return function* chunkByGenerator(signal) {
    const map = new Map<any, TInput[]>();
    for (const next of source(signal)) {
      const key = keySelector(next);
      if (!map.has(next)) {
        map.set(next, []);
      }
      map.get(key)!.push(next);
    }
    yield* map.values();
  };
}

export function chunkByAsync<TInput, TIdentifier = any>(
  source: AsyncPipeSource<TInput>,
  keySelector: (next: TInput) => TIdentifier,
): AsyncPipeSource<TInput[]> {
  return async function* chunkByAsyncGenerator(signal) {
    const map = new Map<any, TInput[]>();
    for await (const next of source(signal)) {
      if (signal.aborted) return;
      const key = keySelector(next);
      if (!map.has(next)) map.set(next, []);
      map.get(key)!.push(next);
    }
    yield* map.values();
  };
}

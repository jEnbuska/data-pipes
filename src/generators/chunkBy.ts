import type {
  AsyncGeneratorMiddleware,
  GeneratorMiddleware,
} from "../types.ts";

export function chunkBy<TInput, TIdentifier = any>(
  keySelector: (next: TInput) => TIdentifier,
): GeneratorMiddleware<TInput, TInput[]> {
  return function* chunkByGenerator(generator) {
    const map = new Map<any, TInput[]>();
    for (const next of generator) {
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
  keySelector: (next: TInput) => TIdentifier,
): AsyncGeneratorMiddleware<TInput, TInput[]> {
  return async function* chunkByAsyncGenerator(generator) {
    const map = new Map<any, TInput[]>();
    for await (const next of generator) {
      const key = keySelector(next);
      if (!map.has(next)) {
        map.set(next, []);
      }
      map.get(key)!.push(next);
    }
    yield* map.values();
  };
}

import { AsyncYielded, Yielded } from "../../src/index.ts";

export function createTestSets<T>(array: T[]) {
  return {
    fromEmpty: Yielded.from<T>([]),
    fromEmptyAsync: AsyncYielded.from<T>(async function* () {
      yield* array.slice(0, 0);
    }),
    fromAsyncGenerator: AsyncYielded.from<T>(async function* () {
      for await (const value of array) {
        yield value;
      }
    }),
    fromGenerator: Yielded.from<T>(function* () {
      yield* array;
    }),
    fromArray: Yielded.from<T>(array),
    fromSingle: Yielded.from<T>(array[0]),
    fromSingleAsync: Yielded.from<T>(array[0]).awaited(),
    fromPromises: Yielded.from<T>(array).map((next) => Promise.resolve(next)),
    fromResolvedPromises: Yielded.from<T>(array)
      .map((next) => Promise.resolve(next))
      .awaited()
      .map((next) => Promise.resolve(next)),
  };
}

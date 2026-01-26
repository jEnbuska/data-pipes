import { Yielded } from "../../src/index.ts";

export function createTestSets<T>(array: T[]) {
  return {
    fromEmpty: Yielded.from<T>([]),
    fromEmptyAsync: Yielded.from(async function* () {
      yield* array.slice(0, 0);
    }),
    fromAsyncGenerator: Yielded.from(async function* () {
      for await (const value of array) {
        yield value;
      }
    }),
    fromGenerator: Yielded.from(function* () {
      yield* array;
    }),
    fromArray: Yielded.from(array),
    fromSingle: Yielded.from(array[0]),
    fromSingleAsync: Yielded.from(array[0]).awaited(),
    fromPromises: Yielded.from(array).map((next) => Promise.resolve(next)),
    fromResolvedPromises: Yielded.from(array)
      .map((next) => Promise.resolve(next))
      .awaited()
      .map((next) => Promise.resolve(next)),
  };
}

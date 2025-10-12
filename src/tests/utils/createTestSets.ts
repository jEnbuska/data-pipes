import source from "../../";

export function createTestSets<T>(array: T[]) {
  return {
    fromEmpty: source<T>([]),
    fromEmptyAsync: source<T>(async function* () {}),
    fromAsyncGenerator: source(async function* () {
      for await (const value of array) {
        yield value;
      }
    }),
    fromGenerator: source(function* () {
      yield* array;
    }),
    fromArray: source(array),
    fromSingle: source(array[0]),
    fromPromises: source(array).map((next) => Promise.resolve(next)),
    fromResolvedPromises: source(array)
      .map((next) => Promise.resolve(next))
      .resolve()
      .map((next) => Promise.resolve(next)),
  };
}

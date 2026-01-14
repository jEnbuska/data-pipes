import yielded from "../../";

export function createTestSets<T>(array: T[]) {
  return {
    fromEmpty: yielded<T>([]),
    fromEmptyAsync: yielded(async function* () {
      yield* array.slice(0, 0);
    }),
    fromAsyncGenerator: yielded(async function* () {
      for await (const value of array) {
        yield value;
      }
    }),
    fromGenerator: yielded(function* () {
      yield* array;
    }),
    fromArray: yielded(array),
    fromSingle: yielded(array[0]),
    fromSingleAsync: yielded(array[0]).resolve(),
    fromPromises: yielded(array).map((next) => Promise.resolve(next)),
    fromResolvedPromises: yielded(array)
      .map((next) => Promise.resolve(next))
      .resolve()
      .map((next) => Promise.resolve(next)),
  };
}

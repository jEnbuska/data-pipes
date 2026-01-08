import { streamless } from "../../";

export function createTestSets<T>(array: T[]) {
  return {
    fromEmpty: streamless<T>([]),
    fromEmptyAsync: streamless<T>(async function* () {}),
    fromAsyncGenerator: streamless(async function* () {
      for await (const value of array) {
        yield value;
      }
    }),
    fromGenerator: streamless(function* () {
      yield* array;
    }),
    fromArray: streamless(array),
    fromSingle: streamless(array[0]),
    fromPromises: streamless(array).map((next) => Promise.resolve(next)),
    fromResolvedPromises: streamless(array)
      .map((next) => Promise.resolve(next))
      .resolve()
      .map((next) => Promise.resolve(next)),
  };
}

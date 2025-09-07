import { chain } from "../../chainable/chain.ts";

export function createTestSets<T>(array: T[]) {
  return {
    fromEmpty: chain<T>([]),
    fromEmptyAsync: chain<T>(async function* () {}),
    fromAsyncGenerator: chain(async function* () {
      for await (const value of array) {
        yield value;
      }
    }),
    fromGenerator: chain(function* () {
      yield* array;
    }),
    fromArray: chain(array),
    fromSingle: chain(array[0]),
    fromPromises: chain(array).map((next) => Promise.resolve(next)),
    fromResolvedPromises: chain(array)
      .map((next) => Promise.resolve(next))
      .resolve()
      .map((next) => Promise.resolve(next)),
  };
}

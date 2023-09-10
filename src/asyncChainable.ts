/* import { Pipe } from "./pipe-middlware.ts";

import { type AsyncOperatorGenerator } from "../operators/types.ts";
*/
export type AsyncPipe<T> = T;
/* export type AsyncPipe<T> = {
  map<R>(fn: (middlware: T) => R): AsyncPipe<R>;
  flat<D extends number = 1>(depth?: D): AsyncPipe<FlatArray<T, D>>;
  flatMap<U>(callback: (value: T) => U | readonly U[]): AsyncPipe<U[]>;
  filter(fn: (middlware: T) => boolean): AsyncPipe<T>;
  reduce<R>(fn: (acc: R, middlware: T) => R, initialValue: R): AsyncPipe<R>;
  awaitMap<R>(fn: (middlware: T) => Promise<R>): AsyncPipe<R>;
  forEach(fn: (middlware: T) => void): AsyncPipe<T>;
  skipWhile(fn: (middlware: T) => boolean): AsyncPipe<T>;
  skip(count: number): AsyncPipe<T>;
  take(count: number): AsyncPipe<T>;
  count(): AsyncPipe<number>;
  takeWhile(fn: (middlware: T) => boolean): AsyncPipe<T>;
  toSingle(): Promise<T>;
  toArray(): Promise<T[]>;
  sort(compareFn?: (a: T, b: T) => number): AsyncPipe<T>;
  distinctBy(selector: (middlware: T) => any): AsyncPipe<T>;
  groupBy<K extends keyof any>(
    keySelector: (middlware: T) => K,
    acc: Record<K, T[]>,
  ): AsyncPipe<Record<K, T[]>>;
  join(separator?: string): AsyncPipe<string>;
};
export function pipeFromAsyncIterableIterator<T>(
  generator: AsyncOperatorGenerator<T>,
): AsyncPipe<T> {
  return {
    join(separator) {
      return pipeFromAsyncIterableIterator(async function* () {
        return yield (
          await pipeFromAsyncIterableIterator(generator).toArray()
        ).join(separator);
      });
    },
    sort(compareFn) {
      return pipeFromAsyncIterableIterator(async function* () {
        const array = await pipeFromAsyncIterableIterator(generator).toArray();
        yield* array.sort(compareFn);
      });
    },
    groupBy(keySelector, acc?: any) {
      return pipeFromAsyncIterableIterator(async function* () {
        yield collectGroups(
          await pipeFromAsyncIterableIterator(generator).toArray(),
          keySelector,
          acc,
        ) as any;
      });
    },
    // groupJoin?
    // join?
    // zip?
    // concat?
    // distinct?
    // distinctUntilChanged?
    // elementAt?
    // except?
    // intersect?
    // last?
    // max?
    // min?
    // orderBy?
    // orderByDescending?
    // reverse?
    // select?
    // selectMany?
    // sequenceEqual?
    // single?
    // skipLast?
    // skipUntil?
    // skipWhile?
    // sum?
    // takeLast?
    // takeUntil?
    // takeWhile?
    // thenBy?
    // thenByDescending?
    // union?
    // where?
    // zipAll?
    // zipAsync?
    // zipWith?
    // zipWithAsync?
    // zipWithIterable?
    // zipWithIterableAsync?
    // zipWithPromise?
    // zipWithPromiseAsync?
    // zipWithPromiseIterable?
    // zipWithPromiseIterableAsync?
    // zipWithIterablePromise?
    // zipWithIterablePromiseAsync?
    // zipWithAsyncIterable?
    // zipWithAsyncIterableAsync?
    // zipWithAsyncIterablePromise?
    // zipWithAsyncIterablePromiseAsync?
    // zipWithAsyncIterableIterable?
    // zipWithAsyncIterableIterableAsync?
    // zipWithAsyncIterablePromiseIterable?
    // zipWithAsyncIterablePromiseIterableAsync?
    // zipWithPromiseAsyncIterable?
    // zipWithPromiseAsyncIterableAsync?
    // zipWithPromiseAsyncIterablePromise?
    // zipWithPromiseAsyncIterablePromiseAsync?
    // zipWithPromiseIterableAsyncIterable?
    // zipWithPromiseIterableAsyncIterableAsync?
    // zipWithPromiseIterablePromiseAsyncIterable?
    // zipWithPromiseIterablePromiseAsyncIterableAsync?
    // zipWithIterableAsyncIterable?

    flat<D extends number = 1>(depth?: D) {
      return pipeFromAsyncIterableIterator(async function* () {
        for await (const item of generator()) {
          if (!Array.isArray(item)) {
            yield item as FlatArray<T, D>;
          } else {
            for (const subItem of item.flat(depth)) {
              yield subItem as FlatArray<T, D>;
            }
          }
        }
      });
    },
    reduce<R>(fn: (acc: R, middlware: T) => R, initialValue: R): AsyncPipe<R> {
      return pipeFromAsyncIterableIterator(async function* () {
        let acc = initialValue;
        for await (const item of generator()) {
          acc = fn(acc, item);
        }
        yield acc;
      });
    },
    map<R>(fn: (middlware: T) => R) {
      return pipeFromAsyncIterableIterator(async function* () {
        for await (const item of generator()) {
          yield fn(item);
        }
      });
    },
    flatMap() {
      return pipeFromAsyncIterableIterator(async function* () {
        for await (const item of generator()) {
          if (Array.isArray(item)) {
            for (const subItem of item) {
              yield subItem;
            }
          } else {
            yield item;
          }
        }
      });
    },
    filter(fn: (middlware: T) => boolean) {
      return pipeFromAsyncIterableIterator(async function* () {
        for await (const item of generator()) {
          if (fn(item)) {
            yield item;
          }
        }
      });
    },

    forEach(fn: (middlware: T) => void) {
      return pipeFromAsyncIterableIterator(async function* () {
        for await (const item of generator()) {
          fn(item);
          yield item;
        }
      });
    },
    skipWhile(fn: (middlware: T) => boolean) {
      return pipeFromAsyncIterableIterator(async function* () {
        let skip = true;
        for await (const item of generator()) {
          if (skip && fn(item)) {
            continue;
          }
          skip = false;
          yield item;
        }
      });
    },
    skip(count: number) {
      return pipeFromAsyncIterableIterator(async function* () {
        let skipped = 0;
        for await (const item of generator()) {
          if (skipped < count) {
            skipped++;
            continue;
          }
          yield item;
        }
      });
    },
    take(count: number) {
      return pipeFromAsyncIterableIterator(async function* () {
        for await (const item of generator()) {
          if (count <= 0) {
            break;
          }
          count--;
          yield item;
        }
      });
    },
    count() {
      return pipeFromAsyncIterableIterator(async function* () {
        let count = 0;
        for await (const _ of generator()) {
          count++;
        }
        yield count;
      });
    },
    takeWhile(fn: (middlware: T) => boolean) {
      return pipeFromAsyncIterableIterator(async function* () {
        for await (const item of generator()) {
          if (fn(item)) {
            yield item;
          } else {
            break;
          }
        }
      });
    },
    awaitMap<R>(fn: (middlware: T) => Promise<R>) {
      return pipeFromAsyncIterableIterator(async function* () {
        for await (const item of generator()) {
          yield await fn(item);
        }
      });
    },
    async toSingle() {
      for await (const item of generator()) {
        return item;
      }
      throw new Error("No items in generator");
    },
    async toArray() {
      const array: T[] = [];
      for await (const item of generator()) {
        array.push(item);
      }
      return array;
    },
  };
} */

export default {};

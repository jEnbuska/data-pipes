import { syncSingleYielded } from "./create/syncSingleYielded.ts";
import { syncYieldedIterator } from "./create/syncYieldedIterator.ts";
import { asyncIterableAYielded } from "./create/yieldedAsyncIterable.ts";
import {
  type AsyncYieldedIterator,
  type SyncYieldedIterator,
  type YieldedAsyncMiddleware,
} from "./types.ts";

function fromCallable<TArgs extends [...rest: any[]], TOutput>(
  AsyncIterable: (
    ...args: TArgs
  ) => AsyncGenerator<TOutput, unknown | void, undefined & void>,
): void;

function fromCallable<TArgs extends [...rest: any[]], TOutput>(
  callback: (
    ...args: TArgs
  ) => Iterable<TOutput, unknown | void, undefined & void>,
): void;

type A = Parameters<(a: any, ...args: any) => {}>;

function fromSource(source: any) {
  if (isAsyncGeneratorFunction<any>(source)) {
    return asyncIterableAYielded(async function* asyncSourceResolver(...args) {
      for await (const next of source(...args)) {
        yield next;
      }
    });
  }
  if (isGeneratorFunction(source)) {
    return asyncIterableAYielded(function* sourceResolver(...args: any[]) {
      for (const next of source(...args)) {
        yield next;
      }
    });
  }
  if (source.asyncIterator) {
    return asyncIterableAYielded(async function* createAsyncSource(
      ..._
    ): AsyncGenerator<any, void, undefined & void> {
      for await (const next of source) {
        yield next;
      }
    });
  }
  if (typeof source === "function") {
    return syncSingleYielded(function* singleYieldedSyncProvider(...args) {
      yield source(...args);
    });
  }
  if (!source[Symbol.iterator]) {
    return syncSingleYielded(function* singleYieldedSyncProvider(..._) {
      yield source;
    });
  }
  return syncYieldedIterator(function* createSyncSource(
    ..._
  ): Generator<any, void, undefined & void> {
    for (const next of source) {
      yield next;
    }
  });
}

function fromSource<TOutput>(
  source: Iterable<TOutput, unknown | void, undefined & void>,
): SyncYieldedIterator<TOutput>;
function fromSource<TOutput>(
  iterable: AsyncGenerator<TOutput, unknown | void, undefined & void>,
): AsyncYieldedIterator<TOutput>;
/**
 * creates a yielded from the given providers
 *
 * @example
 * yielded(async function*() {
 *   yield* await getUsersByGroup(groupId);
 * })
 *  .groupBy(user => user.id)
 *  .resolve() satisfies Promise<Record<string, User>>
 *
 * @example
 * yielded([1,2,3])
 *  .map(n => n * 2)
 *  .resolve() satisfies number[] // [2,4,6]
 *
 * @example
 * yielded(1)
 *  .map(n => n * 2)
 *  .resolve() satisfies number | undefined // 2
 */

const YieldedIterator = {
  from: fromSource,
  fromCallable,
};

export default yielded;

function isAsyncGeneratorFunction<TInput>(
  provider: unknown,
): provider is YieldedAsyncMiddleware<TInput> {
  return (
    Boolean(provider) &&
    Object.getPrototypeOf(provider).constructor.name ===
      "AsyncGeneratorFunction"
  );
}
function isGeneratorFunction(fn: unknown): fn is (...args: any[]) => Generator {
  return (
    typeof fn === "function" && fn.constructor.name === "GeneratorFunction"
  );
}

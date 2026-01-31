import { assertIsValidParallelArguments } from "../generators/parallelUtils.ts";
import type { IYieldedParallelGenerator } from "../shared.types.ts";
import { throttleParallel } from "../utils.ts";

type ResolveCallback<TReturn> = (returnValue: TReturn) => void;

type OnNext<T, TReturn> = (
  value: T,
  resolve: ResolveCallback<TReturn>,
) => unknown;

type OnDone<TReturn> = (resolve: ResolveCallback<TReturn>) => unknown;

type OnDepleted<TReturn> = (
  resolve: ResolveCallback<TReturn>,
  waitUntilIdle: () => Promise<void>,
) => unknown;

export function resolveParallel<T, TReturn>(args: {
  generator: IYieldedParallelGenerator<T>;
  parallel: number;
  parallelOnNext?: number;
  onNext?: OnNext<T, TReturn>;
  onDepleted?: OnDepleted<TReturn>;
  onDone?: OnDone<TReturn>;
}): Promise<TReturn> {
  const {
    generator,
    parallel,
    parallelOnNext = parallel,
    onNext = () => {},
    onDepleted = () => {},
    onDone = () => {},
  } = args;
  assertIsValidParallelArguments({ parallel, parallelOnNext });
  const resolvable = Promise.withResolvers<TReturn>();
  let returned = false;
  function reject(error: any) {
    if (returned) return;
    returned = true;
    void generator.return();
    resolvable.reject(error);
    throw error;
  }
  function resolve(result: TReturn) {
    if (returned) return;
    resolvable.resolve(result);
    returned = true;
    void generator.return();
  }
  function dispose() {
    returned = true;
    void generator.return();
  }
  const handleNext = throttleParallel(async function handleNext(
    promise: Promise<T>,
  ) {
    try {
      const value = await promise;
      return await onNext(value, resolve);
    } catch (e) {
      reject(e);
    }
  }, parallelOnNext);
  void throttleParallel(async function getNext() {
    try {
      const next = await generator.next();
      if (!next.done) {
        void handleNext(next.value);
        void getNext();
        return;
      }
      await onDepleted(resolvable.resolve, handleNext.all);
      await handleNext.all();
      await onDone(resolvable.resolve);
    } catch (e) {
      reject(e);
    }
  }, parallel)();

  return Object.assign(resolvable.promise, {
    [Symbol.dispose]: dispose,
  });
}

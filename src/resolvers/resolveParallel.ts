import { assertIsValidParallel } from "../generators/parallelUtils.ts";
import type { IYieldedParallelGenerator } from "../shared.types.ts";
import { throttle, throttleParallel } from "../utils.ts";

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
  chokeOnNext?: boolean;
  onNext?: OnNext<T, TReturn>;
  onDepleted?: OnDepleted<TReturn>;
  onDone?: OnDone<TReturn>;
  debugName?: string;
  onDispose?: () => unknown;
}): Promise<TReturn> & Disposable {
  const {
    generator,
    parallel,
    chokeOnNext = parallel,
    onNext = () => {},
    onDepleted = () => {},
    onDone = () => {},
    onDispose,
  } = args;
  assertIsValidParallel(parallel);
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
    onDispose?.();
  }
  const handleNext = throttle(
    chokeOnNext ? 1 : parallel,
    async function handleNext(promise: Promise<T>) {
      try {
        const value = await promise;
        console.log("VALUE", value);
        return await onNext(await promise, resolve);
      } catch (error) {
        reject(error);
      }
    },
  );

  void throttleParallel(async function getNext() {
    try {
      const next = await generator.next();
      if (!next.done) {
        void handleNext(next.value);
        void getNext();
      }
      await onDepleted(resolvable.resolve, async () => {
        await handleNext.all();
      });
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

export const DONE = { done: true, value: undefined } as const;

export function withIndex1<Arg1, Return>(
  cb: (agr1: Arg1, index: number) => Return,
) {
  let index = 0;
  return function applyWithIndex(next: Arg1): Return {
    return cb(next, ++index);
  };
}

export function withIndex2<Arg1, Arg2, Return>(
  cb: (agr1: Arg1, arg2: Arg2, index: number) => Return,
) {
  let index = 0;
  return function applyWithIndex(previous: Arg1, next: Arg2): Return {
    return cb(previous, next, ++index);
  };
}

export const PLACEHOLDER = Symbol("PLACEHOLDER");

export function isPlaceholder<T>(value: T | symbol): value is symbol {
  return value === PLACEHOLDER;
}

export function memoize<TArgs extends any[], TReturn>(
  cb: (...args: TArgs) => TReturn,
) {
  // returns memoized version of the function
  let prevArgs: TArgs = [PLACEHOLDER] as unknown as any;
  let prevReturn: TReturn;
  return function memoizedFunction(...args: TArgs): TReturn {
    /** Todo check that every arg is same as previous and as many args */
    let allSame = prevArgs.length === args.length;
    for (let i = 0; i < args.length; i++) {
      if (args[i] === prevArgs[i]) continue;
      allSame = false;
      break;
    }
    if (allSame) {
      return prevReturn;
    }
    prevArgs = args;
    prevReturn = cb(...args);
    return prevReturn;
  };
}

export function locked<TArgs extends any[], TReturn>(
  cb: (...args: TArgs) => TReturn,
) {
  const resolvable = Promise.withResolvers<void>();
  let isLocked = false;
  return async function lockedFunction(...args: TArgs): Promise<TReturn> {
    while (isLocked) {
      await resolvable.promise;
    }
    isLocked = true;
    try {
      // eslint-disable-next-line @typescript-eslint/await-thenable
      return await cb(...args);
    } finally {
      isLocked = false;
      resolvable.resolve();
    }
  };
}

const { promise } = Promise.withResolvers<any>();
export function resolveNever<T = void>(): Promise<T> {
  return promise;
}

type ThrottleQueueItem<TArgs extends any[], TReturn> = {
  args: TArgs;
  resolvable: PromiseWithResolvers<TReturn>;
};
export function throttle<TArgs extends any[], TReturn>(
  cb: (...args: TArgs) => Promise<TReturn>,
  limit: number,
) {
  let active = 0;
  if (limit <= 0) {
    throw new RangeError("Limit must be greater than 0");
  }
  const queue: Array<ThrottleQueueItem<TArgs, TReturn>> = [];
  const inFlight = new Set<Promise<unknown>>();

  async function processQueue() {
    if (active >= limit) return;
    const next = queue.shift();
    if (!next) return;
    active++;
    try {
      const promise = cb(...next.args);
      inFlight.add(promise);
      const result = await promise;
      next.resolvable.resolve(result);
    } catch (e) {
      next.resolvable.reject(e);
    } finally {
      active--;
      inFlight.delete(promise);
      void processQueue();
    }
  }
  function isIdle() {
    return active > 0 || queue.length > 0;
  }
  async function waitForIdle() {
    while (!isIdle()) {
      await Promise.all(inFlight);
    }
  }
  async function waitForAnyResolved() {
    await Promise.race(inFlight);
  }
  return Object.assign(
    function throttledFunction(...args: TArgs): Promise<TReturn> {
      const resolvable = Promise.withResolvers<TReturn>();
      queue.push({ args, resolvable });
      void processQueue();
      return resolvable.promise;
    },
    { waitForIdle, isIdle, waitForAnyResolved },
  );
}

export function once<TArgs extends any[], TReturn>(
  cb?: (...args: TArgs) => TReturn,
) {
  if (!cb) return cb;
  let called = false;
  let returnValue: TReturn;
  return function onceFunction(...args: TArgs): TReturn {
    if (called) return returnValue!;
    called = true;
    returnValue = cb(...args);
    return returnValue;
  };
}

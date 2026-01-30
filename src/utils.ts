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
    // eslint-disable-next-line no-unmodified-loop-condition
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

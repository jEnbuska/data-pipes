import { getPlaceholder } from "./placeholder.ts";

export function memoize<TArgs extends any[], TReturn>(
  cb: (...args: TArgs) => TReturn,
) {
  // returns memoized version of the function
  let prevArgs: TArgs = [getPlaceholder()] as unknown as any;
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

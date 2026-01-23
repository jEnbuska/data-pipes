import type { YieldedGenerator, YieldedMiddleware } from "../types.ts";

export function nextToParent<
  TAsync extends boolean,
  TArgs extends any[],
  TInput,
>(previous: (...args: TArgs) => YieldedGenerator<TAsync, TInput>) {
  return function <TOutput, TReturn>(
    next: YieldedMiddleware<TAsync, TInput, TOutput, TReturn>,
  ): (...args: TArgs) => YieldedGenerator<TAsync, TOutput, TReturn> {
    return (...args: TArgs) => {
      const generator = previous(...args);
      return next(generator);
    };
  };
}

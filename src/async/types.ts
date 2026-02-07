import type { IYieldedParallel } from "../generators/apply/parallel.ts";
import type { IYieldedOperations } from "../generators/types.ts";
import type { IAsyncYieldedResolver } from "../resolvers/async/types.ts";

export interface IAsyncYielded<T>
  extends
    IYieldedOperations<T, "async">,
    IAsyncYieldedResolver<T>,
    IYieldedParallel<T> {}

export type IAsyncYieldedSource<T> =
  | AsyncIterable<T, unknown, unknown>
  | AsyncGenerator<T, unknown, unknown>
  | (() =>
      | AsyncIterable<T, unknown, unknown>
      | AsyncGenerator<T, unknown, unknown>)
  | Promise<T[]>;

export type IYieldedSource<T> =
  T extends IAsyncYieldedSource<T>
    ? never
    :
        | Iterable<T>
        | Generator<T, unknown, unknown>
        | (() =>
            | Iterable<T, unknown, unknown>
            | Generator<T, unknown, unknown>);

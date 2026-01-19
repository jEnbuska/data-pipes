import {
  withAsyncProvider,
  withProvider,
} from "../consumers/yieldedProviderResolver.ts";

export type SyncOperatorGenerator<TIn> = Generator<
  TIn,
  void | undefined,
  undefined
> & {
  [Symbol.dispose](): void;
};

export type AsyncOperatorGenerator<TIn> =
  | SyncOperatorGenerator<TIn>
  | (AsyncGenerator<TIn, void | undefined, undefined> & {
      [Symbol.dispose](): void;
    });

export type SyncOperatorProvider<TArgs extends any[], TIn> = (
  ...args: TArgs
) => SyncOperatorGenerator<TIn>;
export type AsyncOperatorProvider<TArgs extends any[], TIn> = (
  ...args: TArgs
) => AsyncOperatorGenerator<TIn>;

export type OperatorResolverReturn<TNext> = Generator<
  TNext,
  void | undefined,
  undefined
>;

export type SyncOperatorResolver<TArgs extends any[], TIn, TNext = TIn> = (
  provider: SyncOperatorProvider<TArgs, TIn>,
  ...args: TArgs
) => OperatorResolverReturn<TNext>;

export type AsyncOperatorResolver<TArgs extends any[], TIn, TNext = TIn> = {
  readonly prototype: AsyncGenerator;
} & ((
  generator: AsyncOperatorProvider<TArgs, TIn>,
  ...args: TArgs
) => AsyncGenerator<Awaited<TNext>, void, unknown>);

export type SyncOperatorFunction<TArgs extends any[], TIn, TNext> = (
  ...args: TArgs
) => SyncOperatorResolver<TArgs, TIn, TNext>;

type AsyncOperatorFunction<TArgs extends any[], TIn, TNext> = (
  ...args: TArgs
) => AsyncOperatorResolver<TArgs, TIn, TNext>;

export type YieldedOperatorConfig<
  TName extends string,
  ToAsync extends boolean,
  ToMaybe extends boolean,
  ToOne extends boolean,
  ToMany extends boolean,
  TSynchronous extends
    | undefined
    | (ToAsync extends true
        ? AsyncOperatorFunction<any[], any, any>
        : SyncOperatorFunction<any[], any, any>),
  TAsynchronous extends undefined | AsyncOperatorFunction<any[], any, any>,
> = {
  name?: TName;
  toAsync?: ToAsync;
  toMaybe?: ToMaybe;
  toOne?: ToOne;
  toMany?: ToMany;
} & {
  [name in TName as `${TName}Sync`]: TSynchronous;
} & {
  [name in TName as `${TName}Async`]: TAsynchronous;
};

export function defineOperator<
  ToAsync extends boolean,
  ToMaybe extends boolean,
  ToOne extends boolean,
  ToMany extends boolean,
  const TName extends string,
  TSynchronous extends
    | undefined
    | (ToAsync extends true
        ? AsyncOperatorFunction<any[], any, any>
        : SyncOperatorFunction<any[], any, any>),
  const TAsynchronous extends
    | undefined
    | AsyncOperatorFunction<any[], any, any>,
>(
  config: YieldedOperatorConfig<
    TName,
    ToAsync,
    ToMaybe,
    ToOne,
    ToMany,
    TSynchronous,
    TAsynchronous
  >,
) {
  const {
    toMaybe = false,
    toOne = false,
    toAsync = false,
    toMany = false,
  } = config;
  return { ...config, toMany, toOne, toAsync, toMaybe };
}

function create<
  TArgs extends any[],
  TInput,
  TAsync extends boolean,
  TOperators extends Array<
    YieldedOperatorConfig<string, boolean, boolean, boolean, string, any, any>
  >,
>(
  operators: TOperators,
  provider: SyncOperatorProvider<TArgs, TInput>,
  config: {
    asynchronous: TAsync;
  },
) {
  Object.entries(operators).map(([name, operation]) => {
    const callback = config.asynchronous
      ? operation[`${name}Sync`]
      : operation[`${name}Async`];

    const applyWithProvider = config.asynchronous
      ? withProvider
      : withAsyncProvider;
    return [name, (...args: any[]) => {}];
  });
}

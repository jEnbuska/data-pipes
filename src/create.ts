import {
  withAsyncProvider,
  withProvider,
} from "./consumers/yieldedProviderResolver.ts";
import type { SyncOperatorProvider, YieldedOperatorConfig } from "./types.ts";

type YieldedOperatorName<Op> =
  Op extends YieldedOperatorConfig<
    infer Name,
    boolean,
    boolean,
    boolean,
    boolean,
    any,
    any
  >
    ? Name extends string
      ? Name
      : never
    : never;

type CreateYieldedReturn<
  TArgs extends any[],
  TInput,
  TAsync extends boolean,
  TOperators extends Array<
    YieldedOperatorConfig<string, boolean, boolean, boolean, boolean, any, any>
  >,
> = {
  [Op in TOperators as YieldedOperatorName<Op>]: any;
};

function create<
  TArgs extends any[],
  TInput,
  ToMaybe extends boolean,
  ToAsync extends boolean,
  ToOne extends boolean,
  ToMany extends boolean,
  ToSome extends ToMaybe extends true ? false : boolean,
  TOperators extends Array<
    YieldedOperatorConfig<string, boolean, boolean, boolean, boolean, ToSome, any, any>
  >,
>(
  operators: TOperators,
  provider: SyncOperatorProvider< TInput>,
  config: {
    toAsync?: ToAsync;
    toMaybe?: ToMaybe;
    toOne?: ToOne;
    toMany?: ToMany;
  },
): CreateYieldedReturn<TArgs, TInput, ToAsync, TOperators> {
  return operators
    .filter((op) => {
      const { name } = op;
      const callbackName = config.toAsync
        ? (`${name}Sync` as const)
        : (`${name}Async` as const);
      if (!(callbackName in op)) return false;
    })

    .map((op) => {
      const toAsync = config.toAsync || op.toAsync;
      const toOne = config.toOne || op.toOne;
      const toMany = config.toMany && !op.toOne;
      const
      const callback = config.toAsync
        ? operation[`${name}Sync`]
        : operation[`${name}Async`];

      const applyWithProvider = config.asynchronous
        ? withProvider
        : withAsyncProvider;
      return [name, (...args: any[]) => {}];
    });
}

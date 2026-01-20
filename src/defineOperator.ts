import type {
  AsyncOperatorFunction,
  SyncOperatorFunction,
  YieldedOperatorConfig,
} from "./types.ts";

export function defineOperator<
  const TName extends string,
  const ToAsync extends boolean,
  const ToMaybe extends boolean,
  const ToOne extends boolean,
  const ToMany extends ToOne extends true ? false : boolean,
  const ToSome extends ToMaybe extends true ? false : boolean,
  const TSyncResolver extends ToAsync extends true
    ? AsyncOperatorFunction<any[], any, any>
    : SyncOperatorFunction<any[], any, any> | undefined,
  const TAsyncResolver extends
    | undefined
    | AsyncOperatorFunction<any[], any, any>,
>(
  config: YieldedOperatorConfig<
    TName,
    ToAsync,
    ToMaybe,
    ToOne,
    ToMany,
    ToSome,
    TSyncResolver,
    TAsyncResolver
  >,
): ToAsync {
  const {
    toMaybe = false,
    toOne = false,
    toAsync = false,
    toMany = false,
    toSome = false,
  } = config;
  return { ...config, toMany, toOne, toAsync, toMaybe, toSome };
}

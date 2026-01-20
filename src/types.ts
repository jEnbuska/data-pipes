import { MapPayload } from "./commands/$map.ts";



export type MaybeAwaited<TAsync extends boolean, TIn> = TAsync extends true ? Awaited<TIn> : TIn

export type MaybePromise<TAsync extends boolean, TIn> = TAsync extends true ? (Promise<TIn> | TIn) : TIn


export type SyncOperatorGenerator<TIn> = Generator<
  TIn,
  void | undefined,
  undefined
> & {
  [Symbol.dispose](): void;
};

export type DefaultValue<TDefault> = {
  _yieldedDefault: () => TDefault;
};
export type AsyncOperatorGenerator<TIn> =
  | SyncOperatorGenerator<TIn>
  | (AsyncGenerator<TIn, void | undefined, undefined> & {
      [Symbol.dispose](): void;
    });
export type SyncOperatorProvider<TIn> = SyncOperatorGenerator<TIn>;
export type AsyncOperatorProvider<TIn> = AsyncOperatorGenerator<TIn>;
export type SyncOperatorResolverReturn<TNext, TDefault = never> = Generator<
  TDefault extends never ? TNext : ,
  void | undefined,
  undefined
>;

export type SyncOperator<
  TIn,
  TNext = TIn,
  TDefault = never,
> = SyncOperatorResolver<TIn, TDefault extends never ? TNext  : TNext | DefaultValue<TDefault>>;

export type SyncOperatorResolver<TIn, TNext = TIn, TDefault = never> = (
  generator: SyncOperatorGenerator<TIn>,
) => SyncOperatorResolverReturn<TNext>;

export type AsyncOperator<
  TArgs extends any[],
  TIn,
  TNext = TIn,
  TDefault = never,
> = Generator<TDefault, AsyncOperatorResolver<TArgs, TIn, TNext>, TDefault>;

export type AsyncOperatorResolver<TArgs extends any[], TIn, TNext = TIn> = {
  readonly prototype: AsyncGenerator;
} & ((
  provider: AsyncOperatorProvider<, TIn>,
  ...args: TArgs
) => AsyncGenerator<Awaited<TNext>, void, unknown>);

export type SyncOperatorFunction<TArgs extends any[], TIn, TNext> = (
  ...args: TArgs
) => SyncOperatorResolver<TArgs, TIn, TNext>;
export type AsyncOperatorFunction<TArgs extends any[], TIn, TNext> = (
  ...args: TArgs
) => AsyncOperatorResolver<TArgs, TIn, TNext>;

export type OperatorSyncResolver<ToAsync> = ToAsync extends true
  ? SyncOperatorFunction<any[], any, any>
  : AsyncOperatorFunction<any[], any, any> | undefined;

type Definition<
  TName extends string,
  TSyncResolver extends
    | SyncOperatorFunction<any[], any, any>
    | AsyncOperatorFunction<any[], any, any>
    | undefined,
  TAsyncResolver extends undefined | AsyncOperatorFunction<any[], any, any>,
  ToAsync extends boolean,
  ToMaybe extends boolean,
  ToOne extends boolean,
  ToMany extends boolean,
  ToSome extends boolean,
> = {
  name?: TName;
  toAsync?: ToAsync;
  toMaybe?: ToMaybe;
  toOne?: ToOne;
  toMany?: ToMany;
  toSome?: ToSome;
} & {
  [name in TName as `${TName}Sync`]: TSyncResolver;
} & {
  [name in TName as `${TName}Async`]: TAsyncResolver;
};

export type YieldedOperatorConfig<
  TName extends string,
  ToAsync extends boolean,
  ToMaybe extends boolean,
  ToOne extends boolean,
  ToMany extends ToOne extends true ? false : boolean,
  ToSome extends ToMaybe extends true ? false : boolean,
  TSyncResolver extends ToAsync extends true
    ? AsyncOperatorFunction<any[], any, any>
    : SyncOperatorFunction<any[], any, any> | undefined,
  TAsyncResolver extends undefined | AsyncOperatorFunction<any[], any, any>,
> = Definition<
  TName,
  TSyncResolver,
  TAsyncResolver,
  ToAsync,
  ToMaybe,
  ToOne,
  ToMany,
  ToSome
>;

import { _yielded } from "../_internal.ts";
import {
  withAsyncProvider,
  withProvider,
} from "../consumers/yieldedProviderResolver.ts";
import { syncDefaultTo } from "../generators/misc/defaultTo.ts";
import type {
  AsyncConsumer,
  AsyncProvider,
  GeneratorOperator,
  SyncProvider,
} from "../types.ts";
import { MultiAsyncYielded } from "./MultiAsyncYielded.ts";
import { MultiYielded } from "./MultiYielded.ts";
import { SingleAsyncYielded } from "./SingleAsyncYielded.ts";
import { SingleYielded } from "./SingleYielded.ts";

type DeriveExtendedClass<
  TOut,
  TOptional extends boolean,
  TAsync extends boolean,
  TMulti extends boolean,
> = TAsync extends true
  ? TMulti extends true
    ? MultiAsyncYielded<TOut, TOptional>
    : SingleAsyncYielded<TOut, TOptional>
  : TMulti extends true
    ? MultiYielded<TOut, TOptional>
    : SingleYielded<TOut, TOptional>;

type DeriveProviderType<TAsync extends boolean, TOut> = TAsync extends true
  ? AsyncProvider<TOut>
  : SyncProvider<TOut>;

type DeriveConsumerType<TAsync extends boolean, TOut> = TAsync extends true
  ? AsyncConsumer<TOut>
  : GeneratorOperator<TOut>;

type YieldedOptions<
  TMulti extends boolean,
  TOptional extends boolean,
  TAsync extends boolean,
> = {
  isMulti: TMulti;
  isOptional: TOptional;
  isAsync: TAsync;
};

export class YieldedBase<
  TOut,
  TOptional extends boolean,
  TAsync extends boolean,
  TMulti extends boolean,
> {
  #isOptional: TOptional;
  #isAsync: TAsync;
  #isMulti: TMulti;
  readonly defaultTo: TOptional extends false
    ? undefined
    : (
        getDefault: () => TOut,
      ) => DeriveExtendedClass<TOut, TOptional, TAsync, TMulti>;

  readonly #provider: DeriveProviderType<TAsync, TOut>;

  constructor(
    provider: DeriveProviderType<TAsync, TOut>,
    options: YieldedOptions<TMulti, TOptional, TAsync>,
  ) {
    this.#provider = provider;
    this.#isOptional = options.isOptional;
    this.#isAsync = options.isAsync;
    this.#isMulti = options.isMulti;
    if (options.isOptional) {
      this.defaultTo = this.createDefaultToMethod();
    }
  }

  private createDefaultToMethod() {
    return <TDefault>(getDefault: () => TDefault) => {
      return this.create(getDefault, { isOptional: false });
    };
  }

  protected create<
    TNext,
    TNexTOptional extends boolean = TOptional,
    TNextAsync extends boolean = TAsync,
    TNextMulti extends boolean = TMulti,
  >(
    consumer: DeriveConsumerType<TNextAsync, TNext>,
    options: Partial<{
      isMulti?: TNextMulti;
      isOptional?: TNexTOptional;
      isAsync?: TNextAsync;
    }>,
  ): DeriveExtendedClass<TNext, TNexTOptional, TNextAsync, TNextMulti> {
    const {
      isOptional = this.#isOptional,
      isMulti = this.#isMulti,
      isAsync = this.#isAsync,
    } = options;
    const { #provider: provider } = this;
    const YieldedClass = _yielded.invoke(() => {
      if (isAsync) {
        if (isMulti) return MultiAsyncYielded;
        return SingleAsyncYielded;
      }
      if (isMulti) return MultiYielded;
      return SingleYielded;
    });
    const withProviderCallback: any = isAsync
      ? withAsyncProvider
      : withProvider;
    return new YieldedClass(
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      withProviderCallback(provider, consumer),
      isOptional,
    ) as any;
  }

  private createDefaultToMethod() {
    return <TDefault>(getDefault: () => TDefault) => {
      return this.create(syncDefaultTo(getDefault), false);
    };
  }
}

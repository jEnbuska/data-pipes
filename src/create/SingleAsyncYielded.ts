import { consumeAsync } from "../consumers/consume.ts";
import { firstAsync } from "../consumers/first.ts";
import { withAsyncProvider } from "../consumers/yieldedProviderResolver.ts";
import { filterAsync } from "../generators/filters/filter.ts";
import { liftAsync } from "../generators/misc/lift.ts";
import { mapAsync } from "../generators/misc/map.ts";
import { tapAsync } from "../generators/misc/tap.ts";
import { flatAsync } from "../generators/spreaders/flat.ts";
import { flatMapAsync } from "../generators/spreaders/flatMap.ts";
import type {
  AsyncConsumer,
  AsyncProvider,
  YieldedLiftMiddleware,
} from "../types.ts";
import { syncIterableYielded } from "./syncIterableYielded.ts";
import { YieldedBase } from "./YieldedBase.ts";

export class SingleAsyncYielded<
  TOut,
  TOptional extends boolean,
> extends YieldedBase<TOut, TOptional, true, false> {
  constructor(provider: AsyncProvider<TOut>, isOptional: TOptional) {
    super(provider, { isOptional, isAsync: true, isMulti: false });
    this.resolve = this.resolve.bind(this);
    this.consume = this.consume.bind(this);
  }

  private create<TNext, TNextOptional extends boolean>(
    next: AsyncConsumer<TOut, TNext>,
    optional: TNextOptional,
  ): SingleAsyncYielded<TNext, TNextOptional>;
  private create<TNext>(
    next: AsyncConsumer<TOut, TNext>,
  ): SingleAsyncYielded<TNext, TOptional>;
  private create(
    next: AsyncConsumer<any, boolean>,
    optional = this.#isOptional,
  ) {
    return new SingleAsyncYielded<any, boolean>(
      withAsyncProvider(this.#provider, next),
      optional,
    );
  }

  consume(signal?: AbortSignal) {
    return consumeAsync(this.#provider, signal);
  }

  filter<TNext extends TOut>(
    predicate: (next: TOut) => next is TNext,
  ): SingleAsyncYielded<TNext, true>;
  filter(
    predicate: (next: TOut) => boolean | Promise<boolean>,
  ): SingleAsyncYielded<TOut, true>;
  filter(predicate: (next: any) => any): any {
    return this.create(filterAsync(predicate), true);
  }

  flat<Depth extends number = 1>(depth?: Depth) {
    // TODO MultiYielded
    return syncIterableYielded(flatAsync(this.#provider, depth));
  }

  flatMap<TNext>(callback: (value: TOut) => TNext | TNext[]) {
    // TODO MultiYielded
    return syncIterableYielded(flatMapAsync(this.#provider, callback));
  }

  lift<TNext = never>(middleware: YieldedLiftMiddleware<false, TOut, TNext>) {
    // TODO MultiYielded
    return syncIterableYielded(liftAsync(this.#provider, middleware), true);
  }

  map<TNext>(mapper: (next: TOut) => Promise<TNext> | TNext) {
    return this.create(mapAsync(mapper));
  }

  resolve(): Promise<TOut>;
  resolve(signal: AbortSignal): Promise<TOut | undefined>;
  resolve(signal?: AbortSignal) {
    return firstAsync(this.#provider, signal);
  }

  tap(callback: (next: TOut) => unknown) {
    return this.create(tapAsync(callback));
  }
}

import { consumeSync } from "../consumers/consume.ts";
import { firstSync } from "../consumers/first.ts";
import { withProvider } from "../consumers/yieldedProviderResolver.ts";
import { filterSync } from "../generators/filters/filter.ts";
import { syncDefaultTo } from "../generators/misc/defaultTo.ts";
import { liftSync } from "../generators/misc/lift.ts";
import { mapSync } from "../generators/misc/map.ts";
import { tapSync } from "../generators/misc/tap.ts";
import { toAwaited } from "../generators/misc/toAwaited.ts";
import { flatSync } from "../generators/spreaders/flat.ts";
import { flatMapSync } from "../generators/spreaders/flatMap.ts";
import type {
  GeneratorOperator,
  SyncProvider,
  YieldedLiftMiddleware,
} from "../types.ts";
import { SingleAsyncYielded } from "./SingleAsyncYielded.ts";
import { syncIterableYielded } from "./syncIterableYielded.ts";

export class SingleYielded<TOut, TOptional extends boolean> {
  #provider: SyncProvider<TOut>;
  #optional: TOptional;

  constructor(provider: SyncProvider<TOut>, optional: TOptional) {
    this.#optional = optional;
    this.#provider = provider;
    this.resolve = this.resolve.bind(this);
    this.consume = this.consume.bind(this);
    if (this.#optional) {
      this.defaultTo = this.createDefaultToMethod() as any;
    }
  }

  private createDefaultToMethod() {
    return <TDefault>(getDefault: () => TDefault) => {
      return this.create(syncDefaultTo(getDefault), false);
    };
  }

  private create<TNext, TNextOptional extends boolean>(
    next: GeneratorOperator<TOut, TNext>,
    optional: TNextOptional,
  ): SingleYielded<TNext, TNextOptional>;
  private create<TNext>(
    next: GeneratorOperator<TOut, TNext>,
  ): SingleYielded<TNext, TOptional>;
  private create(
    next: GeneratorOperator<any, boolean>,
    optional = this.#optional,
  ) {
    return new SingleYielded<any, boolean>(
      withProvider(this.#provider, next),
      optional,
    );
  }

  consume(signal?: AbortSignal) {
    return consumeSync(this.#provider, signal);
  }

  filter<TNext extends TOut>(
    predicate: (next: TNext) => next is TNext,
  ): SingleYielded<TNext, true>;
  filter(predicate: (next: TOut) => boolean): SingleYielded<TOut, true>;
  filter(predicate: (next: any) => any): any {
    return this.create(filterSync(predicate), true);
  }

  flat<Depth extends number = 1>(depth?: Depth) {
    // TODO MultiYielded
    return syncIterableYielded(
      withProvider(this.#provider, flatSync(depth)),
      true,
    );
  }

  flatMap<TNext>(callback: (value: TNext) => TNext | TNext[]) {
    // TODO MultiYielded
    return syncIterableYielded(this.#provider, flatMapSync(callback), true);
  }

  lift<TNext = never>(middleware: YieldedLiftMiddleware<false, TNext, TNext>) {
    // TODO MultiYielded
    return syncIterableYielded(this.#provider, liftSync(middleware), true);
  }

  map<TNext>(mapper: (next: TOut) => Promise<TNext> | TNext) {
    return this.create(mapSync(mapper));
  }

  resolve(): TOptional extends true ? TOut | undefined : TOut;
  resolve(signal: AbortSignal): TOut | undefined;
  resolve(signal?: AbortSignal) {
    return firstSync(this.#provider, signal);
  }

  tap(callback: (next: TOut) => unknown) {
    return this.create(tapSync(callback));
  }

  toAwaited() {
    return new SingleAsyncYielded(toAwaited(this.#provider), this.#optional);
  }
}

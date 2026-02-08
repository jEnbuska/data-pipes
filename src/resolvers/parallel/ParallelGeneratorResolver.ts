import { assertIsValidParallel } from "../../general/utils/parallel.ts";
import type { IYieldedParallelGenerator } from "../../generators/parallel/types.ts";

type ResolveCallback<TReturn> = (value: TReturn) => void;

type OnNext<T, TReturn> = (
  value: T,
  resolve: ResolveCallback<TReturn>,
) => unknown;

type OnDone<TReturn> = (resolve: ResolveCallback<TReturn>) => unknown;

type ParallelGeneratorResolversArguments<T, TReturn> = {
  generator: IYieldedParallelGenerator<T>;
  parallel: number;
  onNext?: OnNext<T, TReturn>;
  onDone?: OnDone<TReturn>;
  signal?: AbortSignal;
};

export type ParallelGeneratorCallbackArgs<T, TReturn> = Pick<
  ParallelGeneratorResolversArguments<T, TReturn>,
  "onNext" | "onDone"
>;

type ParallelGeneratorResolverState =
  | "running"
  | "depleted"
  | "resolved"
  | "rejected";

export class ParallelGeneratorResolver<T, TReturn> {
  #parallel: number;

  #generator: IYieldedParallelGenerator<T>;

  readonly #onNext?: OnNext<T, TReturn>;

  readonly #onDone?: OnDone<TReturn>;

  #resolvable = Promise.withResolvers<TReturn>();

  #onNextResolvable = Promise.withResolvers<void>();

  #state: ParallelGeneratorResolverState = "running";

  #signal?: AbortSignal;

  #running = 0;

  private constructor(
    generator: IYieldedParallelGenerator<T>,
    parallel: number,
    onNext?: OnNext<T, TReturn>,
    onDone?: OnDone<TReturn>,
    signal?: AbortSignal,
  ) {
    parallel = Math.floor(parallel);
    assertIsValidParallel(parallel);
    this.#parallel = parallel;
    this.#generator = generator;
    this.#onNext = onNext;
    this.#onDone = onDone;
    this.#signal = signal;

    signal?.addEventListener("abort", () => {
      onDone?.(this.#resolve);
      this.#state = "resolved";
    });
    if (this.#signal?.aborted) {
      this.#state = "depleted";
    }
  }

  #reject(error: any) {
    if (this.#state !== "running" && this.#state !== "depleted") return;
    this.#state = "rejected";
    void this.#generator.return();
    this.#onNextResolvable.resolve();
    this.#resolvable.reject(error);
  }

  #resolve = async (value: TReturn | PromiseLike<TReturn>) => {
    if (this.#state !== "running" && this.#state !== "depleted") return;
    this.#state = "resolved";
    void this.#generator.return();
    this.#resolvable.resolve(value);
  };

  protected dispose() {
    this.#state = "rejected";
  }

  static run<T, TReturn = T>(
    options: ParallelGeneratorResolversArguments<T, TReturn>,
  ): Disposable & Promise<TReturn> {
    const { generator, parallel, onNext, onDone, signal } = options;
    const resolver = new ParallelGeneratorResolver<T, TReturn>(
      generator,
      parallel,
      onNext,
      onDone,
      signal,
    );
    return Object.assign(resolver.run(), {
      [Symbol.dispose]() {
        resolver.dispose();
      },
    });
  }

  protected async run(): Promise<TReturn> {
    try {
      while (this.#state === "running") {
        this.#running++;
        this.#onNextResolvable = Promise.withResolvers<void>();
        void this.#generator.next().then(this.#handleNext);
        if (this.#running < this.#parallel) continue;
        await this.#onNextResolvable.promise;
        this.#onNextResolvable = Promise.withResolvers<void>();
      }
      while (this.#state === "depleted") {
        if (!this.#running) {
          await this.#onDone?.(this.#resolve);
          this.#state = "resolved";
        } else {
          await this.#onNextResolvable.promise;
          this.#onNextResolvable = Promise.withResolvers<void>();
        }
      }
    } catch (error) {
      this.#reject(error);
    }
    return this.#resolvable.promise;
  }

  #handleNext = async (result: IteratorResult<T, void>) => {
    try {
      if (result.done) {
        this.#state = "depleted";
      } else {
        await this.#onNext?.(result.value, this.#resolve);
      }
      this.#running--;
      this.#onNextResolvable.resolve();
    } catch (error) {
      this.#reject(error);
    }
  };
}

import type {
  IPromiseOrNot,
  IYieldedParallelGenerator,
} from "../shared.types.ts";

type ResolveCallback<TReturn> = (returnValue: TReturn) => void;
type HandleNext<TNext, TReturn> = (args: {
  value: TNext;
  resolve: ResolveCallback<TReturn>;
}) => unknown;
type HandleDone<TReturn> = (args: {
  resolve: ResolveCallback<TReturn>;
  untilIdle(): Promise<void>;
}) => unknown;
type HandleDoneAndIdle<TReturn> = (
  resolve: ResolveCallback<TReturn>,
) => unknown;

export class ParallelGeneratorResolver<T, TReturn> {
  #throttle: number;
  #throttleResolver = Promise.withResolvers<void>();
  #buffering: Array<Promise<void>> = [];

  #parallel: number;
  #parallelResolver = Promise.withResolvers<void>();
  readonly #pulling: Array<Promise<IteratorResult<Promise<T>, void>>> = [];

  readonly #generator: IYieldedParallelGenerator<T>;
  #returned = false;
  #returnResolver = Promise.withResolvers<TReturn>();

  private constructor(
    generator: IYieldedParallelGenerator<T>,
    parallel: number,
    throttle = parallel,
  ) {
    this.#generator = generator;
    this.#parallel = parallel;
    this.#throttle = throttle;
  }

  static run<TNext, TReturn>(args: {
    generator: IYieldedParallelGenerator<TNext>;
    parallel: number;
    throttle?: number;
    onNext?: HandleNext<TNext, TReturn>;
    onDone?: HandleDone<TReturn>;
    onDoneAndIdle?: HandleDoneAndIdle<TReturn>;
  }) {
    const { generator, parallel, throttle, onNext, onDone, onDoneAndIdle } =
      args;
    return new ParallelGeneratorResolver<TNext, TReturn>(
      generator,
      parallel,
      throttle,
    ).pull(onNext, onDone, onDoneAndIdle);
  }

  #resolve = (result: TReturn) => {
    if (this.#returned) return;
    this.#returnResolver.resolve(result);
    this.#returned = true;
    void this.#generator.return();
  };

  #reject = (error: any) => {
    if (this.#returned) return;
    this.#returnResolver.reject(error);
    this.#returned = true;
    void this.#generator.return();
    throw error;
  };

  async #untilIdle() {
    console.log("ParallelGeneratorResolver", "Waiting until buffered resolved");
    while (!this.#returned) {
      if (this.#buffering.length) await Promise.race(this.#buffering);
      else if (this.#pulling.length) await Promise.race(this.#pulling);
      else return;
    }
  }

  async #trackPulling(promise: Promise<IteratorResult<Promise<T>, void>>) {
    this.#pulling.push(promise);
    const result = promise;
    void this.#pulling.splice(this.#pulling.indexOf(promise), 1);
    return result;
  }

  async #pullNext() {
    while (!this.#parallel) {
      await this.#parallelResolver.promise;
    }
    this.#parallelResolver = Promise.withResolvers<void>();
    this.#parallel--;
    const result = await this.#generator.next();
    this.#parallel++;
    this.#parallelResolver.resolve();
    return result;
  }

  async #applyNext(promise: Promise<T>, handleNext: HandleNext<T, TReturn>) {
    const value = await promise;
    try {
      return await handleNext({ value, resolve: this.#resolve });
    } catch (e) {
      this.#reject(e);
    }
  }

  [Symbol.dispose]() {
    this.#returned = true;
    void this.#generator.return();
  }

  async #trackBuffering(promise: Promise<void>) {
    try {
      this.#buffering.push(promise);
      await promise;
      void this.#buffering.splice(this.#buffering.indexOf(promise), 1);
    } catch (e) {
      this.#reject(e);
    }
  }

  async #addToBuffer(promise: IPromiseOrNot<unknown>) {
    this.#throttle--;
    await promise;
    this.#throttle++;
    this.#throttleResolver.resolve();
    this.#throttleResolver = Promise.withResolvers();
  }

  protected async pull(
    handleNext?: HandleNext<T, TReturn>,
    handleDone?: HandleDone<TReturn>,
    handleDoneAndIdle?: HandleDoneAndIdle<TReturn>,
  ): Promise<TReturn> {
    const onNext = async (
      next: IteratorResult<Promise<T>, void | undefined>,
    ) => {
      if (this.#returned) return;
      if (next.done) {
        handleDone?.({
          resolve: this.#resolve,
          untilIdle: this.#untilIdle,
        });
        if (!handleDoneAndIdle) return;
        await this.#untilIdle();
        if (this.#returned) return;
        return handleDoneAndIdle(this.#resolve);
      }

      if (handleNext) {
        void this.#trackBuffering(
          this.#addToBuffer(this.#applyNext(next.value, handleNext)),
        );
      }
      void this.#trackPulling(this.#pullNext()).then(onNext);
    };
    void this.#generator.next().then(onNext);
    return this.#returnResolver.promise;
  }
}

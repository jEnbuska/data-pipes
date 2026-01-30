import type {
  IPromiseOrNot,
  IYieldedParallelGenerator,
} from "../shared.types.ts";
import { DONE } from "../utils.ts";

type NextResult<TOut> =
  | { type: "CONTINUE" }
  | { type: "RETURN" }
  | { type: "YIELD"; payload: IPromiseOrNot<TOut> }
  | { type: "YIELD_ALL"; payload: Array<IPromiseOrNot<TOut>> };

type HandleNext<T, TOut> = (
  next: Promise<T>,
) => IPromiseOrNot<NextResult<TOut>>;

type HandleDone<TOut> = () => IPromiseOrNot<
  Exclude<NextResult<TOut>, { type: "CONTINUE" }>
>;

export class YieldedParallelGenerator<
  T,
  TNext = T,
> implements IYieldedParallelGenerator<TNext> {
  #throttle: number;
  #throttleResolver = Promise.withResolvers<void>();
  readonly #buffering: Array<Promise<void>> = [];
  readonly #buffer: Array<Promise<TNext>> = [];

  #parallel: number;
  #parallelResolver = Promise.withResolvers<void>();
  readonly #pulling: Array<Promise<IteratorResult<Promise<T>, void>>> = [];

  readonly #generator: IYieldedParallelGenerator<T>;
  #depleted = false;
  #isDisposed = false;

  readonly #handleNext: HandleNext<T, TNext>;
  #handleDone?: HandleDone<TNext>;

  private constructor(
    generator: IYieldedParallelGenerator<T>,
    handleNext: HandleNext<T, TNext>,
    parallel: number,
    throttle = parallel,
    handleDone?: HandleDone<TNext>,
  ) {
    this.#handleNext = handleNext;
    this.#handleDone = handleDone;
    this.#generator = generator;
    this.#parallel = parallel;
    this.#throttle = throttle;
  }

  static create<T, TOut = T>(args: {
    generator: IYieldedParallelGenerator<T>;
    handleNext: HandleNext<T, TOut>;
    handleDone?: HandleDone<TOut>;
    parallel: number;
    throttle?: number;
  }) {
    return new YieldedParallelGenerator<T, TOut>(
      args.generator,
      args.handleNext,
      args.parallel,
      args.throttle,
      args.handleDone,
    );
  }

  #reject = (error: any) => {
    if (this.#isDisposed) return;
    this.#isDisposed = true;
    void this.#generator.throw(error);
    this.#depleted = true;
    throw error;
  };

  #dispose() {
    if (this.#isDisposed) return DONE;
    console.log("YieldedParallelGenerator", "Disposing");
    this.#isDisposed = true;
    void this.#generator.return();
    this.#depleted = true;
    return DONE;
  }

  async [Symbol.asyncDispose]() {
    this.#dispose();
  }

  [Symbol.dispose]() {
    this.#dispose();
  }

  async #trackPulling(promise: Promise<IteratorResult<Promise<T>, void>>) {
    try {
      this.#pulling.push(promise);
      const result = promise;
      void this.#pulling.splice(this.#pulling.indexOf(promise), 1);
      return result;
    } catch (e) {
      this.#reject(e);
    }
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

  async #trackBuffering(promise: Promise<void>) {
    try {
      this.#buffering.push(promise);
      await promise;
      void this.#buffering.splice(this.#buffering.indexOf(promise), 1);
    } catch (e) {
      this.#reject(e);
    }
  }

  provided = 0;

  async #addToBuffer(promise: IPromiseOrNot<NextResult<TNext>>) {
    this.#throttle--;
    const result = await promise;
    switch (result.type) {
      case "CONTINUE":
        break;
      case "YIELD":
        this.#buffer.push(Promise.resolve(result.payload));
        break;
      case "YIELD_ALL":
        Array.prototype.push.apply(this.#buffer, result.payload);
        break;
      case "RETURN":
        this.#depleted = true;
        break;
    }
    this.#throttle++;
    this.#throttleResolver.resolve();
    this.#throttleResolver = Promise.withResolvers();
  }

  async #waitUntilBufferedResolved() {
    while (!this.#isDisposed) {
      if (this.#buffer.length) return;
      if (this.#buffering.length) await Promise.race(this.#buffering);
      else if (this.#pulling.length) await Promise.race(this.#pulling);
      else return;
    }
  }

  async next(..._: [] | [void]): Promise<IteratorResult<Promise<TNext>, void>> {
    while (!this.#isDisposed) {
      if (this.#depleted) break;
      if (this.#buffer.length) {
        const value = this.#buffer.shift()!;
        console.log("YieldedParallelGenerator", "Providing", ++this.provided);
        return { value, done: false };
      }

      const next = await this.#trackPulling(this.#pullNext());
      this.#depleted = !!next.done;
      if (!next.done) {
        void this.#trackBuffering(
          this.#addToBuffer(this.#handleNext(next.value)),
        );
      } else {
        this.#depleted = true;
      }
    }
    if (this.#isDisposed) return DONE;
    if (this.#handleDone) {
      void this.#trackBuffering(this.#addToBuffer(this.#handleDone()));
      this.#handleDone = undefined;
    }
    await this.#waitUntilBufferedResolved();
    console.log("YieldedParallelGenerator", "Draining buffer");
    if (this.#isDisposed) {
      console.log("YieldedParallelGenerator", "Disposed while draining buffer");
      return DONE;
    }
    if (this.#buffer.length) {
      console.log("YieldedParallelGenerator", "Returning value from buffer");
      const value = this.#buffer.shift()!;
      console.log("YieldedParallelGenerator", "Providing", ++this.provided);
      return { value, done: false };
    }
    return this.#dispose();
  }

  async return() {
    return this.#dispose();
  }

  async throw() {
    return this.#dispose();
  }

  [Symbol.asyncIterator]() {
    return this;
  }
}

import { DONE } from "../constants.ts";
import type { IYieldedIterableSource } from "../resolvers/resolver.types.ts";
import type {
  IYieldedFlow,
  IYieldedGenerator,
  IYieldedParallelGenerator,
  MaybeAsync,
} from "../shared.types.ts";
import { parallelIterableSourceToAsyncIterable } from "../utils/iteration.ts";
import { throttle } from "../utils/throttle.ts";
import { assertIsValidParallel } from "./parallelUtils.ts";

type ParallelCallbackReturn<TOut> = void | null | IYieldedIterableSource<
  TOut,
  "parallel"
>;

type ParallelGeneratorState = "running" | "done" | "aborted";

type BufferedProvider<TOut> = () => Promise<IteratorYieldResult<TOut>>;
function createBufferedProvider<TOut>(
  value: Exclude<ParallelCallbackReturn<TOut>, void | null>,
): BufferedProvider<TOut> {
  const iterator = parallelIterableSourceToAsyncIterable(value);
  return async () => {
    const next = await iterator.next();
    if (next.done) return undefined;
    next.value = await next.value;
    return next as any;
  };
}

type ParallelGeneratorOnNext<T, TOut> = (
  value: T,
) => MaybeAsync<ParallelCallbackReturn<TOut>>;
type ParallelGeneratorOnDone<TOut> = () => MaybeAsync<
  void | undefined | ParallelCallbackReturn<TOut>
>;

export type ParallelGeneratorArguments<T, TOut> = {
  generator: IYieldedGenerator<T, IYieldedFlow>;
  onNext?: ParallelGeneratorOnNext<T, TOut>;
  onDone?: ParallelGeneratorOnDone<TOut>;
  parallel: number;
};

export class ParallelGenerator<
  T,
  TOut,
> implements IYieldedParallelGenerator<TOut> {
  #state: ParallelGeneratorState = "running";

  #onNext: ParallelGeneratorOnNext<T, TOut>;

  #onDone?: ParallelGeneratorOnDone<TOut>;

  #pendingWork = new Set<any>();

  #abortResolvable = Promise.withResolvers<never>();

  #doneResolvable = Promise.withResolvers<void>();

  readonly #parallel: number;

  readonly #buffer: Array<BufferedProvider<MaybeAsync<TOut>>> = [];

  readonly #generator: IYieldedParallelGenerator<T>;

  static create<T, TOut = T>(
    options:
      | ParallelGeneratorArguments<T, TOut>
      | Omit<ParallelGeneratorArguments<T, TOut>, "onNext">,
  ): IYieldedParallelGenerator<TOut> {
    const {
      generator,
      parallel,
      onNext = ParallelGenerator.#defaultOnNext,
      onDone,
    } = options as any;
    return new ParallelGenerator<T, TOut>(generator, parallel, onNext, onDone);
  }

  static #defaultOnNext(value: Promise<unknown>) {
    return [value];
  }

  private constructor(
    generator: IYieldedParallelGenerator<T>,
    parallel: number,
    onNext: ParallelGeneratorOnNext<T, TOut>,
    onDone?: ParallelGeneratorOnDone<TOut>,
  ) {
    parallel = Math.floor(parallel);
    assertIsValidParallel(parallel);
    this.#generator = generator;
    this.#onNext = onNext;
    this.#onDone = onDone;
    this.#parallel = parallel;

    this.next = throttle(this.#parallel, this.next.bind(this));
  }

  // ---------------- AsyncGenerator ----------------

  [Symbol.asyncIterator]() {
    return this;
  }

  async [Symbol.asyncDispose]() {
    this.#setState("aborted");
  }

  async return(): Promise<IteratorReturnResult<void | undefined>> {
    this.#setState("aborted");
    return DONE;
  }

  async throw(err: unknown): Promise<IteratorReturnResult<void | undefined>> {
    this.#setState("aborted");
    throw err;
  }

  #setState(state: ParallelGeneratorState) {
    switch (state) {
      case "running":
        throw new Error('Cannot transition to "running" state');
      case "done": {
        this.#state = state;
        return;
      }
      case "aborted": {
        if (this.#state === "aborted") return;
        this.#state = state;
        this.#abortResolvable.reject(new Error("Aborted"));
        void this.#generator.return?.();
        this.#buffer.length = 0;
        break;
      }
      default:
        throw new Error("Invalid state transition to " + state);
    }
  }

  async next(): Promise<IteratorResult<TOut, void>> {
    try {
      switch (this.#state) {
        case "aborted":
          return DONE;
        case "done": {
          await this.#doneResolvable.promise;
          const buffered = await this.#getNextFromBuffer();
          return buffered ?? DONE;
        }
        case "running": {
          return await this.#queueHandleNext();
        }
      }
    } catch (error) {
      if (this.#state === "aborted") return DONE;
      this.#setState("aborted");
      throw error;
    }
  }

  // ---------------- Internal ----------------

  #queue: Array<PromiseWithResolvers<IteratorResult<TOut, void>>> = [];

  async #queueHandleNext() {
    const resolvable = Promise.withResolvers<IteratorResult<TOut, void>>();
    this.#queue.push(resolvable);
    void this.#handleNext()
      .then(this.#onHandleNextResolved)
      .catch(this.#onHandleNextRejected);
    return resolvable.promise;
  }

  #onHandleNextResolved = (result: IteratorResult<TOut, void>) => {
    const resolvable = this.#queue.shift();
    resolvable?.resolve(result);
  };

  #onHandleNextRejected = (error: any) => {
    const resolvable = this.#queue.shift();
    resolvable?.reject(error);
    throw new Error(error);
  };

  async #handleNext(): Promise<IteratorResult<TOut, void>> {
    while (true) {
      const buffered = await this.#getNextFromBuffer();
      if (buffered) return buffered;
      const next = await this.#registerWork(this.#generator.next());
      if (next.done) {
        return this.#handleDone();
      }
      const result = await this.#registerWork(this.#onNext?.(next.value));
      if (result === null) {
        void this.#generator.return?.();
        return this.#handleDone();
      }
      if (!result) continue;
      const provider = createBufferedProvider(result);
      const first = await this.#registerWork(provider());
      if (!first) continue;
      this.#buffer.push(provider);
      return first;
    }
  }

  async #registerWork<T>(work: Promise<T> | T) {
    const promise = Promise.race([this.#abortResolvable.promise, work]);
    this.#pendingWork.add(promise);
    try {
      const result = await promise;
      if (result === "ABORTED") {
        throw new Error("Aborted");
      }
      return result;
    } finally {
      this.#pendingWork.delete(promise);
    }
  }

  async #handleDone() {
    if (this.#state === "running") {
      this.#setState("done");
      while (this.#pendingWork.size) await Promise.all(this.#pendingWork);
      const result = await this.#onDone?.();
      if (result) {
        const provider = createBufferedProvider(result);
        if (provider) this.#buffer.push(provider);
      }
      this.#doneResolvable.resolve();
    }
    await this.#doneResolvable.promise;
    const buffered = await this.#getNextFromBuffer();
    return buffered ?? DONE;
  }

  #bufferIndex = 0;

  async #getNextFromBuffer() {
    while (this.#buffer.length) {
      const index = this.#bufferIndex++ % this.#buffer.length;
      const getNext = this.#buffer[index]!;
      const next = await Promise.race([
        this.#abortResolvable.promise,
        getNext(),
      ]);
      if (!next) {
        this.#buffer.splice(this.#buffer.indexOf(getNext), 1);
        continue;
      }
      if (!next.done) return next as IteratorYieldResult<TOut>;
    }
  }
}

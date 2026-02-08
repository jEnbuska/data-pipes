import type { IYieldedFlow } from "../../general/types.ts";
import {
  assertIsValidParallel,
  throttle,
} from "../../general/utils/parallel.ts";
import { ParallelBufferGenerator } from "../../resolvers/parallel/ParallelBufferGenerator.ts";
import type { IYieldedGenerator } from "../types.ts";
import type {
  IYieldedParallelGenerator,
  ParallelGeneratorOnDone,
  ParallelGeneratorOnNext,
  ParallelGeneratorState,
} from "./types.ts";

const returnResult: IteratorReturnResult<void | undefined> = {
  done: true,
  value: undefined,
};
export class ParallelGenerator<
  T,
  TOut,
> implements IYieldedParallelGenerator<TOut> {
  #state: ParallelGeneratorState = "running";

  readonly #onNext: ParallelGeneratorOnNext<T, TOut>;

  readonly #onDone?: ParallelGeneratorOnDone<TOut>;

  #pendingWork = new Set<any>();

  #abortResolvable = Promise.withResolvers<never>();

  #doneResolvable: PromiseWithResolvers<void> & { resolved?: boolean } =
    Promise.withResolvers<void>();

  readonly #parallel: number;

  readonly #buffer: Array<IYieldedGenerator<TOut, "async">> = [];

  readonly #generator: IYieldedParallelGenerator<T>;

  #drainers = 0;

  #drainResolvable = Promise.withResolvers<void>();

  static create<T, TOut = T>(options: {
    generator: IYieldedGenerator<T, IYieldedFlow>;
    onNext?: ParallelGeneratorOnNext<T, TOut>;
    onDone?: ParallelGeneratorOnDone<TOut>;
    parallel: number;
  }): IYieldedParallelGenerator<TOut> {
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
    return returnResult;
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
          return returnResult;
        case "done": {
          return this.#drainLastFromBuffered();
        }
        case "running": {
          return this.#queueHandleNext();
        }
      }
    } catch (error) {
      if (this.#state === "aborted") return returnResult;
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
    if (this.#state === "aborted") return;
    this.#setState("aborted");
    const resolvable = this.#queue.shift();
    resolvable?.reject(error);
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
      if (!result) continue;
      if (result === "STOP") {
        void this.#generator.return?.();
        return this.#handleDone();
      }
      const iterable = new ParallelBufferGenerator(result);
      const first = await this.#registerWork(iterable.next());
      if (first.done) continue;
      this.#buffer.push(iterable);
      return first;
    }
  }

  async #registerWork<T>(work: Promise<T> | T) {
    const promise = Promise.race([this.#abortResolvable.promise, work]);
    this.#pendingWork.add(promise);
    try {
      return await promise;
    } finally {
      this.#pendingWork.delete(promise);
    }
  }

  async #handleDone() {
    if (this.#state === "running") {
      this.#setState("done");
      while (this.#pendingWork.size) await Promise.all(this.#pendingWork);
      const result = await this.#onDone?.();
      if (result) this.#buffer.push(new ParallelBufferGenerator(result));
      this.#doneResolvable.resolve();
      this.#doneResolvable.resolved = true;
    }
    return this.#drainLastFromBuffered();
  }

  async #getNextFromBuffer() {
    while (this.#buffer.length) {
      const iterable = this.#buffer.shift()!;
      const next = await iterable.next();
      if (next.done) continue;
      this.#buffer.push(iterable);
      return next;
    }
  }

  async #drainLastFromBuffered(): Promise<IteratorResult<TOut, void>> {
    const wasResolved = this.#doneResolvable.resolved;
    while (this.#drainers && !this.#buffer.length) {
      await this.#drainResolvable.promise;
    }
    let next: IteratorResult<TOut, void> = returnResult;
    while (this.#buffer.length) {
      const iterable = this.#buffer.shift()!;
      this.#drainers++;
      next = await iterable.next();
      this.#drainers--;
      if (next.done) continue;
      this.#buffer.push(iterable);
      break;
    }
    this.#drainResolvable.resolve();
    this.#drainResolvable = Promise.withResolvers<void>();
    if (!next.done || wasResolved) return next;
    await this.#doneResolvable.promise;
    return this.#drainLastFromBuffered();
  }
}

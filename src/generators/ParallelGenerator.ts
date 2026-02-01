import type { IYieldedParallelGenerator, MaybeAsync } from "../shared.types.ts";
import { throttle } from "../utils.ts";

type ExpandResult<R> =
  | undefined
  | void
  | Iterator<R>
  | Iterable<R>
  | AsyncIterator<R>
  | AsyncIterable<R>;

function getIterator<TOut>(
  value: Exclude<ExpandResult<TOut>, undefined>,
): AsyncIterator<TOut> | Iterator<TOut> {
  if (
    typeof (value as AsyncIterable<TOut>)[Symbol.asyncIterator] === "function"
  ) {
    return (value as any)[Symbol.asyncIterator]() as AsyncIterator<TOut>;
  }

  if (typeof (value as Iterable<TOut>)[Symbol.iterator] === "function") {
    return (value as any)[Symbol.iterator]() as Iterator<TOut>;
  }

  if (typeof (value as any).next === "function") {
    return value as AsyncIterator<TOut> | Iterator<TOut>;
  }
  throw new Error("Invalid ExpandResult");
}

export class ParallelGenerator<
  T,
  TOut = T,
> implements IYieldedParallelGenerator<TOut> {
  readonly #source: IYieldedParallelGenerator<T>;

  readonly #onNext?: (
    value: Promise<T>,
  ) => MaybeAsync<ExpandResult<MaybeAsync<TOut>>>;

  readonly #parallel: number;

  readonly #maxBuffer: number;

  readonly #signal?: AbortSignal;

  readonly #pendingNext: Array<
    (r: IteratorResult<Promise<TOut>, void>) => void
  > = [];

  /** FIFO buffer of remaining iterators */
  readonly #buffer: Array<
    Iterator<MaybeAsync<TOut>> | AsyncIterator<MaybeAsync<TOut>>
  > = [];

  #activeWorkers = 0;

  #upstreamDone = false;

  #closed = false;

  readonly #nextUpstream: () => Promise<IteratorResult<Promise<T>, void>>;

  constructor(options: {
    generator: IYieldedParallelGenerator<T>;
    onNext?: (value: Promise<T>) => MaybeAsync<ExpandResult<MaybeAsync<TOut>>>;
    onDepleted?: () => unknown;
    onDone?: () => MaybeAsync<ExpandResult<MaybeAsync<TOut>>>;
    chokeOnNext?: boolean;
    parallel: number;
    maxBuffer?: number;
    signal?: AbortSignal;
  }) {
    const {
      generator,
      onNext,
      parallel,
      maxBuffer = 10_000,
      signal,
      chokeOnNext = false,
    } = options;

    if (!Number.isInteger(parallel) || parallel < 2 || parallel >= 50) {
      throw new RangeError("parallel must be an integer between 2 and 49");
    }
    if (!Number.isInteger(maxBuffer) || maxBuffer <= 0) {
      throw new RangeError("maxBuffer must be a positive integer");
    }

    this.#source = generator;
    this.#onNext = onNext;
    this.#parallel = parallel;
    this.#maxBuffer = maxBuffer;
    this.#signal = signal;
    this.#nextUpstream = function nextUpstream() {
      return generator.next();
    };
    if (chokeOnNext) {
      this.#nextUpstream = throttle(1, this.#nextUpstream);
    }

    // signal?.addEventListener("abort", () => this.#abort(), { once: true });
  }

  // ---------------- AsyncGenerator ----------------

  async next(): Promise<IteratorResult<Promise<TOut>, void>> {
    console.log("next");
    if (this.#closed || this.#signal?.aborted) {
      return { value: undefined, done: true };
    }

    const buffered = await this.#tryDrainBuffer();

    if (buffered) return buffered;
    console.log("no buffer to drain");

    if (this.#isDone()) {
      return { value: undefined, done: true };
    }
    const { resolve, promise } =
      Promise.withResolvers<IteratorResult<Promise<TOut>, void>>();
    this.#pendingNext.push(resolve);
    this.#maybeSpawnWorker();
    return promise;
  }

  async return(): Promise<IteratorReturnResult<void | undefined>> {
    console.log("return");
    this.#abort();
    return { value: undefined, done: true };
  }

  async throw(err: unknown): Promise<IteratorReturnResult<void | undefined>> {
    console.log("throw");
    this.#abort();
    throw err;
  }

  [Symbol.asyncIterator]() {
    console.log("asyncIterator");
    return this as AsyncGenerator<TOut>;
  }

  async [Symbol.asyncDispose]() {
    console.log("async dispose");
    this.#abort();
  }

  // ---------------- Internal ----------------

  async #runWorker(): Promise<void> {
    console.log("RUN WORK");
    this.#activeWorkers++;
    try {
      if (this.#signal?.aborted) return;
      console.log("GET NEXT UPstream");
      const { value, done } = await this.#nextUpstream();
      console.log("GOT NEXT UPSTREAM");
      if (done) {
        this.#upstreamDone = true;
        this.#flush();
        return;
      }

      const mapped = await this.#onNext?.(value);
      console.log("MAPPED", mapped);
      if (!mapped) return;
      const iterator = getIterator(mapped);

      console.log("CREATED ITERATOR", iterator);

      const first = await iterator.next();
      console.log("FIRST", first);
      if (!first.done) {
        // push first value to buffer
        this.#buffer.push(iterator);
        // resolve a pending next if exists
        if (this.#pendingNext.length > 0) {
          this.#flush();
        }
      }
    } catch (e) {
      console.error(e);
      throw e;
    } finally {
      console.log("fINALLY ERROR");
      this.#activeWorkers--;
      this.#flush();
      this.#maybeSpawnWorker();
    }
  }

  async #tryDrainBuffer(): Promise<
    IteratorResult<Promise<TOut>, void> | undefined
  > {
    console.log("tryDrainBuffer");
    while (this.#buffer.length) {
      const it = this.#buffer[0];
      const r = await it.next();
      if (!r.done) {
        return { value: Promise.resolve(r.value), done: false as const };
      }
      this.#buffer.shift();
    }
  }

  #maybeSpawnWorker() {
    console.log("maybeSpawnWorker");
    if (this.#signal?.aborted) return;
    if (this.#activeWorkers >= this.#parallel) return;
    if (this.#upstreamDone) return;
    if (this.#buffer.length >= this.#maxBuffer) return;
    console.log("next run worker");
    void this.#runWorker();
  }

  #flush() {
    while (this.#pendingNext.length) {
      void this.#tryDrainBuffer().then((r) => {
        if (!r) return;
        if (!this.#pendingNext.length) return;
        this.#pendingNext.shift()!(r);
      });
    }

    if (this.#isDone()) {
      while (this.#pendingNext.length) {
        this.#pendingNext.shift()!({ value: undefined, done: true });
      }
    }
  }

  #isDone(): boolean {
    console.log("isDone?");
    return (
      this.#upstreamDone &&
      this.#activeWorkers === 0 &&
      this.#buffer.length === 0
    );
  }

  #abort() {
    console.log("abort?");
    if (this.#closed) return;
    this.#closed = true;

    while (this.#pendingNext.length) {
      this.#pendingNext.shift()!({ value: undefined, done: true });
    }

    this.#buffer.length = 0;
    void this.#source.return?.();
  }
}

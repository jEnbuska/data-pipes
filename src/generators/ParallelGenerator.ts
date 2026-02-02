import { DONE } from "../constants.ts";
import type { IYieldedParallelGenerator, MaybeAsync } from "../shared.types.ts";
import { throttle } from "../utils/throttle.ts";
import { assertIsValidParallel } from "./parallelUtils.ts";

type ExpandResult<R> =
  | undefined
  | void
  | Iterator<R>
  | Iterable<R>
  | AsyncIterator<R>
  | AsyncIterable<R>;

function getIterator<TOut>(
  value: Exclude<ExpandResult<TOut>, undefined>,
): AsyncIterator<MaybeAsync<TOut>> | Iterator<MaybeAsync<TOut>> {
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

type BufferedProvider<TOut> = () => Promise<
  IteratorResult<TOut, void | undefined>
>;
function createBufferedProvider<TOut extends MaybeAsync<any>>(
  value: Exclude<ExpandResult<TOut>, undefined>,
): BufferedProvider<TOut> {
  const iterator = getIterator(value);
  return throttle(1, async () => {
    const next = await iterator.next();
    if (next.done) return next;
    if (!next.value || !(next.value instanceof Promise)) {
      next.value = Promise.resolve(next.value);
    }
    return next as any;
  });
}

type ParallelGeneratorArguments<T, TOut> = {
  generator: IYieldedParallelGenerator<T>;
  onNext?: (value: Promise<T>) => MaybeAsync<ExpandResult<MaybeAsync<TOut>>>;
  onDone?: () => MaybeAsync<ExpandResult<MaybeAsync<TOut>>>;
  chokeOnNext?: boolean;
  parallel: number;
};
export function parallelGenerator<T, TOut>({
  generator,
  parallel,
  chokeOnNext,
  onNext,
  onDone,
}: ParallelGeneratorArguments<T, TOut>): IYieldedParallelGenerator<TOut> {
  return new ParallelGenerator({
    generator,
    parallel,
    chokeOnNext,
    onNext,
    onDone,
  });
}

export class ParallelGenerator<
  T,
  TOut = T,
> implements IYieldedParallelGenerator<TOut> {
  readonly #source: IYieldedParallelGenerator<T>;

  #onNext?: ParallelGeneratorArguments<T, TOut>["onNext"];

  #onDone?: ParallelGeneratorArguments<T, TOut>["onDone"];

  readonly #parallel: number;

  readonly #pendingToBeResolved: Array<
    (r: IteratorResult<Promise<TOut>, void>) => void
  > = [];

  /** FIFO buffer of remaining iterators */
  readonly #buffer: Array<BufferedProvider<MaybeAsync<TOut>>> = [];

  #activeWorkers = 0;

  #upstreamDone = false;

  #aborted = false;

  #resolving = false;

  readonly #getNext: () => Promise<IteratorResult<Promise<T>, void>>;

  constructor(options: ParallelGeneratorArguments<T, TOut>) {
    const {
      generator,
      onNext,

      chokeOnNext = false,
      onDone,
    } = options;
    const parallel = Math.floor(options.parallel);
    assertIsValidParallel(parallel);
    this.#source = generator;
    this.#onNext = onNext;
    this.#onDone = onDone;
    this.#parallel = parallel;
    this.#getNext = function getNext() {
      return generator.next();
    };
    if (chokeOnNext) {
      this.#getNext = throttle(1, this.#getNext);
    }
  }

  // ---------------- AsyncGenerator ----------------

  [Symbol.asyncIterator]() {
    console.log("asyncIterator");
    return this as AsyncGenerator<TOut>;
  }

  async [Symbol.asyncDispose]() {
    console.log("async dispose");
    this.#abort();
  }

  async return(): Promise<IteratorReturnResult<void | undefined>> {
    console.log("return");
    this.#abort();
    return DONE;
  }

  async throw(err: unknown): Promise<IteratorReturnResult<void | undefined>> {
    console.log("throw");
    this.#abort();
    throw err;
  }

  async next(): Promise<IteratorResult<Promise<TOut>, void>> {
    if (this.#aborted) return DONE;
    const buffered = await this.#getNextFromBuffer();
    if (buffered) return buffered;
    if (this.#upstreamDone || this.#aborted) return DONE;
    const { resolve, promise } =
      Promise.withResolvers<IteratorResult<Promise<TOut>, void>>();

    this.#pendingToBeResolved.push(resolve);
    if (this.#activeWorkers < this.#parallel) {
      void this.#runWorker();
    }
    return promise;
  }

  async #trackFinalized(promise: Promise<IteratorResult<Promise<TOut>>>) {
    try {
      return await promise;
    } finally {
      if (this.#upstreamDone && !this.#buffer.length && !this.#activeWorkers) {
        console.log("FINALIZE", this.#pendingToBeResolved.length);
        while (this.#pendingToBeResolved.length) {
          this.#pendingToBeResolved.shift()!(DONE);
        }
      }
    }
  }

  // ---------------- Internal ----------------

  async #runWorker(): Promise<void> {
    while (true) {
      this.#activeWorkers++;
      while (true) {
        if (this.#aborted || !this.#pendingToBeResolved.length) return;
        if (this.#upstreamDone) {
          this.#activeWorkers--;
          return;
        }
        const next = await this.#getNext();
        if (next.done) {
          this.#upstreamDone = true;
          break;
        }
        const mapped = await this.#onNext?.(next.value);
        if (!mapped) continue;
        this.#buffer.push(createBufferedProvider(mapped));
        break;
      }
      this.#activeWorkers--;
      if (!this.#resolving) void this.#runResolver();
    }
  }

  async #runResolver() {
    this.#resolving = true;
    while (this.#pendingToBeResolved.length) {
      if (this.#aborted) return;
      const next = await this.#getNextFromBuffer();
      if (!next) break;
      if (this.#aborted) return;
      this.#pendingToBeResolved.shift()!(next);
    }
    this.#resolving = false;
  }

  async #resolvePendingFromBuffer() {
    const next = await this.#getNextFromBuffer();
    if (!next) return;
    if (this.#aborted) return;
    this.#pendingToBeResolved.shift()!(next);
  }

  async #getNextFromBuffer(): Promise<
    undefined | IteratorYieldResult<Promise<TOut>>
  > {
    while (this.#buffer.length) {
      const next = await this.#buffer[0]!();
      if (!next.done) return next as IteratorYieldResult<Promise<TOut>>;
      this.#buffer.shift();
    }
  }

  #abort() {
    if (this.#aborted) return;
    this.#aborted = true;
    this.#upstreamDone = true;
    void this.#source.return?.();
    while (this.#pendingToBeResolved.length) {
      this.#pendingToBeResolved.shift()!(DONE);
    }
    this.#onNext = undefined;
    this.#onDone = undefined;
  }
}

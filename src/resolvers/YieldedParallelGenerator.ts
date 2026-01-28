import type {
  IYieldedParallelGenerator,
  IYieldedParallelGeneratorOnNext,
} from "../shared.types.ts";
import { DONE } from "../utils.ts";
import { ParallelHandler } from "./ParallelHandler.ts";

export class YieldedParallelGenerator<
  R,
> implements IYieldedParallelGenerator<R> {
  readonly #onNext: IYieldedParallelGeneratorOnNext<R>;
  #handler = new ParallelHandler<
    undefined | IteratorResult<Promise<R>, void>
  >();

  #done = false;
  constructor(onNext: IYieldedParallelGeneratorOnNext<R>) {
    this.#onNext = onNext;
  }

  async [Symbol.asyncDispose]() {
    this.#done = true;
  }

  [Symbol.dispose]() {
    this.#done = true;
  }

  private static wrapReturn<T>(value: Promise<T>) {
    return { done: false as const, value };
  }

  async next(..._: [] | [void]): Promise<IteratorResult<Promise<R>, void>> {
    if (this.#done) return DONE;
    void this.#handler.register(
      this.#onNext(YieldedParallelGenerator.wrapReturn<R>),
    );
    while (!this.#handler.isEmpty()) {
      const result = await this.#handler.raceRegistered();
      if (result) {
        return result;
      }
    }
    return DONE;
  }

  async return(): Promise<IteratorResult<Promise<R>, void>> {
    this.#done = true;
    return DONE;
  }

  async throw(): Promise<IteratorResult<Promise<R>, void>> {
    this.#done = true;
    return DONE;
  }

  [Symbol.asyncIterator]() {
    return this;
  }
}

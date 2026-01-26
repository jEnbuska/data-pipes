import { parallel } from "../middlewares/parallel.ts";
import type { IYieldedAsyncGenerator } from "../shared.types.ts";

export class YieldedAsyncGenerator<T> implements IYieldedAsyncGenerator<T> {
  #generator: IYieldedAsyncGenerator<T>;
  #done = false;
  constructor(generator: IYieldedAsyncGenerator<T>, count: number) {
    if (count < 1) {
      throw new Error(`parallel count must be 1 or larger, but got ${count}`);
    }
    if (count > 1) {
      this.#generator = parallel(generator, count);
    } else {
      this.#generator = generator;
    }
  }

  async [Symbol.asyncDispose]() {}
  next(..._: [] | [void]): Promise<IteratorResult<T, void>> {
    return this.#generator.next();
  }

  async return(): Promise<IteratorResult<T, void>> {
    this.#done = true;
    return { done: true, value: undefined };
  }

  async throw(): Promise<IteratorResult<T, void>> {
    this.#done = true;
    return { done: true, value: undefined };
  }

  [Symbol.asyncIterator]() {
    console.log("get this", this);
    return this;
  }
}

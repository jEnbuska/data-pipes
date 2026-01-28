import { isPlaceholder, PLACEHOLDER } from "../utils.ts";

export class ParallelHandler<T = void> {
  #arr: Array<Promise<T>> = [];
  #tasks: any[] = [];
  #resolvable = Promise.withResolvers<T | symbol>();
  #cleanup: Array<() => unknown> = [];

  [Symbol.dispose]() {
    for (const fn of this.#cleanup) {
      fn();
    }
    this.#cleanup = [];
    this.#arr = [];
    this.#tasks = [];
  }

  async register(promise: Promise<T>) {
    this.#arr.push(promise);
    const resolvable = Promise.withResolvers<T | symbol>();
    this.#resolvable.promise = resolvable.promise;
    this.#resolvable.resolve(PLACEHOLDER);
    this.#resolvable.resolve = resolvable.resolve;
    try {
      await promise;
    } finally {
      void promise.then(this.#resolvable.resolve);
      void this.#arr.splice(this.#arr.indexOf(promise), 1);
    }
  }

  async raceRegistered() {
    return Promise.race(this.#arr);
  }

  async waitUntilAllResolved() {
    const arr = this.#arr;
    const tasks = this.#tasks;
    while (arr.length || tasks.length) {
      if (arr.length) await arr[0];
      else await tasks[0];
    }
  }

  isEmpty() {
    return this.#arr.length === 0 && this.#tasks.length === 0;
  }

  onAddedResolved(callback: (next: T) => Promise<void> | void) {
    const ended = Symbol("ENDED");
    const { promise, resolve } = Promise.withResolvers<symbol>();
    const loop = async () => {
      await this.#resolvable.promise;
      while (true) {
        const res = await Promise.race([
          promise,
          this.#resolvable.promise,
          ...this.#arr,
        ]);
        if (res === ended) return;
        if (isPlaceholder(res)) continue;
        const resultPromise = callback(res);
        this.#tasks.push(resultPromise);
        await resultPromise;
        void this.#tasks.splice(this.#tasks.indexOf(resultPromise), 1);
      }
    };
    void loop();
    return () => resolve(ended);
  }
}

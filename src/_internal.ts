export const _yielded = {
  getDisposableAsyncGenerator<TInput>(signal: AbortSignal) {
    const generator = provider(signal);
    return Object.assign(generator, {
      [Symbol.dispose]() {
        void generator.return(undefined);
      },
    });
  },
  getDisposableGenerator<TInput>(signal: AbortSignal) {
    const generator = provider(signal);
    return Object.assign(generator, {
      [Symbol.dispose]() {
        void generator.return(undefined);
      },
    });
  },
  getTrue: () => true,
  getUndefined: () => undefined,
  getZero: () => 0,
  invoke<T>(cb: () => T) {
    return cb();
  },
  once<TReturn>(cb: () => TReturn) {
    let result: undefined | { value: TReturn };
    return function invokeOnce() {
      if (result) return result.value;
      result = { value: cb(...args) };
      return result.value;
    };
  },
  createIndexFinder<TInput>(
    arr: TInput[],
    comparator: (a: TInput, b: TInput) => number,
  ) {
    return function findIndex(next: TInput, low = 0, high = arr.length - 1) {
      if (low > high) {
        return low;
      }
      const mid = Math.floor((low + high) / 2);
      const diff = comparator(next, arr[mid]);
      if (diff < 0) {
        return findIndex(next, low, mid - 1);
      }
      return findIndex(next, mid + 1, high);
    };
  },
  createIndexFinderAsync<TInput>(
    arr: TInput[],
    comparator: (a: TInput, b: TInput) => Promise<number> | number,
  ) {
    return async function findIndexAsync(
      next: TInput,
      low = 0,
      high = arr.length - 1,
    ) {
      if (low > high) {
        return low;
      }
      const mid = Math.floor((low + high) / 2);
      const diff = await comparator(next, arr[mid]);
      if (diff < 0) {
        return findIndexAsync(next, low, mid - 1);
      }
      return findIndexAsync(next, mid + 1, high);
    };
  },
};

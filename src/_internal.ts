export const _yielded = {
  getTrue: () => true,
  getUndefined: () => undefined,
  getZero: () => 0,
  invoke<T>(cb: () => T) {
    return cb();
  },
  once<TArgs extends any[], TReturn>(cb: (...args: TArgs) => TReturn) {
    let result: undefined | { value: TReturn };
    return function invokeOnce(...args: TArgs) {
      if (result) return result.value;
      result = { value: cb(...args) };
      return result.value;
    };
  },
};

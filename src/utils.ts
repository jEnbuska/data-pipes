export const _internalYielded = {
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
  getZero: () => 0,
  getUndefined: () => undefined,
  getTrue: () => true,
};

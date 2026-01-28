export const DONE = { done: true, value: undefined } as const;

export function withIndex1<Arg1, Return>(
  cb: (agr1: Arg1, index: number) => Return,
) {
  let index = 0;
  return function applyWithIndex(next: Arg1): Return {
    return cb(next, ++index);
  };
}

export function withIndex2<Arg1, Arg2, Return>(
  cb: (agr1: Arg1, arg2: Arg2, index: number) => Return,
) {
  let index = 0;
  return function applyWithIndex(previous: Arg1, next: Arg2): Return {
    return cb(previous, next, ++index);
  };
}

export const PLACEHOLDER = Symbol("PLACEHOLDER");

export function isPlaceholder<T>(value: T | symbol): value is symbol {
  return value === PLACEHOLDER;
}

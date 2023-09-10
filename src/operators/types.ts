export type OperatorGenerator<T> = () => Generator<T>;
export type AsyncOperatorGenerator<T> = () => AsyncIterableIterator<T>;

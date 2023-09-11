export type OperatorGenerator<T> = (isDone: () => boolean) => Generator<T>;
export type AsyncOperatorGenerator<T> = () => AsyncIterableIterator<T>;

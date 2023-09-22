export type OperatorGenerator<T> = (
  isDone: () => boolean,
) => Generator<T, void, void>;

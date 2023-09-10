import {
  type AsyncOperatorGenerator,
  type OperatorGenerator,
} from "../operators/types.ts";

export function toArray<T>(generator: OperatorGenerator<T>) {
  const array: T[] = [];
  for (const next of generator()) {
    array.push(next);
  }
  return array;
}

export async function toArrayASync<T>(generator: AsyncOperatorGenerator<T>) {
  const array: T[] = [];
  for await (const next of generator()) {
    array.push(next);
  }
  return array;
}

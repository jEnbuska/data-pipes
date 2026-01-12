import {
  type StreamlessProvider,
  type AsyncStreamlessProvider,
} from "../../types";
import { InternalStreamless } from "../../utils";

export function max<TInput>(
  source: StreamlessProvider<TInput>,
  callback: (next: TInput) => number,
): StreamlessProvider<TInput> {
  return function* maxGenerator() {
    let currentMax: undefined | number;
    let current: undefined | TInput;
    using generator = InternalStreamless.disposable(source);
    for (const next of generator) {
      const value = callback(next);
      if (currentMax === undefined || value > currentMax) {
        current = next;
        currentMax = value;
      }
    }
    if (currentMax === undefined) {
      return;
    }
    yield current as TInput;
  };
}

export function maxAsync<TInput>(
  source: AsyncStreamlessProvider<TInput>,
  callback: (next: TInput) => number,
): AsyncStreamlessProvider<TInput> {
  return async function* maxGenerator() {
    let currentMax: undefined | number;
    let current: undefined | TInput;
    using generator = InternalStreamless.disposable(source);
    for await (const next of generator) {
      const value = callback(next);
      if (currentMax === undefined || value > currentMax) {
        current = next;
        currentMax = value;
      }
    }
    if (currentMax === undefined) {
      return;
    }
    yield current as TInput;
  };
}

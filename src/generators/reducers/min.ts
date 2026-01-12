import {
  type StreamlessProvider,
  type AsyncStreamlessProvider,
} from "../../types";
import { _internalStreamless } from "../../utils";

export function min<TInput>(
  source: StreamlessProvider<TInput>,
  callback: (next: TInput) => number,
): StreamlessProvider<TInput> {
  return function* minGenerator() {
    let currentMin: undefined | number;
    let current: undefined | TInput;
    using generator = _internalStreamless.disposable(source);
    for (const next of generator) {
      const value = callback(next);
      if (currentMin === undefined || value < currentMin) {
        current = next;
        currentMin = value;
      }
    }
    if (currentMin === undefined) {
      return;
    }
    yield current as TInput;
  };
}

export function minAsync<TInput>(
  source: AsyncStreamlessProvider<TInput>,
  callback: (next: TInput) => number,
): AsyncStreamlessProvider<TInput> {
  return async function* minAsyncGenerator() {
    let currentMin: undefined | number;
    let current: undefined | TInput;
    using generator = _internalStreamless.disposable(source);
    for await (const next of generator) {
      const value = callback(next);
      if (currentMin === undefined || value < currentMin) {
        current = next;
        currentMin = value;
      }
    }
    if (currentMin === undefined) {
      return;
    }
    yield current as TInput;
  };
}

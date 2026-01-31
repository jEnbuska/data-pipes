import type {
  IPromiseOrNot,
  IYieldedParallelGenerator,
} from "../shared.types.ts";
import { DONE, throttleParallel } from "../utils.ts";
import { assertIsValidParallelArguments } from "./parallelUtils.ts";

type YieldCommand<T> = { YIELD: IPromiseOrNot<T> };
type YieldFlatCommand<T> = {
  YIELD_FLAT: IPromiseOrNot<
    | IPromiseOrNot<T>
    | Iterable<IPromiseOrNot<T>>
    | AsyncIterable<IPromiseOrNot<T>>
  >;
};
type ReturnCommand = { RETURN: null };
type ContinueCommand = { CONTINUE: null };

type NextCommand<T> =
  | YieldCommand<T>
  | YieldFlatCommand<T>
  | ReturnCommand
  | ContinueCommand;

type DoneCommand<T> = Exclude<NextCommand<T>, { CONTINUE: null }>;

function isContinueCommand<T>(
  command: NextCommand<T>,
): command is ContinueCommand {
  return "CONTINUE" in command;
}
function isYieldCommand<T>(
  command: NextCommand<T>,
): command is YieldCommand<T> {
  return "YIELD" in command;
}
function isReturnCommand<T>(command: NextCommand<T>): command is ReturnCommand {
  return "RETURN" in command;
}
function isYieldFlatCommand<T>(
  command: NextCommand<T>,
): command is YieldFlatCommand<T> {
  return "YIELD_FLAT" in command;
}

function isAsyncIterable<T>(
  obj: T | Iterable<T> | AsyncIterable<T>,
): obj is AsyncIterable<T> {
  return Boolean(
    obj &&
    // @ts-expect-error
    typeof obj[Symbol.asyncIterator] === "function",
  );
}

function isIterable<T>(
  obj: T | Iterable<T> | AsyncIterable<T>,
): obj is Iterable<T> {
  return Boolean(
    obj &&
    // @ts-expect-error
    typeof obj[Symbol.iterator] === "function",
  );
}

export function createParallel<T, TOut = T>(args: {
  generator: IYieldedParallelGenerator<T>;
  parallel: number;
  parallelOnNext?: number;
  onNext: (value: Promise<T>) => IPromiseOrNot<NextCommand<TOut>>;
  onDepleted?: () => IPromiseOrNot<DoneCommand<TOut>>;
  onDone?: () => IPromiseOrNot<DoneCommand<TOut>>;
}): IYieldedParallelGenerator<TOut> {
  const { generator, parallel, parallelOnNext = parallel, onNext } = args;
  assertIsValidParallelArguments({ parallel, parallelOnNext });

  function reject(error: any) {
    if (!disposed) {
      void generator.return();
    }
    throw error;
  }

  let disposed = false;
  function dispose() {
    disposed = true;
    void generator.return();
  }
  const buffer: Array<Promise<TOut>> = [];
  let depleted = false;
  async function handleCommand(command: NextCommand<TOut>) {
    if (isContinueCommand(command)) {
      return;
    }
    if (isReturnCommand(command)) {
      depleted = true;
      return;
    }
    if (isYieldCommand(command)) {
      buffer.push(Promise.resolve(command.YIELD));
      return;
    }
    if (isYieldFlatCommand(command)) {
      const YieldFlat = await command.YIELD_FLAT;
      if (Array.isArray(YieldFlat)) {
        Array.prototype.push.apply(buffer, YieldFlat);
        return;
      }
      if (isAsyncIterable(YieldFlat)) {
        const generator = YieldFlat[Symbol.asyncIterator]();
        let next = await generator.next();
        while (!next.done) {
          buffer.push(Promise.resolve(next.value));
          next = await generator.next();
        }
        return;
      }
      if (isIterable(YieldFlat)) {
        for (const next of YieldFlat) buffer.push(Promise.resolve(next));
        return;
      }
      buffer.push(Promise.resolve(YieldFlat));
      return;
    }
    throw new TypeError(
      `Command with key(s) ${Object.keys(command satisfies never).join(", ")} is not recognized.`,
    );
  }

  const handleNext = throttleParallel(async function handleNext(
    promise: Promise<T>,
  ) {
    if (disposed) return;
    try {
      const command = await onNext(promise);
      await handleCommand(command);
    } catch (e) {
      reject(e);
    }
  }, parallelOnNext);

  const getNext = throttleParallel(async function getNext() {
    if (depleted || disposed) return;
    try {
      const next = await generator.next();
      if (!next.done) {
        void handleNext(next.value);
      } else {
        depleted = true;
      }
    } catch (e) {
      reject(e);
    }
  }, parallel);

  let { onDepleted, onDone } = args;
  return {
    [Symbol.asyncIterator]() {
      return this;
    },
    async [Symbol.asyncDispose]() {
      dispose();
    },
    async return() {
      dispose();
      return DONE;
    },
    async throw(e) {
      reject(e);
      return DONE;
    },
    async next(..._: [] | [void]) {
      // deplete the generator fill the buffer, if buffer has values return first
      while (!depleted && !disposed) {
        {
          const value = buffer.shift();
          if (value) return { value, done: false };
        }
        await getNext();
      }
      if (disposed) return DONE;

      // the generator was depleted
      const command = await onDepleted?.();
      onDepleted = undefined;
      if (command) void handleCommand(command);
      if (disposed) return DONE;

      // Wait for any commands affecting by the command returned from onDone
      {
        const value = buffer.shift();
        if (value) return { value, done: false };
      }
      while (!handleNext.isIdle() && !disposed) {
        await handleNext.race();
        {
          const value = buffer.shift();
          if (value) return { value, done: false };
        }
      }
      if (disposed) return DONE;

      // Finally call onIdle and return any remaining buffered values
      await onDone?.();
      onDone = undefined;
      {
        const value = buffer.shift();
        if (value) return { value, done: false };
      }
      while (!handleNext.isIdle() && !disposed) {
        await handleNext.race();
        const value = buffer.shift();
        if (value) return { value, done: false };
      }
      return DONE;
    },
  };
}

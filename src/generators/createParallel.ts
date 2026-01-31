import type {
  IPromiseOrNot,
  IYieldedParallelGenerator,
} from "../shared.types.ts";
import { DONE, throttleParallel } from "../utils.ts";
import { assertIsValidParallelArguments } from "./parallelUtils.ts";

type YieldCommand<T> = { YIELD: IPromiseOrNot<T> };
type YieldAllCommand<T> = { YIELD_ALL: IPromiseOrNot<Array<IPromiseOrNot<T>>> };
type ReturnCommand = { RETURN: null };
type ContinueCommand = { CONTINUE: null };

type NextCommand<T> =
  | YieldCommand<T>
  | YieldAllCommand<T>
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
  return "CONTINUE" in command;
}
function isReturnCommand<T>(command: NextCommand<T>): command is ReturnCommand {
  return "RETURN" in command;
}
function isYieldAllCommand<T>(
  command: NextCommand<T>,
): command is YieldAllCommand<T> {
  return "RETURN" in command;
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
    if (isYieldAllCommand(command)) {
      for (const item of await command.YIELD_ALL) {
        buffer.push(Promise.resolve(item));
      }
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

import type { MaybeAsync } from "../shared.types.ts";
import type { ThrottleQueueItem } from "./types.ts";

export function throttle<TArgs extends any[], TReturn>(
  limit: number,
  cb: (...args: TArgs) => MaybeAsync<TReturn>,
) {
  let active = 0;
  if (limit <= 0) {
    throw new RangeError("Limit must be greater than 0");
  }
  const queue: Array<ThrottleQueueItem<TArgs, TReturn>> = [];
  const inFlight = new Set<Promise<TReturn>>();

  async function processQueue() {
    if (active >= limit) return;
    const next = queue.shift();
    if (!next) return;
    active++;
    const promise = Promise.resolve(cb(...next.args));
    inFlight.add(promise);
    try {
      const result = await promise;
      next.resolvable.resolve(result);
    } catch (error) {
      next.resolvable.reject(error);
    } finally {
      active--;
      inFlight.delete(promise);
      void processQueue();
    }
  }
  function isIdle() {
    return !active && !queue.length;
  }

  return Object.assign(
    function throttledFunction(...args: TArgs): Promise<TReturn> {
      const resolvable = Promise.withResolvers<TReturn>();
      queue.push({ args, resolvable });
      void processQueue();
      return resolvable.promise;
    },

    {
      count() {
        return active;
      },
      async all(): Promise<Array<Awaited<TReturn>>> {
        while (true) {
          const promise = await Promise.all(inFlight);
          if (isIdle()) return promise;
        }
      },
      isIdle,
    },
  );
}

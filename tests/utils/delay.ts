import { sleep } from "./sleep.ts";

export async function delay<T>(value: T, ms: number): Promise<T> {
  await sleep(ms);
  return value;
}

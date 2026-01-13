import { describe, test, expect } from "bun:test";
import { streamless } from "../create";
import { sleep } from "bun";

describe("parallel", () => {
  test(
    "Parallel with empty list",
    async () => {
      const result = (await streamless([] as number[])
        .map((it) => it)
        .resolveParallel(10)
        .collect()) satisfies number[];

      expect(result).toStrictEqual([]);
    },
    { timeout: 1000 },
  );
  test(
    "Parallel with all at once",
    async () => {
      const result = (await streamless([500, 404, 100, 300, 200])
        .map(async (it) => {
          return await sleep(it).then(() => it);
        })
        .resolveParallel(5)
        .collect()) satisfies number[];

      expect(result).toStrictEqual([100, 200, 300, 404, 500]);
    },
    { timeout: 1000 },
  );

  test(
    "Parallel with 3 parallel count",
    async () => {
      const result = (await streamless([550, 450, 300, 10, 100])
        .map(async (it) => sleep(it).then(() => it))
        .resolveParallel(3)
        .collect()) satisfies number[];
      expect(result).toStrictEqual([300, 10, 100, 450, 550]);
    },
    {
      timeout: 1000,
    },
  );
});

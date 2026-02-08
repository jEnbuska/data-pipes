import { describe, expect, test } from "vitest";
import { createTestSets } from "../utils/createTestSets.ts";

describe("withSignal", () => {
  describe("abort during iteration", () => {
    createTestSets([1, 2, 3]).modes.forEach(({ yielded, mode }) => {
      const controller = new AbortController();
      let tapped = 0;
      test(mode, async () => {
        await yielded
          .tap(() => {
            tapped++;
          })
          .withSignal(controller.signal)
          .forEach((_, i) => {
            if (i === 1) {
              controller.abort();
            }
          });
        expect(tapped).toBe(2);
      });
    });
  });
  describe("abort before iteration", () => {
    const createSet = () =>
      createTestSets([1, 2, 3]).modes.map(({ yielded, mode }) => {
        const controller = new AbortController();
        controller.abort();
        let tapped = 0;

        return {
          mode,
          getTapped() {
            return tapped;
          },
          yielded: yielded
            .tap(() => {
              tapped++;
            })
            .withSignal(controller.signal),
        };
      });
    describe("reduce", () => {
      describe("without initial value", () => {
        createSet().forEach(({ yielded, mode, getTapped }) => {
          const apply = async () => {
            await yielded.reduce((acc, next) => acc + next);
          };
          test(mode, async () => {
            await expect(apply()).rejects.toThrowError(TypeError);
            expect(getTapped()).toBe(0);
          });
        });
      });

      describe("without initial value", () => {
        createSet().forEach(({ yielded, mode, getTapped }) => {
          test(mode, async () => {
            await (yielded.reduce as any)(
              (acc: any, next: any) => acc + next,
              0,
            );
            expect(getTapped()).toBe(0);
          });
        });
      });
    });
    describe("groupBy", () => {
      createSet().forEach(({ yielded, mode, getTapped }) =>
        test(mode, async () => {
          await (yielded.groupBy as any)((next: any) => `${next}`);
          expect(getTapped()).toBe(0);
        }),
      );
    });

    (
      ["find", "maxBy", "every", "some", "minBy", "sumBy", "forEach"] as const
    ).map((method) => {
      describe(method, () => {
        createSet().forEach(({ yielded, mode, getTapped }) =>
          test(mode, async () => {
            await yielded[method]((_) => _);
            expect(getTapped()).toBe(0);
          }),
        );
      });
    });

    (
      [
        "consume",
        "toArray",
        "toSorted",
        "toSet",
        "toReversed",
        "first",
        "last",
        "count",
      ] as const
    ).forEach((method) => {
      describe(method, () => {
        createSet().forEach(({ yielded, mode, getTapped }) =>
          test(mode, async () => {
            await yielded[method]();
            expect(getTapped()).toBe(0);
          }),
        );
      });
    });
  });
});

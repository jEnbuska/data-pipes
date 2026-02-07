import { describe, expect, test } from "vitest";
import { Yielded } from "../../src";
import { delay } from "../utils/delay.ts";

describe("withSignal", () => {
  test("abort sync", () => {
    const controller = new AbortController();
    let tapped = 0;
    Yielded.from([1, 2, 3])
      .tap(() => {
        tapped++;
      })
      .withSignal(controller.signal)
      .forEach((n) => {
        if (n === 2) {
          controller.abort();
        }
      });
    expect(tapped).toBe(2);
  });

  test("abort async", async () => {
    const controller = new AbortController();
    let tapped = 0;
    await Yielded.from([1, 2, 3])
      .map((it) => delay(it, 100))
      .awaited()
      .tap(() => {
        tapped++;
      })
      .withSignal(controller.signal)
      .forEach((n) => {
        if (n === 2) {
          controller.abort();
        }
      });
    expect(tapped).toBe(2);
  });

  test("abort parallel", async () => {
    const controller = new AbortController();
    let tapped = 0;
    await Yielded.from([1, 2, 3])
      .parallel(3)
      .map((it) => delay(it, 100))
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

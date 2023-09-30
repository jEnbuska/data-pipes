import { describe, test } from "bun:test";
import { chainable } from "../..";

describe("flatMap", () => {
  test("flatten non array", () => {
    chainable
      .from(1, 2, 3)
      .flatMap((it) => it)
      .forEach((_) => {});
  });
});

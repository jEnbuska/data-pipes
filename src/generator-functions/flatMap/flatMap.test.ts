import { describe, test } from "bun:test";
import pipe from "../..";

describe("flatMap", () => {
  test("flatten non array", () => {
    pipe(1, 2, 3)
      .flatMap((it) => it)
      .forEach((_) => {});
  });
});

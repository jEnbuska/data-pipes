import { describe, test, expect } from "bun:test";
import { createProducer } from "../producer";
import streamless from "../";

describe("producer", () => {
  test("producer test", async () => {
    const producer = await createProducer<number>();
    const received: number[] = [];
    const promise = streamless(producer)
      .forEach((value) => {
        received.push(value);
      })
      .take(2)
      .consume();
    void producer.push(1);
    void producer.push(2);
    await promise;
    expect(received).toStrictEqual([1, 2]);
  }, 1000);
  test("producer test with initial", async () => {
    const producer = await createProducer<number>(0);
    const received: number[] = [];
    const promise = streamless(producer)
      .forEach((value) => received.push(value))
      .take(3)
      .consume();
    void producer.push(1);
    void producer.push(2);
    await promise;
    expect(received).toStrictEqual([0, 1, 2]);
  }, 1000);
});

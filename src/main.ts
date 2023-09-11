import pipe from "./pipe.ts";

const p = pipe(1)
  .map((x) => x * 2)
  .toSingle();

const value = pipe(function* () {
  yield 1;
  yield 2;
  yield 3;
})
  .map((x) => x * 2)
  .forEach((x) => console.log("x", x))
  .takeWhile((x) => x < 4)
  .toArray();

console.log("value", value);

const value2 = pipe([1, 2, 3])
  .map((x) => x * 2)
  .toArray();
console.log("value2", value2);

const value3 = pipe(1)
  .map((x) => x * 2)
  .toArray();

console.log("value3", value3);
/*
const value4 = pipe(async function* () {
  yield await Promise.resolve(1);
})
  .map((x) => x * 2)
  .toArray();

console.log("value4", value4);
*/

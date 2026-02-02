export function withIndex1<Arg1, Return>(
  cb: (agr1: Arg1, index: number) => Return,
) {
  let index = 0;
  return function applyWithIndex(next: Arg1): Return {
    return cb(next, ++index);
  };
}

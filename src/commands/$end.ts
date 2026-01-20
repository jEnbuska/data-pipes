export type EndPayload = {
  type: "$end";
};

function* end(): Generator<EndPayload, never, void> {
  yield { type: "$end" };
  throw new Error("$end command was incorrectly handled");
}

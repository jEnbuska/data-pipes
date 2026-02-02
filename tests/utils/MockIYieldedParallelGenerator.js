"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MockIYieldedParallelGenerator = MockIYieldedParallelGenerator;
function MockIYieldedParallelGenerator([...values]) {
    let disposed = false;
    return Object.assign({
        [Symbol.asyncIterator]() {
            return this;
        },
        async [Symbol.asyncDispose]() {
            disposed = true;
        },
        async next() {
            console.log("NEXT", "GT NEXT VALUE");
            if (disposed || !values.length)
                return { done: true, value: undefined };
            const value = values.shift();
            console.log("return value", value);
            return { value: Promise.resolve(value), done: false };
        },
        async return() {
            disposed = true;
            return { done: true, value: undefined };
        },
        async throw() {
            disposed = true;
            return { done: true, value: undefined };
        },
    }, {
        [Symbol.dispose]() {
            disposed = true;
        },
    });
}
//# sourceMappingURL=MockIYieldedParallelGenerator.js.map
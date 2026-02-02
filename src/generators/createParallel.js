"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createParallel = createParallel;
var ParallelGenerator_ts_1 = require("./ParallelGenerator.ts");
function createParallel(args) {
    return new ParallelGenerator_ts_1.ParallelGenerator({
        generator: args.generator,
        parallel: args.parallel,
        onNext: args.onNext,
        onDepleted: args.onDepleted,
        onDone: args.onDone,
        chokeOnNext: args.chokeOnNext,
    });
}

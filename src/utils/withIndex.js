"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.withIndex1 = withIndex1;
function withIndex1(cb) {
    var index = 0;
    return function applyWithIndex(next) {
        return cb(next, ++index);
    };
}

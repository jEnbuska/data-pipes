"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.memoize = memoize;
var placeholder_ts_1 = require("./placeholder.ts");
function memoize(cb) {
    // returns memoized version of the function
    var prevArgs = [(0, placeholder_ts_1.getPlaceholder)()];
    var prevReturn;
    return function memoizedFunction() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        /** Todo check that every arg is same as previous and as many args */
        var allSame = prevArgs.length === args.length;
        for (var i = 0; i < args.length; i++) {
            if (args[i] === prevArgs[i])
                continue;
            allSame = false;
            break;
        }
        if (allSame) {
            return prevReturn;
        }
        prevArgs = args;
        prevReturn = cb.apply(void 0, args);
        return prevReturn;
    };
}

"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.toSortedSync = toSortedSync;
exports.toSortedAsync = toSortedAsync;
exports.toSortedParallel = toSortedParallel;
exports.createIndexFinderAsync = createIndexFinderAsync;
var resolveParallel_ts_1 = require("../resolveParallel.ts");
function createIndexFinder(arr, comparator) {
    return function findIndex(next, low, high) {
        if (low === void 0) { low = 0; }
        if (high === void 0) { high = arr.length - 1; }
        if (low > high) {
            return low;
        }
        var mid = Math.floor((low + high) / 2);
        var diff = comparator(next, arr[mid]);
        if (diff < 0) {
            return findIndex(next, low, mid - 1);
        }
        return findIndex(next, mid + 1, high);
    };
}
function toSortedSync(generator, compareFn) {
    var arr = [];
    var findIndex = createIndexFinder(arr, compareFn);
    for (var _i = 0, generator_1 = generator; _i < generator_1.length; _i++) {
        var next = generator_1[_i];
        arr.splice(findIndex(next), 0, next);
    }
    return arr;
}
function toSortedAsync(generator, compareFn) {
    return __awaiter(this, void 0, void 0, function () {
        var arr, findIndex, pending, _loop_1, e_1_1;
        var _a, generator_2, generator_2_1;
        var _b, e_1, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    arr = [];
                    findIndex = createIndexFinderAsync(arr, compareFn);
                    pending = Promise.resolve();
                    _e.label = 1;
                case 1:
                    _e.trys.push([1, 6, 7, 12]);
                    _loop_1 = function () {
                        _d = generator_2_1.value;
                        _a = false;
                        var next = _d;
                        pending = pending.then(function () {
                            return findIndex(next).then(function (index) { return arr.splice(index, 0, next); });
                        });
                    };
                    _a = true, generator_2 = __asyncValues(generator);
                    _e.label = 2;
                case 2: return [4 /*yield*/, generator_2.next()];
                case 3:
                    if (!(generator_2_1 = _e.sent(), _b = generator_2_1.done, !_b)) return [3 /*break*/, 5];
                    _loop_1();
                    _e.label = 4;
                case 4:
                    _a = true;
                    return [3 /*break*/, 2];
                case 5: return [3 /*break*/, 12];
                case 6:
                    e_1_1 = _e.sent();
                    e_1 = { error: e_1_1 };
                    return [3 /*break*/, 12];
                case 7:
                    _e.trys.push([7, , 10, 11]);
                    if (!(!_a && !_b && (_c = generator_2.return))) return [3 /*break*/, 9];
                    return [4 /*yield*/, _c.call(generator_2)];
                case 8:
                    _e.sent();
                    _e.label = 9;
                case 9: return [3 /*break*/, 11];
                case 10:
                    if (e_1) throw e_1.error;
                    return [7 /*endfinally*/];
                case 11: return [7 /*endfinally*/];
                case 12: return [4 /*yield*/, pending];
                case 13:
                    _e.sent();
                    return [2 /*return*/, arr];
            }
        });
    });
}
function toSortedParallel(generator, parallel, compareFn) {
    var arr = [];
    var findIndex = createIndexFinderAsync(arr, compareFn);
    return (0, resolveParallel_ts_1.resolveParallel)({
        generator: generator,
        parallel: parallel,
        chokeOnNext: true,
        onNext: function (value) {
            return __awaiter(this, void 0, void 0, function () {
                var index;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, findIndex(value)];
                        case 1:
                            index = _a.sent();
                            arr.splice(index, 0, value);
                            return [2 /*return*/];
                    }
                });
            });
        },
        onDone: function (resolve) {
            resolve(arr);
        },
    });
}
function createIndexFinderAsync(arr, comparator) {
    return function findIndexAsync(next_1) {
        return __awaiter(this, arguments, void 0, function (next, low, high) {
            var mid, diff;
            if (low === void 0) { low = 0; }
            if (high === void 0) { high = arr.length - 1; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (low > high) {
                            return [2 /*return*/, low];
                        }
                        mid = Math.floor((low + high) / 2);
                        return [4 /*yield*/, comparator(next, arr[mid])];
                    case 1:
                        diff = _a.sent();
                        if (diff < 0) {
                            return [2 /*return*/, findIndexAsync(next, low, mid - 1)];
                        }
                        return [2 /*return*/, findIndexAsync(next, mid + 1, high)];
                }
            });
        });
    };
}

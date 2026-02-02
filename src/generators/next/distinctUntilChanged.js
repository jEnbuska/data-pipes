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
var __await = (this && this.__await) || function (v) { return this instanceof __await ? (this.v = v, this) : new __await(v); }
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __asyncGenerator = (this && this.__asyncGenerator) || function (thisArg, _arguments, generator) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var g = generator.apply(thisArg, _arguments || []), i, q = [];
    return i = Object.create((typeof AsyncIterator === "function" ? AsyncIterator : Object).prototype), verb("next"), verb("throw"), verb("return", awaitReturn), i[Symbol.asyncIterator] = function () { return this; }, i;
    function awaitReturn(f) { return function (v) { return Promise.resolve(v).then(f, reject); }; }
    function verb(n, f) { if (g[n]) { i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; if (f) i[n] = f(i[n]); } }
    function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
    function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
    function fulfill(value) { resume("next", value); }
    function reject(value) { resume("throw", value); }
    function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.distinctUntilChangedSync = distinctUntilChangedSync;
exports.distinctUntilChangedAsync = distinctUntilChangedAsync;
exports.distinctUntilChangedParallel = distinctUntilChangedParallel;
var createParallel_ts_1 = require("../createParallel.ts");
function distinctUntilChangedSync(generator, compare) {
    var first, previous, _i, generator_1, next;
    if (compare === void 0) { compare = defaultCompare; }
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                first = generator.next();
                if (first.done)
                    return [2 /*return*/];
                previous = first.value;
                return [4 /*yield*/, previous];
            case 1:
                _a.sent();
                _i = 0, generator_1 = generator;
                _a.label = 2;
            case 2:
                if (!(_i < generator_1.length)) return [3 /*break*/, 5];
                next = generator_1[_i];
                if (!!compare(previous, next)) return [3 /*break*/, 4];
                previous = next;
                return [4 /*yield*/, next];
            case 3:
                _a.sent();
                _a.label = 4;
            case 4:
                _i++;
                return [3 /*break*/, 2];
            case 5: return [2 /*return*/];
        }
    });
}
function distinctUntilChangedAsync(generator_2) {
    return __asyncGenerator(this, arguments, function distinctUntilChangedAsync_1(generator, compare) {
        var first, previous, _a, generator_3, generator_3_1, next, e_1_1;
        var _b, e_1, _c, _d;
        if (compare === void 0) { compare = defaultCompare; }
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0: return [4 /*yield*/, __await(generator.next())];
                case 1:
                    first = _e.sent();
                    if (!first.done) return [3 /*break*/, 3];
                    return [4 /*yield*/, __await(void 0)];
                case 2: return [2 /*return*/, _e.sent()];
                case 3:
                    previous = first.value;
                    return [4 /*yield*/, __await(previous)];
                case 4: return [4 /*yield*/, _e.sent()];
                case 5:
                    _e.sent();
                    _e.label = 6;
                case 6:
                    _e.trys.push([6, 14, 15, 20]);
                    _a = true, generator_3 = __asyncValues(generator);
                    _e.label = 7;
                case 7: return [4 /*yield*/, __await(generator_3.next())];
                case 8:
                    if (!(generator_3_1 = _e.sent(), _b = generator_3_1.done, !_b)) return [3 /*break*/, 13];
                    _d = generator_3_1.value;
                    _a = false;
                    next = _d;
                    return [4 /*yield*/, __await(compare(previous, next))];
                case 9:
                    if (!!(_e.sent())) return [3 /*break*/, 12];
                    previous = next;
                    return [4 /*yield*/, __await(next)];
                case 10: return [4 /*yield*/, _e.sent()];
                case 11:
                    _e.sent();
                    _e.label = 12;
                case 12:
                    _a = true;
                    return [3 /*break*/, 7];
                case 13: return [3 /*break*/, 20];
                case 14:
                    e_1_1 = _e.sent();
                    e_1 = { error: e_1_1 };
                    return [3 /*break*/, 20];
                case 15:
                    _e.trys.push([15, , 18, 19]);
                    if (!(!_a && !_b && (_c = generator_3.return))) return [3 /*break*/, 17];
                    return [4 /*yield*/, __await(_c.call(generator_3))];
                case 16:
                    _e.sent();
                    _e.label = 17;
                case 17: return [3 /*break*/, 19];
                case 18:
                    if (e_1) throw e_1.error;
                    return [7 /*endfinally*/];
                case 19: return [7 /*endfinally*/];
                case 20: return [2 /*return*/];
            }
        });
    });
}
function distinctUntilChangedParallel(generator, parallel, compare) {
    if (compare === void 0) { compare = defaultCompare; }
    var previous;
    return (0, createParallel_ts_1.createParallel)({
        generator: generator,
        parallel: parallel,
        chokeOnNext: true,
        onNext: function (next) {
            return __awaiter(this, void 0, void 0, function () {
                var _a, _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            if (!previous) {
                                previous = next;
                                return [2 /*return*/, [next]];
                            }
                            _a = compare;
                            return [4 /*yield*/, previous];
                        case 1:
                            _b = [_c.sent()];
                            return [4 /*yield*/, next];
                        case 2: return [4 /*yield*/, _a.apply(void 0, _b.concat([_c.sent()]))];
                        case 3:
                            if (_c.sent()) {
                                previous = next;
                                return [2 /*return*/, [next]];
                            }
                            return [2 /*return*/, []];
                    }
                });
            });
        },
    });
}
function defaultCompare(a, b) {
    return a === b;
}

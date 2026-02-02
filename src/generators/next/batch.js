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
var __await = (this && this.__await) || function (v) { return this instanceof __await ? (this.v = v, this) : new __await(v); }
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
exports.batchSync = batchSync;
exports.batchAsync = batchAsync;
exports.batchParallel = batchParallel;
var throttle_ts_1 = require("../../utils/throttle.ts");
var createParallel_ts_1 = require("../createParallel.ts");
function batchSync(generator, predicate) {
    var index, acc, _i, generator_1, next;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                index = 0;
                acc = [];
                _i = 0, generator_1 = generator;
                _a.label = 1;
            case 1:
                if (!(_i < generator_1.length)) return [3 /*break*/, 4];
                next = generator_1[_i];
                acc.push(next);
                if (predicate(acc, index++))
                    return [3 /*break*/, 3];
                return [4 /*yield*/, acc];
            case 2:
                _a.sent();
                acc = [];
                _a.label = 3;
            case 3:
                _i++;
                return [3 /*break*/, 1];
            case 4:
                if (!acc.length) return [3 /*break*/, 6];
                return [4 /*yield*/, acc];
            case 5:
                _a.sent();
                _a.label = 6;
            case 6: return [2 /*return*/];
        }
    });
}
function batchAsync(generator, predicate) {
    return __asyncGenerator(this, arguments, function batchAsync_1() {
        var index, acc, _a, generator_2, generator_2_1, next, e_1_1;
        var _b, e_1, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    index = 0;
                    acc = [];
                    _e.label = 1;
                case 1:
                    _e.trys.push([1, 9, 10, 15]);
                    _a = true, generator_2 = __asyncValues(generator);
                    _e.label = 2;
                case 2: return [4 /*yield*/, __await(generator_2.next())];
                case 3:
                    if (!(generator_2_1 = _e.sent(), _b = generator_2_1.done, !_b)) return [3 /*break*/, 8];
                    _d = generator_2_1.value;
                    _a = false;
                    next = _d;
                    acc.push(next);
                    return [4 /*yield*/, __await(predicate(acc, index++))];
                case 4:
                    if (_e.sent())
                        return [3 /*break*/, 7];
                    return [4 /*yield*/, __await(acc)];
                case 5: return [4 /*yield*/, _e.sent()];
                case 6:
                    _e.sent();
                    acc = [];
                    _e.label = 7;
                case 7:
                    _a = true;
                    return [3 /*break*/, 2];
                case 8: return [3 /*break*/, 15];
                case 9:
                    e_1_1 = _e.sent();
                    e_1 = { error: e_1_1 };
                    return [3 /*break*/, 15];
                case 10:
                    _e.trys.push([10, , 13, 14]);
                    if (!(!_a && !_b && (_c = generator_2.return))) return [3 /*break*/, 12];
                    return [4 /*yield*/, __await(_c.call(generator_2))];
                case 11:
                    _e.sent();
                    _e.label = 12;
                case 12: return [3 /*break*/, 14];
                case 13:
                    if (e_1) throw e_1.error;
                    return [7 /*endfinally*/];
                case 14: return [7 /*endfinally*/];
                case 15:
                    if (!acc.length) return [3 /*break*/, 18];
                    return [4 /*yield*/, __await(acc)];
                case 16: return [4 /*yield*/, _e.sent()];
                case 17:
                    _e.sent();
                    _e.label = 18;
                case 18: return [2 /*return*/];
            }
        });
    });
}
function batchParallel(generator, parallel, predicate) {
    var _this = this;
    var index = 0;
    var lockedPredicate = (0, throttle_ts_1.throttle)(1, function (next) { return __awaiter(_this, void 0, void 0, function () {
        var value;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, next];
                case 1:
                    value = _a.sent();
                    acc.push(value);
                    return [2 /*return*/, predicate(acc, index++)];
            }
        });
    }); });
    var acc = [];
    return (0, createParallel_ts_1.createParallel)({
        generator: generator,
        parallel: parallel,
        onNext: function (next) {
            return __awaiter(this, void 0, void 0, function () {
                var match, payload;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, lockedPredicate(next)];
                        case 1:
                            match = _a.sent();
                            if (match)
                                return [2 /*return*/, []];
                            payload = acc;
                            acc = [];
                            return [2 /*return*/, [payload]];
                    }
                });
            });
        },
        onDone: function () {
            if (acc.length)
                return [acc];
        },
    });
}

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
var __asyncDelegator = (this && this.__asyncDelegator) || function (o) {
    var i, p;
    return i = {}, verb("next"), verb("throw", function (e) { throw e; }), verb("return"), i[Symbol.iterator] = function () { return this; }, i;
    function verb(n, f) { i[n] = o[n] ? function (v) { return (p = !p) ? { value: __await(o[n](v)), done: false } : f ? f(v) : v; } : f; }
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
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.flatMapSync = flatMapSync;
exports.flatMapAsync = flatMapAsync;
exports.flatMapParallel = flatMapParallel;
var withIndex_ts_1 = require("../../utils/withIndex.ts");
var createParallel_ts_1 = require("../createParallel.ts");
function flatMapSync(generator, flatMapper) {
    var callback, _i, generator_1, next, out;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                callback = (0, withIndex_ts_1.withIndex1)(flatMapper);
                _i = 0, generator_1 = generator;
                _a.label = 1;
            case 1:
                if (!(_i < generator_1.length)) return [3 /*break*/, 6];
                next = generator_1[_i];
                out = callback(next);
                if (!(out === null || out === void 0 ? void 0 : out[Symbol.iterator])) return [3 /*break*/, 3];
                return [5 /*yield**/, __values(out)];
            case 2:
                _a.sent();
                return [3 /*break*/, 5];
            case 3: return [4 /*yield*/, out];
            case 4:
                _a.sent();
                _a.label = 5;
            case 5:
                _i++;
                return [3 /*break*/, 1];
            case 6: return [2 /*return*/];
        }
    });
}
function flatMapAsync(generator, flatMapper) {
    return __asyncGenerator(this, arguments, function flatMapAsync_1() {
        var callback, _a, generator_2, generator_2_1, next, out, e_1_1;
        var _b, e_1, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    callback = (0, withIndex_ts_1.withIndex1)(flatMapper);
                    _e.label = 1;
                case 1:
                    _e.trys.push([1, 12, 13, 18]);
                    _a = true, generator_2 = __asyncValues(generator);
                    _e.label = 2;
                case 2: return [4 /*yield*/, __await(generator_2.next())];
                case 3:
                    if (!(generator_2_1 = _e.sent(), _b = generator_2_1.done, !_b)) return [3 /*break*/, 11];
                    _d = generator_2_1.value;
                    _a = false;
                    next = _d;
                    return [4 /*yield*/, __await(callback(next))];
                case 4:
                    out = _e.sent();
                    if (!(out === null || out === void 0 ? void 0 : out[Symbol.iterator])) return [3 /*break*/, 7];
                    return [5 /*yield**/, __values(__asyncDelegator(__asyncValues(out)))];
                case 5: return [4 /*yield*/, __await.apply(void 0, [_e.sent()])];
                case 6:
                    _e.sent();
                    return [3 /*break*/, 10];
                case 7: return [4 /*yield*/, __await(out)];
                case 8: return [4 /*yield*/, _e.sent()];
                case 9:
                    _e.sent();
                    _e.label = 10;
                case 10:
                    _a = true;
                    return [3 /*break*/, 2];
                case 11: return [3 /*break*/, 18];
                case 12:
                    e_1_1 = _e.sent();
                    e_1 = { error: e_1_1 };
                    return [3 /*break*/, 18];
                case 13:
                    _e.trys.push([13, , 16, 17]);
                    if (!(!_a && !_b && (_c = generator_2.return))) return [3 /*break*/, 15];
                    return [4 /*yield*/, __await(_c.call(generator_2))];
                case 14:
                    _e.sent();
                    _e.label = 15;
                case 15: return [3 /*break*/, 17];
                case 16:
                    if (e_1) throw e_1.error;
                    return [7 /*endfinally*/];
                case 17: return [7 /*endfinally*/];
                case 18: return [2 /*return*/];
            }
        });
    });
}
function flatMapParallel(generator, parallel, flatMapper) {
    var callback = (0, withIndex_ts_1.withIndex1)(flatMapper);
    return (0, createParallel_ts_1.createParallel)({
        generator: generator,
        parallel: parallel,
        onNext: function (next) {
            return __awaiter(this, void 0, void 0, function () {
                var res;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, next.then(callback)];
                        case 1:
                            res = _a.sent();
                            if (Array.isArray(res))
                                return [2 /*return*/, res]; // TODO
                            return [2 /*return*/, [res]];
                    }
                });
            });
        },
    });
}

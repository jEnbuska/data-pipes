"use strict";
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
var __addDisposableResource = (this && this.__addDisposableResource) || function (env, value, async) {
    if (value !== null && value !== void 0) {
        if (typeof value !== "object" && typeof value !== "function") throw new TypeError("Object expected.");
        var dispose, inner;
        if (async) {
            if (!Symbol.asyncDispose) throw new TypeError("Symbol.asyncDispose is not defined.");
            dispose = value[Symbol.asyncDispose];
        }
        if (dispose === void 0) {
            if (!Symbol.dispose) throw new TypeError("Symbol.dispose is not defined.");
            dispose = value[Symbol.dispose];
            if (async) inner = dispose;
        }
        if (typeof dispose !== "function") throw new TypeError("Object not disposable.");
        if (inner) dispose = function() { try { inner.call(this); } catch (e) { return Promise.reject(e); } };
        env.stack.push({ value: value, dispose: dispose, async: async });
    }
    else if (async) {
        env.stack.push({ async: true });
    }
    return value;
};
var __disposeResources = (this && this.__disposeResources) || (function (SuppressedError) {
    return function (env) {
        function fail(e) {
            env.error = env.hasError ? new SuppressedError(e, env.error, "An error was suppressed during disposal.") : e;
            env.hasError = true;
        }
        var r, s = 0;
        function next() {
            while (r = env.stack.pop()) {
                try {
                    if (!r.async && s === 1) return s = 0, env.stack.push(r), Promise.resolve().then(next);
                    if (r.dispose) {
                        var result = r.dispose.call(r.value);
                        if (r.async) return s |= 2, Promise.resolve(result).then(next, function(e) { fail(e); return next(); });
                    }
                    else s |= 1;
                }
                catch (e) {
                    fail(e);
                }
            }
            if (s === 1) return env.hasError ? Promise.reject(env.error) : Promise.resolve();
            if (env.hasError) throw env.error;
        }
        return next();
    };
})(typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
    var e = new Error(message);
    return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
});
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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.syncToAwaited = syncToAwaited;
exports.parallelToAwaited = parallelToAwaited;
var resolveParallel_ts_1 = require("../../resolvers/resolveParallel.ts");
function syncToAwaited(generator) {
    return __asyncGenerator(this, arguments, function syncToAwaited_1() {
        var _i, generator_1, next;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _i = 0, generator_1 = generator;
                    _a.label = 1;
                case 1:
                    if (!(_i < generator_1.length)) return [3 /*break*/, 5];
                    next = generator_1[_i];
                    return [4 /*yield*/, __await(next)];
                case 2: return [4 /*yield*/, _a.sent()];
                case 3:
                    _a.sent();
                    _a.label = 4;
                case 4:
                    _i++;
                    return [3 /*break*/, 1];
                case 5: return [2 /*return*/];
            }
        });
    });
}
function parallelToAwaited(generator, parallel) {
    return __asyncGenerator(this, arguments, function parallelToAwaited_1() {
        var env_1, done, buffer, resolvable, _, _a, generator_2, generator_2_1, next, e_1_1, e_2;
        var _b, e_1, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    env_1 = { stack: [], error: void 0, hasError: false };
                    _e.label = 1;
                case 1:
                    _e.trys.push([1, 22, 23, 24]);
                    done = false;
                    buffer = [];
                    resolvable = Promise.withResolvers();
                    _ = __addDisposableResource(env_1, (0, resolveParallel_ts_1.resolveParallel)({
                        generator: generator,
                        parallel: parallel,
                        onNext: function (value) {
                            console.log("PUSH", value);
                            buffer.push(value);
                            resolvable.resolve();
                        },
                        onDone: function (resolve) {
                            done = true;
                            resolvable.resolve();
                            resolve();
                        },
                    }), false);
                    _e.label = 2;
                case 2:
                    _e.trys.push([2, 9, 10, 15]);
                    _a = true, generator_2 = __asyncValues(generator);
                    _e.label = 3;
                case 3: return [4 /*yield*/, __await(generator_2.next())];
                case 4:
                    if (!(generator_2_1 = _e.sent(), _b = generator_2_1.done, !_b)) return [3 /*break*/, 8];
                    _d = generator_2_1.value;
                    _a = false;
                    next = _d;
                    return [4 /*yield*/, __await(next)];
                case 5: return [4 /*yield*/, _e.sent()];
                case 6:
                    _e.sent();
                    _e.label = 7;
                case 7:
                    _a = true;
                    return [3 /*break*/, 3];
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
                    if (!(!done || buffer.length)) return [3 /*break*/, 21];
                    _e.label = 16;
                case 16:
                    if (!buffer.length) return [3 /*break*/, 19];
                    return [4 /*yield*/, __await(buffer.shift())];
                case 17: return [4 /*yield*/, _e.sent()];
                case 18:
                    _e.sent();
                    return [3 /*break*/, 16];
                case 19: return [4 /*yield*/, __await(resolvable.promise)];
                case 20:
                    _e.sent();
                    resolvable = Promise.withResolvers();
                    return [3 /*break*/, 15];
                case 21: return [3 /*break*/, 24];
                case 22:
                    e_2 = _e.sent();
                    env_1.error = e_2;
                    env_1.hasError = true;
                    return [3 /*break*/, 24];
                case 23:
                    __disposeResources(env_1);
                    return [7 /*endfinally*/];
                case 24: return [2 /*return*/];
            }
        });
    });
}

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
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _ParallelGenerator_instances, _ParallelGenerator_source, _ParallelGenerator_onNext, _ParallelGenerator_parallel, _ParallelGenerator_maxBuffer, _ParallelGenerator_signal, _ParallelGenerator_pendingNext, _ParallelGenerator_buffer, _ParallelGenerator_activeWorkers, _ParallelGenerator_upstreamDone, _ParallelGenerator_closed, _ParallelGenerator_nextUpstream, _ParallelGenerator_runWorker, _ParallelGenerator_tryDrainBuffer, _ParallelGenerator_maybeSpawnWorker, _ParallelGenerator_flush, _ParallelGenerator_isDone, _ParallelGenerator_abort;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParallelGenerator = void 0;
exports.parallelGenerator = parallelGenerator;
var throttle_ts_1 = require("../utils/throttle.ts");
var parallelUtils_ts_1 = require("./parallelUtils.ts");
function getIterator(value) {
    if (typeof value[Symbol.asyncIterator] === "function") {
        return value[Symbol.asyncIterator]();
    }
    if (typeof value[Symbol.iterator] === "function") {
        return value[Symbol.iterator]();
    }
    if (typeof value.next === "function") {
        return value;
    }
    throw new Error("Invalid ExpandResult");
}
function parallelGenerator(_a) {
    var _b;
    var generator = _a.generator, parallel = _a.parallel, _c = _a.maxBuffer, maxBuffer = _c === void 0 ? 10000 : _c, signal = _a.signal, chokeOnNext = _a.chokeOnNext, onNext = _a.onNext, onDone = _a.onDone, onDepleted = _a.onDepleted;
    (0, parallelUtils_ts_1.assertIsValidParallel)(parallel);
    if (!Number.isInteger(maxBuffer) || maxBuffer <= 0) {
        throw new RangeError("maxBuffer must be a positive integer");
    }
    var closed = false;
    var pendingNext = [];
    var buffer = [];
    var activeWorkers = 0;
    var upstreamDone = false;
    function isDone() {
        console.log("isDone?");
        return upstreamDone && activeWorkers === 0 && buffer.length === 0;
    }
    function abort() {
        var _a;
        console.log("abort?");
        if (closed)
            return;
        closed = true;
        while (pendingNext.length) {
            pendingNext.shift()({ value: undefined, done: true });
        }
        buffer.length = 0;
        void ((_a = generator.return) === null || _a === void 0 ? void 0 : _a.call(generator));
    }
    var getNext = function getNext() {
        return generator.next();
    };
    if (chokeOnNext) {
        getNext = (0, throttle_ts_1.throttle)(1, getNext);
    }
    function tryDrainBuffer() {
        return __awaiter(this, void 0, void 0, function () {
            var it, r;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log("tryDrainBuffer");
                        _a.label = 1;
                    case 1:
                        if (!buffer.length) return [3 /*break*/, 3];
                        it = buffer[0];
                        return [4 /*yield*/, it.next()];
                    case 2:
                        r = _a.sent();
                        if (!r.done) {
                            return [2 /*return*/, { value: Promise.resolve(r.value), done: false }];
                        }
                        buffer.shift();
                        return [3 /*break*/, 1];
                    case 3: return [2 /*return*/];
                }
            });
        });
    }
    function maybeSpawnWorker() {
        console.log("maybeSpawnWorker");
        if (signal === null || signal === void 0 ? void 0 : signal.aborted)
            return;
        if (activeWorkers >= parallel)
            return;
        if (upstreamDone)
            return;
        if (buffer.length >= maxBuffer)
            return;
        console.log("next run worker");
        return runWorker();
    }
    function runWorker() {
        return __awaiter(this, void 0, void 0, function () {
            var _a, value, done, mapped, iterator, first, e_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        console.log("RUN WORK");
                        activeWorkers++;
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 4, 5, 6]);
                        if (signal === null || signal === void 0 ? void 0 : signal.aborted)
                            return [2 /*return*/];
                        console.log("GET NEXT UPstream");
                        return [4 /*yield*/, getNext()];
                    case 2:
                        _a = _b.sent(), value = _a.value, done = _a.done;
                        console.log("GOT NEXT UPSTREAM");
                        if (done) {
                            console.log("done");
                            upstreamDone = true;
                            flush();
                            return [2 /*return*/];
                        }
                        console.log("get mapper");
                        return [4 /*yield*/, (onNext === null || onNext === void 0 ? void 0 : onNext(value))];
                    case 3:
                        mapped = _b.sent();
                        console.log("MAPPED", mapped);
                        if (!mapped)
                            return [2 /*return*/];
                        iterator = getIterator(mapped);
                        console.log("CREATED ITERATOR", iterator);
                        first = iterator;
                        console.log("FIRST", first);
                        if (!first.done) {
                            // push first value to buffer
                            buffer.push(iterator);
                            // resolve a pending next if exists
                            if (pendingNext.length > 0) {
                                flush();
                            }
                        }
                        return [3 /*break*/, 6];
                    case 4:
                        e_1 = _b.sent();
                        console.error(e_1);
                        throw e_1;
                    case 5:
                        console.log("fINALLY ERROR");
                        activeWorkers--;
                        flush();
                        maybeSpawnWorker();
                        return [7 /*endfinally*/];
                    case 6: return [2 /*return*/];
                }
            });
        });
    }
    function flush() {
        while (pendingNext.length) {
            void tryDrainBuffer().then(function (r) {
                if (!r)
                    return;
                if (!pendingNext.length)
                    return;
                pendingNext.shift()(r);
            });
        }
        if (isDone()) {
            while (pendingNext.length) {
                pendingNext.shift()({ value: undefined, done: true });
            }
        }
    }
    return _b = {
            return: function () {
                return __awaiter(this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        console.log("return");
                        abort();
                        return [2 /*return*/, { value: undefined, done: true }];
                    });
                });
            },
            throw: function (err) {
                return __awaiter(this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        console.log("throw");
                        abort();
                        throw err;
                    });
                });
            }
        },
        _b[Symbol.asyncIterator] = function () {
            console.log("asyncIterator");
            return this;
        },
        _b[Symbol.asyncDispose] = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    console.log("async dispose");
                    abort();
                    return [2 /*return*/];
                });
            });
        },
        _b.next = function () {
            return __awaiter(this, void 0, void 0, function () {
                var buffered, _a, resolve, promise;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            console.log("next");
                            if (closed || (signal === null || signal === void 0 ? void 0 : signal.aborted)) {
                                return [2 /*return*/, { value: undefined, done: true }];
                            }
                            return [4 /*yield*/, tryDrainBuffer()];
                        case 1:
                            buffered = _b.sent();
                            if (buffered)
                                return [2 /*return*/, buffered];
                            console.log("no buffer to drain");
                            if (isDone()) {
                                return [2 /*return*/, { value: undefined, done: true }];
                            }
                            _a = Promise.withResolvers(), resolve = _a.resolve, promise = _a.promise;
                            pendingNext.push(resolve);
                            maybeSpawnWorker();
                            return [2 /*return*/, promise];
                    }
                });
            });
        },
        _b;
}
var ParallelGenerator = /** @class */ (function () {
    function ParallelGenerator(options) {
        _ParallelGenerator_instances.add(this);
        _ParallelGenerator_source.set(this, void 0);
        _ParallelGenerator_onNext.set(this, void 0);
        _ParallelGenerator_parallel.set(this, void 0);
        _ParallelGenerator_maxBuffer.set(this, void 0);
        _ParallelGenerator_signal.set(this, void 0);
        _ParallelGenerator_pendingNext.set(this, []);
        /** FIFO buffer of remaining iterators */
        _ParallelGenerator_buffer.set(this, []);
        _ParallelGenerator_activeWorkers.set(this, 0);
        _ParallelGenerator_upstreamDone.set(this, false);
        _ParallelGenerator_closed.set(this, false);
        _ParallelGenerator_nextUpstream.set(this, void 0);
        var generator = options.generator, onNext = options.onNext, parallel = options.parallel, _a = options.maxBuffer, maxBuffer = _a === void 0 ? 10000 : _a, signal = options.signal, _b = options.chokeOnNext, chokeOnNext = _b === void 0 ? false : _b;
        if (!Number.isInteger(parallel) || parallel < 2 || parallel >= 50) {
            throw new RangeError("parallel must be an integer between 2 and 49");
        }
        if (!Number.isInteger(maxBuffer) || maxBuffer <= 0) {
            throw new RangeError("maxBuffer must be a positive integer");
        }
        __classPrivateFieldSet(this, _ParallelGenerator_source, generator, "f");
        __classPrivateFieldSet(this, _ParallelGenerator_onNext, onNext, "f");
        __classPrivateFieldSet(this, _ParallelGenerator_parallel, parallel, "f");
        __classPrivateFieldSet(this, _ParallelGenerator_maxBuffer, maxBuffer, "f");
        __classPrivateFieldSet(this, _ParallelGenerator_signal, signal, "f");
        __classPrivateFieldSet(this, _ParallelGenerator_nextUpstream, function nextUpstream() {
            return generator.next();
        }, "f");
        if (chokeOnNext) {
            __classPrivateFieldSet(this, _ParallelGenerator_nextUpstream, (0, throttle_ts_1.throttle)(1, __classPrivateFieldGet(this, _ParallelGenerator_nextUpstream, "f")), "f");
        }
        // signal?.addEventListener("abort", () => this.#abort(), { once: true });
    }
    // ---------------- AsyncGenerator ----------------
    ParallelGenerator.prototype.next = function () {
        return __awaiter(this, void 0, void 0, function () {
            var buffered, _a, resolve, promise;
            var _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        console.log("next");
                        if (__classPrivateFieldGet(this, _ParallelGenerator_closed, "f") || ((_b = __classPrivateFieldGet(this, _ParallelGenerator_signal, "f")) === null || _b === void 0 ? void 0 : _b.aborted)) {
                            return [2 /*return*/, { value: undefined, done: true }];
                        }
                        return [4 /*yield*/, __classPrivateFieldGet(this, _ParallelGenerator_instances, "m", _ParallelGenerator_tryDrainBuffer).call(this)];
                    case 1:
                        buffered = _c.sent();
                        if (buffered)
                            return [2 /*return*/, buffered];
                        console.log("no buffer to drain");
                        if (__classPrivateFieldGet(this, _ParallelGenerator_instances, "m", _ParallelGenerator_isDone).call(this)) {
                            return [2 /*return*/, { value: undefined, done: true }];
                        }
                        _a = Promise.withResolvers(), resolve = _a.resolve, promise = _a.promise;
                        __classPrivateFieldGet(this, _ParallelGenerator_pendingNext, "f").push(resolve);
                        __classPrivateFieldGet(this, _ParallelGenerator_instances, "m", _ParallelGenerator_maybeSpawnWorker).call(this);
                        return [2 /*return*/, promise];
                }
            });
        });
    };
    ParallelGenerator.prototype.return = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                console.log("return");
                __classPrivateFieldGet(this, _ParallelGenerator_instances, "m", _ParallelGenerator_abort).call(this);
                return [2 /*return*/, { value: undefined, done: true }];
            });
        });
    };
    ParallelGenerator.prototype.throw = function (err) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                console.log("throw");
                __classPrivateFieldGet(this, _ParallelGenerator_instances, "m", _ParallelGenerator_abort).call(this);
                throw err;
            });
        });
    };
    ParallelGenerator.prototype[(_ParallelGenerator_source = new WeakMap(), _ParallelGenerator_onNext = new WeakMap(), _ParallelGenerator_parallel = new WeakMap(), _ParallelGenerator_maxBuffer = new WeakMap(), _ParallelGenerator_signal = new WeakMap(), _ParallelGenerator_pendingNext = new WeakMap(), _ParallelGenerator_buffer = new WeakMap(), _ParallelGenerator_activeWorkers = new WeakMap(), _ParallelGenerator_upstreamDone = new WeakMap(), _ParallelGenerator_closed = new WeakMap(), _ParallelGenerator_nextUpstream = new WeakMap(), _ParallelGenerator_instances = new WeakSet(), Symbol.asyncIterator)] = function () {
        console.log("asyncIterator");
        return this;
    };
    ParallelGenerator.prototype[Symbol.asyncDispose] = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                console.log("async dispose");
                __classPrivateFieldGet(this, _ParallelGenerator_instances, "m", _ParallelGenerator_abort).call(this);
                return [2 /*return*/];
            });
        });
    };
    return ParallelGenerator;
}());
exports.ParallelGenerator = ParallelGenerator;
_ParallelGenerator_runWorker = function _ParallelGenerator_runWorker() {
    return __awaiter(this, void 0, void 0, function () {
        var _a, value, done, mapped, iterator, first, e_2;
        var _b, _c;
        var _d, _e;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0:
                    console.log("RUN WORK");
                    __classPrivateFieldSet(this, _ParallelGenerator_activeWorkers, (_d = __classPrivateFieldGet(this, _ParallelGenerator_activeWorkers, "f"), _d++, _d), "f");
                    _f.label = 1;
                case 1:
                    _f.trys.push([1, 5, 6, 7]);
                    if ((_b = __classPrivateFieldGet(this, _ParallelGenerator_signal, "f")) === null || _b === void 0 ? void 0 : _b.aborted)
                        return [2 /*return*/];
                    console.log("GET NEXT UPstream");
                    return [4 /*yield*/, __classPrivateFieldGet(this, _ParallelGenerator_nextUpstream, "f").call(this)];
                case 2:
                    _a = _f.sent(), value = _a.value, done = _a.done;
                    console.log("GOT NEXT UPSTREAM");
                    if (done) {
                        __classPrivateFieldSet(this, _ParallelGenerator_upstreamDone, true, "f");
                        __classPrivateFieldGet(this, _ParallelGenerator_instances, "m", _ParallelGenerator_flush).call(this);
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, ((_c = __classPrivateFieldGet(this, _ParallelGenerator_onNext, "f")) === null || _c === void 0 ? void 0 : _c.call(this, value))];
                case 3:
                    mapped = _f.sent();
                    console.log("MAPPED", mapped);
                    if (!mapped)
                        return [2 /*return*/];
                    iterator = getIterator(mapped);
                    console.log("CREATED ITERATOR", iterator);
                    return [4 /*yield*/, iterator.next()];
                case 4:
                    first = _f.sent();
                    console.log("FIRST", first);
                    if (!first.done) {
                        // push first value to buffer
                        __classPrivateFieldGet(this, _ParallelGenerator_buffer, "f").push(iterator);
                        // resolve a pending next if exists
                        if (__classPrivateFieldGet(this, _ParallelGenerator_pendingNext, "f").length > 0) {
                            __classPrivateFieldGet(this, _ParallelGenerator_instances, "m", _ParallelGenerator_flush).call(this);
                        }
                    }
                    return [3 /*break*/, 7];
                case 5:
                    e_2 = _f.sent();
                    console.error(e_2);
                    throw e_2;
                case 6:
                    console.log("fINALLY ERROR");
                    __classPrivateFieldSet(this, _ParallelGenerator_activeWorkers, (_e = __classPrivateFieldGet(this, _ParallelGenerator_activeWorkers, "f"), _e--, _e), "f");
                    __classPrivateFieldGet(this, _ParallelGenerator_instances, "m", _ParallelGenerator_flush).call(this);
                    __classPrivateFieldGet(this, _ParallelGenerator_instances, "m", _ParallelGenerator_maybeSpawnWorker).call(this);
                    return [7 /*endfinally*/];
                case 7: return [2 /*return*/];
            }
        });
    });
}, _ParallelGenerator_tryDrainBuffer = function _ParallelGenerator_tryDrainBuffer() {
    return __awaiter(this, void 0, void 0, function () {
        var it, r;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("tryDrainBuffer");
                    _a.label = 1;
                case 1:
                    if (!__classPrivateFieldGet(this, _ParallelGenerator_buffer, "f").length) return [3 /*break*/, 3];
                    it = __classPrivateFieldGet(this, _ParallelGenerator_buffer, "f")[0];
                    return [4 /*yield*/, it.next()];
                case 2:
                    r = _a.sent();
                    if (!r.done) {
                        return [2 /*return*/, { value: Promise.resolve(r.value), done: false }];
                    }
                    __classPrivateFieldGet(this, _ParallelGenerator_buffer, "f").shift();
                    return [3 /*break*/, 1];
                case 3: return [2 /*return*/];
            }
        });
    });
}, _ParallelGenerator_maybeSpawnWorker = function _ParallelGenerator_maybeSpawnWorker() {
    var _a;
    console.log("maybeSpawnWorker");
    if ((_a = __classPrivateFieldGet(this, _ParallelGenerator_signal, "f")) === null || _a === void 0 ? void 0 : _a.aborted)
        return;
    if (__classPrivateFieldGet(this, _ParallelGenerator_activeWorkers, "f") >= __classPrivateFieldGet(this, _ParallelGenerator_parallel, "f"))
        return;
    if (__classPrivateFieldGet(this, _ParallelGenerator_upstreamDone, "f"))
        return;
    if (__classPrivateFieldGet(this, _ParallelGenerator_buffer, "f").length >= __classPrivateFieldGet(this, _ParallelGenerator_maxBuffer, "f"))
        return;
    console.log("next run worker");
    void __classPrivateFieldGet(this, _ParallelGenerator_instances, "m", _ParallelGenerator_runWorker).call(this);
}, _ParallelGenerator_flush = function _ParallelGenerator_flush() {
    var _this = this;
    while (__classPrivateFieldGet(this, _ParallelGenerator_pendingNext, "f").length) {
        void __classPrivateFieldGet(this, _ParallelGenerator_instances, "m", _ParallelGenerator_tryDrainBuffer).call(this).then(function (r) {
            if (!r)
                return;
            if (!__classPrivateFieldGet(_this, _ParallelGenerator_pendingNext, "f").length)
                return;
            __classPrivateFieldGet(_this, _ParallelGenerator_pendingNext, "f").shift()(r);
        });
    }
    if (__classPrivateFieldGet(this, _ParallelGenerator_instances, "m", _ParallelGenerator_isDone).call(this)) {
        while (__classPrivateFieldGet(this, _ParallelGenerator_pendingNext, "f").length) {
            __classPrivateFieldGet(this, _ParallelGenerator_pendingNext, "f").shift()({ value: undefined, done: true });
        }
    }
}, _ParallelGenerator_isDone = function _ParallelGenerator_isDone() {
    console.log("isDone?");
    return (__classPrivateFieldGet(this, _ParallelGenerator_upstreamDone, "f") &&
        __classPrivateFieldGet(this, _ParallelGenerator_activeWorkers, "f") === 0 &&
        __classPrivateFieldGet(this, _ParallelGenerator_buffer, "f").length === 0);
}, _ParallelGenerator_abort = function _ParallelGenerator_abort() {
    var _a, _b;
    console.log("abort?");
    if (__classPrivateFieldGet(this, _ParallelGenerator_closed, "f"))
        return;
    __classPrivateFieldSet(this, _ParallelGenerator_closed, true, "f");
    while (__classPrivateFieldGet(this, _ParallelGenerator_pendingNext, "f").length) {
        __classPrivateFieldGet(this, _ParallelGenerator_pendingNext, "f").shift()({ value: undefined, done: true });
    }
    __classPrivateFieldGet(this, _ParallelGenerator_buffer, "f").length = 0;
    void ((_b = (_a = __classPrivateFieldGet(this, _ParallelGenerator_source, "f")).return) === null || _b === void 0 ? void 0 : _b.call(_a));
};

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
exports.groupBySync = groupBySync;
exports.groupByAsync = groupByAsync;
exports.groupByParallel = groupByParallel;
var resolveParallel_ts_1 = require("../resolveParallel.ts");
function groupBySync(generator, keySelector, groups) {
    var record = createInitialGroups(groups);
    for (var _i = 0, generator_1 = generator; _i < generator_1.length; _i++) {
        var next = generator_1[_i];
        var key = keySelector(next);
        if (!(key in record))
            record[key] = [];
        record[key].push(next);
    }
    return record;
}
function groupByAsync(generator_2, keySelector_1) {
    return __awaiter(this, arguments, void 0, function (generator, keySelector, groups) {
        var record, next, key, e_1_1;
        var _a, generator_3, generator_3_1;
        var _b, e_1, _c, _d;
        if (groups === void 0) { groups = []; }
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    record = createInitialGroups(groups);
                    _e.label = 1;
                case 1:
                    _e.trys.push([1, 7, 8, 13]);
                    _a = true, generator_3 = __asyncValues(generator);
                    _e.label = 2;
                case 2: return [4 /*yield*/, generator_3.next()];
                case 3:
                    if (!(generator_3_1 = _e.sent(), _b = generator_3_1.done, !_b)) return [3 /*break*/, 6];
                    _d = generator_3_1.value;
                    _a = false;
                    next = _d;
                    return [4 /*yield*/, keySelector(next)];
                case 4:
                    key = _e.sent();
                    if (!(key in record))
                        record[key] = [];
                    record[key].push(next);
                    _e.label = 5;
                case 5:
                    _a = true;
                    return [3 /*break*/, 2];
                case 6: return [3 /*break*/, 13];
                case 7:
                    e_1_1 = _e.sent();
                    e_1 = { error: e_1_1 };
                    return [3 /*break*/, 13];
                case 8:
                    _e.trys.push([8, , 11, 12]);
                    if (!(!_a && !_b && (_c = generator_3.return))) return [3 /*break*/, 10];
                    return [4 /*yield*/, _c.call(generator_3)];
                case 9:
                    _e.sent();
                    _e.label = 10;
                case 10: return [3 /*break*/, 12];
                case 11:
                    if (e_1) throw e_1.error;
                    return [7 /*endfinally*/];
                case 12: return [7 /*endfinally*/];
                case 13: return [2 /*return*/, record];
            }
        });
    });
}
function groupByParallel(generator, parallel, keySelector, groups) {
    if (groups === void 0) { groups = []; }
    var record = createInitialGroups(groups);
    return (0, resolveParallel_ts_1.resolveParallel)({
        generator: generator,
        parallel: parallel,
        onNext: function (value) {
            return __awaiter(this, void 0, void 0, function () {
                var key;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, keySelector(value)];
                        case 1:
                            key = _a.sent();
                            if (!(key in record)) {
                                record[key] = [];
                            }
                            record[key].push(value);
                            return [2 /*return*/];
                    }
                });
            });
        },
        onDone: function (resolve) {
            resolve(record);
        },
    });
}
function createInitialGroups(groups) {
    if (groups === void 0) { groups = []; }
    return Object.fromEntries(groups.map(function (key) { return [key, []]; }));
}

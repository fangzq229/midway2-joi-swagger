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
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
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
Object.defineProperty(exports, "__esModule", { value: true });
var joi = require("joi");
/*
 * joi参数校验处理
 */
var validate = function (schemaList) {
    return function (ctx, next) { return __awaiter(void 0, void 0, void 0, function () {
        var _i, schemaList_1, p, param, joiArr, _loop_1, k, e;
        var _a, _b, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    try {
                        for (_i = 0, schemaList_1 = schemaList; _i < schemaList_1.length; _i++) {
                            p = schemaList_1[_i];
                            param = p.ctxkey.includes("body")
                                ? ctx.request.body
                                : ctx[p.ctxkey];
                            if (!param) {
                                continue;
                            }
                            joi.assert(param, p.schemas);
                            joiArr = ((_b = (_a = p.schemas) === null || _a === void 0 ? void 0 : _a.$_terms) === null || _b === void 0 ? void 0 : _b.keys) || [];
                            _loop_1 = function (k) {
                                var p1 = joiArr.find(function (i) { return i.key === k; });
                                if (((_c = p1 === null || p1 === void 0 ? void 0 : p1.schema) === null || _c === void 0 ? void 0 : _c.type) === "number") {
                                    param[k] = Number(param[k]);
                                }
                            };
                            for (k in param) {
                                _loop_1(k);
                            }
                        }
                    }
                    catch (error) {
                        e = error.details ? (_d = error.details[0]) === null || _d === void 0 ? void 0 : _d.message : "parameter error";
                        return [2 /*return*/, ctx.throw(422, e)];
                    }
                    return [4 /*yield*/, next()];
                case 1:
                    _e.sent();
                    return [2 /*return*/];
            }
        });
    }); };
};
exports.default = validate;

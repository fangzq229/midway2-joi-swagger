"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SwaggerJoiDel = exports.SwaggerJoiPut = exports.SwaggerJoiPost = exports.SwaggerJoiGet = exports.SwaggerJoiController = void 0;
var decorator_1 = require("@midwayjs/decorator");
var swagger_json_1 = require("./swagger-json");
var mid_validate_1 = require("./mid-validate");
var SwaggerJoiController = function (paramIn) {
    // swagger json
    swagger_json_1.addToApiGroup(paramIn);
    // 组织controller
    return decorator_1.Controller(_convertPath(paramIn.path), paramIn.routerOptions);
};
exports.SwaggerJoiController = SwaggerJoiController;
var SwaggerJoiGet = function (paramIn) {
    paramIn.method = 'get';
    var realPath = _allSet(paramIn, 'get');
    _paramInUpdMiddeware(paramIn);
    return decorator_1.Get(realPath, paramIn.routerOptions);
};
exports.SwaggerJoiGet = SwaggerJoiGet;
var SwaggerJoiPost = function (paramIn) {
    paramIn.method = 'post';
    var realPath = _allSet(paramIn, 'post');
    _paramInUpdMiddeware(paramIn);
    return decorator_1.Post(realPath, paramIn.routerOptions);
};
exports.SwaggerJoiPost = SwaggerJoiPost;
var SwaggerJoiPut = function (paramIn) {
    paramIn.method = 'put';
    var realPath = _allSet(paramIn, 'put');
    _paramInUpdMiddeware(paramIn);
    return decorator_1.Put(realPath, paramIn.routerOptions);
};
exports.SwaggerJoiPut = SwaggerJoiPut;
var SwaggerJoiDel = function (paramIn) {
    paramIn.method = 'del';
    var realPath = _allSet(paramIn, 'delete');
    _paramInUpdMiddeware(paramIn);
    return decorator_1.Del(realPath, paramIn.routerOptions);
};
exports.SwaggerJoiDel = SwaggerJoiDel;
/**
 * 路由 path 参数转换
 * egg. /api/{id} -> /api/:id
 * @param {String} path
 */
var _convertPath = function (path) {
    var re = new RegExp('{(.*?)}', 'g');
    return path.replace(re, ':$1');
};
var _allSet = function (paramIn, method) {
    // swagger json
    swagger_json_1.addToApiObject(paramIn, method);
    var realPath = _convertPath(paramIn.path);
    return realPath;
};
var _createSchemaMiddleware = function (paramIn) {
    var schemaName = [
        { sname: 'body', key: 'request.body' },
        { sname: 'pathParams', key: 'params' },
        { sname: 'query' },
        { sname: 'formData' },
    ];
    var schemaList = schemaName
        .filter(function (p) { return paramIn[p.sname]; })
        .map(function (p) {
        return {
            ctxkey: p.key || p.sname,
            schemas: paramIn[p.sname],
        };
    });
    return mid_validate_1.default(schemaList);
};
// 添加 Schemas 验证中间件
var _paramInUpdMiddeware = function (paramIn) {
    var _a, _b;
    var tempMidd = (_a = paramIn === null || paramIn === void 0 ? void 0 : paramIn.routerOptions) === null || _a === void 0 ? void 0 : _a.middleware;
    var validateMid = _createSchemaMiddleware(paramIn);
    if (((_b = paramIn.routerOptions) === null || _b === void 0 ? void 0 : _b.middleware) && Array.isArray(tempMidd)) {
        paramIn.routerOptions.middleware = __spreadArray([validateMid], tempMidd);
    }
    else {
        paramIn.routerOptions = { middleware: [validateMid] };
    }
};

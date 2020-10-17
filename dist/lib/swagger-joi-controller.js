"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.apiObjects = exports.SwaggerJoiDel = exports.SwaggerJoiPut = exports.SwaggerJoiPost = exports.SwaggerJoiGet = exports.SwaggerJoiController = void 0;
var decorator_1 = require("@midwayjs/decorator");
var _ = require("lodash");
var j2s = require("joi-to-swagger");
var mid_validate_1 = require("./mid-validate");
/**
 * used for building swagger docs object
 * 属性[controller]：[apiobject]
 */
var apiObjects = {};
exports.apiObjects = apiObjects;
/**
 * egg. /api/{id} -> /api/:id
 * @param {String} path
 */
var convertPath = function (path) {
    var re = new RegExp("{(.*?)}", "g");
    return path.replace(re, ":$1");
};
// body 参数 swagger json 化
var _paramsBody = function (parameters) {
    if (!parameters) {
        return undefined;
    }
    var swagger = j2s(parameters).swagger;
    return [
        {
            name: "data",
            description: "request body",
            schema: swagger,
            in: "body",
        },
    ];
};
// query 参数 swagger json 化
var _paramsList = function (parameters, type) {
    if (!parameters) {
        return undefined;
    }
    var swagger = j2s(parameters).swagger;
    return Object.keys(swagger.properties).map(function (p) {
        var obj = __assign(__assign({}, swagger.properties[p]), { name: p, in: type, required: swagger.required ? swagger.required.includes(p) : false });
        if (swagger.properties[p].example &&
            swagger.properties[p].example === "file") {
            Object.assign(obj, { type: "file" });
        }
        return obj;
    });
};
// 请求 responsesBody swagger json 化
var _responsesBody = function (body) {
    if (!body) {
        return undefined;
    }
    var swagger = j2s(body).swagger;
    return {
        name: "data",
        description: "response body",
        schema: swagger,
        in: "body",
    };
};
/**
 * 权限处理
 * @param auth
 */
var _auth = function (auth) {
    var _a;
    if (!auth) {
        // 获取默认
        return [];
    }
    if (Array.isArray(auth) && auth.length > 0) {
        var result_1 = {};
        __spreadArrays(auth).forEach(function (p) {
            result_1[p] = [];
        });
        return result_1;
    }
    return [
        (_a = {},
            _a[auth] = [],
            _a),
    ];
};
/**
 *
 * @param target
 * @param name
 * @param apiObj
 * @param content
 */
var _addToApiObject = function (key, apiObj, content) {
    if (!apiObj[key]) {
        apiObj[key] = {};
    }
    Object.assign(apiObj[key], content);
};
var SwaggerJoiController = function (paramIn) {
    Object.keys(apiObjects)
        .filter(function (p) { return p.split("|")[0] === paramIn.api; })
        .forEach(function (p) {
        apiObjects[p].path = ("" + paramIn.path + apiObjects[p].path).replace("//", "/");
        paramIn.description && (apiObjects[p].tags = [paramIn.description]);
    });
    // 组织controller
    return decorator_1.Controller(convertPath(paramIn.path), paramIn.routerOptions);
};
exports.SwaggerJoiController = SwaggerJoiController;
var allSet = function (paramIn, method) {
    var key = paramIn.api + "|" + method + "-" + paramIn.path.replace("/", "_");
    _addToApiObject(key, apiObjects, {
        api: paramIn.api,
        tags: [paramIn.api],
        method: method,
        path: paramIn.path,
        summary: paramIn.description,
        description: paramIn.summary,
        pathParams: _paramsList(paramIn.pathParams, "path"),
        query: _paramsList(paramIn.query, "query"),
        body: _paramsBody(paramIn.body),
        formData: _paramsList(paramIn.formData, "formData"),
        security: _auth(paramIn.auth),
        responses: _responsesBody(paramIn.responses),
    });
    var realPath = convertPath(paramIn.path);
    return realPath;
};
var createSchemaMiddleware = function (paramIn) {
    var schemaName = [
        { sname: "body", key: "request.body" },
        { sname: "pathParams", key: "params" },
        { sname: "query" },
        { sname: "formData" },
    ];
    var schemaList = schemaName
        .filter(function (p) { return paramIn[p.sname]; })
        .map(function (p) {
        return {
            ctxkey: _.get(p, "key", p.sname),
            schemas: paramIn[p.sname],
        };
    });
    return mid_validate_1.default(schemaList);
};
var paramInUpdMiddeware = function (paramIn) {
    var tempMidd = _.get(paramIn, "routerOptions.middleware");
    var validateMid = createSchemaMiddleware(paramIn);
    if (_.isArray(tempMidd)) {
        _.set(paramIn, "routerOptions.middleware", __spreadArrays([validateMid], tempMidd));
    }
    else if (_.isString(tempMidd)) {
        _.set(paramIn, "routerOptions.middleware", [validateMid, tempMidd]);
    }
    else {
        _.set(paramIn, "routerOptions.middleware", [validateMid]);
    }
};
var SwaggerJoiGet = function (paramIn) {
    paramIn.method = "get";
    var realPath = allSet(paramIn, "get");
    paramInUpdMiddeware(paramIn);
    return decorator_1.Get(realPath, paramIn.routerOptions);
};
exports.SwaggerJoiGet = SwaggerJoiGet;
var SwaggerJoiPost = function (paramIn) {
    paramIn.method = "post";
    var realPath = allSet(paramIn, "post");
    paramInUpdMiddeware(paramIn);
    return decorator_1.Post(realPath, paramIn.routerOptions);
};
exports.SwaggerJoiPost = SwaggerJoiPost;
var SwaggerJoiPut = function (paramIn) {
    paramIn.method = "put";
    var realPath = allSet(paramIn, "put");
    paramInUpdMiddeware(paramIn);
    return decorator_1.Put(realPath, paramIn.routerOptions);
};
exports.SwaggerJoiPut = SwaggerJoiPut;
var SwaggerJoiDel = function (paramIn) {
    paramIn.method = "del";
    var realPath = allSet(paramIn, "delete");
    paramInUpdMiddeware(paramIn);
    return decorator_1.Del(realPath, paramIn.routerOptions);
};
exports.SwaggerJoiDel = SwaggerJoiDel;
